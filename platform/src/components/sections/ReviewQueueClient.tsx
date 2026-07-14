'use client'

import { ReviewQueueRow } from '@/components/sections/ReviewQueueRow'
import type { WorkspaceExtraction } from '@/lib/data'

export function ReviewQueueClient({
  extractions,
  canReview,
}: {
  extractions: WorkspaceExtraction[]
  canReview: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--gray-50)] text-left text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
            <th className="px-5 py-3">Account</th>
            <th className="px-5 py-3">Document</th>
            <th className="px-5 py-3">Field</th>
            <th className="px-5 py-3">Value</th>
            <th className="px-5 py-3">Conf.</th>
            <th className="px-5 py-3">Review</th>
          </tr>
        </thead>
        <tbody>
          {extractions.map((extraction) => (
            <ReviewQueueRow key={extraction.id} extraction={extraction} canReview={canReview} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
