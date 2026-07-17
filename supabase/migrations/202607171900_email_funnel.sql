-- Track outbound transactional emails (idempotency) and funnel contacts.

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  event_type text not null
    check (event_type in ('welcome', 'purchase', 'waitlist')),
  user_id uuid references auth.users (id) on delete set null,
  workspace_id uuid references public.workspaces (id) on delete set null,
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists email_events_welcome_email_uidx
  on public.email_events (lower(email))
  where event_type = 'welcome';

create unique index if not exists email_events_waitlist_email_uidx
  on public.email_events (lower(email))
  where event_type = 'waitlist';

create unique index if not exists email_events_purchase_external_uidx
  on public.email_events (external_id)
  where event_type = 'purchase' and external_id is not null;

create index if not exists email_events_email_idx
  on public.email_events (lower(email));

alter table public.email_events enable row level security;

create table if not exists public.email_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  source text not null
    check (source in ('signup', 'purchase', 'waitlist')),
  user_id uuid references auth.users (id) on delete set null,
  workspace_id uuid references public.workspaces (id) on delete set null,
  tags text[] not null default '{}',
  resend_contact_id text,
  subscribed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists email_contacts_email_uidx
  on public.email_contacts (lower(email));

alter table public.email_contacts enable row level security;
