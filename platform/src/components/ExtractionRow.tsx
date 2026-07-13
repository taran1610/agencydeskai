'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import type { Extraction, ExtractionStatus } from '@/lib/types'

export function ExtractionRow({ extraction }: { extraction: Extraction }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(extraction.edited_value ?? extraction.value)

  const effectiveValue =
    extraction.status === 'edited' && extraction.edited_value
      ? extraction.edited_value
      : extraction.value

  async function review(status: ExtractionStatus, editedValue?: string) {
    setBusy(true)
    try {
      const response = await fetch(`/api/extractions/${extraction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, editedValue }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Update failed')
      }
      setEditing(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr className="border-t border-slate-100">
      <td className="w-52 px-4 py-2 align-top text-xs font-medium text-slate-500">
        {extraction.field_label}
        {extraction.source_note && (
          <span className="mt-0.5 block font-normal text-slate-400">
            {extraction.source_note}
          </span>
        )}
      </td>
      <td className="px-2 py-2 align-top text-slate-800">
        {editing ? (
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <>
            <span className={extraction.status === 'rejected' ? 'line-through opacity-50' : ''}>
              {effectiveValue}
            </span>
            {extraction.status === 'edited' && (
              <span className="ml-2 text-xs text-slate-400 line-through">
                {extraction.value}
              </span>
            )}
          </>
        )}
      </td>
      <td className="w-16 px-2 py-2 align-top">
        <ConfidenceBadge value={extraction.confidence} />
      </td>
      <td className="w-40 px-4 py-2 align-top">
        {editing ? (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => review('edited', draft)}
              disabled={busy || !draft.trim()}
              className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600"
            >
              Cancel
            </button>
          </div>
        ) : extraction.status === 'pending' ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => review('approved')}
              disabled={busy}
              title="Approve"
              className="rounded border border-emerald-200 p-1.5 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={busy}
              title="Edit"
              className="rounded border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => review('rejected')}
              disabled={busy}
              title="Reject"
              className="rounded border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => review('pending')}
            disabled={busy}
            className={`rounded px-2 py-0.5 text-[11px] font-medium ${
              extraction.status === 'approved'
                ? 'bg-emerald-50 text-emerald-700'
                : extraction.status === 'edited'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-red-50 text-red-600'
            }`}
            title="Click to undo review"
          >
            {extraction.status}
          </button>
        )}
      </td>
    </tr>
  )
}
