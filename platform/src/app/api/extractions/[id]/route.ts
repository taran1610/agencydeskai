import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Extraction } from '@/lib/types'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const db = supabaseAdmin()
  const { data: extraction, error } = await db
    .from('extractions')
    .update({
      status,
      edited_value: status === 'edited' ? editedValue!.trim() : null,
      reviewed_at: status === 'pending' ? null : new Date().toISOString(),
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
