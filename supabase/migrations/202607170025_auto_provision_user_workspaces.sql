-- Give every independent signup a workspace immediately.
-- Invitations can still add users to an existing workspace.

create schema if not exists private;

create or replace function private.bootstrap_user_workspace()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ws_id uuid;
  ws_name text;
begin
  if exists (
    select 1
    from public.workspace_members
    where user_id = new.id
  ) then
    return new;
  end if;

  ws_name := coalesce(
    nullif(btrim(new.raw_user_meta_data->>'workspace_name'), ''),
    nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'My Agency'
  );

  insert into public.workspaces (name)
  values (ws_name)
  returning id into ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  return new;
end;
$$;

revoke all on function private.bootstrap_user_workspace() from public, anon, authenticated;

drop trigger if exists on_auth_user_bootstrap on auth.users;
create trigger on_auth_user_bootstrap
  after insert on auth.users
  for each row execute function private.bootstrap_user_workspace();

drop function if exists public.bootstrap_first_workspace();

-- Repair users who previously signed in but were blocked because only the
-- first account received a workspace.
do $$
declare
  orphan record;
  ws_id uuid;
  ws_name text;
begin
  for orphan in
    select u.id, u.email, u.raw_user_meta_data
    from auth.users u
    where not exists (
      select 1
      from public.workspace_members wm
      where wm.user_id = u.id
    )
  loop
    ws_name := coalesce(
      nullif(btrim(orphan.raw_user_meta_data->>'workspace_name'), ''),
      nullif(btrim(orphan.raw_user_meta_data->>'full_name'), ''),
      nullif(split_part(coalesce(orphan.email, ''), '@', 1), ''),
      'My Agency'
    );

    insert into public.workspaces (name)
    values (ws_name)
    returning id into ws_id;

    insert into public.workspace_members (workspace_id, user_id, role)
    values (ws_id, orphan.id, 'owner');
  end loop;
end;
$$;
