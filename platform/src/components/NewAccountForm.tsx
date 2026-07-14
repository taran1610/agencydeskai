'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function NewAccountForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Could not create account')
      setName('')
      router.push(`/accounts/${data.account.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <label className="mb-1.5 block text-xs font-medium text-[var(--gray-500)]">
          New client name
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Maple Ridge Logistics"
          className="console-input"
          required
          minLength={2}
        />
      </div>
      <button type="submit" disabled={busy} className="console-btn-primary shrink-0 sm:mb-0">
        {busy ? 'Creating…' : '+ New account'}
      </button>
      {error && <p className="w-full text-xs text-black sm:col-span-2">{error}</p>}
    </form>
  )
}
