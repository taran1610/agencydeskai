export interface WorkspaceBilling {
  id: string
  name: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string
  subscription_plan: string | null
  subscription_current_period_end: string | null
}

export function isSubscriptionActive(status: string) {
  return status === 'active' || status === 'trialing'
}
