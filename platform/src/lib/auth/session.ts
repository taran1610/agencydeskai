import { NextResponse } from 'next/server'
import { canManageTeam, canWrite, type UserRole } from '@/lib/auth/permissions'
import { createClient } from '@/lib/supabase/server'

export interface AuthContext {
  userId: string
  email: string
  workspaceId: string
  role: UserRole
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const user = await getSignedInUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!membership) return null

  return {
    userId: user.id,
    email: user.email,
    workspaceId: membership.workspace_id,
    role: membership.role as UserRole,
  }
}

export async function getSignedInUser(): Promise<{ id: string; email: string } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null
  return { id: user.id, email: user.email }
}

export async function requireAuth(minRole: UserRole = 'viewer'): Promise<AuthContext | NextResponse> {
  const ctx = await getAuthContext()
  if (!ctx) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const ranks = { owner: 3, reviewer: 2, viewer: 1 }
  if (ranks[ctx.role] < ranks[minRole]) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return ctx
}

export function isAuthContext(value: AuthContext | NextResponse): value is AuthContext {
  return 'userId' in value
}

export function requireWrite(ctx: AuthContext): NextResponse | null {
  if (!canWrite(ctx.role)) {
    return NextResponse.json({ error: 'Reviewer or owner role required' }, { status: 403 })
  }
  return null
}

export function requireOwner(ctx: AuthContext): NextResponse | null {
  if (!canManageTeam(ctx.role)) {
    return NextResponse.json({ error: 'Owner role required' }, { status: 403 })
  }
  return null
}
