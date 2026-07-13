'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { ExtractionRow } from '@/components/ExtractionRow'
import type { DocumentRow, Extraction } from '@/lib/types'
import { DOC_TYPE_LABELS } from '@/lib/types'

const STATUS_STYLES: Record<DocumentRow['status'], string> = {
  uploaded: 'bg-slate-100 text-slate-600',
  processing: 'bg-indigo-50 text-indigo-700',
  processed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
}

export function DocumentCard({
  document,
  extractions,
  canReview = true,
}: {
  document: DocumentRow
  extractions: Extraction[]
  canReview?: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(document.status === 'processed')

  async function process() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/documents/${document.id}/process`, {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Processing failed')
      setOpen(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
    } finally {
      setBusy(false)
    }
  }

  async function bulkApproveHigh() {
    setBulkBusy(true)
    try {
      const res = await fetch('/api/extractions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          status: 'approved',
          minConfidence: 0.9,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setBulkBusy(false)
    }
  }

  const pending = extractions.filter((e) => e.status === 'pending')
  const highConfidencePending = pending.filter((e) => e.confidence >= 0.9)

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-slate-400 hover:text-slate-700"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <FileText size={16} className="shrink-0 text-slate-400" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
          {document.filename}
        </span>
        {document.doc_type && (
          <span
            className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-600"
            title={document.doc_type_reasoning ?? undefined}
          >
            {DOC_TYPE_LABELS[document.doc_type]}
            {document.doc_type_confidence != null &&
              ` · ${Math.round(document.doc_type_confidence * 100)}%`}
          </span>
        )}
        <span
          className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[document.status]}`}
        >
          {busy ? 'processing' : document.status}
        </span>
        {canReview && (
          <button
            type="button"
            onClick={process}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-500 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={13} className="animate-spin" />
            ) : document.status === 'processed' || document.status === 'failed' ? (
              <RefreshCw size={13} />
            ) : (
              <Sparkles size={13} />
            )}
            {busy
              ? 'Reading…'
              : document.status === 'processed' || document.status === 'failed'
                ? 'Reprocess'
                : 'Process with AI'}
          </button>
        )}
      </div>

      {(error || document.error) && (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error ?? document.error}
        </p>
      )}

      {open && extractions.length > 0 && (
        <div className="border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Extracted fields ({extractions.length})
            </p>
            <div className="flex items-center gap-2">
              {pending.length > 0 && (
                <p className="text-xs text-amber-700">{pending.length} awaiting review</p>
              )}
              {canReview && highConfidencePending.length > 0 && (
                <button
                  type="button"
                  onClick={bulkApproveHigh}
                  disabled={bulkBusy}
                  className="flex items-center gap-1 rounded border border-emerald-200 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                >
                  {bulkBusy ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <CheckCheck size={10} />
                  )}
                  Approve ≥90% ({highConfidencePending.length})
                </button>
              )}
            </div>
          </div>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400">
                <th className="px-4 pb-1 font-medium">Field</th>
                <th className="px-2 pb-1 font-medium">Value</th>
                <th className="px-2 pb-1 font-medium">Conf.</th>
                <th className="px-4 pb-1 font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {extractions.map((extraction) => (
                <ExtractionRow
                  key={extraction.id}
                  extraction={extraction}
                  canReview={canReview}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
