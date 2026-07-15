import { Link } from 'react-router-dom'
import { PricingIntro, PricingTiers } from '../components/PricingTiers'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { site } from '../config/site'
import { useScrolledPast } from '../hooks/useScrolledPast'

export const PricingPage = () => {
  const navScrolled = useScrolledPast(24)

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

      <header className={`nav${navScrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link className="brand" to="/" aria-label={`${site.name} home`}>
            <span className="brand__name">{site.name}</span>
          </Link>
          <nav className="nav__links" aria-label="Page sections">
            <Link to="/#features">What we do</Link>
            <Link to="/#how-it-works">How it works</Link>
            <Link to="/#for-brokers">Who it&rsquo;s for</Link>
            <Link to="/pricing" aria-current="page">
              Pricing
            </Link>
            <Link to="/#trust">Trust</Link>
          </nav>
          <div className="nav__actions">
            <a href={site.loginUrl} className="nav__signin">
              Sign in
            </a>
            <a href={site.loginUrl} className="nav__cta">
              Launch console
            </a>
          </div>
        </div>
      </header>

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
