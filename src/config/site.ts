const trimTrailingSlash = (url: string) => url.replace(/\/$/, '')

/** Public contact for footer, privacy, and form placeholders */
export const CONTACT_EMAIL = 'liber1821@gmail.com'

const siteUrl = trimTrailingSlash(
  import.meta.env.VITE_SITE_URL || 'https://agencydesk.ai',
)

const xHandleRaw = (import.meta.env.VITE_X_HANDLE || '').replace(/^@/, '')

const appUrl = trimTrailingSlash(
  import.meta.env.VITE_APP_URL || 'https://agencydeskai-app.vercel.app',
)

export const site = {
  name: 'AgencyDesk AI',
  tagline: 'Cited AMS updates for insurance agencies',
  description:
    'AgencyDesk reads ACORD applications, multi-year loss runs, and declaration pages. Every extracted field cites its source page, and CRM updates wait for a person to approve them.',
  url: siteUrl,
  // Use og-image.png for X/Twitter (export from public/og-image.svg). SVG is the source file.
  ogImage: `${siteUrl}/og-image.png`,
  ogImageSvg: `${siteUrl}/og-image.svg`,
  xHandle: xHandleRaw,
  xUrl: xHandleRaw ? `https://x.com/${xHandleRaw}` : '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || CONTACT_EMAIL,
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || '',
  /** Operations console (Next.js app in platform/) */
  appUrl,
  /** Sign-in page on the operations console */
  loginUrl: `${appUrl}/login`,
} as const

export const xShareUrl = (text: string) => {
  const params = new URLSearchParams({
    text,
    url: site.url,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}
