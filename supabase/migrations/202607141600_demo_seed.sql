-- Demo / sample data support for onboarding workspaces.

alter table public.workspaces
  add column if not exists demo_seeded_at timestamptz;

alter table public.accounts
  add column if not exists is_demo boolean not null default false;

create index if not exists accounts_workspace_demo_idx
  on public.accounts (workspace_id)
  where is_demo = true;
