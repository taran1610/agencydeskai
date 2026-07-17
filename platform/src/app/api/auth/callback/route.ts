import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { safeNextPath } from '@/lib/auth/next-path'
import { ensureUserWorkspace } from '@/lib/auth/ensure-workspace'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error')
  const oauthDescription = searchParams.get('error_description')

  const nextFromQuery = searchParams.get('next')
  const nextFromCookieRaw = request.cookies.get('auth_next')?.value
  const nextFromCookie = nextFromCookieRaw ? decodeURIComponent(nextFromCookieRaw) : null
  const next = safeNextPath(nextFromQuery ?? nextFromCookie)

  if (oauthError) {
    const detail = oauthDescription || oauthError
    const url = new URL(`${origin}/login`)
    url.searchParams.set('error', 'auth')
    url.searchParams.set('detail', detail)
    return NextResponse.redirect(url)
  }

  if (code) {
    // Build the redirect response first so session cookies are attached to it.
    const successRedirect = NextResponse.redirect(`${origin}${next}`)
    successRedirect.cookies.set('auth_next', '', { path: '/', maxAge: 0 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      return NextResponse.redirect(`${origin}/login?error=auth&detail=missing_supabase_env`)
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            successRedirect.cookies.set(name, value, options)
          })
        },
      },
    })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      try {
        await ensureUserWorkspace({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata as Record<string, unknown> | undefined,
        })
      } catch (provisionError) {
        console.error('Workspace provision after OAuth failed:', provisionError)
      }
      return successRedirect
    }

    console.error('OAuth code exchange failed:', error?.message ?? 'unknown')
    const fail = new URL(`${origin}/login`)
    fail.searchParams.set('error', 'auth')
    if (error?.message) fail.searchParams.set('detail', error.message)
    return NextResponse.redirect(fail)
  }

  return NextResponse.redirect(`${origin}/login?error=auth&detail=missing_code`)
}
