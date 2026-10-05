# Restore operations console + payments

`agencydeskai-app.vercel.app` currently returns Vercel `DEPLOYMENT_NOT_FOUND`.
The marketing site still links Sign in / console there, so Launch console / Sign in 404s.

## What already works

- Marketing: https://www.agencydesk.online / https://agencydeskai.vercel.app
- Solo Stripe Payment Link (money collection):
  https://buy.stripe.com/7sYdR86gP86zgpJfHC0RG00

## Temporary console deploy (claim ASAP — expires ~1h)

App: https://temporary-flying-cerulean-fi7yr6v.vercel.app/login  
Claim: https://vercel.com/claim-deployment?code=dfd48ef7-855a-4902-b88a-47c32437526a

After claiming:

1. Rename / assign production domain **`agencydeskai-app.vercel.app`** (or update `VITE_APP_URL` on the marketing project).
2. Set Production env vars (see `platform/README.md`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID` (+ Agency / Multi-office price IDs if used)
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://agencydeskai-app.vercel.app`
3. Redeploy.
4. Stripe webhook URL:
   `https://agencydeskai-app.vercel.app/api/webhooks/stripe`
5. Supabase Auth Site URL + redirect:
   `https://agencydeskai-app.vercel.app`
   `https://agencydeskai-app.vercel.app/api/auth/callback`

## Code changes in this branch

- Migrate Next.js `middleware` → `proxy` (Node runtime; required for deploy).
- Cap AI route `maxDuration` at 60s for Vercel plan limits.
- Don’t crash `/login` when Supabase env vars are missing.
- Marketing Solo pricing CTA → live Stripe Payment Link.
- Agency / Multi-office CTAs → contact email until in-app checkout is back.
