import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { IntegrationsPanel } from '@/components/sections/IntegrationsPanel'
import { hasAiConfigured, requireConsolePage } from '@/lib/console-page'

export const dynamic = 'force-dynamic'

export default async function IntegrationsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Integrations"
        title="Integrations"
        description="Connect AI providers, authentication, and future AMS/CRM systems to your workspace."
      />
      <IntegrationsPanel hasAiKey={hasAiConfigured()} />
    </div>
  )
}
