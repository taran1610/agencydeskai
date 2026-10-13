import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { PageHeader } from '@/components/console/PageHeader'
import { AccountsGrid } from '@/components/dashboard/AccountsGrid'
import { NewAccountForm } from '@/components/NewAccountForm'
import { requireConsolePage } from '@/lib/console-page'
import { listAccounts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AccountsPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth, canCreate } = result

  const accounts = await listAccounts(auth.workspaceId)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Client accounts"
        title="All client accounts"
        description="One account per insured. Open an account to upload documents, run AI extraction, and review fields."
        action={canCreate ? <NewAccountForm /> : undefined}
      />

      <AccountsGrid accounts={accounts} canCreate={canCreate} />
    </div>
  )
}
