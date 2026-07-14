import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { DocumentsTable } from '@/components/sections/DocumentsTable'
import { requireConsolePage } from '@/lib/console-page'
import { listWorkspaceDocuments } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const documents = await listWorkspaceDocuments(auth.workspaceId)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Documents"
        title="All documents"
        description={`${documents.length} file${documents.length === 1 ? '' : 's'} uploaded across every account in your workspace.`}
      />
      <DocumentsTable documents={documents} />
    </div>
  )
}
