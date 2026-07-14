import Link from 'next/link'
import { Check, Plug, X } from 'lucide-react'

export function IntegrationsPanel({
  hasAiKey,
  hasStripe = false,
}: {
  hasAiKey: boolean
  hasStripe?: boolean
}) {
  const integrations = [
    {
      name: 'Supabase',
      description: 'Authentication, database, and document storage for your workspace.',
      status: 'connected' as const,
      detail: 'Connected via environment variables on Vercel.',
    },
    {
      name: 'Anthropic / OpenAI',
      description: 'AI models for document classification and field extraction.',
      status: hasAiKey ? ('connected' as const) : ('disconnected' as const),
      detail: hasAiKey
        ? 'API key configured — live processing enabled.'
        : 'Add ANTHROPIC_API_KEY or OPENAI_API_KEY in Vercel project settings.',
    },
    {
      name: 'Google OAuth',
      description: 'Sign in with Google for your team members.',
      status: 'optional' as const,
      detail: 'Enable under Supabase → Authentication → Providers.',
    },
    {
      name: 'Stripe Billing',
      description: 'B2B subscription billing, invoicing, and tax collection for agency workspaces.',
      status: hasStripe ? ('connected' as const) : ('disconnected' as const),
      detail: hasStripe
        ? 'Checkout, Customer Portal, and webhooks configured for AgencyDesk Pro subscriptions.'
        : 'Add STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and STRIPE_PRICE_ID in Vercel.',
    },
    {
      name: 'Applied Epic / AMS',
      description: 'Push approved field updates to your agency management system.',
      status: 'coming' as const,
      detail: 'CRM export blocks are available now; direct AMS sync is on the roadmap.',
    },
    {
      name: 'Salesforce',
      description: 'Sync account summaries and suggested CRM field updates.',
      status: 'coming' as const,
      detail: 'Use CSV export or copy CRM blocks from account analysis today.',
    },
  ]

  return (
    <div className="space-y-4">
      {integrations.map((item) => (
        <div key={item.name} className="dash-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--gray-50)]">
                <Plug size={18} className="text-[var(--gray-600)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">{item.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--gray-500)]">
                  {item.description}
                </p>
                <p className="mt-2 text-xs text-[var(--gray-400)]">{item.detail}</p>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
      <p className="text-xs text-[var(--gray-500)]">
        Need a specific integration?{' '}
        <Link href="/settings" className="font-medium text-black underline">
          Contact your workspace owner
        </Link>{' '}
        or export via CRM & exports in the meantime.
      </p>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: 'connected' | 'disconnected' | 'optional' | 'coming'
}) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-black bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
        <Check size={11} /> Connected
      </span>
    )
  }
  if (status === 'disconnected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-strong)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
        <X size={11} /> Not configured
      </span>
    )
  }
  if (status === 'optional') {
    return (
      <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-500)]">
        Optional
      </span>
    )
  }
  return (
    <span className="rounded-full border border-dashed border-[var(--border-strong)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">
      Coming soon
    </span>
  )
}
