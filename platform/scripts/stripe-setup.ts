/**
 * One-time Stripe setup for AgencyDesk AI.
 * Creates product, price, and webhook endpoint.
 *
 * Run: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-setup.ts
 */
import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
const webhookUrl =
  process.env.STRIPE_WEBHOOK_URL ??
  'https://agencydeskai-app.vercel.app/api/webhooks/stripe'

if (!key) {
  console.error('Set STRIPE_SECRET_KEY in the environment first.')
  process.exit(1)
}

const stripe = new Stripe(key)

const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]

async function ensureProductAndPrice() {
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

  return price.id
}

async function ensureWebhook() {
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 })
  const match = endpoints.data.find((e) => e.url === webhookUrl && e.status !== 'disabled')

  if (match) {
    console.log('Webhook already exists:', match.id)
    console.log('If you lost the secret, delete this endpoint in Stripe Dashboard and re-run this script.')
    return null
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: WEBHOOK_EVENTS,
    description: 'AgencyDesk AI — subscription sync',
  })

  console.log('Created webhook:', endpoint.id)
  return endpoint.secret
}

async function main() {
  const priceId = await ensureProductAndPrice()
  const webhookSecret = await ensureWebhook()

  console.log('\n--- Add to Vercel (agencydeskai-app) ---')
  console.log(`STRIPE_PRICE_ID=${priceId}`)
  if (webhookSecret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`)
  }
  console.log('\nAlso enable in Stripe Dashboard:')
  console.log('- Settings → Billing → Customer portal')
  console.log('- Settings → Tax → Stripe Tax')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
