import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/LoginForm'
import { MARKETING_URL } from '@/config/urls'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { getAuthContext, getSignedInUser } from '@/lib/auth/session'
import { isSupabasePublicConfigured } from '@/lib/supabase/config'
import { isSupabaseServerConfigured } from '@/lib/supabase/env'

export default async function LoginPage() {
  const publicConfigured = isSupabasePublicConfigured()
  const serverReady = isSupabaseServerConfigured()
  const auth = publicConfigured ? await getAuthContext() : null
  const signedInUser = publicConfigured && !auth ? await getSignedInUser() : null

  if (auth && serverReady) {
    redirect('/')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center">
      <div className="mb-10 text-center">
        <p className="console-label">Operations console</p>
        <h1 className="console-title mt-3">Sign in</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          AI document intake, extraction, and review for your agency.
        </p>
      </div>

      <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
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
            <LoginForm />
          </Suspense>
        )}
      </div>

      <p className="console-label mt-8 text-center">
        <Link href={MARKETING_URL} className="underline hover:text-[var(--ink)]">
          Marketing site
        </Link>
        {' · '}
        Human approval required on every extraction
      </p>
    </div>
  )
}
