import { Link } from 'react-router-dom'
import { site } from '../config/site'

export const SiteFooter = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <span className="brand__name">{site.name}</span>
        <p className="footer__tag">{site.tagline}</p>
        <p className="footer__meta">
          &copy; {new Date().getFullYear()} {site.name} &middot; Private beta
        </p>
      </div>
      <nav className="footer__col" aria-label="Product">
        <span className="footer__col-label">Product</span>
        <a href="/#features">What we do</a>
        <a href="/#how-it-works">How it works</a>
        <a href="/#trust">Trust</a>
      </nav>
      <nav className="footer__col" aria-label="Company">
        <span className="footer__col-label">Company</span>
        <a href="/#beta">Pilot access</a>
        <a href={`mailto:${site.contactEmail}`}>Contact</a>
        <Link to="/privacy">Privacy</Link>
        <a href={site.appUrl}>Operations console</a>
      </nav>
      <div className="footer__ref" aria-hidden>
        REF. AD-026
      </div>
    </div>
  </footer>
)
