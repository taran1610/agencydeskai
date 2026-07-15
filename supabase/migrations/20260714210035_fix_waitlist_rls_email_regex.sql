-- Fix waitlist RLS email check (simpler regex, matches normal addresses).

drop policy if exists "Anyone can join waitlist" on public.waitlist_signups;

create policy "Anyone can join waitlist"
on public.waitlist_signups
for insert
to anon, authenticated
with check (
  email ~* '^[^@]+@[^@]+\.[^@]+$'
  and source in ('hero', 'final')
);
