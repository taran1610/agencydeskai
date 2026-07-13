'use client'

import type { AccountAnalysis } from '@/lib/types'
import { diffAnalyses } from '@/lib/analysis'

export function AnalysisHistory({
  analyses,
}: {
  analyses: AccountAnalysis[]
}) {
  if (analyses.length < 2) return null

  const [current, previous] = analyses
  const diff = diffAnalyses(previous, current)
  if (!diff) return null

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4">
      <h3 className="text-sm font-semibold text-indigo-900">
        Changes since last analysis ({new Date(previous.created_at).toLocaleString()})
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-indigo-800">
        {diff.summaryChanged && <li>· Summary updated</li>}
        {diff.newFlags.map((f) => (
          <li key={f.title}>
            · New flag [{f.severity}]: {f.title}
          </li>
        ))}
        {diff.resolvedFlags.map((f) => (
          <li key={f.title} className="text-indigo-600">
            · Resolved: {f.title}
          </li>
        ))}
        {diff.newUpdates.map((u) => (
          <li key={u.field}>
            · New CRM update: {u.field} = {u.suggestedValue}
          </li>
        ))}
        {diff.changedUpdates.map((u) => (
          <li key={u.field}>
            · Changed {u.field}: {u.from} → {u.to}
          </li>
        ))}
        {!diff.summaryChanged &&
          diff.newFlags.length === 0 &&
          diff.resolvedFlags.length === 0 &&
          diff.newUpdates.length === 0 &&
          diff.changedUpdates.length === 0 && (
            <li className="text-indigo-600">· No material changes detected</li>
          )}
      </ul>
    </div>
  )
}
