import { Suspense } from 'react'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { BillingPanel } from '@/components/BillingPanel'
import { PageHeader } from '@/components/console/PageHeader'
import { requireConsolePage } from '@/lib/console-page'
import { getWorkspaceBilling } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const billing = await getWorkspaceBilling(auth.workspaceId)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <PageHeader
        role={auth.role}
        section="Billing"
        title="Billing & subscription"
        description="Manage your AgencyDesk Pro subscription, invoices, and payment methods."
      />

      <Suspense fallback={null}>
        <BillingPanel
          billing={billing}
          stripeConfigured={isStripeConfigured()}
          isOwner={auth.role === 'owner'}
        />
      </Suspense>

      <section className="dash-card p-5 text-sm">
        <h2 className="font-semibold text-black">What&apos;s included</h2>
        <ul className="mt-3 space-y-2 text-xs text-[var(--gray-600)]">
          <li>Unlimited client accounts and document uploads</li>
          <li>AI document classification and field extraction</li>
          <li>Human review workflow with audit trail</li>
          <li>Account analysis, flags, and CRM export blocks</li>
          <li>Team invites (reviewers and viewers)</li>
          <li>Stripe-hosted invoices with automatic tax calculation</li>
        </ul>
      </section>
    </div>
  )
}
