import { Resend } from 'resend'

let client: Resend | null = null

/** Runtime lookup — avoid Next.js build-time env inlining. */
function env(name: string) {
  return process.env[name]?.trim() || ''
}

export function isEmailConfigured() {
  return Boolean(env('RESEND_API_KEY') && env('EMAIL_FROM'))
}

export function getResend() {
  const key = env('RESEND_API_KEY')
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  if (!client) client = new Resend(key)
  return client
}

export function getEmailFrom() {
  const from = env('EMAIL_FROM')
  if (!from) throw new Error('EMAIL_FROM is not configured')
  return from
}

export function getEmailReplyTo() {
  return env('EMAIL_REPLY_TO') || env('EMAIL_FROM') || undefined
}

export const APP_URL =
  env('NEXT_PUBLIC_APP_URL').replace(/\/$/, '') ||
  'https://agencydeskai-app.vercel.app'

export const MARKETING_URL =
  env('NEXT_PUBLIC_MARKETING_URL').replace(/\/$/, '') ||
  'https://agencydeskai.vercel.app'
