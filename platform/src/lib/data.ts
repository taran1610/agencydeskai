import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  Account,
  AccountAnalysis,
  AuditEntry,
  DocumentRow,
  Extraction,
} from '@/lib/types'

export interface AccountListItem extends Account {
  documentCount: number
  pendingReviewCount: number
}

export async function listAccounts(): Promise<AccountListItem[]> {
  const db = supabaseAdmin()
  const { data: accounts, error } = await db
    .from('accounts')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .returns<Account[]>()
  if (error) throw new Error(error.message)
  if (!accounts || accounts.length === 0) return []

  const ids = accounts.map((account) => account.id)
  const [{ data: docs }, { data: pending }] = await Promise.all([
    db.from('documents').select('account_id').in('account_id', ids),
    db
      .from('extractions')
      .select('account_id')
      .in('account_id', ids)
      .eq('status', 'pending'),
  ])

  const docCounts = new Map<string, number>()
  for (const row of docs ?? []) {
    docCounts.set(row.account_id, (docCounts.get(row.account_id) ?? 0) + 1)
  }
  const pendingCounts = new Map<string, number>()
  for (const row of pending ?? []) {
    pendingCounts.set(row.account_id, (pendingCounts.get(row.account_id) ?? 0) + 1)
  }

  return accounts.map((account) => ({
    ...account,
    documentCount: docCounts.get(account.id) ?? 0,
    pendingReviewCount: pendingCounts.get(account.id) ?? 0,
  }))
}

export interface AccountDetail {
  account: Account
  documents: DocumentRow[]
  extractions: Extraction[]
  latestAnalysis: AccountAnalysis | null
  auditTrail: AuditEntry[]
}

export async function getAccountDetail(accountId: string): Promise<AccountDetail | null> {
  const db = supabaseAdmin()
  const { data: account } = await db
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single<Account>()
  if (!account) return null

  const [{ data: documents }, { data: extractions }, { data: analyses }, { data: audit }] =
    await Promise.all([
      db
        .from('documents')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .returns<DocumentRow[]>(),
      db
        .from('extractions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: true })
        .returns<Extraction[]>(),
      db
        .from('account_analyses')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(1)
        .returns<AccountAnalysis[]>(),
      db
        .from('audit_log')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(50)
        .returns<AuditEntry[]>(),
    ])

  return {
    account,
    documents: documents ?? [],
    extractions: extractions ?? [],
    latestAnalysis: analyses?.[0] ?? null,
    auditTrail: audit ?? [],
  }
}
