# AgencyDesk AI — Operations Console

Production: **https://agencydeskai-app.vercel.app**

The main product: an AI operations teammate for insurance agencies.

## Production setup (Vercel + Supabase)

1. Apply all migrations in `../supabase/migrations/` in the Supabase SQL editor.
2. Enable **Email** (and optionally **Google** / **Apple**) in Supabase → Authentication → Providers.
3. Supabase → Authentication → URL Configuration:
   - Site URL: `https://agencydeskai-app.vercel.app`
   - Redirect URLs (add both):
     - `https://agencydeskai-app.vercel.app/api/auth/callback`
     - `https://agencydeskai-app.vercel.app/**`
4. Vercel project **agencydeskai-app** → Environment Variables (Production):

   | Variable | Source |
   |----------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API (secret) |
   | `OPENAI_API_KEY` | platform.openai.com (or use `ANTHROPIC_API_KEY` instead) |
   | `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
   | `STRIPE_PRICE_ID` | Run `npx tsx scripts/stripe-setup.ts` or create in Dashboard |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook → `/api/webhooks/stripe` |
   | `NEXT_PUBLIC_APP_URL` | `https://agencydeskai-app.vercel.app` |
   | `RESEND_API_KEY` | Resend → API Keys |
   | `EMAIL_FROM` | e.g. `AgencyDesk AI <hello@agencydesk.ai>` |
   | `EMAIL_REPLY_TO` | Optional reply address |
   | `RESEND_AUDIENCE_ID` | Optional — for product update broadcasts |

See [docs/STRIPE.md](docs/STRIPE.md) for billing and [docs/EMAIL.md](docs/EMAIL.md) for the Resend mail funnel.

5. Redeploy after adding env vars.

For Google OAuth: add client ID/secret in Supabase and set Google redirect URI to  
`https://jghdvkuwguugneoowopu.supabase.co/auth/v1/callback`

## Auth & roles

Sign in with **Google** or **email/password**.

| Role | Permissions |
|------|-------------|
| **Owner** | Everything + invite team members |
| **Reviewer** | Upload, process, review extractions, run analysis, export |
| **Viewer** | Read-only access to accounts and analyses |

- **Every signup** (Google or email) automatically gets their own workspace as owner.
- **Invitations** (Settings → Team) add people to an *existing* agency workspace.
- Invitation links: `https://agencydeskai-app.vercel.app/invite/[token]` (valid 7 days).

## Core loop

1. Create a client account
2. Upload documents (PDF, PNG, JPEG, WebP)
3. Process with AI (or **Process all** for batch)
4. Review fields — approve, edit, or reject; bulk approve ≥90% confidence
5. Generate analysis — summary, flags, CRM updates, action items
6. Export CSV or HTML report

## Architecture

- Next.js App Router + TypeScript, deployed on Vercel
- Supabase Auth + Postgres + Storage
- RLS on all tables; workspace-scoped data isolation
- Server routes validate session + role; service-role for AI pipeline
- Vercel AI SDK with Zod structured output (Claude primary, GPT-4o fallback)
