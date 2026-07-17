import { NextResponse } from 'next/server'
import { getEmailFrom, isEmailConfigured } from '@/lib/email/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Temporary diagnostics — does not expose secrets. */
export async function GET() {
  let from = ''
  try {
    from = getEmailFrom()
  } catch {
    from = ''
  }

  const domain = from.includes('@') ? from.split('@').pop()?.replace(/>.*/, '') : null

  return NextResponse.json({
    configured: isEmailConfigured(),
    fromDomain: domain,
    fromLooksLikeResend: /resend\.dev/i.test(from),
    fromLooksLikeExample: /example\.com/i.test(from),
    hasReplyTo: Boolean(process.env['EMAIL_REPLY_TO']),
  })
}
