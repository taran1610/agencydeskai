import { MARKETING_URL } from '@/config/urls'

/** Public marketing site URL (agencydeskai.vercel.app). */
export function getMarketingSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_MARKETING_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return MARKETING_URL
}

/** Navigate to the marketing site (client-only). */
export function goToMarketingSite() {
  if (typeof window === 'undefined') return
  window.location.assign(getMarketingSiteUrl())
}
