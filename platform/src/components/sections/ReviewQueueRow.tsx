'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import type { ExtractionStatus } from '@/lib/types'
import type { WorkspaceExtraction } from '@/lib/data'

export function ReviewQueueRow({
  extraction,
  canReview,
}: {
  extraction: WorkspaceExtraction
  canReview: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(extraction.value)

  async function review(status: ExtractionStatus, editedValue?: string) {
    setBusy(true)
    try {
      const response = await fetch(`/api/extractions/${extraction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, editedValue }),
      })
      if (!response.ok) throw new Error('Update failed')
      setEditing(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr className="border-t border-[var(--border)] hover:bg-[var(--gray-50)]">
      <td className="px-5 py-3 align-top">
        <Link
          href={`/accounts/${extraction.account_id}`}
          className="text-sm font-medium text-black hover:underline"
        >
          {extraction.account_name}
        </Link>
      </td>
      <td className="px-5 py-3 align-top text-xs text-[var(--gray-500)]">
        {extraction.document_filename}
      </td>
      <td className="px-5 py-3 align-top text-xs font-medium text-[var(--gray-600)]">
        {extraction.field_label}
      </td>
      <td className="max-w-xs px-5 py-3 align-top">
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="console-input text-sm"
            autoFocus
          />
        ) : (
          <p className="text-sm text-black">{extraction.value}</p>
        )}
      </td>
      <td className="px-5 py-3 align-top">
        <ConfidenceBadge value={extraction.confidence} />
      </td>
      <td className="px-5 py-3 align-top">
        {!canReview ? (
          <span className="text-xs text-[var(--gray-400)]">View only</span>
        ) : editing ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => review('edited', draft)}
              disabled={busy}
              className="console-btn-primary px-2 py-1 text-[10px]"
            >
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="console-btn-secondary px-2 py-1 text-[10px]">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => review('approved')}
              disabled={busy}
              title="Approve"
              className="rounded border border-[var(--border-strong)] p-1.5 hover:bg-[var(--gray-100)]"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={busy}
              title="Edit"
              className="rounded border border-[var(--border-strong)] p-1.5 hover:bg-[var(--gray-100)]"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => review('rejected')}
              disabled={busy}
              title="Reject"
              className="rounded border border-[var(--border-strong)] p-1.5 hover:bg-[var(--gray-100)]"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
