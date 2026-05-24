import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { site } from '../config/site'
import { isSupabaseConfigured } from '../lib/supabase'
import { saveWaitlistSignup } from '../lib/waitlist'
import { trackEvent } from './Analytics'

const STORAGE_KEY = 'agencydesk-waitlist'

export type WaitlistEntry = {
  email: string
  role?: string
  source: 'hero' | 'final'
  createdAt: string
}

const sessionSubmittedKey = (variant: 'hero' | 'final') =>
  `agencydesk-waitlist-submitted-${variant}`

const readSessionSubmitted = (variant: 'hero' | 'final') => {
  try {
    return sessionStorage.getItem(sessionSubmittedKey(variant)) === '1'
  } catch {
    return false
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES = [
  'Agency owner',
  'Account manager',
  'Producer',
  'Operations leader',
] as const

const persist = (entry: WaitlistEntry) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: WaitlistEntry[] = raw ? JSON.parse(raw) : []
    list.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // localStorage may be unavailable (e.g. private mode); fail quietly.
  }
}

// Netlify-compatible POST body encoder.
const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]),
    )
    .join('&')

type Props = {
  variant: 'hero' | 'final'
  withRole?: boolean
  buttonLabel: string
  placeholder?: string
}

export const WaitlistForm = ({
  variant,
  withRole = false,
  buttonLabel,
  placeholder = 'Enter your work email',
}: Props) => {
  const id = useId()
  const successRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>(ROLES[0])
  const [submitted, setSubmitted] = useState(() => readSessionSubmitted(variant))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!submitted) return
    successRef.current?.focus()
  }, [submitted])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError('Please enter a valid work email.')
      return
    }

    setSubmitting(true)

    const entry: WaitlistEntry = {
      email: trimmed,
      role: withRole ? role : undefined,
      source: variant,
      createdAt: new Date().toISOString(),
    }
    persist(entry)

    const remote = await saveWaitlistSignup({
      email: entry.email,
      role: entry.role,
      source: entry.source,
    })

    if (!remote.ok && isSupabaseConfigured) {
      setSubmitting(false)
      setError(
        `We could not save your signup right now. Try again or email ${site.contactEmail}.`,
      )
      return
    }

    trackEvent('Waitlist signup', { source: variant })

    try {
      sessionStorage.setItem(sessionSubmittedKey(variant), '1')
    } catch {
      // sessionStorage unavailable
    }

    // Best-effort POST to Netlify forms. If we're not on Netlify, this
    // simply 404s in dev and we still treat the submission as captured
    // (localStorage already has it).
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'waitlist',
          email: trimmed,
          role: withRole ? role : '',
          source: variant,
        }),
      })
    } catch {
      // ignore network failures — we already stored locally
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={`waitlist-success waitlist-success--${variant}`}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 size={22} strokeWidth={2} className="waitlist-success__icon" />
        <div>
          <div className="waitlist-success__title">You&rsquo;re on the list.</div>
          <div className="waitlist-success__body">
            You&rsquo;re on the private beta list. We&rsquo;ll reach out when pilots
            open.
          </div>
        </div>
      </div>
    )
  }

  const inputId = `${id}-email`
  const roleId = `${id}-role`

  return (
    <form
      className={`waitlist-form waitlist-form--${variant}${
        withRole ? ' waitlist-form--with-role' : ''
      }`}
      onSubmit={handleSubmit}
      name="waitlist"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      noValidate
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <input type="hidden" name="source" value={variant} />
      {/* honeypot for bots */}
      <p className="waitlist-form__honeypot">
        <label>
          Don&rsquo;t fill this out:{' '}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <label htmlFor={inputId} className="waitlist-form__label-sr">
        Work email
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (error) setError(null)
        }}
        className="waitlist-form__email"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />

      {withRole && (
        <>
          <label htmlFor={roleId} className="waitlist-form__label-sr">
            Role
          </label>
          <select
            id={roleId}
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="waitlist-form__role"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </>
      )}

      <button
        type="submit"
        className="waitlist-form__button"
        disabled={submitting}
      >
        <span>{submitting ? 'Sending…' : buttonLabel}</span>
        <ArrowRight size={18} strokeWidth={2} aria-hidden />
      </button>

      {error && (
        <div id={`${id}-err`} className="waitlist-form__error" role="alert">
          {error}
        </div>
      )}
    </form>
  )
}
