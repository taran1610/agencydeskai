export type CheckoutPlanId = 'solo' | 'agency' | 'multi-office'

export type CheckoutPlan = {
  id: CheckoutPlanId
  name: string
  label: string
  price: number
  currency: string
  period: string
  seatNote: string
  tagline: string
  features: readonly string[]
  stripeCheckout: boolean
  contactSubject?: string
}

export const CHECKOUT_PLANS: Record<CheckoutPlanId, CheckoutPlan> = {
  solo: {
    id: 'solo',
    name: 'Solo',
    label: 'AgencyDesk Pro — Solo',
    price: 299,
    currency: 'US$',
    period: '/month',
    seatNote: '1 workspace',
    tagline: 'For producers and small books getting started.',
    stripeCheckout: true,
    features: [
      'Up to 25 client accounts',
      'AI document intake & extraction',
      'Human review with confidence scores',
      'CRM-ready export blocks',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    label: 'AgencyDesk Pro — Agency',
    price: 799,
    currency: 'US$',
    period: '/month',
    seatNote: 'up to 5 users',
    tagline: 'For growing teams that need shared workflows.',
    stripeCheckout: true,
    features: [
      'Unlimited client accounts',
      'Shared team workspace',
      'Owner, reviewer & viewer roles',
      'Bulk approve & process-all',
      'Priority support',
    ],
  },
  'multi-office': {
    id: 'multi-office',
    name: 'Multi-office',
    label: 'AgencyDesk Pro — Multi-office',
    price: 1999,
    currency: 'US$',
    period: '/month',
    seatNote: 'up to 20 users',
    tagline: 'For multi-location agency groups.',
    stripeCheckout: true,
    features: [
      'Everything in Agency',
      'Advanced review workflows',
      'Custom AMS integrations',
      'Dedicated onboarding support',
    ],
  },
}

/** Early-customer promo — enter at Stripe Checkout */
export const EARLY_CUSTOMER_PROMO_CODE = 'Thanks50'

export const DEFAULT_CHECKOUT_PLAN: CheckoutPlanId = 'solo'

export function parseCheckoutPlan(raw: string | null | undefined): CheckoutPlanId {
  if (raw && raw in CHECKOUT_PLANS) return raw as CheckoutPlanId
  return DEFAULT_CHECKOUT_PLAN
}

export function selectableCheckoutPlans(): CheckoutPlan[] {
  return [CHECKOUT_PLANS.solo, CHECKOUT_PLANS.agency, CHECKOUT_PLANS['multi-office']]
}
