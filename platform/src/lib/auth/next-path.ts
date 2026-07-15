/** Allow only same-origin relative redirects after login. */
export function safeNextPath(raw: string | null | undefined, fallback = '/') {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}
