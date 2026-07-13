-- AgencyDesk AI platform core schema.
-- Accounts -> documents -> extractions, plus account-level analyses and a full audit log.

create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  filename text not null,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint not null,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'processing', 'processed', 'failed')),
  doc_type text
    check (doc_type in (
      'acord_application', 'loss_run', 'dec_page', 'certificate_of_insurance',
      'policy_document', 'endorsement', 'quote', 'correspondence', 'other'
    )),
  doc_type_confidence numeric check (doc_type_confidence between 0 and 1),
  doc_type_reasoning text,
  error text,
  model text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists documents_account_idx on public.documents (account_id, created_at desc);

create table if not exists public.extractions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  field_key text not null,
  field_label text not null,
  value text not null,
  confidence numeric not null check (confidence between 0 and 1),
  source_note text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'edited', 'rejected')),
  edited_value text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists extractions_document_idx on public.extractions (document_id);
create index if not exists extractions_account_idx on public.extractions (account_id);

create table if not exists public.account_analyses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  summary text not null,
  flags jsonb not null default '[]',
  suggested_updates jsonb not null default '[]',
  action_items jsonb not null default '[]',
  model text,
  created_at timestamptz not null default now()
);

create index if not exists account_analyses_account_idx
  on public.account_analyses (account_id, created_at desc);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts (id) on delete set null,
  document_id uuid references public.documents (id) on delete set null,
  actor text not null check (actor in ('ai', 'human', 'system')),
  action text not null,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists audit_log_account_idx on public.audit_log (account_id, created_at desc);

-- The platform talks to Postgres exclusively through server-side routes using the
-- service-role key. RLS is enabled with no anon/authenticated policies, so the
-- public API keys cannot read or write any of this data.
alter table public.accounts enable row level security;
alter table public.documents enable row level security;
alter table public.extractions enable row level security;
alter table public.account_analyses enable row level security;
alter table public.audit_log enable row level security;

-- Private storage bucket for uploaded insurance documents.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
