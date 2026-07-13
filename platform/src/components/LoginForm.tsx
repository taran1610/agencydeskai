'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from '@/components/OAuthButtons'

export function LoginForm({
  defaultEmail = '',
  lockEmail = false,
  showOAuth = true,
}: {
  defaultEmail?: string
  lockEmail?: boolean
  showOAuth?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(
    authError === 'auth' ? 'Sign-in was cancelled or failed. Try again.' : null,
  )
  const [notice, setNotice] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || undefined,
              workspace_name: workspaceName || undefined,
            },
          },
        })
        if (signUpError) throw signUpError
        if (data.user && !data.session) {
          setNotice(
            'Account created. If email confirmation is enabled in Supabase, check your inbox first — then sign in.',
          )
          setMode('signin')
          return
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {showOAuth && !lockEmail && (
        <>
          <OAuthButtons />
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or use email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      )}

      {!lockEmail && (
        <div className="mb-6 flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Create account
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'signup' && !lockEmail && (
          <>
            <div>
              <label className="text-xs font-medium text-slate-600">Your name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Agency name</label>
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Smith Insurance Agency"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                First signup creates your workspace. Later users need an invitation.
              </p>
            </div>
          </>
        )}
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={lockEmail}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm read-only:bg-slate-50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in with email'}
        </button>
      </form>
    </div>
  )
}
