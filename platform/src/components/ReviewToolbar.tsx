'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCheck, Loader2 } from 'lucide-react'

export function ReviewToolbar({
  accountId,
  pendingCount,
  highConfidenceCount,
}: {
  accountId: string
  pendingCount: number
  highConfidenceCount: number
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function bulkApprove(minConfidence?: number) {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/extractions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, status: 'approved', minConfidence }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage(`Approved ${data.updated} field${data.updated === 1 ? '' : 's'}`)
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Bulk approve failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm text-amber-900">
        <span className="font-medium">{pendingCount}</span> fields awaiting human review
        {highConfidenceCount > 0 && (
          <span className="text-amber-800">
            {' '}
            · {highConfidenceCount} high-confidence (≥90%)
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        {highConfidenceCount > 0 && (
          <button
            type="button"
            onClick={() => bulkApprove(0.9)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
            Approve all ≥90%
          </button>
        )}
        <button
          type="button"
          onClick={() => bulkApprove()}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:border-amber-400 disabled:opacity-50"
        >
          Approve all pending
        </button>
      </div>
      {message && <p className="w-full text-xs text-amber-800">{message}</p>}
    </div>
  )
}
