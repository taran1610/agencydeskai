import { Resend } from 'resend'

let client: Resend | null = null

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  if (!client) client = new Resend(key)
  return client
}

export function getEmailFrom() {
  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM is not configured')
  return from
}

export function getEmailReplyTo() {
  return process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || undefined
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
  'https://agencydeskai-app.vercel.app'

export const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, '') ??
  'https://agencydeskai.vercel.app'
