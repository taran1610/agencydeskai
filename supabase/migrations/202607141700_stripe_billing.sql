-- Stripe Billing: link workspaces to Stripe customers and subscriptions.

alter table public.workspaces
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text not null default 'none'
    check (subscription_status in (
      'none', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'
    )),
  add column if not exists subscription_plan text,
  add column if not exists subscription_current_period_end timestamptz;

create index if not exists workspaces_stripe_customer_idx
  on public.workspaces (stripe_customer_id)
  where stripe_customer_id is not null;
