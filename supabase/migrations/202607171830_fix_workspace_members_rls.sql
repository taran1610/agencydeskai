-- Make workspace membership readable by the member themselves.
-- Fixes Google/OAuth users who are provisioned but blocked by a recursive RLS check.

drop policy if exists "Members read membership" on public.workspace_members;
drop policy if exists "Members read own membership" on public.workspace_members;
drop policy if exists "Members read workspace roster" on public.workspace_members;

create policy "Members read own membership"
on public.workspace_members for select to authenticated
using (user_id = auth.uid());

create policy "Members read workspace roster"
on public.workspace_members for select to authenticated
using (workspace_id in (select public.user_workspace_ids()));
