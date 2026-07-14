# AgencyDesk AI

**AgencyDesk AI** is an AI-native insurance operations platform. The main product lives in **`platform/`** — a Next.js operations console where agencies upload client document packets, the AI classifies and extracts fields, humans review and approve, and the system produces account summaries, flags, and CRM-ready updates.

The repo root (`src/`) contains the **marketing site** and waitlist for the private beta.

## Production URLs

| App | URL |
|-----|-----|
| Marketing site | https://agencydeskai.vercel.app |
| Operations console | https://agencydeskai-app.vercel.app |

## Production setup

1. Apply all migrations in `supabase/migrations/` in the Supabase SQL editor.
2. Configure Supabase **Authentication → URL Configuration**:
   - Site URL: `https://agencydeskai-app.vercel.app`
   - Redirect URL: `https://agencydeskai-app.vercel.app/api/auth/callback`
3. Set Vercel env vars on **agencydeskai-app**:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY`
4. Set Vercel env vars on **agencydeskai** (marketing):
   - `VITE_APP_URL=https://agencydeskai-app.vercel.app`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (waitlist)

Sign in at https://agencydeskai-app.vercel.app/login — first signup creates your workspace as **owner**.

## Repository layout

```text
platform/          ← Main product (Next.js 16, App Router)
  src/app/         Pages + API routes
  src/components/  Review UI, analysis, auth
  src/lib/         AI pipeline, auth, data, export

src/               Marketing landing page (Vite + React)
supabase/          Shared migrations (waitlist + platform + auth)
docs/              Launch playbooks
```

## Product features

- **Auth + roles** — Supabase Auth with owner / reviewer / viewer; invitation links
- **Core loop** — Upload → classify → extract → review → analyze → export
- **Review UX** — AI vs human badges, bulk approve high-confidence fields
- **Analysis** — Severity-ranked flags, source citations, copy-paste CRM block
- **Batch** — Process all pending documents at once
- **Versioning** — Analysis history with diff vs previous run
- **Export** — CSV (extractions) and HTML report (analysis)

## Docs

- [platform/README.md](platform/README.md) — Product setup and architecture
- [docs/LAUNCH.md](docs/LAUNCH.md) — Marketing launch checklist
- [docs/supabase-setup.md](docs/supabase-setup.md) — Supabase configuration

## License

Private — AgencyDesk AI.
