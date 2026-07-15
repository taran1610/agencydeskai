'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react'
import type { WorkspaceBilling } from '@/lib/stripe/status'
import { isSubscriptionActive } from '@/lib/stripe/status'

export function BillingPanel({
  billing,
  stripeConfigured,
  isOwner,
}: {
  billing: WorkspaceBilling | null
  stripeConfigured: boolean
  isOwner: boolean
}) {
  const searchParams = useSearchParams()
  const billingNotice = searchParams.get('billing')
  const shouldAutoCheckout = searchParams.get('checkout') === '1'
  const autoCheckoutStarted = useRef(false)
  const [busy, setBusy] = useState<'checkout' | 'portal' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const status = billing?.subscription_status ?? 'none'
  const active = isSubscriptionActive(status)

  function friendlyBillingError(message: string) {
    if (/no such price/i.test(message)) {
      return 'Billing is misconfigured on the server (invalid Stripe price). Contact support or try again later.'
    }
    if (/no such customer/i.test(message)) {
      return 'Your billing profile was reset. Click Subscribe to Pro again.'
    }
    return message
  }

  async function startCheckout() {
    setBusy('checkout')
    setError(null)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
      window.location.href = data.url
    } catch (err) {
      setError(friendlyBillingError(err instanceof Error ? err.message : 'Checkout failed'))
      setBusy(null)
    }
  }

  useEffect(() => {
    if (
      !shouldAutoCheckout ||
      autoCheckoutStarted.current ||
      !isOwner ||
      !stripeConfigured ||
      active
    ) {
      return
    }
    autoCheckoutStarted.current = true
    void startCheckout()
  }, [shouldAutoCheckout, isOwner, stripeConfigured, active])

  async function openPortal() {
    setBusy('portal')
    setError(null)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Portal failed')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portal failed')
      setBusy(null)
    }
  }

  return (
    <section className="dash-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--gray-50)]">
          <CreditCard size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-black">Billing & subscription</h2>
          <p className="mt-1 text-xs text-[var(--gray-500)]">
            AgencyDesk Pro — monthly subscription with invoicing and automatic tax via Stripe.
          </p>
        </div>
      </div>

      {shouldAutoCheckout && busy === 'checkout' && !active && (
        <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--gray-50)] px-3 py-2 text-xs text-black">
          Redirecting to secure Stripe checkout…
        </p>
      )}

      {billingNotice === 'success' && (
        <p className="mt-4 rounded-lg border border-black bg-[var(--gray-50)] px-3 py-2 text-xs text-black">
          Subscription updated successfully.
        </p>
      )}
      {billingNotice === 'canceled' && (
        <p className="mt-4 text-xs text-[var(--gray-500)]">Checkout canceled — no changes made.</p>
      )}

      <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--gray-500)]">Status</dt>
          <dd className="font-medium capitalize text-black">
            {status === 'none' ? 'Not subscribed' : status.replace('_', ' ')}
          </dd>
        </div>
        {billing?.subscription_plan && (
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--gray-500)]">Plan</dt>
            <dd className="font-medium text-black">{billing.subscription_plan}</dd>
          </div>
        )}
        {billing?.subscription_current_period_end && active && (
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--gray-500)]">Renews</dt>
            <dd className="text-black">
              {new Date(billing.subscription_current_period_end).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </dd>
          </div>
        )}
      </dl>

      {!stripeConfigured && (
        <p className="mt-4 text-xs text-[var(--gray-500)]">
          Stripe env vars are not configured on this deployment yet.
        </p>
      )}

      {error && <p className="mt-3 text-xs text-black">{error}</p>}

      {isOwner && stripeConfigured && (
        <div className="mt-4 flex flex-wrap gap-2">
          {!active ? (
            <button
              type="button"
              onClick={startCheckout}
              disabled={busy !== null}
              className="console-btn-primary inline-flex items-center gap-2"
            >
              {busy === 'checkout' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CreditCard size={14} />
              )}
              Subscribe to Pro
            </button>
          ) : (
            <button
              type="button"
              onClick={openPortal}
              disabled={busy !== null}
              className="console-btn-secondary inline-flex items-center gap-2"
            >
              {busy === 'portal' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ExternalLink size={14} />
              )}
              Manage billing & invoices
            </button>
          )}
        </div>
      )}

      {!isOwner && (
        <p className="mt-4 text-xs text-[var(--gray-500)]">
          Only workspace owners can manage billing.
        </p>
      )}

      <p className="mt-4 text-[11px] text-[var(--gray-400)]">
        Invoices, payment methods, and tax IDs are managed in Stripe Customer Portal. Stripe Tax
        calculates tax automatically at checkout when enabled in your Stripe Dashboard.
      </p>
    </section>
  )
}
