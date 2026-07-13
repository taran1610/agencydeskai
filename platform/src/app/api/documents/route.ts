import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth, requireWrite } from '@/lib/auth/session'
import { logAudit } from '@/lib/audit'
import { DOCUMENTS_BUCKET, supabaseAdmin } from '@/lib/supabase/admin'
import type { DocumentRow } from '@/lib/types'

const ACCEPTED_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
])
const MAX_FILE_BYTES = 30 * 1024 * 1024

export async function POST(request: Request) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth
  const denied = requireWrite(auth)
  if (denied) return denied

  const form = await request.formData()
  const accountId = form.get('accountId')
  const files = form.getAll('files').filter((entry): entry is File => entry instanceof File)

  if (typeof accountId !== 'string' || !accountId) {
    return NextResponse.json({ error: 'accountId is required' }, { status: 400 })
  }
  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data: account } = await db
    .from('accounts')
    .select('id, workspace_id')
    .eq('id', accountId)
    .eq('workspace_id', auth.workspaceId)
    .single()
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const uploaded: DocumentRow[] = []
  const rejected: { filename: string; reason: string }[] = []

  for (const file of files) {
    if (!ACCEPTED_TYPES.has(file.type)) {
      rejected.push({ filename: file.name, reason: `Unsupported type: ${file.type || 'unknown'}` })
      continue
    }
    if (file.size > MAX_FILE_BYTES) {
      rejected.push({ filename: file.name, reason: 'File exceeds 30 MB limit' })
      continue
    }

    const storagePath = `${accountId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]+/g, '_')}`
    const { error: uploadError } = await db.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, file, { contentType: file.type })
    if (uploadError) {
      rejected.push({ filename: file.name, reason: uploadError.message })
      continue
    }

    const { data: doc, error: insertError } = await db
      .from('documents')
      .insert({
        account_id: accountId,
        filename: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select('*')
      .single<DocumentRow>()
    if (insertError || !doc) {
      rejected.push({ filename: file.name, reason: insertError?.message ?? 'DB insert failed' })
      continue
    }

    uploaded.push(doc)
    await logAudit({
      accountId,
      documentId: doc.id,
      actor: 'human',
      userId: auth.userId,
      action: 'document.uploaded',
      detail: { filename: file.name, sizeBytes: file.size },
    })
  }

  return NextResponse.json({ uploaded, rejected }, { status: uploaded.length > 0 ? 201 : 400 })
}
