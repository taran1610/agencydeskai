import { supabaseAdmin } from '@/lib/supabase/admin'
import type { CheckoutPlanId } from '@/lib/plans'
import {
  APP_URL,
  getStripe,
  getStripePriceId,
  isStripeAutomaticTaxEnabled,
} from '@/lib/stripe/client'
import type { WorkspaceBilling } from '@/lib/stripe/status'
import { isSubscriptionActive } from '@/lib/stripe/status'

export type { WorkspaceBilling }
export { isSubscriptionActive }

export async function getWorkspaceBilling(
  workspaceId: string,
): Promise<WorkspaceBilling | null> {
  const { data, error } = await supabaseAdmin()
    .from('workspaces')
    .select(
      'id, name, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, subscription_current_period_end',
    )
    .eq('id', workspaceId)
    .single()
  if (error || !data) return null
  return data as WorkspaceBilling
}

export async function getOrCreateStripeCustomer(
  workspace: WorkspaceBilling,
  email: string,
): Promise<string> {
  const stripe = getStripe()

  if (workspace.stripe_customer_id) {
    try {
      const existing = await stripe.customers.retrieve(workspace.stripe_customer_id)
      if (!('deleted' in existing && existing.deleted)) {
        return existing.id
      }
    } catch {
      // Stale ID (e.g. keys rotated to another Stripe account) — create fresh below.
    }
  }

  const customer = await stripe.customers.create({
    email,
    name: workspace.name,
    metadata: {
      workspace_id: workspace.id,
    },
  })

  const { error } = await supabaseAdmin()
    .from('workspaces')
    .update({ stripe_customer_id: customer.id })
    .eq('id', workspace.id)
  if (error) throw new Error(error.message)

  return customer.id
}

export async function createCheckoutSession(options: {
  workspaceId: string
  email: string
  userId: string
  plan?: CheckoutPlanId
}) {
  const plan = options.plan ?? 'solo'
  const workspace = await getWorkspaceBilling(options.workspaceId)
  if (!workspace) throw new Error('Workspace not found')

  const customerId = await getOrCreateStripeCustomer(workspace, options.email)
  const stripe = getStripe()

  const sessionParams: import('stripe').Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: getStripePriceId(plan), quantity: 1 }],
    success_url: `${APP_URL}/billing?billing=success`,
    cancel_url: `${APP_URL}/checkout?plan=${plan}&billing=canceled`,
    client_reference_id: workspace.id,
    metadata: {
      workspace_id: workspace.id,
      user_id: options.userId,
      plan,
    },
    subscription_data: {
      metadata: {
        workspace_id: workspace.id,
        plan,
      },
    },
    billing_address_collection: 'required',
    allow_promotion_codes: true,
  }

  if (isStripeAutomaticTaxEnabled()) {
    sessionParams.automatic_tax = { enabled: true }
    sessionParams.customer_update = { address: 'auto', name: 'auto' }
    sessionParams.tax_id_collection = { enabled: true }
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  if (!session.url) throw new Error('Could not create checkout session')
  return session.url
}

export async function createBillingPortalSession(workspaceId: string) {
  const workspace = await getWorkspaceBilling(workspaceId)
  if (!workspace?.stripe_customer_id) {
    throw new Error('No billing account yet. Subscribe first.')
  }

  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: workspace.stripe_customer_id,
    return_url: `${APP_URL}/billing`,
  })

  return session.url
}

export async function syncSubscriptionToWorkspace(
  subscription: import('stripe').Stripe.Subscription,
) {
  const workspaceId = subscription.metadata.workspace_id
  if (!workspaceId) return

  const status = subscription.status
  const plan =
    subscription.items.data[0]?.price?.nickname ??
    subscription.items.data[0]?.price?.id ??
    'pro'

  const periodEnd = subscription.items.data[0]?.current_period_end

  await supabaseAdmin()
    .from('workspaces')
    .update({
      stripe_subscription_id: subscription.id,
      subscription_status: mapSubscriptionStatus(status),
      subscription_plan: plan,
      subscription_current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    })
    .eq('id', workspaceId)
}

function mapSubscriptionStatus(status: string): string {
  const allowed = [
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
  ] as const
  if (allowed.includes(status as (typeof allowed)[number])) return status
  return 'none'
}

export async function markWorkspaceSubscriptionCanceled(subscriptionId: string) {
  await supabaseAdmin()
    .from('workspaces')
    .update({
      subscription_status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('stripe_subscription_id', subscriptionId)
}
