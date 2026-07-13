import { NextResponse } from 'next/server'
import { getAuthContext, isAuthContext, requireAuth } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Account } from '@/lib/types'

export async function POST(request: Request) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth

  let name: unknown
  try {
    ;({ name } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json(
      { error: 'Account name must be at least 2 characters.' },
      { status: 400 },
    )
  }

  const { data: account, error } = await supabaseAdmin()
    .from('accounts')
    .insert({ name: name.trim(), workspace_id: auth.workspaceId })
    .select('*')
    .single<Account>()
  if (error || !account) {
    return NextResponse.json(
      { error: error?.message ?? 'Could not create account' },
      { status: 500 },
    )
  }

  await logAudit({
    accountId: account.id,
    actor: 'human',
    userId: auth.userId,
    action: 'account.created',
    detail: { name: account.name },
  })

  return NextResponse.json({ account }, { status: 201 })
}

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ workspaceId: auth.workspaceId, role: auth.role })
}
