import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_PRICE_ID,
  )
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

export function getStripePriceId() {
  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) throw new Error('STRIPE_PRICE_ID is not configured')
  return priceId
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
  'https://agencydeskai-app.vercel.app'
