import { useEffect } from 'react'
import { site } from '../config/site'

type Props = {
  title?: string
  description?: string
  path?: string
}

export const SeoHead = ({
  title = `${site.name} — ${site.tagline}`,
  description = site.description,
  path = '/',
}: Props) => {
  useEffect(() => {
    document.title = title

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }

    const pageUrl = `${site.url}${path}`

    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', pageUrl)
    setMeta('meta[property="og:image"]', site.ogImage)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:url"]', pageUrl)
    setMeta('meta[name="twitter:image"]', site.ogImage)

    const jsonLd = document.querySelector('script[type="application/ld+json"]')
    if (jsonLd?.textContent) {
      try {
        const data = JSON.parse(jsonLd.textContent) as { url?: string }
        data.url = pageUrl
        jsonLd.textContent = JSON.stringify(data)
      } catch {
        // Leave the build-time JSON-LD in place if it is not valid JSON.
      }
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${site.url}${path}`
  }, [title, description, path])

  return null
}
