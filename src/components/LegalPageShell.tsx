import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SeoHead } from './SeoHead'
import { SiteFooter } from './SiteFooter'
import { site } from '../config/site'

export function LegalPageShell({
  title,
  description,
  path,
  heading,
  updated,
  children,
}: {
  title: string
  description: string
  path: string
  heading: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="page page--legal">
      <SeoHead title={title} description={description} path={path} />
      <header className="nav nav--scrolled nav--legal">
        <div className="nav__inner">
          <Link className="brand" to="/" aria-label={`${site.name} home`}>
            <span className="brand__name">{site.name}</span>
          </Link>
          <div className="nav__actions">
            <Link to="/privacy" className="nav__signin">
              Privacy
            </Link>
            <Link to="/terms" className="nav__cta">
              Terms
            </Link>
          </div>
        </div>
      </header>

      <main className="legal">
        <div className="container legal__inner">
          <h1>{heading}</h1>
          <p className="legal__updated">Last updated: {updated}</p>
          <p className="legal__intro">
            These terms apply to {site.name} ({site.url}) and the operations console at{' '}
            <a href={site.appUrl}>{site.appUrl}</a>. Questions:{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
          {children}
          <nav className="legal__links" aria-label="Legal documents">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </nav>
          <p className="legal__back">
            <Link to="/">← Back to {site.name}</Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
