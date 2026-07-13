'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Copy, UserPlus } from 'lucide-react'
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/auth/permissions'
import type { Invitation } from '@/lib/types'

export function TeamInviteForm({
  initialInvitations,
}: {
  initialInvitations: Invitation[]
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'reviewer' | 'viewer'>('reviewer')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastLink, setLastLink] = useState<string | null>(null)
  const [invitations, setInvitations] = useState(initialInvitations)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLastLink(data.inviteUrl)
      setInvitations((prev) => [data.invitation, ...prev])
      setEmail('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send invitation')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="colleague@agency.com"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'reviewer' | 'viewer')}
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="reviewer">Reviewer</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          <UserPlus size={14} />
          {busy ? 'Sending…' : 'Invite'}
        </button>
      </form>
      <p className="text-xs text-slate-400">{ROLE_DESCRIPTIONS[role]}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {lastLink && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <span className="min-w-0 flex-1 truncate">{lastLink}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(lastLink)}
            className="shrink-0 text-emerald-700 hover:text-emerald-900"
          >
            <Copy size={14} />
          </button>
        </div>
      )}

      {invitations.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pending invitations
          </h3>
          <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-sm">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-700">{inv.email}</span>
                <span className="text-xs text-slate-400">
                  {ROLE_LABELS[inv.role]} · expires{' '}
                  {new Date(inv.expires_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
