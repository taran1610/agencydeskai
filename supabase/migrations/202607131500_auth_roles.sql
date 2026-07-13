-- Auth, workspaces, roles, and invitations for AgencyDesk AI platform.

-- ---------------------------------------------------------------------------
-- Workspaces & membership
-- ---------------------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Agency',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'reviewer', 'viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx
  on public.workspace_members (user_id);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role text not null check (role in ('reviewer', 'viewer')),
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists invitations_token_idx on public.invitations (token);
create index if not exists invitations_email_idx on public.invitations (lower(email));

-- ---------------------------------------------------------------------------
-- Tie existing data to workspaces
-- ---------------------------------------------------------------------------

alter table public.accounts
  add column if not exists workspace_id uuid references public.workspaces (id) on delete cascade;

alter table public.extractions
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null;

alter table public.audit_log
  add column if not exists user_id uuid references auth.users (id) on delete set null;

-- ---------------------------------------------------------------------------
-- RLS helper functions
-- ---------------------------------------------------------------------------

create or replace function public.user_workspace_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select workspace_id from public.workspace_members where user_id = auth.uid();
$$;

create or replace function public.user_role(ws_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.workspace_members
  where user_id = auth.uid() and workspace_id = ws_id
  limit 1;
$$;

create or replace function public.can_write(ws_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.user_role(ws_id) in ('owner', 'reviewer');
$$;

create or replace function public.is_owner(ws_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.user_role(ws_id) = 'owner';
$$;

-- ---------------------------------------------------------------------------
-- RLS policies (authenticated users via anon key + session)
-- ---------------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;

drop policy if exists "Members read workspace" on public.workspaces;
create policy "Members read workspace"
on public.workspaces for select to authenticated
using (id in (select public.user_workspace_ids()));

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update to authenticated
using (id = auth.uid());

drop policy if exists "Members read membership" on public.workspace_members;
create policy "Members read membership"
on public.workspace_members for select to authenticated
using (workspace_id in (select public.user_workspace_ids()));

drop policy if exists "Owners manage invitations" on public.invitations;
create policy "Owners read invitations"
on public.invitations for select to authenticated
using (public.is_owner(workspace_id));

create policy "Owners insert invitations"
on public.invitations for insert to authenticated
with check (public.is_owner(workspace_id));

-- Accounts
drop policy if exists "Members read accounts" on public.accounts;
create policy "Members read accounts"
on public.accounts for select to authenticated
using (workspace_id in (select public.user_workspace_ids()));

drop policy if exists "Writers manage accounts" on public.accounts;
create policy "Writers insert accounts"
on public.accounts for insert to authenticated
with check (public.can_write(workspace_id));

create policy "Writers update accounts"
on public.accounts for update to authenticated
using (public.can_write(workspace_id));

-- Documents
drop policy if exists "Members read documents" on public.documents;
create policy "Members read documents"
on public.documents for select to authenticated
using (
  account_id in (
    select id from public.accounts
    where workspace_id in (select public.user_workspace_ids())
  )
);

drop policy if exists "Writers manage documents" on public.documents;
create policy "Writers insert documents"
on public.documents for insert to authenticated
with check (
  account_id in (
    select id from public.accounts
    where public.can_write(workspace_id)
  )
);

create policy "Writers update documents"
on public.documents for update to authenticated
using (
  account_id in (
    select id from public.accounts
    where public.can_write(workspace_id)
  )
);

-- Extractions
drop policy if exists "Members read extractions" on public.extractions;
create policy "Members read extractions"
on public.extractions for select to authenticated
using (
  account_id in (
    select id from public.accounts
    where workspace_id in (select public.user_workspace_ids())
  )
);

drop policy if exists "Writers review extractions" on public.extractions;
create policy "Writers update extractions"
on public.extractions for update to authenticated
using (
  account_id in (
    select id from public.accounts
    where public.can_write(workspace_id)
  )
);

-- Analyses & audit (read for all members; writes via service role in API)
drop policy if exists "Members read analyses" on public.account_analyses;
create policy "Members read analyses"
on public.account_analyses for select to authenticated
using (
  account_id in (
    select id from public.accounts
    where workspace_id in (select public.user_workspace_ids())
  )
);

drop policy if exists "Members read audit" on public.audit_log;
create policy "Members read audit"
on public.audit_log for select to authenticated
using (
  account_id is null
  or account_id in (
    select id from public.accounts
    where workspace_id in (select public.user_workspace_ids())
  )
);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bootstrap: first signup becomes workspace owner
-- ---------------------------------------------------------------------------

create or replace function public.bootstrap_first_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
  member_count int;
begin
  select count(*) into member_count from public.workspace_members;
  if member_count = 0 then
    insert into public.workspaces (name)
    values (coalesce(new.raw_user_meta_data->>'workspace_name', 'My Agency'))
    returning id into ws_id;

    insert into public.workspace_members (workspace_id, user_id, role)
    values (ws_id, new.id, 'owner');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_bootstrap on auth.users;
create trigger on_auth_user_bootstrap
  after insert on auth.users
  for each row execute function public.bootstrap_first_workspace();

-- Backfill: attach orphan accounts to the first workspace if one exists
do $$
declare
  ws_id uuid;
begin
  select id into ws_id from public.workspaces order by created_at limit 1;
  if ws_id is not null then
    update public.accounts set workspace_id = ws_id where workspace_id is null;
  end if;
end;
$$;

alter table public.accounts
  alter column workspace_id set not null;

alter table public.account_analyses
  add column if not exists crm_export_block text;

-- ---------------------------------------------------------------------------
-- Storage policies (documents bucket: path = accountId/filename)
-- ---------------------------------------------------------------------------

create policy "Members read documents storage"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] in (
    select id::text from public.accounts
    where workspace_id in (select public.user_workspace_ids())
  )
);

create policy "Writers upload documents storage"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] in (
    select id::text from public.accounts
    where public.can_write(workspace_id)
  )
);
