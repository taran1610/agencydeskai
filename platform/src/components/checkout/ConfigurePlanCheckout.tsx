'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowLeft,
  Beaker,
  CreditCard,
  Loader2,
  Sparkles,
  Star,
  UserCheck,
  Zap,
} from 'lucide-react'
import { MarketingSiteLink } from '@/components/MarketingSiteLink'
import {
  CHECKOUT_PLANS,
  parseCheckoutPlan,
  selectableCheckoutPlans,
  type CheckoutPlanId,
} from '@/lib/plans'
import { isSubscriptionActive } from '@/lib/stripe/status'
import type { WorkspaceBilling } from '@/lib/stripe/status'

const FEATURE_ICONS = [Zap, Star, Sparkles, UserCheck, Beaker] as const

const CONTACT_EMAIL = 'liber1821@gmail.com'

export function ConfigurePlanCheckout({
  billing,
  stripeConfigured,
  isOwner,
  userEmail,
  workspaceName,
}: {
  billing: WorkspaceBilling | null
  stripeConfigured: boolean
  isOwner: boolean
  userEmail: string
  workspaceName: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialPlan = parseCheckoutPlan(searchParams.get('plan'))
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlanId>(initialPlan)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'saved'>('card')
  const [businessPurchase, setBusinessPurchase] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canceled = searchParams.get('billing') === 'canceled'

  const plan = CHECKOUT_PLANS[selectedPlan]
  const active = isSubscriptionActive(billing?.subscription_status ?? 'none')
  const options = selectableCheckoutPlans()

  async function handleSubscribe() {
    if (!plan.stripeCheckout) {
      const subject = encodeURIComponent(plan.contactSubject ?? 'AgencyDesk plan')
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}`
      return
    }

    if (!isOwner) {
      setError('Only workspace owners can subscribe.')
      return
    }
    if (!stripeConfigured) {
      setError('Stripe is not configured on this deployment.')
      return
    }

    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setBusy(false)
    }
  }

  if (active) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__inner checkout-page__inner--center">
          <p className="checkout-page__active-note">You already have an active subscription.</p>
          <Link href="/billing" className="checkout-page__back-link">
            Manage billing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__inner">
        <header className="checkout-page__top">
          <button
            type="button"
            onClick={() => router.back()}
            className="checkout-page__back"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="checkout-page__title">Configure your plan</h1>
          <MarketingSiteLink className="checkout-page__site-link">Marketing site</MarketingSiteLink>
        </header>

        {canceled && (
          <p className="checkout-page__canceled" role="status">
            Checkout was canceled. You can try again when ready.
          </p>
        )}

        <div className="checkout-page__layout">
          <div className="checkout-page__main">
            <section className="checkout-section">
              <h2 className="checkout-section__label">Plan detail</h2>
              <div className="checkout-plans">
                {options.map((option) => {
                  const selected = option.id === selectedPlan
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedPlan(option.id)}
                      className={`checkout-plan-card${selected ? ' checkout-plan-card--selected' : ''}`}
                    >
                      <p className="checkout-plan-card__tagline">{option.tagline}</p>
                      <p className="checkout-plan-card__price">
                        {option.currency}
                        {option.price}
                        {option.period}
                      </p>
                    </button>
                  )
                })}
              </div>
              {!plan.stripeCheckout && (
                <p className="checkout-section__hint">
                  {plan.name} is sold via sales — we&apos;ll open email so you can request onboarding.
                </p>
              )}
            </section>

            {plan.stripeCheckout && (
              <>
                <section className="checkout-section">
                  <h2 className="checkout-section__label">Pay with</h2>
                  <button type="button" className="checkout-apple-pay" disabled>
                    Pay
                  </button>
                  <div className="checkout-divider">
                    <span>OR</span>
                  </div>
                  <div className="checkout-pay-tabs">
                    <button
                      type="button"
                      className={`checkout-pay-tab${paymentMethod === 'saved' ? ' checkout-pay-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('saved')}
                    >
                      <CreditCard size={16} />
                      Saved
                    </button>
                    <button
                      type="button"
                      className={`checkout-pay-tab${paymentMethod === 'card' ? ' checkout-pay-tab--active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={16} />
                      Card
                    </button>
                  </div>
                  <div className="checkout-saved-card">
                    <CreditCard size={18} />
                    <span>Secure card entry on Stripe Checkout</span>
                  </div>
                </section>

                <section className="checkout-section">
                  <h2 className="checkout-section__label">Billing address</h2>
                  <div className="checkout-address">
                    <div>
                      <p className="checkout-address__name">{workspaceName}</p>
                      <p className="checkout-address__email">{userEmail}</p>
                      <p className="checkout-address__note">
                        Address and tax ID collected securely on the next step.
                      </p>
                    </div>
                  </div>
                  <label className="checkout-checkbox">
                    <input
                      type="checkbox"
                      checked={businessPurchase}
                      onChange={(e) => setBusinessPurchase(e.target.checked)}
                    />
                    <span>I&apos;m purchasing as a business</span>
                  </label>
                </section>
              </>
            )}
          </div>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">{plan.label}</h2>
            <p className="checkout-summary__subtitle">Top features</p>
            <ul className="checkout-summary__features">
              {plan.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length]
                return (
                  <li key={feature}>
                    <Icon size={16} strokeWidth={2} />
                    <span>{feature}</span>
                  </li>
                )
              })}
            </ul>

            <dl className="checkout-summary__rows">
              <div className="checkout-summary__row">
                <dt>Monthly subscription</dt>
                <dd>
                  {plan.currency}
                  {plan.price.toFixed(2)}
                </dd>
              </div>
              {plan.stripeCheckout && (
                <div className="checkout-summary__row">
                  <dt>Tax</dt>
                  <dd>Calculated at checkout</dd>
                </div>
              )}
              <div className="checkout-summary__row checkout-summary__row--total">
                <dt>{plan.stripeCheckout ? 'Due today' : 'Starting at'}</dt>
                <dd>
                  {plan.currency}
                  {plan.price.toFixed(2)}
                  {!plan.stripeCheckout && '+'}
                </dd>
              </div>
            </dl>

            {error && <p className="checkout-summary__error">{error}</p>}

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={busy || (plan.stripeCheckout && !isOwner)}
              className="checkout-summary__cta"
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting…
                </>
              ) : plan.stripeCheckout ? (
                'Subscribe'
              ) : (
                'Contact sales'
              )}
            </button>

            {!isOwner && plan.stripeCheckout && (
              <p className="checkout-summary__fine">Only workspace owners can subscribe.</p>
            )}

            <p className="checkout-summary__legal">
              {plan.stripeCheckout
                ? 'Your subscription renews monthly until canceled. By subscribing you agree to our terms. Tax is calculated automatically via Stripe Tax when enabled.'
                : 'Our team will follow up with custom onboarding and pricing confirmation.'}
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
