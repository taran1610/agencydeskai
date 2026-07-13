'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Pencil, Sparkles, UserCheck, X } from 'lucide-react'
import { ConfidenceBadge } from '@/components/ConfidenceBadge'
import type { Extraction, ExtractionStatus } from '@/lib/types'

export function ExtractionRow({
  extraction,
  canReview = true,
}: {
  extraction: Extraction
  canReview?: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(extraction.edited_value ?? extraction.value)

  const isHumanEdited = extraction.status === 'edited'
  const isApproved = extraction.status === 'approved'
  const isRejected = extraction.status === 'rejected'
  const isPending = extraction.status === 'pending'

  const effectiveValue =
    isHumanEdited && extraction.edited_value ? extraction.edited_value : extraction.value

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

  const rowBg = isHumanEdited
    ? 'bg-indigo-50/60'
    : isApproved
      ? 'bg-emerald-50/40'
      : isRejected
        ? 'bg-red-50/30'
        : ''

  return (
    <tr className={`border-t border-slate-100 ${rowBg}`}>
      <td className="w-52 px-4 py-2.5 align-top text-xs font-medium text-slate-500">
        {extraction.field_label}
        {extraction.source_note && (
          <span className="mt-1 block rounded bg-slate-100 px-1.5 py-0.5 font-normal text-[10px] leading-snug text-slate-500">
            📄 {extraction.source_note}
          </span>
        )}
      </td>
      <td className="px-2 py-2.5 align-top">
        {editing ? (
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full rounded border border-indigo-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {isPending && (
                <span className="inline-flex items-center gap-0.5 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                  <Sparkles size={9} /> AI suggested
                </span>
              )}
              {isHumanEdited && (
                <span className="inline-flex items-center gap-0.5 rounded border border-indigo-200 bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800">
                  <UserCheck size={9} /> Human edited
                </span>
              )}
              {isApproved && !isHumanEdited && (
                <span className="inline-flex items-center gap-0.5 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                  <Check size={9} /> Approved
                </span>
              )}
            </div>
            <p
              className={`text-sm text-slate-800 ${isRejected ? 'line-through opacity-50' : ''} ${
                isHumanEdited ? 'font-medium text-indigo-900' : ''
              }`}
            >
              {effectiveValue}
            </p>
            {isHumanEdited && (
              <p className="text-xs text-slate-400">
                AI had: <span className="line-through">{extraction.value}</span>
              </p>
            )}
          </div>
        )}
      </td>
      <td className="w-16 px-2 py-2.5 align-top">
        <ConfidenceBadge value={extraction.confidence} />
      </td>
      <td className="w-44 px-4 py-2.5 align-top">
        {!canReview ? (
          <span className="text-xs text-slate-400">{extraction.status}</span>
        ) : editing ? (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => review('edited', draft)}
              disabled={busy || !draft.trim()}
              className="rounded bg-indigo-700 px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              Save edit
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600"
            >
              Cancel
            </button>
          </div>
        ) : isPending ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => review('approved')}
              disabled={busy}
              title="Approve AI value"
              className="rounded border border-emerald-200 p-1.5 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={busy}
              title="Edit before approving"
              className="rounded border border-indigo-200 p-1.5 text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
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
              isApproved
                ? 'bg-emerald-50 text-emerald-700'
                : isHumanEdited
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
