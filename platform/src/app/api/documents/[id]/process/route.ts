import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth, requireWrite } from '@/lib/auth/session'
import { processDocument } from '@/lib/pipeline'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const maxDuration = 300

async function documentInWorkspace(documentId: string, workspaceId: string) {
  const db = supabaseAdmin()
  const { data: doc } = await db
    .from('documents')
    .select('id, account_id')
    .eq('id', documentId)
    .single()
  if (!doc) return false
  const { data: account } = await db
    .from('accounts')
    .select('workspace_id')
    .eq('id', doc.account_id)
    .eq('workspace_id', workspaceId)
    .single()
  return Boolean(account)
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth('reviewer')
  if (!isAuthContext(auth)) return auth
  const denied = requireWrite(auth)
  if (denied) return denied

  const { id } = await params
  if (!(await documentInWorkspace(id, auth.workspaceId))) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  try {
    const document = await processDocument(id, auth.userId)
    return NextResponse.json({ document })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
