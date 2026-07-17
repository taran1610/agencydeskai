'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { safeNextPath } from '@/lib/auth/next-path'
import { OAuthButtons } from '@/components/OAuthButtons'

export function LoginForm({
  defaultEmail = '',
  lockEmail = false,
  showOAuth = true,
  variant = 'default',
}: {
  defaultEmail?: string
  lockEmail?: boolean
  showOAuth?: boolean
  variant?: 'default' | 'split'
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = safeNextPath(searchParams.get('next'))
  const authError = searchParams.get('error')
  const authDetail = searchParams.get('detail')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(() => {
    if (authError !== 'auth') return null
    if (authDetail) {
      const decoded = decodeURIComponent(authDetail)
      if (/redirect_uri|redirect url|not allowed/i.test(decoded)) {
        return 'Google sign-in is misconfigured (redirect URL). Contact support.'
      }
      return `Google sign-in failed: ${decoded}`
    }
    return 'Google sign-in was cancelled or failed. Please try again.'
  })
  const [notice, setNotice] = useState<string | null>(null)

  const isSplit = variant === 'split'

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
      // Fire-and-forget welcome (idempotent). OAuth path also sends via callback.
      void fetch('/api/email/welcome', { method: 'POST' }).catch(() => {})
      router.push(nextPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  async function onForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email above, then click Forgot password.')
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      })
      if (resetError) throw resetError
      setNotice('Password reset link sent — check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email')
    } finally {
      setBusy(false)
    }
  }

  if (isSplit) {
    return (
      <div className="login-form-split">
        <div className="login-form-split__head">
          <h2 className="login-form-split__title">Sign in</h2>
          <p className="login-form-split__sub">Access your operations console</p>
        </div>

        {showOAuth && !lockEmail && (
          <>
            <OAuthButtons nextPath={nextPath} variant="split" />
            <div className="login-form-split__divider">
              <span className="login-form-split__divider-line" />
              <span className="login-form-split__divider-text">OR</span>
              <span className="login-form-split__divider-line" />
            </div>
          </>
        )}

        {!lockEmail && (
          <div className="login-form-split__tabs">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`login-form-split__tab${mode === 'signin' ? ' login-form-split__tab--active' : ''}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`login-form-split__tab${mode === 'signup' ? ' login-form-split__tab--active' : ''}`}
            >
              Create account
            </button>
          </div>
        )}

        {error && (
          <p className="login-form-split__alert login-form-split__alert--error">{error}</p>
        )}
        {notice && (
          <p className="login-form-split__alert login-form-split__alert--success">{notice}</p>
        )}

        <form onSubmit={onSubmit}>
          {mode === 'signup' && !lockEmail && (
            <>
              <div className="login-form-split__field">
                <label className="login-form-split__label" htmlFor="login-full-name">
                  Your name
                </label>
                <input
                  id="login-full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="login-form-split__input"
                  placeholder="Jane Smith"
                />
              </div>
              <div className="login-form-split__field">
                <label className="login-form-split__label" htmlFor="login-workspace">
                  Agency name
                </label>
                <input
                  id="login-workspace"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="login-form-split__input"
                  placeholder="Smith Insurance Agency"
                />
                <p className="login-form-split__hint">
                  We&rsquo;ll create a private workspace for your agency.
                </p>
              </div>
            </>
          )}

          <div className="login-form-split__field">
            <label className="login-form-split__label" htmlFor="login-email">
              Email
            </label>
            <div className="login-form-split__input-wrap">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={lockEmail}
                required
                className="login-form-split__input"
                placeholder="you@agency.com"
              />
              <Mail size={16} className="login-form-split__input-icon" aria-hidden />
            </div>
          </div>

          <div className="login-form-split__field">
            <div className="login-form-split__label-row">
              <label className="login-form-split__label" htmlFor="login-password">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="login-form-split__forgot"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="login-form-split__input-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="login-form-split__input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="login-form-split__toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="login-form-split__submit">
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in with email'}
          </button>
        </form>

        <p className="login-form-split__secure">
          <Lock size={12} aria-hidden />
          Your data is encrypted and secure
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {showOAuth && !lockEmail && (
        <>
          <OAuthButtons nextPath={nextPath} />
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
                We&rsquo;ll create a private workspace for your agency.
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
