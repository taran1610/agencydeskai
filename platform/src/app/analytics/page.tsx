import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { AnalyticsView } from '@/components/sections/AnalyticsView'
import { requireConsolePage } from '@/lib/console-page'
import { getWorkspaceAnalytics } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const analytics = await getWorkspaceAnalytics(auth.workspaceId)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Analytics"
        title="Platform analytics"
        description="Workspace-wide metrics — document mix, AI confidence, review progress, and per-account breakdown."
      />
      <AnalyticsView data={analytics} />
    </div>
  )
}
