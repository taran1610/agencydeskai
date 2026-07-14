import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { AccountsGrid } from '@/components/dashboard/AccountsGrid'
import { ConfidenceOverview } from '@/components/dashboard/ConfidenceOverview'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import {
  GettingStartedCard,
  ProcessingPipeline,
} from '@/components/dashboard/GettingStartedCard'
import { DocumentTypesPanel } from '@/components/dashboard/DocumentTypesPanel'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { DemoDataBanner } from '@/components/DemoDataBanner'
import { NewAccountForm } from '@/components/NewAccountForm'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { getAuthContext, getSignedInUser } from '@/lib/auth/session'
import { canWrite } from '@/lib/auth/permissions'
import { ROLE_LABELS } from '@/lib/auth/permissions'
import { ensureDemoDataForWorkspace } from '@/lib/demo/seed'
import {
  getWorkspaceDashboardInsights,
  listAccounts,
  summarizeWorkspace,
} from '@/lib/data'
import { isSupabaseConfigured } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function hasAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect('/login')
  }

  const auth = await getAuthContext()
  if (!auth) {
    const user = await getSignedInUser()
    if (user) {
      return <NoWorkspaceAccess email={user.email} />
    }
    redirect('/login')
  }

  const canCreate = canWrite(auth.role)

  try {
    await ensureDemoDataForWorkspace(auth.workspaceId, auth.userId)
  } catch (error) {
    console.error('Demo seed skipped:', error)
  }

  const [accounts, insights] = await Promise.all([
    listAccounts(auth.workspaceId),
    getWorkspaceDashboardInsights(auth.workspaceId),
  ])
  const stats = summarizeWorkspace(accounts)
  const hasDemo = accounts.some((a) => a.is_demo)

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb + page header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--gray-400)]">
            <span className="font-medium text-[var(--gray-600)]">{ROLE_LABELS[auth.role]}</span>
            <ChevronRight size={12} />
            <span>Operations Console</span>
          </nav>
          <h1 className="console-title mt-2">Client accounts</h1>
          <p className="console-lede">
            Upload insurance documents, let the AI read and extract every field, review with your
            team, then generate account summaries and CRM-ready updates.
          </p>
        </div>
        {canCreate && (
          <div id="exports" className="w-full sm:w-80">
            <NewAccountForm />
          </div>
        )}
      </div>

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

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentActivity items={insights.recentActivity} />
        <ConfidenceOverview confidence={insights.confidence} />
        <DocumentTypesPanel types={insights.documentTypes} totalDocuments={stats.documentCount} />
      </div>

      <div id="integrations" className="scroll-mt-20" aria-hidden />

      <AccountsGrid accounts={accounts} canCreate={canCreate} />
    </div>
  )
}
