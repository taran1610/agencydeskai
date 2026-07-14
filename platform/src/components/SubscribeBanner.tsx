import Link from 'next/link'
import { CreditCard } from 'lucide-react'

export function SubscribeBanner({
  isOwner,
  stripeConfigured,
  subscriptionActive,
}: {
  isOwner: boolean
  stripeConfigured: boolean
  subscriptionActive: boolean
}) {
  if (!stripeConfigured || subscriptionActive) return null

  return (
    <section className="dash-card flex flex-wrap items-center justify-between gap-4 border-black bg-black p-5 text-white">
      <div className="flex items-start gap-3">
        <CreditCard size={20} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Subscribe to AgencyDesk Pro</p>
          <p className="mt-1 text-xs text-[var(--gray-300)]">
            $299/month per workspace — AI processing, team seats, invoicing, and automatic tax.
          </p>
        </div>
      </div>
      {isOwner ? (
        <Link href="/billing" className="console-btn-secondary bg-white text-black hover:bg-[var(--gray-100)]">
          View plans & subscribe
        </Link>
      ) : (
        <p className="text-xs text-[var(--gray-400)]">Ask your workspace owner to subscribe.</p>
      )}
    </section>
  )
}
