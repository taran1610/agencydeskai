import { ArrowUpRight } from 'lucide-react'
import { site } from '../config/site'
import { pricingIntro, pricingTiers } from '../data/pricing'

function tierCtaHref(key: string) {
  switch (key) {
    case 'billing':
      return `${site.appUrl}/checkout?plan=solo`
    case 'contact-agency':
      return `${site.appUrl}/checkout?plan=agency`
    case 'contact-multi':
      return `${site.appUrl}/checkout?plan=multi-office`
    default:
      return site.loginUrl
  }
}

function isExternalHref(href: string) {
  return href.startsWith('mailto:') || href.startsWith('http')
}

export const PricingTiers = () => (
  <div className="pricing-page__tiers">
    {pricingTiers.map((tier, index) => {
      const href = tierCtaHref(tier.cta.href)
      const external = isExternalHref(href)

      return (
        <article
          key={tier.id}
          className={`pricing-tier${index > 0 ? ' pricing-tier--bordered' : ''}`}
        >
          <p className="pricing-tier__name">{tier.name}</p>
          <div className="pricing-tier__price-row">
            <span className="pricing-tier__amount">
              <span className="pricing-tier__currency">{tier.currency}</span>
              {tier.price.toLocaleString()}
            </span>
            <span className="pricing-tier__meta">
              {tier.period} · {tier.seatNote}
            </span>
          </div>
          <ul className="pricing-tier__features">
            {tier.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <a
            href={href}
            className="pricing-tier__cta"
            {...(external ? { rel: 'noopener noreferrer' } : {})}
          >
            {tier.cta.label}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </a>
        </article>
      )
    })}
    <p className="pricing-page__footnote">{pricingIntro.footnote}</p>
  </div>
)

export const PricingIntro = ({ headingLevel = 'h1' }: { headingLevel?: 'h1' | 'h2' }) => {
  const Heading = headingLevel
  return (
    <div className="pricing-page__intro">
      <Heading className="pricing-page__title">{pricingIntro.title}</Heading>
      <p className="pricing-page__lede">{pricingIntro.description}</p>
    </div>
  )
}
