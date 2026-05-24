import { Link } from 'react-router-dom'
import { SeoHead } from '../components/SeoHead'
import { SiteFooter } from '../components/SiteFooter'
import { site } from '../config/site'

export const PrivacyPage = () => (
  <div className="page page--legal">
    <SeoHead
      title={`Privacy — ${site.name}`}
      description={`How ${site.name} handles waitlist email addresses and pilot communications.`}
      path="/privacy"
    />
    <header className="nav nav--scrolled nav--legal">
      <div className="nav__inner">
        <Link className="brand" to="/" aria-label={`${site.name} home`}>
          <span className="brand__name">{site.name}</span>
        </Link>
        <Link to="/#beta" className="nav__cta">
          Join beta
        </Link>
      </div>
    </header>

    <main className="legal">
      <div className="container legal__inner">
        <h1>Privacy policy</h1>
        <p className="legal__updated">Last updated: May 2026</p>

        <section>
          <h2>What we collect</h2>
          <p>
            When you join the private beta waitlist, we collect your work email
            address and, if you provide it, your role at your agency. We may also
            record which form you used (hero or final signup) and the time you
            submitted.
          </p>
        </section>

        <section>
          <h2>How we use it</h2>
          <p>
            We use your email only to contact you about the AgencyDesk AI pilot,
            onboarding, and product updates related to the beta. We do not sell
            your information.
          </p>
        </section>

        <section>
          <h2>Where it is stored</h2>
          <p>
            Waitlist data is stored in our database provider (Supabase) when
            configured, and may also be captured by our hosting form handler
            (Netlify Forms) or temporarily in your browser (localStorage) as a
            backup when offline.
          </p>
        </section>

        <section>
          <h2>Retention &amp; deletion</h2>
          <p>
            We keep waitlist entries until the pilot ends or you ask us to delete
            your data. To request deletion, email{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2>Analytics</h2>
          <p>
            If enabled, we use privacy-friendly analytics (Plausible) to understand
            traffic to this marketing site. No advertising trackers are used on
            this page.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy:{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </p>
        </section>

        <p className="legal__back">
          <Link to="/">← Back to {site.name}</Link>
        </p>
      </div>
    </main>

    <SiteFooter />
  </div>
)
