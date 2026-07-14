/**
 * One-time setup: creates AgencyDesk Pro product + monthly price in Stripe.
 * Run from platform/: npx tsx scripts/stripe-setup.ts
 */
import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('Set STRIPE_SECRET_KEY in the environment first.')
  process.exit(1)
}

const stripe = new Stripe(key)

async function main() {
  const existing = await stripe.products.search({
    query: "name:'AgencyDesk Pro'",
  })

  let product = existing.data[0]
  if (!product) {
    product = await stripe.products.create({
      name: 'AgencyDesk Pro',
      description:
        'AI document intake, extraction, review, and CRM export for insurance agencies. Billed monthly per workspace.',
      metadata: { app: 'agencydeskai' },
    })
    console.log('Created product:', product.id)
  } else {
    console.log('Product already exists:', product.id)
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 })
  let price = prices.data.find((p) => p.recurring?.interval === 'month')

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: 29900,
      currency: 'usd',
      recurring: { interval: 'month' },
      nickname: 'AgencyDesk Pro — Monthly',
      tax_behavior: 'exclusive',
    })
    console.log('Created price:', price.id)
  } else {
    console.log('Price already exists:', price.id)
  }

  console.log('\nAdd to Vercel (agencydeskai-app):')
  console.log(`STRIPE_PRICE_ID=${price.id}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
