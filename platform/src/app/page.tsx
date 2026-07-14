import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { ConfidenceOverview } from '@/components/dashboard/ConfidenceOverview'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import {
  GettingStartedCard,
  ProcessingPipeline,
} from '@/components/dashboard/GettingStartedCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { DemoDataBanner } from '@/components/DemoDataBanner'
import { OverviewQuickNav } from '@/components/sections/OverviewQuickNav'
import { hasAiConfigured, requireConsolePage } from '@/lib/console-page'
import { getWorkspaceDashboardInsights, listAccounts, summarizeWorkspace } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth, canCreate } = result

  const [accounts, insights] = await Promise.all([
    listAccounts(auth.workspaceId),
    getWorkspaceDashboardInsights(auth.workspaceId),
  ])
  const stats = summarizeWorkspace(accounts)
  const hasDemo = accounts.some((a) => a.is_demo)
  const featured = accounts.slice(0, 3)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Overview"
        title="Operations overview"
        description="A snapshot of your entire workspace — accounts, documents, processing status, and recent activity."
      />

      <DemoDataBanner hasDemo={hasDemo} canManage={auth.role === 'owner'} />

      <DashboardStats stats={stats} />

      <div className="grid gap-4 xl:grid-cols-2">
        <GettingStartedCard
          accounts={accounts}
          canCreate={canCreate}
          hasAiKey={hasAiConfigured()}
        />
        <ProcessingPipeline />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity items={insights.recentActivity} />
        <ConfidenceOverview confidence={insights.confidence} />
      </div>

      {featured.length > 0 && (
        <section className="dash-card">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-sm font-semibold text-black">Recent accounts</h2>
            <Link href="/accounts" className="text-xs font-semibold text-black hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {featured.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/accounts/${account.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[var(--gray-50)]"
                >
                  <div>
                    <p className="text-sm font-medium text-black">{account.name}</p>
                    <p className="text-xs text-[var(--gray-500)]">
                      {account.documentCount} docs · {account.pendingReviewCount} to review
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--gray-400)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <OverviewQuickNav />
    </div>
  )
}
