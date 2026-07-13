import { supabaseAdmin } from '@/lib/supabase/admin'

export async function logAudit(entry: {
  accountId?: string | null
  documentId?: string | null
  actor: 'ai' | 'human' | 'system'
  action: string
  detail?: Record<string, unknown>
}) {
  const { error } = await supabaseAdmin().from('audit_log').insert({
    account_id: entry.accountId ?? null,
    document_id: entry.documentId ?? null,
    actor: entry.actor,
    action: entry.action,
    detail: entry.detail ?? {},
  })
  if (error) {
    // Audit failures should never break the main flow, but they must be visible.
    console.error('audit_log insert failed:', error.message)
  }
}
