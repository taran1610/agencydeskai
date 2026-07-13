import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth, requireWrite } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Extraction } from '@/lib/types'

async function extractionInWorkspace(extractionId: string, workspaceId: string) {
  const db = supabaseAdmin()
  const { data: extraction } = await db
    .from('extractions')
    .select('id, account_id')
    .eq('id', extractionId)
    .single()
  if (!extraction) return null
  const { data: account } = await db
    .from('accounts')
    .select('workspace_id')
    .eq('id', extraction.account_id)
    .eq('workspace_id', workspaceId)
    .single()
  return account ? extraction : null
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth
  const denied = requireWrite(auth)
  if (denied) return denied

  const { id } = await params
  let body: { status?: string; editedValue?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { status, editedValue } = body
  if (!status || !['approved', 'edited', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json(
      { error: 'status must be approved, edited, rejected, or pending' },
      { status: 400 },
    )
  }
  if (status === 'edited' && (typeof editedValue !== 'string' || !editedValue.trim())) {
    return NextResponse.json(
      { error: 'editedValue is required when status is edited' },
      { status: 400 },
    )
  }

  if (!(await extractionInWorkspace(id, auth.workspaceId))) {
    return NextResponse.json({ error: 'Extraction not found' }, { status: 404 })
  }

  const db = supabaseAdmin()
  const { data: extraction, error } = await db
    .from('extractions')
    .update({
      status,
      edited_value: status === 'edited' ? editedValue!.trim() : null,
      reviewed_at: status === 'pending' ? null : new Date().toISOString(),
      reviewed_by: status === 'pending' ? null : auth.userId,
    })
    .eq('id', id)
    .select('*')
    .single<Extraction>()
  if (error || !extraction) {
    return NextResponse.json(
      { error: error?.message ?? 'Extraction not found' },
      { status: 404 },
    )
  }

  await logAudit({
    accountId: extraction.account_id,
    documentId: extraction.document_id,
    userId: auth.userId,
    actor: 'human',
    action: `extraction.${status}`,
    detail: {
      field: extraction.field_key,
      aiValue: extraction.value,
      ...(status === 'edited' ? { editedValue: extraction.edited_value } : {}),
    },
  })

  return NextResponse.json({ extraction })
}
