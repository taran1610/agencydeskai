create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text,
  source text not null default 'hero',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

drop policy if exists "Anyone can join waitlist" on public.waitlist_signups;

create policy "Anyone can join waitlist"
on public.waitlist_signups
for insert
to anon, authenticated
with check (
  email ~* '^[^@]+@[^@]+\.[^@]+$'
  and source in ('hero', 'final')
);
