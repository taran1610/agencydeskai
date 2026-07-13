'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  AlertTriangle,
  ClipboardList,
  Copy,
  Database,
  Loader2,
  Sparkles,
} from 'lucide-react'
import type { AccountAnalysis } from '@/lib/types'

const SEVERITY_STYLES = {
  high: 'border-red-200 bg-red-50 text-red-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-slate-200 bg-slate-50 text-slate-700',
}

export function AnalysisPanel({
  accountId,
  analysis,
  processedCount,
}: {
  accountId: string
  analysis: AccountAnalysis | null
  processedCount: number
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function run() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/accounts/${accountId}/analyze`, {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Analysis failed')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setBusy(false)
    }
  }

  async function copySummary() {
    if (!analysis) return
    await navigator.clipboard.writeText(analysis.summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Account analysis
        </h2>
        <button
          type="button"
          onClick={run}
          disabled={busy || processedCount === 0}
          title={processedCount === 0 ? 'Process at least one document first' : undefined}
          className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {busy ? 'Analyzing…' : analysis ? 'Re-run analysis' : 'Generate analysis'}
        </button>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!analysis ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Once documents are processed, the AI writes the account summary, flags missing
          or inconsistent information, and prepares CRM updates for your approval.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Client file summary</h3>
              <button
                type="button"
                onClick={copySummary}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
              >
                <Copy size={12} /> {copied ? 'Copied' : 'Copy for CRM'}
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {analysis.summary}
            </p>
            <p className="mt-3 text-[11px] text-slate-400">
              Generated {new Date(analysis.created_at).toLocaleString()}
              {analysis.model ? ` · ${analysis.model}` : ''}
            </p>
          </div>

          {analysis.flags.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <AlertTriangle size={14} className="text-amber-600" />
                Flags ({analysis.flags.length})
              </h3>
              <ul className="mt-3 space-y-2">
                {analysis.flags.map((flag, index) => (
                  <li
                    key={index}
                    className={`rounded-md border px-3 py-2 text-sm ${SEVERITY_STYLES[flag.severity]}`}
                  >
                    <span className="font-medium">
                      [{flag.severity}] {flag.title}
                    </span>{' '}
                    <span className="opacity-90">— {flag.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggested_updates.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <Database size={14} className="text-slate-500" />
                Suggested CRM updates
              </h3>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="pb-1.5 font-medium">Field</th>
                    <th className="pb-1.5 font-medium">Suggested value</th>
                    <th className="pb-1.5 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.suggested_updates.map((update, index) => (
                    <tr key={index} className="border-t border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-700">{update.field}</td>
                      <td className="py-2 pr-4 text-slate-800">{update.suggestedValue}</td>
                      <td className="py-2 text-xs text-slate-400">{update.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-slate-400">
                Nothing is written to any CRM or AMS automatically — copy what you approve.
              </p>
            </div>
          )}

          {analysis.action_items.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <ClipboardList size={14} className="text-slate-500" />
                Action items
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {analysis.action_items.map((item, index) => (
                  <li key={index} className="flex items-baseline gap-2">
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${
                        item.priority === 'high'
                          ? 'bg-red-50 text-red-700'
                          : item.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span>
                      <span className="font-medium text-slate-800">{item.title}</span>{' '}
                      <span className="text-slate-600">— {item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
