import { Link } from 'react-router-dom'
import { site } from '../config/site'

export const SiteFooter = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <span className="brand__name">{site.name}</span>
        <span className="footer__tag">{site.tagline}</span>
      </div>
      <nav className="footer__links" aria-label="Footer">
        <Link to="/privacy">Privacy</Link>
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        {site.xUrl ? (
          <a href={site.xUrl} target="_blank" rel="noopener noreferrer">
            @{site.xHandle} on X
          </a>
        ) : null}
      </nav>
      <div className="footer__meta">
        © {new Date().getFullYear()} {site.name} · Private beta
      </div>
    </div>
  </footer>
)
