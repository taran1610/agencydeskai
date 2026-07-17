import Stripe from 'stripe'
import type { CheckoutPlanId } from '@/lib/plans'

let stripeClient: Stripe | null = null

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_PRICE_ID,
  )
}

/** Enable only after Stripe Tax head office is configured in Dashboard. */
export function isStripeAutomaticTaxEnabled() {
  return process.env.STRIPE_AUTOMATIC_TAX === 'true'
}

export function isStripeLiveMode() {
  const key = process.env.STRIPE_SECRET_KEY ?? ''
  return key.startsWith('sk_live_')
}

export function getStripeMode(): 'live' | 'test' | 'unknown' {
  const key = process.env.STRIPE_SECRET_KEY ?? ''
  if (key.startsWith('sk_live_')) return 'live'
  if (key.startsWith('sk_test_')) return 'test'
  return 'unknown'
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, { typescript: true })
  }
  return stripeClient
}

export function getStripePriceId(plan: CheckoutPlanId = 'solo') {
  const priceByPlan: Record<CheckoutPlanId, string | undefined> = {
    solo: process.env.STRIPE_PRICE_ID,
    agency: process.env.STRIPE_PRICE_ID_AGENCY,
    'multi-office': process.env.STRIPE_PRICE_ID_MULTI_OFFICE,
  }

  const priceId = priceByPlan[plan]
  if (!priceId) {
    if (plan === 'solo') throw new Error('STRIPE_PRICE_ID is not configured')
    throw new Error(
      `Stripe price for ${plan} is not configured. Add STRIPE_PRICE_ID_${plan === 'agency' ? 'AGENCY' : 'MULTI_OFFICE'}.`,
    )
  }
  return priceId
}

export function isStripePlanConfigured(plan: CheckoutPlanId) {
  try {
    getStripePriceId(plan)
    return isStripeConfigured()
  } catch {
    return false
  }
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
  'https://agencydeskai-app.vercel.app'
