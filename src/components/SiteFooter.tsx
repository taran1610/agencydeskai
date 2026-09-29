import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { Brand } from './Brand'

export const SiteFooter = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <Brand />
        <p className="footer__tag">{site.tagline}</p>
        <p className="footer__meta">
          &copy; {new Date().getFullYear()} {site.name} &middot; Private beta
        </p>
      </div>
      <nav className="footer__col" aria-label="Product">
        <span className="footer__col-label">Product</span>
        <a href="/#product">Product</a>
        <a href="/#how-it-works">How it works</a>
        <a href="/#for-brokers">Who it’s for</a>
        <a href="/#pricing">Pricing</a>
        <a href="/#trust">Trust</a>
      </nav>
      <nav className="footer__col" aria-label="Company">
        <span className="footer__col-label">Company</span>
        <a href="/#pilot">Pilot access</a>
        <a href={`mailto:${site.contactEmail}`}>Contact</a>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <a href={site.loginUrl}>Sign in</a>
        <a href={site.appUrl}>Operations console</a>
      </nav>
    </div>
  </footer>
)
