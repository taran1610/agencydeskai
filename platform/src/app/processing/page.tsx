import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { ProcessingPipeline } from '@/components/dashboard/GettingStartedCard'
import { ProcessingQueue } from '@/components/sections/ProcessingQueue'
import { hasAiConfigured, requireConsolePage } from '@/lib/console-page'
import { listWorkspaceDocuments } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ProcessingPage() {
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
        section="Processing"
        title="AI processing queue"
        description={
          hasAiConfigured()
            ? 'Documents waiting to be classified and extracted. Open an account to process files.'
            : 'AI is not configured yet — add OPENAI_API_KEY or ANTHROPIC_API_KEY in Vercel, then redeploy.'
        }
      />
      <ProcessingQueue documents={documents} />
      <ProcessingPipeline />
    </div>
  )
}
