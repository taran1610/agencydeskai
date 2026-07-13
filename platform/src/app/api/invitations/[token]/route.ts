import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const db = supabaseAdmin()
  const { data: invitation } = await db
    .from('invitations')
    .select('email, role, expires_at, accepted_at, workspace_id')
    .eq('token', token)
    .single()

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }
  if (invitation.accepted_at) {
    return NextResponse.json({ error: 'Invitation already accepted' }, { status: 410 })
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invitation expired' }, { status: 410 })
  }

  const { data: workspace } = await db
    .from('workspaces')
    .select('name')
    .eq('id', invitation.workspace_id)
    .single()

  const workspaceName = workspace?.name ?? 'AgencyDesk workspace'

  return NextResponse.json({
    email: invitation.email,
    role: invitation.role,
    workspaceName,
    expiresAt: invitation.expires_at,
  })
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const auth = await requireAuth('viewer')
  if (!isAuthContext(auth)) return auth

  const { token } = await params
  const db = supabaseAdmin()

  const { data: invitation } = await db
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }
  if (invitation.accepted_at) {
    return NextResponse.json({ error: 'Invitation already accepted' }, { status: 410 })
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Invitation expired' }, { status: 410 })
  }
  if (auth.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return NextResponse.json(
      { error: `Sign in as ${invitation.email} to accept this invitation` },
      { status: 403 },
    )
  }

  const { data: existing } = await db
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', invitation.workspace_id)
    .eq('user_id', auth.userId)
    .single()

  if (!existing) {
    const { error: memberError } = await db.from('workspace_members').insert({
      workspace_id: invitation.workspace_id,
      user_id: auth.userId,
      role: invitation.role,
    })
    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }
  }

  await db
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invitation.id)

  await logAudit({
    actor: 'human',
    userId: auth.userId,
    action: 'invitation.accepted',
    detail: { role: invitation.role, workspaceId: invitation.workspace_id },
  })

  return NextResponse.json({ ok: true, workspaceId: invitation.workspace_id })
}
