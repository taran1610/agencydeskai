import { NextResponse } from 'next/server'
import { sendWaitlistEmail } from '@/lib/email/send'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin')
  const allowed = [
    process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, ''),
    'https://agencydeskai.vercel.app',
    'https://agencydesk.ai',
    'https://www.agencydesk.ai',
    'http://localhost:5173',
    'http://localhost:4173',
  ].filter(Boolean) as string[]

  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*'

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function POST(request: Request) {
  const headers = corsHeaders(request)

  try {
    const body = (await request.json()) as { email?: unknown }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400, headers })
    }

    const result = await sendWaitlistEmail({ email })
    return NextResponse.json({ ok: true, ...result }, { headers })
  } catch (error) {
    console.error('Waitlist email API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500, headers },
    )
  }
}
