# Email funnel (Resend)

Transactional + lifecycle emails for AgencyDesk AI, sent via [Resend](https://resend.com).

## What gets sent

| Trigger | Email | When |
|---------|-------|------|
| New workspace created (first signup / OAuth) | Welcome — thanks for trying us | `ensureUserWorkspace` |
| Stripe Checkout completed | Thank you for subscribing | `checkout.session.completed` webhook |
| Marketing waitlist form | Thanks for joining the waitlist | `POST /api/email/waitlist` |

Contacts are stored in `email_contacts` (for your CRM view) and optionally synced to a Resend Audience for broadcasts (product updates, incident notes, etc.).

Sends are idempotent via `email_events` (one welcome / waitlist per email; one purchase per Checkout session).

## Environment variables (Vercel: **agencydeskai-app**)

| Variable | Required | Example |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | `re_...` |
| `EMAIL_FROM` | Yes | `AgencyDesk AI <hello@agencydesk.ai>` |
| `EMAIL_REPLY_TO` | Optional | `liber1821@gmail.com` |
| `RESEND_AUDIENCE_ID` | Optional | Audience ID from Resend for broadcasts |
| `NEXT_PUBLIC_MARKETING_URL` | Optional | `https://agencydesk.ai` (CORS for waitlist API) |

Without `RESEND_API_KEY` / `EMAIL_FROM`, email calls no-op (logged) so signup and billing still work.

## Resend setup

1. Create an account at [resend.com](https://resend.com)
2. **Domains** → add `agencydesk.ai` (or your sending domain) and verify DNS (SPF + DKIM)
3. **API Keys** → create a key → set `RESEND_API_KEY` on Vercel
4. Set `EMAIL_FROM` to an address on that verified domain
5. Optional: **Audiences** → create “Customers” → copy ID to `RESEND_AUDIENCE_ID`
6. Redeploy **agencydeskai-app**

Until the domain is verified, you can test with Resend’s onboarding address (`beth.t@example.com`) as `EMAIL_FROM`, but production should use your domain.

## Broadcasting updates later

1. Contacts land in Resend Audience (if `RESEND_AUDIENCE_ID` is set) and in Supabase `email_contacts`
2. In Resend: **Broadcasts** → write update / “we’re fixing X” → send to the audience
3. Or filter tags in your own tooling (`signup`, `purchase`, `waitlist`, `paid`)

## Local test

```bash
cd platform
# set RESEND_API_KEY + EMAIL_FROM in .env.local
curl -X POST http://localhost:3000/api/email/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```
