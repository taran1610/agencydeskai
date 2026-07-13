'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Layers, Loader2 } from 'lucide-react'

export function ProcessAllButton({
  accountId,
  pendingDocs,
}: {
  accountId: string
  pendingDocs: number
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  if (pendingDocs === 0) return null

  async function processAll() {
    setBusy(true)
    try {
      const res = await fetch(`/api/accounts/${accountId}/process-all`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={processAll}
      disabled={busy}
      className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500 disabled:opacity-50"
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Layers size={14} />}
      {busy ? 'Processing…' : `Process all (${pendingDocs})`}
    </button>
  )
}
