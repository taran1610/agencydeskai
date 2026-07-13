'use client'

import { Download, FileText, Table } from 'lucide-react'

export function ExportMenu({
  accountId,
  hasAnalysis,
}: {
  accountId: string
  hasAnalysis: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <a
        href={`/api/accounts/${accountId}/export?format=csv`}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500"
      >
        <Table size={14} /> CSV
      </a>
      {hasAnalysis && (
        <a
          href={`/api/accounts/${accountId}/export?format=html`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500"
        >
          <FileText size={14} /> Report
        </a>
      )}
      <span className="sr-only">Export</span>
      <Download size={14} className="text-slate-400" aria-hidden />
    </div>
  )
}
