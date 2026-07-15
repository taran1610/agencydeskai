import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/LoginForm'
import { LoginShell } from '@/components/login/LoginShell'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { safeNextPath } from '@/lib/auth/next-path'
import { getAuthContext, getSignedInUser } from '@/lib/auth/session'
import { isSupabasePublicConfigured } from '@/lib/supabase/config'
import { isSupabaseServerConfigured } from '@/lib/supabase/env'
import './login.css'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const nextPath = safeNextPath(params.next)
  const publicConfigured = isSupabasePublicConfigured()
  const serverReady = isSupabaseServerConfigured()
  const auth = publicConfigured ? await getAuthContext() : null
  const signedInUser = publicConfigured && !auth ? await getSignedInUser() : null

  if (auth && serverReady) {
    redirect(nextPath)
  }

  return (
    <LoginShell>
      {!publicConfigured ? (
        <div className="text-sm text-[var(--ink-muted)]">
          <p className="font-medium text-[var(--ink)]">Supabase not configured on Vercel</p>
          <p className="mt-2">
            Add <code className="bg-[var(--cream-panel)] px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="bg-[var(--cream-panel)] px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
            the <strong>agencydeskai-app</strong> Vercel project, then redeploy.
          </p>
        </div>
      ) : signedInUser && !serverReady ? (
        <div className="text-sm text-[var(--ink-muted)]">
          <p className="font-medium text-[var(--ink)]">Signed in as {signedInUser.email}</p>
          <p className="mt-2">
            Add <code className="bg-[var(--cream-panel)] px-1">SUPABASE_SERVICE_ROLE_KEY</code> in
            Vercel, then redeploy.
          </p>
        </div>
      ) : signedInUser ? (
        <NoWorkspaceAccess email={signedInUser.email} />
      ) : (
        <Suspense fallback={<p className="text-center text-sm text-[var(--ink-muted)]">Loading…</p>}>
          <LoginForm variant="split" />
        </Suspense>
      )}
    </LoginShell>
  )
}
