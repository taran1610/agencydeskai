const trimTrailingSlash = (url: string) => url.replace(/\/$/, '')

/** Public contact for footer, privacy, and form placeholders */
export const CONTACT_EMAIL = 'liber1821@gmail.com'

const siteUrl = trimTrailingSlash(
  import.meta.env.VITE_SITE_URL || 'https://agencydesk.ai',
)

const xHandleRaw = (import.meta.env.VITE_X_HANDLE || '').replace(/^@/, '')

export const site = {
  name: 'AgencyDesk AI',
  tagline: 'AI back office for insurance agencies',
  description:
    'Process inbound PDFs, summarize client files, stage CRM updates, and flag missing forms before your team touches the packet.',
  url: siteUrl,
  // Use og-image.png for X/Twitter (export from public/og-image.svg). SVG is the source file.
  ogImage: `${siteUrl}/og-image.png`,
  ogImageSvg: `${siteUrl}/og-image.svg`,
  xHandle: xHandleRaw,
  xUrl: xHandleRaw ? `https://x.com/${xHandleRaw}` : '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || CONTACT_EMAIL,
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || '',
} as const

export const xShareUrl = (text: string) => {
  const params = new URLSearchParams({
    text,
    url: site.url,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}
