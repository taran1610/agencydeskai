import Link from 'next/link'
import { UserCheck } from 'lucide-react'
import { ReviewQueueClient } from '@/components/sections/ReviewQueueClient'
import type { WorkspaceExtraction } from '@/lib/data'

export function ReviewQueue({
  extractions,
  canReview,
}: {
  extractions: WorkspaceExtraction[]
  canReview: boolean
}) {
  const lowConfidence = extractions.filter((e) => e.confidence < 0.9).length
  const highConfidence = extractions.filter((e) => e.confidence >= 0.9).length

  if (extractions.length === 0) {
    return (
      <div className="dash-card px-8 py-16 text-center">
        <UserCheck className="mx-auto text-[var(--gray-300)]" size={36} />
        <p className="mt-4 text-sm font-semibold text-black">Review queue is empty</p>
        <p className="mx-auto mt-2 max-w-md text-xs text-[var(--gray-500)]">
          All extracted fields have been reviewed. New pending fields will appear here after AI
          processing.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="dash-card p-5">
          <p className="text-xs font-medium text-[var(--gray-500)]">Awaiting review</p>
          <p className="mt-2 text-3xl font-bold text-black">{extractions.length}</p>
        </div>
        <div className="dash-card p-5">
          <p className="text-xs font-medium text-[var(--gray-500)]">High confidence (≥90%)</p>
          <p className="mt-2 text-3xl font-bold text-black">{highConfidence}</p>
        </div>
        <div className="dash-card p-5">
          <p className="text-xs font-medium text-[var(--gray-500)]">Needs attention (&lt;90%)</p>
          <p className="mt-2 text-3xl font-bold text-black">{lowConfidence}</p>
        </div>
      </div>

      <div className="dash-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Pending fields</h2>
          <p className="text-xs text-[var(--gray-500)]">
            Approve, edit, or reject each extraction before exporting to CRM
          </p>
        </div>
        <ReviewQueueClient extractions={extractions} canReview={canReview} />
      </div>

      <p className="text-xs text-[var(--gray-500)]">
        Tip: open an{' '}
        <Link href="/accounts" className="font-medium text-black underline">
          account workspace
        </Link>{' '}
        for document context and bulk approve actions.
      </p>
    </div>
  )
}
