import Stripe from 'stripe'
import type { CheckoutPlanId } from '@/lib/plans'

let stripeClient: Stripe | null = null

function readEnv(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/**
 * Secret key from the app env, or from the Vercel Stripe integration
 * (`agencydesk_STRIPE_SECRET_KEY`).
 */
export function getStripeSecretKey() {
  return (
    readEnv(process.env.STRIPE_SECRET_KEY) ??
    readEnv(process.env.agencydesk_STRIPE_SECRET_KEY)
  )
}

/** Hosted Checkout needs a secret key and the Solo price. The publishable key is not used. */
export function isStripeConfigured() {
  return Boolean(getStripeSecretKey() && readEnv(process.env.STRIPE_PRICE_ID))
}

/** Enable only after Stripe Tax head office is configured in Dashboard. */
export function isStripeAutomaticTaxEnabled() {
  return process.env.STRIPE_AUTOMATIC_TAX === 'true'
}

export function isStripeLiveMode() {
  return (getStripeSecretKey() ?? '').startsWith('sk_live_')
}

export function getStripeMode(): 'live' | 'test' | 'unknown' {
  const key = getStripeSecretKey() ?? ''
  if (key.startsWith('sk_live_')) return 'live'
  if (key.startsWith('sk_test_')) return 'test'
  return 'unknown'
}

export function getStripe() {
  const key = getStripeSecretKey()
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

  const priceId = readEnv(priceByPlan[plan])
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
