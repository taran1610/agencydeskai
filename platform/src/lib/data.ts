import { supabaseAdmin } from '@/lib/supabase/admin'
import type {
  Account,
  AccountAnalysis,
  AuditEntry,
  DocumentRow,
  Extraction,
  Invitation,
  WorkspaceMember,
} from '@/lib/types'

export interface AccountListItem extends Account {
  documentCount: number
  pendingReviewCount: number
}

export async function listAccounts(workspaceId: string): Promise<AccountListItem[]> {
  const db = supabaseAdmin()
  const { data: accounts, error } = await db
    .from('accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
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
  analyses: AccountAnalysis[]
  auditTrail: AuditEntry[]
}

export async function getAccountDetail(
  accountId: string,
  workspaceId: string,
): Promise<AccountDetail | null> {
  const db = supabaseAdmin()
  const { data: account } = await db
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .eq('workspace_id', workspaceId)
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
    analyses: analyses ?? [],
    auditTrail: audit ?? [],
  }
}

export async function listTeamMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const db = supabaseAdmin()
  const { data: members, error } = await db
    .from('workspace_members')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  if (!members?.length) return []

  const userIds = members.map((m) => m.user_id)
  const { data: profiles } = await db
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  return members.map((member) => ({
    ...member,
    profile: profileMap.get(member.user_id),
  })) as WorkspaceMember[]
}

export async function listPendingInvitations(workspaceId: string): Promise<Invitation[]> {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('invitations')
    .select('*')
    .eq('workspace_id', workspaceId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .returns<Invitation[]>()
  if (error) throw new Error(error.message)
  return data ?? []
}
