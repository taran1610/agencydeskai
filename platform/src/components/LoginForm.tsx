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
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="console-label">or use email</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </>
      )}

      {!lockEmail && (
        <div className="mb-6 grid grid-cols-2 border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
              mode === 'signin'
                ? 'bg-[var(--ink)] text-white'
                : 'bg-white text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`border-l border-[var(--border)] py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
              mode === 'signup'
                ? 'bg-[var(--ink)] text-white'
                : 'bg-white text-[var(--ink-muted)] hover:text-[var(--ink)]'
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
              <label className="console-label">Your name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="console-input mt-1.5"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="console-label">Agency name</label>
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="console-input mt-1.5"
                placeholder="Smith Insurance Agency"
              />
              <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">
                First signup creates your workspace. Later users need an invitation.
              </p>
            </div>
          </>
        )}
        <div>
          <label className="console-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={lockEmail}
            required
            className="console-input mt-1.5 read-only:bg-[var(--cream-panel)]"
          />
        </div>
        <div>
          <label className="console-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="console-input mt-1.5"
          />
        </div>
        {error && (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {notice && (
          <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {notice}
          </p>
        )}
        <button type="submit" disabled={busy} className="console-btn-primary w-full">
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in with email'}
        </button>
      </form>
    </div>
  )
}
