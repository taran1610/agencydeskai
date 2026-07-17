# Stripe (agencydeskai-app)

B2B subscription billing for insurance agency workspaces.

## Environment variables (Vercel project: agencydeskai-app)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Secret key (`sk_live_...` in production) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_live_...` in production) |
| `STRIPE_PRICE_ID` | Solo monthly price ID (`price_...`) from **live** mode |
| `STRIPE_PRICE_ID_AGENCY` | Agency monthly price ID |
| `STRIPE_PRICE_ID_MULTI_OFFICE` | Multi-office monthly price ID |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) from **live** endpoint |
| `NEXT_PUBLIC_APP_URL` | `https://agencydeskai-app.vercel.app` |
| `STRIPE_AUTOMATIC_TAX` | Optional. Set to `true` only after Stripe Tax head office is configured |

## Promo code

**`Thanks50`** — 50% off forever on every plan (Solo / Agency / Multi-office).  
Enter it on the Stripe Checkout “Add promotion code” field.

| Plan | List | With Thanks50 |
|------|------|---------------|
| Solo | US$299/mo | US$149.50/mo |
| Agency | US$799/mo | US$399.50/mo |
| Multi-office | US$1999/mo | US$999.50/mo |

## Go live (production payments)

1. **Stripe Dashboard** → toggle **Test mode OFF** (live mode)
2. Activate **Billing**, **Customer portal**, and complete business verification if prompted
3. Create product + price (or run script with live key):

```bash
cd platform
STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/stripe-setup.ts
```

Copy the printed `STRIPE_PRICE_ID` and `STRIPE_WEBHOOK_SECRET`.

4. **Vercel** → `agencydeskai-app` → Settings → Environment Variables → update all four Stripe vars with **live** values
5. Redeploy: `npx vercel deploy --prod` from `platform/`

### Stripe Tax (optional)

Automatic tax is **off by default** so checkout works without a head office address.

When ready:

1. Stripe Dashboard → **Settings → Tax** → add head office address and tax registrations
2. Set `STRIPE_AUTOMATIC_TAX=true` on Vercel
3. Redeploy

## Webhooks

Live endpoint URL:

`https://agencydeskai-app.vercel.app/api/webhooks/stripe`

Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`

## How customers pay (live)

**In-app (recommended):** workspace owners go to  
https://agencydeskai-app.vercel.app/checkout?plan=solo → **Subscribe**  
→ Stripe Checkout (Visa / Mastercard / Amex / etc.) → money lands in your Stripe balance → webhook marks the workspace **active**.

**Direct Payment Link (Solo $299/mo):**  
https://buy.stripe.com/7sYdR86gP86zgpJfHC0RG00  

Use the Payment Link for quick collection. Prefer in-app checkout when the buyer needs their workspace subscription synced automatically.

## Test flow (before going live)

1. Use `sk_test_...` keys on a preview deployment
2. Sign in as workspace **owner**
3. `/checkout?plan=solo` → **Subscribe**
4. Test card: `4242 4242 4242 4242`

## Security

Never commit secret keys. Rotate any key pasted in chat or logs.
