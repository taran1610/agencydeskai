import { NextResponse } from 'next/server'
import { APP_URL } from '@/config/urls'
import { isAuthContext, requireAuth, requireOwner } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { listPendingInvitations } from '@/lib/data'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth

  const invitations = await listPendingInvitations(auth.workspaceId)
  return NextResponse.json({ invitations })
}

export async function POST(request: Request) {
  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth
  const denied = requireOwner(auth)
  if (denied) return denied

  let body: { email?: string; role?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const role = body.role
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!role || !['reviewer', 'viewer'].includes(role)) {
    return NextResponse.json({ error: 'role must be reviewer or viewer' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data: invitation, error } = await db
    .from('invitations')
    .insert({
      workspace_id: auth.workspaceId,
      email,
      role,
      invited_by: auth.userId,
    })
    .select('*')
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actor: 'human',
    userId: auth.userId,
    action: 'invitation.created',
    detail: { email, role },
  })

  const origin = request.headers.get('origin') ?? APP_URL
  const inviteUrl = `${origin}/invite/${invitation.token}`

  return NextResponse.json({ invitation, inviteUrl }, { status: 201 })
}
