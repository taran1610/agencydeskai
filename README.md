# AgencyDesk AI

**AgencyDesk AI** is an AI-native insurance operations platform. The main product lives in **`platform/`** — a Next.js operations console where agencies upload client document packets, the AI classifies and extracts fields, humans review and approve, and the system produces account summaries, flags, and CRM-ready updates.

The repo root (`src/`) contains the **marketing site** and waitlist for the private beta.

## Quick start (product)

```bash
cd platform
npm install
cp .env.example .env.local   # Supabase + AI keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). First signup creates your workspace as **owner**. Invite reviewers and viewers from **Settings → Team**.

Apply migrations in `supabase/migrations/` to your Supabase project before first run.

## Quick start (marketing site)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

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
