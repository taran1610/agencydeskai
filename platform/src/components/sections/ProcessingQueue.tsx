import Link from 'next/link'
import { AlertCircle, Sparkles } from 'lucide-react'
import type { WorkspaceDocument } from '@/lib/data'
import { DOC_TYPE_LABELS } from '@/lib/types'

export function ProcessingQueue({ documents }: { documents: WorkspaceDocument[] }) {
  const queued = documents.filter((d) => d.status === 'uploaded')
  const inProgress = documents.filter((d) => d.status === 'processing')
  const failed = documents.filter((d) => d.status === 'failed')
  const done = documents.filter((d) => d.status === 'processed')

  const needsAction = [...failed, ...queued]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Queued', value: queued.length },
          { label: 'Processing', value: inProgress.length },
          { label: 'Failed', value: failed.length },
          { label: 'Completed', value: done.length },
        ].map((item) => (
          <div key={item.label} className="dash-card p-5">
            <p className="text-xs font-medium text-[var(--gray-500)]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-black">{item.value}</p>
          </div>
        ))}
      </div>

      {needsAction.length === 0 ? (
        <div className="dash-card px-8 py-12 text-center">
          <Sparkles className="mx-auto text-[var(--gray-300)]" size={36} />
          <p className="mt-4 text-sm font-semibold text-black">Processing queue is clear</p>
          <p className="mt-2 text-xs text-[var(--gray-500)]">
            All documents are processed or currently running. Upload new files from an account to
            add to the queue.
          </p>
        </div>
      ) : (
        <div className="dash-card overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-sm font-semibold text-black">Needs processing</h2>
            <p className="text-xs text-[var(--gray-500)]">
              Open the account to run AI extraction on these files
            </p>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {needsAction.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black">{doc.filename}</p>
                  <p className="text-xs text-[var(--gray-500)]">
                    {doc.account_name}
                    {doc.doc_type ? ` · ${DOC_TYPE_LABELS[doc.doc_type]}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status === 'failed' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-black">
                      <AlertCircle size={13} /> Failed
                    </span>
                  )}
                  <Link
                    href={`/accounts/${doc.account_id}`}
                    className="console-btn-primary text-xs"
                  >
                    Open & process
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {inProgress.length > 0 && (
        <div className="dash-card overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-sm font-semibold text-black">Currently processing</h2>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {inProgress.map((doc) => (
              <li key={doc.id} className="px-5 py-3 text-sm text-[var(--gray-600)]">
                {doc.filename}{' '}
                <span className="text-[var(--gray-400)]">· {doc.account_name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
