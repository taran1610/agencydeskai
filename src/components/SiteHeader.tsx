import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site } from '../config/site'
import { useScrolledPast } from '../hooks/useScrolledPast'
import { Brand } from './Brand'

export type SiteNavLink = {
  href: string
  label: string
  current?: boolean
}

function NavAnchor({
  href,
  className,
  children,
  onClick,
  current,
}: {
  href: string
  className?: string
  children: ReactNode
  onClick?: () => void
  current?: boolean
}) {
  const currentProps = current ? ({ 'aria-current': 'page' } as const) : {}

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} onClick={onClick} {...currentProps}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} onClick={onClick} {...currentProps}>
      {children}
    </a>
  )
}

export function SiteHeader({
  links,
  ctaHref,
}: {
  links: readonly SiteNavLink[]
  ctaHref: string
}) {
  const scrolled = useScrolledPast(8)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1040) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${open ? ' nav--open' : ''}`}>
      <div className="nav__inner">
        <Brand />
        <nav className="nav__links" aria-label="Page sections">
          {links.map((link) => (
            <NavAnchor key={link.href + link.label} href={link.href} current={link.current}>
              {link.label}
            </NavAnchor>
          ))}
        </nav>
        <div className="nav__actions">
          <a href={site.loginUrl} className="nav__signin">
            Sign in
          </a>
          <NavAnchor href={ctaHref} className="btn btn--primary nav__cta" onClick={close}>
            <span className="nav__cta-long">Request pilot access</span>
            <span className="nav__cta-short">Pilot access</span>
          </NavAnchor>
          <button
            ref={menuButtonRef}
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? <X size={20} strokeWidth={2.25} aria-hidden /> : <Menu size={20} strokeWidth={2.25} aria-hidden />}
          </button>
        </div>
      </div>
      <div id={menuId} className="nav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((link) => (
            <NavAnchor key={`m-${link.href}`} href={link.href} current={link.current} onClick={close}>
              {link.label}
            </NavAnchor>
          ))}
          <a href={site.loginUrl} onClick={close}>
            Sign in
          </a>
        </nav>
      </div>
    </header>
  )
}
