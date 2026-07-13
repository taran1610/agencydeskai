'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ClipboardList,
  Copy,
  Database,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { AnalysisHistory } from '@/components/AnalysisHistory'
import { sortFlagsBySeverity } from '@/lib/analysis'
import type { AccountAnalysis } from '@/lib/types'

const SEVERITY_STYLES = {
  high: 'border-red-300 bg-red-50 text-red-900',
  medium: 'border-amber-300 bg-amber-50 text-amber-900',
  low: 'border-slate-200 bg-slate-50 text-slate-700',
}

const SEVERITY_BADGE = {
  high: 'bg-red-600 text-white',
  medium: 'bg-amber-500 text-white',
  low: 'bg-slate-400 text-white',
}

export function AnalysisPanel({
  accountId,
  analyses,
  processedCount,
  canRun = true,
  accountName,
}: {
  accountId: string
  analyses: AccountAnalysis[]
  processedCount: number
  canRun?: boolean
  accountName: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<'summary' | 'crm' | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const analysis = analyses[selectedIndex] ?? null
  const sortedFlags = useMemo(
    () => (analysis ? sortFlagsBySeverity(analysis.flags) : []),
    [analysis],
  )

  async function run() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`/api/accounts/${accountId}/analyze`, {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Analysis failed')
      setSelectedIndex(0)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setBusy(false)
    }
  }

  async function copyText(text: string, kind: 'summary' | 'crm') {
    await navigator.clipboard.writeText(text)
    setCopied(kind)
    setTimeout(() => setCopied(null), 1500)
  }

  const crmBlock =
    analysis?.crm_export_block ??
    (analysis
      ? [
          `=== ${accountName} — CRM Update ===`,
          analysis.summary,
          '',
          ...analysis.suggested_updates.map(
            (u) =>
              `${u.field}: ${u.suggestedValue}\n  Source: ${u.source}${u.sourceDocument ? ` (${u.sourceDocument})` : ''}`,
          ),
        ].join('\n')
      : '')

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Account analysis
          </h2>
          {analyses.length > 1 && (
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="mt-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-600"
            >
              {analyses.map((a, i) => (
                <option key={a.id} value={i}>
                  {i === 0 ? 'Latest — ' : ''}
                  {new Date(a.created_at).toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>
        {canRun && (
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
        )}
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
          {selectedIndex === 0 && analyses.length > 1 && (
            <AnalysisHistory analyses={analyses} />
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Client file summary</h3>
              <button
                type="button"
                onClick={() => copyText(analysis.summary, 'summary')}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
              >
                <Copy size={12} /> {copied === 'summary' ? 'Copied' : 'Copy summary'}
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

          {sortedFlags.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <AlertTriangle size={14} className="text-amber-600" />
                Flags ({sortedFlags.length}) — sorted by severity
              </h3>
              <ul className="mt-3 space-y-2">
                {sortedFlags.map((flag, index) => (
                  <li
                    key={index}
                    className={`rounded-md border px-3 py-2.5 text-sm ${SEVERITY_STYLES[flag.severity]}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${SEVERITY_BADGE[flag.severity]}`}
                      >
                        {flag.severity}
                      </span>
                      <span className="rounded bg-white/60 px-1.5 py-0.5 text-[10px] font-medium uppercase">
                        {flag.type}
                      </span>
                      <span className="font-semibold">{flag.title}</span>
                    </div>
                    <p className="mt-1 opacity-90">{flag.detail}</p>
                    {flag.sourceDocuments && flag.sourceDocuments.length > 0 && (
                      <p className="mt-1 text-xs opacity-75">
                        Sources: {flag.sourceDocuments.join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggested_updates.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Database size={14} className="text-slate-500" />
                  Suggested CRM updates
                </h3>
                <button
                  type="button"
                  onClick={() => copyText(crmBlock, 'crm')}
                  className="flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700"
                >
                  <Copy size={11} /> {copied === 'crm' ? 'Copied' : 'Copy CRM block'}
                </button>
              </div>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="pb-1.5 font-medium">Field</th>
                    <th className="pb-1.5 font-medium">Suggested value</th>
                    <th className="pb-1.5 font-medium">Source citation</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.suggested_updates.map((update, index) => (
                    <tr key={index} className="border-t border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-700">{update.field}</td>
                      <td className="py-2 pr-4 font-mono text-sm text-slate-800">
                        {update.suggestedValue}
                      </td>
                      <td className="py-2 text-xs text-slate-500">
                        {update.source}
                        {update.sourceDocument && (
                          <span className="mt-0.5 block text-slate-400">
                            📄 {update.sourceDocument}
                            {update.sourceSection ? ` · ${update.sourceSection}` : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <pre className="mt-4 max-h-40 overflow-auto rounded border border-slate-100 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-600">
                {crmBlock}
              </pre>
            </div>
          )}

          {analysis.action_items.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <ClipboardList size={14} className="text-slate-500" />
                Action items
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {[...analysis.action_items]
                  .sort(
                    (a, b) =>
                      ({ high: 0, medium: 1, low: 2 })[a.priority] -
                      ({ high: 0, medium: 1, low: 2 })[b.priority],
                  )
                  .map((item, index) => (
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
