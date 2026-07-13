'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from '@/components/LoginForm'
import { ROLE_LABELS } from '@/lib/auth/permissions'

interface InviteInfo {
  email: string
  role: string
  workspaceName: string
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    fetch(`/api/invitations/${token}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setInvite(data)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Invalid invitation'))
  }, [token])

  async function acceptInvite() {
    setAccepting(true)
    try {
      const res = await fetch(`/api/invitations/${token}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept invitation')
    } finally {
      setAccepting(false)
    }
  }

  if (error && !invite) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!invite) {
    return <p className="py-16 text-center text-sm text-slate-400">Loading invitation…</p>
  }

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 text-center">
        <p className="text-sm text-slate-500">You&rsquo;ve been invited to</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{invite.workspaceName}</p>
        <p className="mt-2 text-sm text-slate-600">
          as <span className="font-medium">{ROLE_LABELS[invite.role as keyof typeof ROLE_LABELS] ?? invite.role}</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">for {invite.email}</p>
      </div>

      <p className="mb-4 text-center text-sm text-slate-600">
        Sign in or create an account with <strong>{invite.email}</strong>, then accept.
      </p>
      <LoginForm defaultEmail={invite.email} lockEmail />

      <button
        type="button"
        onClick={acceptInvite}
        disabled={accepting}
        className="mt-4 w-full rounded-md border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-500 disabled:opacity-50"
      >
        {accepting ? 'Accepting…' : 'Accept invitation'}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
