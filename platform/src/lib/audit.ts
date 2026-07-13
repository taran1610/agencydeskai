import { supabaseAdmin } from '@/lib/supabase/admin'

export async function logAudit(entry: {
  accountId?: string | null
  documentId?: string | null
  userId?: string | null
  actor: 'ai' | 'human' | 'system'
  action: string
  detail?: Record<string, unknown>
}) {
  const { error } = await supabaseAdmin().from('audit_log').insert({
    account_id: entry.accountId ?? null,
    document_id: entry.documentId ?? null,
    user_id: entry.userId ?? null,
    actor: entry.actor,
    action: entry.action,
    detail: entry.detail ?? {},
  })
  if (error) {
    console.error('audit_log insert failed:', error.message)
  }
}
