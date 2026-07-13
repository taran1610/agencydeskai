import { Suspense } from 'react'
import Link from 'next/link'
import { FileSearch } from 'lucide-react'
import { LoginForm } from '@/components/LoginForm'
import { isSupabasePublicConfigured } from '@/lib/supabase/config'

export default function LoginPage() {
  const configured = isSupabasePublicConfigured()

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-md flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
          <FileSearch size={22} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">AgencyDesk AI</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your operations console</p>
      </div>

      {!configured ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-medium">Supabase not configured</p>
          <p className="mt-2 text-amber-900/80">
            Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
            <code className="rounded bg-amber-100 px-1">platform/.env.local</code>, then restart
            the dev server.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium underline">
            Back to setup guide
          </Link>
        </div>
      ) : (
        <Suspense fallback={<p className="text-center text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        <Link href="http://localhost:5173" className="underline hover:text-slate-600">
          Marketing site
        </Link>
        {' · '}
        Human approval required on every extraction
      </p>
    </div>
  )
}
