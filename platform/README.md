# AgencyDesk AI — Operations Console

The main product: an AI operations teammate for insurance agencies.

## Setup

1. Apply all migrations in `../supabase/migrations/` to your Supabase project.
2. Enable **Email** provider in Supabase Auth (Authentication → Providers).
3. `cp .env.example .env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY`
4. `npm install && npm run dev` → http://localhost:3000

## Auth & roles

Sign in with **Google**, **Apple**, or **email/password** (enable providers in Supabase → Authentication → Providers).

For Google: add your OAuth client ID/secret in Supabase and set redirect URL to `http://localhost:3000/api/auth/callback` (and your production URL).

| Role | Permissions |
|------|-------------|
| **Owner** | Everything + invite team members |
| **Reviewer** | Upload, process, review extractions, run analysis, export |
| **Viewer** | Read-only access to accounts and analyses |

- **First signup** automatically creates a workspace and assigns owner.
- **Later users** must be invited via Settings → Team (owners only).
- Invitation links: `/invite/[token]` (valid 7 days).

## Core loop

1. Create a client account
2. Upload documents (PDF, PNG, JPEG, WebP)
3. Process with AI (or **Process all** for batch)
4. Review fields — approve, edit, or reject; bulk approve ≥90% confidence
5. Generate analysis — summary, flags, CRM updates, action items
6. Export CSV or HTML report

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |

## Architecture

- Next.js App Router + TypeScript
- Supabase Auth + Postgres + Storage
- RLS on all tables; workspace-scoped data isolation
- Server routes validate session + role; service-role for AI pipeline
- Vercel AI SDK with Zod structured output (Claude primary, GPT-4o fallback)
