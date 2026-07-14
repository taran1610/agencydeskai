import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { WorkspaceDocument } from '@/lib/data'
import { DOC_TYPE_LABELS } from '@/lib/types'

const STATUS_LABEL: Record<WorkspaceDocument['status'], string> = {
  uploaded: 'Uploaded',
  processing: 'Processing',
  processed: 'Processed',
  failed: 'Failed',
}

export function DocumentsTable({ documents }: { documents: WorkspaceDocument[] }) {
  if (documents.length === 0) {
    return (
      <div className="dash-card border-dashed px-8 py-16 text-center">
        <FileText className="mx-auto text-[var(--gray-300)]" size={36} strokeWidth={1.25} />
        <p className="mt-4 text-sm font-semibold text-black">No documents yet</p>
        <p className="mx-auto mt-2 max-w-md text-xs text-[var(--gray-500)]">
          Upload files from a client account to see them listed here.
        </p>
        <Link href="/accounts" className="console-btn-primary mt-6 inline-flex">
          Go to accounts
        </Link>
      </div>
    )
  }

  return (
    <div className="dash-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--gray-50)] text-left text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
              <th className="px-5 py-3">Document</th>
              <th className="px-5 py-3">Account</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-[var(--gray-50)]">
                <td className="px-5 py-3">
                  <Link
                    href={`/accounts/${doc.account_id}`}
                    className="font-medium text-black hover:underline"
                  >
                    {doc.filename}
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--gray-600)]">{doc.account_name}</td>
                <td className="px-5 py-3 text-[var(--gray-600)]">
                  {doc.doc_type ? DOC_TYPE_LABELS[doc.doc_type] : '—'}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded border border-[var(--border)] px-2 py-0.5 text-xs font-medium">
                    {STATUS_LABEL[doc.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-[var(--gray-400)]">
                  {new Date(doc.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
