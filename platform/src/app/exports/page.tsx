import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { ExportsPanel } from '@/components/sections/ExportsPanel'
import { requireConsolePage } from '@/lib/console-page'
import { listExportReadyAccounts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ExportsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const accounts = await listExportReadyAccounts(auth.workspaceId)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="CRM & exports"
        title="Exports & CRM prep"
        description="Download CSV extractions and HTML summary reports, or copy CRM-ready blocks from account analysis."
      />
      <ExportsPanel accounts={accounts} />
    </div>
  )
}
