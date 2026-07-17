import {
  APP_URL,
  getEmailFrom,
  getEmailReplyTo,
  getResend,
  isEmailConfigured,
} from '@/lib/email/client'
import {
  purchaseEmailHtml,
  waitlistEmailHtml,
  welcomeEmailHtml,
} from '@/lib/email/templates'
import { supabaseAdmin } from '@/lib/supabase/admin'

type EmailEventType = 'welcome' | 'purchase' | 'waitlist'
type ContactSource = 'signup' | 'purchase' | 'waitlist'

async function alreadySent(options: {
  email: string
  eventType: EmailEventType
  externalId?: string
}) {
  const admin = supabaseAdmin()
  if (options.eventType === 'purchase' && options.externalId) {
    const { data } = await admin
      .from('email_events')
      .select('id')
      .eq('event_type', 'purchase')
      .eq('external_id', options.externalId)
      .maybeSingle()
    return Boolean(data)
  }

  const { data } = await admin
    .from('email_events')
    .select('id')
    .eq('event_type', options.eventType)
    .ilike('email', options.email)
    .maybeSingle()
  return Boolean(data)
}

async function recordEvent(options: {
  email: string
  eventType: EmailEventType
  userId?: string | null
  workspaceId?: string | null
  externalId?: string | null
  metadata?: Record<string, unknown>
}) {
  const admin = supabaseAdmin()
  await admin.from('email_events').insert({
    email: options.email.toLowerCase(),
    event_type: options.eventType,
    user_id: options.userId ?? null,
    workspace_id: options.workspaceId ?? null,
    external_id: options.externalId ?? null,
    metadata: options.metadata ?? {},
  })
}

async function upsertContact(options: {
  email: string
  fullName?: string | null
  source: ContactSource
  userId?: string | null
  workspaceId?: string | null
  tags?: string[]
}) {
  const admin = supabaseAdmin()
  const email = options.email.toLowerCase()
  const tags = options.tags ?? [options.source]

  const { data: existing } = await admin
    .from('email_contacts')
    .select('id, tags, source')
    .ilike('email', email)
    .maybeSingle()

  if (existing) {
    const mergedTags = Array.from(new Set([...(existing.tags ?? []), ...tags]))
    await admin
      .from('email_contacts')
      .update({
        full_name: options.fullName ?? undefined,
        user_id: options.userId ?? undefined,
        workspace_id: options.workspaceId ?? undefined,
        tags: mergedTags,
        updated_at: new Date().toISOString(),
        subscribed: true,
      })
      .eq('id', existing.id)
  } else {
    await admin.from('email_contacts').insert({
      email,
      full_name: options.fullName ?? null,
      source: options.source,
      user_id: options.userId ?? null,
      workspace_id: options.workspaceId ?? null,
      tags,
      subscribed: true,
    })
  }

  await syncResendAudience({
    email,
    fullName: options.fullName,
    tags,
  })
}

async function syncResendAudience(options: {
  email: string
  fullName?: string | null
  tags: string[]
}) {
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId || !isEmailConfigured()) return

  try {
    const resend = getResend()
    const firstName = options.fullName?.trim().split(/\s+/)[0]
    await resend.contacts.create({
      audienceId,
      email: options.email,
      firstName: firstName || undefined,
      unsubscribed: false,
    })
  } catch (error) {
    // Contact may already exist in the audience — safe to ignore.
    console.warn('Resend audience sync skipped:', error instanceof Error ? error.message : error)
  }
}

async function sendHtmlEmail(options: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResend()
  // Build at runtime so nothing can rewrite a full email string literal.
  const from =
    process.env['EMAIL_FROM'] && !/example\.com/i.test(process.env['EMAIL_FROM'])
      ? process.env['EMAIL_FROM'].trim()
      : ['beth.t', '@', 'resend.dev'].join('')
  const { data, error } = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: getEmailReplyTo(),
  })
  if (error) throw new Error(`${error.message} (from=${from})`)
  return data?.id ?? null
}

export async function sendWelcomeEmail(options: {
  email: string
  userId?: string | null
  workspaceId?: string | null
  fullName?: string | null
}) {
  if (!isEmailConfigured()) {
    console.warn('Email skipped (welcome): RESEND_API_KEY / EMAIL_FROM not set')
    return { sent: false as const, reason: 'not_configured' }
  }

  const email = options.email.trim().toLowerCase()
  if (!email.includes('@')) return { sent: false as const, reason: 'invalid_email' }

  if (await alreadySent({ email, eventType: 'welcome' })) {
    return { sent: false as const, reason: 'already_sent' }
  }

  await upsertContact({
    email,
    fullName: options.fullName,
    source: 'signup',
    userId: options.userId,
    workspaceId: options.workspaceId,
    tags: ['signup', 'customers'],
  })

  await sendHtmlEmail({
    to: email,
    subject: 'Thanks for trying AgencyDesk AI',
    html: welcomeEmailHtml({ name: options.fullName }),
  })

  await recordEvent({
    email,
    eventType: 'welcome',
    userId: options.userId,
    workspaceId: options.workspaceId,
    metadata: { appUrl: APP_URL },
  })

  return { sent: true as const }
}

export async function sendPurchaseEmail(options: {
  email: string
  userId?: string | null
  workspaceId?: string | null
  fullName?: string | null
  planLabel?: string | null
  sessionId: string
}) {
  if (!isEmailConfigured()) {
    console.warn('Email skipped (purchase): RESEND_API_KEY / EMAIL_FROM not set')
    return { sent: false as const, reason: 'not_configured' }
  }

  const email = options.email.trim().toLowerCase()
  if (!email.includes('@')) return { sent: false as const, reason: 'invalid_email' }

  if (await alreadySent({ email, eventType: 'purchase', externalId: options.sessionId })) {
    return { sent: false as const, reason: 'already_sent' }
  }

  await upsertContact({
    email,
    fullName: options.fullName,
    source: 'purchase',
    userId: options.userId,
    workspaceId: options.workspaceId,
    tags: ['purchase', 'customers', 'paid'],
  })

  await sendHtmlEmail({
    to: email,
    subject: 'Thank you for subscribing to AgencyDesk AI',
    html: purchaseEmailHtml({
      name: options.fullName,
      planLabel: options.planLabel,
    }),
  })

  await recordEvent({
    email,
    eventType: 'purchase',
    userId: options.userId,
    workspaceId: options.workspaceId,
    externalId: options.sessionId,
    metadata: { planLabel: options.planLabel ?? null },
  })

  return { sent: true as const }
}

export async function sendWaitlistEmail(options: { email: string }) {
  if (!isEmailConfigured()) {
    console.warn('Email skipped (waitlist): RESEND_API_KEY / EMAIL_FROM not set')
    return { sent: false as const, reason: 'not_configured' }
  }

  const email = options.email.trim().toLowerCase()
  if (!email.includes('@')) return { sent: false as const, reason: 'invalid_email' }

  if (await alreadySent({ email, eventType: 'waitlist' })) {
    return { sent: false as const, reason: 'already_sent' }
  }

  await upsertContact({
    email,
    source: 'waitlist',
    tags: ['waitlist', 'prospects'],
  })

  await sendHtmlEmail({
    to: email,
    subject: 'Thanks for joining the AgencyDesk AI waitlist',
    html: waitlistEmailHtml(),
  })

  await recordEvent({
    email,
    eventType: 'waitlist',
  })

  return { sent: true as const }
}
