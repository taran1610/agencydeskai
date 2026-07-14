# Stripe (agencydeskai-app)

B2B subscription billing for insurance agency workspaces.

## Environment variables (Vercel project: agencydeskai-app)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Secret key (`sk_test_...` or `sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_test_...`) |
| `STRIPE_PRICE_ID` | Monthly price ID (`price_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_APP_URL` | `https://agencydeskai-app.vercel.app` |

## One-time Stripe setup

1. **Stripe Dashboard** → activate **Billing**, **Tax**, and **Customer portal**
2. Create product + price (or run script):

```bash
cd platform
STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-setup.ts
```

Copy the printed `STRIPE_PRICE_ID` into Vercel.

3. **Webhooks** → Add endpoint:
   - URL: `https://agencydeskai-app.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

4. **Customer portal** → Enable invoice history, payment methods, cancellation

5. **Stripe Tax** → Settings → Tax → enable and add registration

6. Redeploy `agencydeskai-app`

## Test flow

1. Sign in as workspace **owner**
2. Settings → **Subscribe to Pro**
3. Checkout with test card `4242 4242 4242 4242`
4. **Manage billing & invoices** opens Stripe Customer Portal

## Security

Never commit secret keys. Rotate any key pasted in chat or logs.
