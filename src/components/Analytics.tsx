import { useEffect } from 'react'
import { site } from '../config/site'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export const Analytics = () => {
  useEffect(() => {
    if (!site.plausibleDomain) return

    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = site.plausibleDomain
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}

export const trackEvent = (name: string, props?: Record<string, string>) => {
  if (typeof window.plausible === 'function') {
    window.plausible(name, props ? { props } : undefined)
  }
}
