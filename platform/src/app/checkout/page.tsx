import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ConfigurePlanCheckout } from '@/components/checkout/ConfigurePlanCheckout'
import { NoWorkspaceAccess } from '@/components/NoWorkspaceAccess'
import { requireConsolePage } from '@/lib/console-page'
import { getWorkspaceBilling } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'
import './checkout.css'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const result = await requireConsolePage()
  if ('noWorkspace' in result) {
    return <NoWorkspaceAccess email={result.noWorkspace} />
  }
  const { auth } = result

  const billing = await getWorkspaceBilling(auth.workspaceId)

  return (
    <Suspense fallback={<div className="checkout-page checkout-page--loading">Loading…</div>}>
      <ConfigurePlanCheckout
        billing={billing}
        stripeConfigured={isStripeConfigured()}
        isOwner={auth.role === 'owner'}
        userEmail={auth.email}
        workspaceName={billing?.name ?? 'My Agency'}
      />
    </Suspense>
  )
}
