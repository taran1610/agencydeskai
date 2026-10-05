import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth, requireWrite } from '@/lib/auth/session'
import { analyzeAccount } from '@/lib/pipeline'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth
  const denied = requireWrite(auth)
  if (denied) return denied

  const { id } = await params
  const db = supabaseAdmin()
  const { data: account } = await db
    .from('accounts')
    .select('id')
    .eq('id', id)
    .eq('workspace_id', auth.workspaceId)
    .single()
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  try {
    const analysis = await analyzeAccount(id, auth.userId)
    return NextResponse.json({ analysis })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
