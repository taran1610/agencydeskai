import Link from 'next/link'
import { ConfidenceOverview } from '@/components/dashboard/ConfidenceOverview'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DocumentTypesPanel } from '@/components/dashboard/DocumentTypesPanel'
import type { WorkspaceAnalytics } from '@/lib/data'

export function AnalyticsView({ data }: { data: WorkspaceAnalytics }) {
  return (
    <div className="space-y-6">
      <DashboardStats stats={data.stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ConfidenceOverview confidence={data.confidence} />
        <DocumentTypesPanel types={data.documentTypes} totalDocuments={data.stats.documentCount} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Analyses run', value: data.analysisCount },
          { label: 'Fields approved', value: data.approvedCount },
          { label: 'Fields edited', value: data.editedCount },
          { label: 'Fields rejected', value: data.rejectedCount },
        ].map((item) => (
          <div key={item.label} className="dash-card p-5">
            <p className="text-xs font-medium text-[var(--gray-500)]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="dash-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Per-account breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--gray-50)] text-left text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Documents</th>
                <th className="px-5 py-3">Processed</th>
                <th className="px-5 py-3">Pending review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.accounts.map((account) => (
                <tr key={account.id} className="hover:bg-[var(--gray-50)]">
                  <td className="px-5 py-3">
                    <Link
                      href={`/accounts/${account.id}`}
                      className="font-medium text-black hover:underline"
                    >
                      {account.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[var(--gray-600)]">{account.documentCount}</td>
                  <td className="px-5 py-3 text-[var(--gray-600)]">
                    {account.processedDocumentCount}
                  </td>
                  <td className="px-5 py-3 font-medium text-black">
                    {account.pendingReviewCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
