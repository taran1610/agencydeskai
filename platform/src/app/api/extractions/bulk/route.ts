import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth, requireWrite } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'

async function accountIdsInWorkspace(workspaceId: string, accountId?: string) {
  const db = supabaseAdmin()
  let query = db.from('accounts').select('id').eq('workspace_id', workspaceId)
  if (accountId) query = query.eq('id', accountId)
  const { data } = await query
  return (data ?? []).map((a) => a.id)
}

export async function POST(request: Request) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth
  const denied = requireWrite(auth)
  if (denied) return denied

  let body: {
    extractionIds?: string[]
    documentId?: string
    accountId?: string
    minConfidence?: number
    status?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { status = 'approved', minConfidence, documentId, accountId, extractionIds } = body
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'status must be approved or rejected' }, { status: 400 })
  }

  const allowedAccountIds = await accountIdsInWorkspace(
    auth.workspaceId,
    accountId || undefined,
  )
  if (accountId && allowedAccountIds.length === 0) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const db = supabaseAdmin()
  let query = db
    .from('extractions')
    .select('id, account_id, document_id, field_key, value, confidence')
    .eq('status', 'pending')

  if (extractionIds?.length) {
    query = query.in('id', extractionIds)
  } else if (documentId) {
    const { data: doc } = await db
      .from('documents')
      .select('account_id')
      .eq('id', documentId)
      .single()
    if (!doc || !allowedAccountIds.includes(doc.account_id)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    query = query.eq('document_id', documentId)
  } else if (accountId) {
    query = query.eq('account_id', accountId)
  } else {
    return NextResponse.json(
      { error: 'Provide extractionIds, documentId, or accountId' },
      { status: 400 },
    )
  }

  if (typeof minConfidence === 'number') {
    query = query.gte('confidence', minConfidence)
  }

  const { data: rows, error: fetchError } = await query
  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const filtered = (rows ?? []).filter((r) => allowedAccountIds.includes(r.account_id))
  if (!filtered.length) {
    return NextResponse.json({ updated: 0 })
  }

  const ids = filtered.map((r) => r.id)
  const { error: updateError } = await db
    .from('extractions')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.userId,
    })
    .in('id', ids)
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const first = filtered[0]
  await logAudit({
    accountId: first.account_id,
    documentId: first.document_id,
    userId: auth.userId,
    actor: 'human',
    action: `extractions.bulk_${status}`,
    detail: { count: ids.length, minConfidence, status },
  })

  return NextResponse.json({ updated: ids.length })
}
