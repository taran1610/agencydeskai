# AgencyDesk AI — Operations Console

The product app: an AI operations teammate for insurance agencies. Upload a client's
document packet (ACORD forms, loss runs, dec pages, COIs), and the AI classifies each
document, extracts every material field with confidence scores and source notes, writes
an account summary, flags missing/inconsistent information, and prepares CRM updates.
A human reviews and approves everything — nothing is written anywhere automatically.

The marketing site lives at the repo root; this app lives in `platform/`.

## Core loop

1. Create a client account.
2. Upload documents (PDF, PNG, JPEG, WebP — multiple at once).
3. Click "Process with AI" on each document: it is classified and its fields extracted,
   each with a confidence score and a source note.
4. Review each field: approve, edit, or reject. Edits override the AI value everywhere.
5. Click "Generate analysis": account summary, flags, suggested CRM updates, action items.
6. Everything the AI and humans did is recorded in the audit trail.

## Setup

1. Apply the migration `../supabase/migrations/202607131400_platform_core.sql` to your
   Supabase project (SQL editor, or `supabase db push`). It creates the tables and the
   private `documents` storage bucket.
2. `cp .env.example .env.local` and fill in:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY`
3. `npm install && npm run dev`, then open http://localhost:3000.

## Architecture

- **Next.js 15 App Router + TypeScript.** Server components read data; API routes mutate.
- **Supabase** Postgres + Storage. All tables have RLS enabled with no public policies;
  the app talks to the database only through server routes using the service-role key,
  so document data is never exposed to the browser via public API keys.
- **AI layer** (`src/lib/ai/`): Vercel AI SDK `generateObject` with Zod schemas for
  guaranteed-structured output. Claude Sonnet is primary; if it fails (rate limit,
  outage), the same call automatically retries on GPT-4o. Temperature 0.
- **No OCR pipeline needed for v1**: PDFs and images are sent natively to the model,
  which reads them directly. RAG/pgvector comes later for cross-account search.
- **Trust primitives**: per-field confidence + source note, human review state per field
  (`pending / approved / edited / rejected`), and an append-only `audit_log` of every AI
  and human action.

## Data model

- `accounts` — one per client file.
- `documents` — uploaded files, their classification (`doc_type` + confidence), status.
- `extractions` — one row per extracted field: key, label, value, confidence,
  source note, review status, optional human-edited value.
- `account_analyses` — versioned analyses: summary, flags, suggested CRM updates,
  action items.
- `audit_log` — append-only record of every action (`ai` / `human` / `system`).

## Roadmap

- Phase 2: side-by-side diff view against previous analyses, batch "process all",
  background job queue for large packets.
- Phase 3: email drafting from findings, CRM/AMS integration hooks, team workspace
  with Supabase Auth + roles.
