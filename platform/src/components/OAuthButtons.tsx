import type { ReactNode } from 'react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Provider = 'google' | 'apple'

const PROVIDERS: { id: Provider; label: string; icon: ReactNode }[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.79 15.25 5.51 7.59 11.68 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.16 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
]

export function OAuthButtons() {
  const [busy, setBusy] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function signIn(provider: Provider) {
    setBusy(provider)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (oauthError) throw oauthError
      if (!data?.url) {
        throw new Error(
          `Could not start ${provider} sign-in. Enable ${provider} under Supabase → Authentication → Providers.`,
        )
      }
      // Must redirect manually — otherwise the button appears to do nothing.
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      setBusy(null)
    }
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => signIn(p.id)}
          disabled={busy !== null}
          className="flex w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
        >
          {p.icon}
          {busy === p.id ? 'Redirecting…' : p.label}
        </button>
      ))}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      <p className="text-center text-[11px] text-slate-400">
        Google &amp; Apple require enabling providers in your Supabase project
        (Authentication → Providers).
      </p>
    </div>
  )
}
