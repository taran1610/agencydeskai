import Link from 'next/link'
import { Database, FileText, Table } from 'lucide-react'
import type { ExportReadyAccount } from '@/lib/data'

export function ExportsPanel({ accounts }: { accounts: ExportReadyAccount[] }) {
  if (accounts.length === 0) {
    return (
      <div className="dash-card border-dashed px-8 py-16 text-center">
        <Database className="mx-auto text-[var(--gray-300)]" size={36} />
        <p className="mt-4 text-sm font-semibold text-black">Nothing to export yet</p>
        <p className="mx-auto mt-2 max-w-md text-xs text-[var(--gray-500)]">
          Create an account, process documents, and run analysis to generate CRM-ready exports.
        </p>
      </div>
    )
  }

  return (
    <div className="dash-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-sm font-semibold text-black">Export by account</h2>
        <p className="text-xs text-[var(--gray-500)]">
          Download extracted fields as CSV or generate a summary report
        </p>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {accounts.map((account) => (
          <li
            key={account.id}
            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  {account.name}
                </Link>
                {account.is_demo && (
                  <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--gray-500)]">
                    Sample
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--gray-500)]">
                {account.documentCount} documents · {account.processedDocumentCount} processed
                {account.pendingReviewCount > 0 &&
                  ` · ${account.pendingReviewCount} fields pending review`}
              </p>
              {account.hasAnalysis && account.analysisDate && (
                <p className="mt-0.5 text-[11px] text-[var(--gray-400)]">
                  Analysis generated{' '}
                  {new Date(account.analysisDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/api/accounts/${account.id}/export?format=csv`}
                className="console-btn-secondary inline-flex items-center gap-1.5"
              >
                <Table size={14} /> CSV
              </a>
              {account.hasAnalysis ? (
                <a
                  href={`/api/accounts/${account.id}/export?format=html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="console-btn-secondary inline-flex items-center gap-1.5"
                >
                  <FileText size={14} /> Report
                </a>
              ) : (
                <span className="text-[11px] text-[var(--gray-400)]">Run analysis for report</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
