-- Treat duplicate emails as idempotent signups (same person, second form).
create unique index if not exists waitlist_signups_email_lower_idx
  on public.waitlist_signups (lower(email));
