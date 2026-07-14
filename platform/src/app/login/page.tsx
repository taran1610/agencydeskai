import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileSearch } from 'lucide-react'
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
    <div className="mx-auto flex min-h-[75vh] w-full max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
          <FileSearch size={22} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">AgencyDesk AI</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your operations console</p>
      </div>

      {!publicConfigured ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-medium">Supabase not configured on Vercel</p>
          <p className="mt-2 text-amber-900/80">
            Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in the{' '}
            <strong>agencydeskai-app</strong> Vercel project, then redeploy.
          </p>
        </div>
      ) : signedInUser && !serverReady ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <p className="font-medium text-slate-900">Signed in as {signedInUser.email}</p>
          <p className="mt-2 text-slate-600">
            The dashboard needs <code className="rounded bg-slate-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
            added in Vercel → <strong>agencydeskai-app</strong> → Environment Variables, then
            redeploy.
          </p>
        </div>
      ) : signedInUser ? (
        <NoWorkspaceAccess email={signedInUser.email} />
      ) : (
        <Suspense fallback={<p className="text-center text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        <Link href={MARKETING_URL} className="underline hover:text-slate-600">
          Marketing site
        </Link>
        {' · '}
        Human approval required on every extraction
      </p>
    </div>
  )
}
