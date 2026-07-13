import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, History } from 'lucide-react'
import { AnalysisPanel } from '@/components/AnalysisPanel'
import { DocumentCard } from '@/components/DocumentCard'
import { UploadZone } from '@/components/UploadZone'
import { getAccountDetail } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getAccountDetail(id)
  if (!detail) notFound()
  const { account, documents, extractions, latestAnalysis, auditTrail } = detail

  const processedCount = documents.filter((doc) => doc.status === 'processed').length

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={13} /> All accounts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {account.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'} ·{' '}
          {processedCount} processed ·{' '}
          {extractions.filter((extraction) => extraction.status === 'pending').length}{' '}
          fields awaiting review
        </p>
      </div>

      <UploadZone accountId={account.id} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Documents
        </h2>
        {documents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Upload the client&rsquo;s packet above — ACORD forms, loss runs, dec pages,
            certificates. The AI reads each one and extracts every material field.
          </p>
        ) : (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              extractions={extractions.filter(
                (extraction) => extraction.document_id === doc.id,
              )}
            />
          ))
        )}
      </section>

      <AnalysisPanel
        accountId={account.id}
        analysis={latestAnalysis}
        processedCount={processedCount}
      />

      <section className="space-y-3">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <History size={14} /> Audit trail
        </h2>
        {auditTrail.length === 0 ? (
          <p className="text-sm text-slate-400">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-sm">
            {auditTrail.map((entry) => (
              <li key={entry.id} className="flex items-baseline gap-3 px-4 py-2.5">
                <span
                  className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-[11px] font-medium ${
                    entry.actor === 'ai'
                      ? 'bg-indigo-50 text-indigo-700'
                      : entry.actor === 'human'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {entry.actor}
                </span>
                <span className="font-medium text-slate-700">{entry.action}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
                  {JSON.stringify(entry.detail)}
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
