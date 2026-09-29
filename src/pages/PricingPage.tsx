import { PricingIntro, PricingTiers } from '../components/PricingTiers'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { site } from '../config/site'

const nav = [
  { href: '/#product', label: 'Product' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#for-brokers', label: 'Who it’s for' },
  { href: '/pricing', label: 'Pricing', current: true },
  { href: '/#trust', label: 'Trust' },
] as const

export const PricingPage = () => {
  return (
    <div className="page page--pricing">
      <SeoHead
        title={`Pricing — ${site.name}`}
        description="AgencyDesk AI plans for independent insurance agencies — predictable monthly pricing for document intake, AI extraction, and CRM-ready exports."
        path="/pricing"
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader links={nav} ctaHref="/#pilot" />

      <main id="main-content" className="pricing-page" tabIndex={-1}>
        <div className="container">
          <PricingIntro />
          <PricingTiers />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
