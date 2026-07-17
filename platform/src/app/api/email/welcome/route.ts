import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email/send'
import { getAuthContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/** Idempotent welcome email for the signed-in user (email/password + OAuth). */
export async function POST() {
  const ctx = await getAuthContext()
  if (!ctx) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const fullName =
    (typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    (typeof user?.user_metadata?.name === 'string' && user.user_metadata.name) ||
    null

  try {
    const result = await sendWelcomeEmail({
      email: ctx.email,
      userId: ctx.userId,
      workspaceId: ctx.workspaceId,
      fullName,
    })
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('Welcome email API failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send' },
      { status: 500 },
    )
  }
}
