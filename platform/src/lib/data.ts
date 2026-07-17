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
import { DOC_TYPE_LABELS } from '@/lib/types'

export interface AccountListItem extends Account {
  documentCount: number
  processedDocumentCount: number
  pendingReviewCount: number
}

export interface WorkspaceStats {
  accountCount: number
  documentCount: number
  processedCount: number
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
    db.from('documents').select('account_id, status').in('account_id', ids),
    db
      .from('extractions')
      .select('account_id')
      .in('account_id', ids)
      .eq('status', 'pending'),
  ])

  const docCounts = new Map<string, number>()
  const processedCounts = new Map<string, number>()
  for (const row of docs ?? []) {
    docCounts.set(row.account_id, (docCounts.get(row.account_id) ?? 0) + 1)
    if (row.status === 'processed') {
      processedCounts.set(row.account_id, (processedCounts.get(row.account_id) ?? 0) + 1)
    }
  }
  const pendingCounts = new Map<string, number>()
  for (const row of pending ?? []) {
    pendingCounts.set(row.account_id, (pendingCounts.get(row.account_id) ?? 0) + 1)
  }

  return accounts.map((account) => ({
    ...account,
    documentCount: docCounts.get(account.id) ?? 0,
    processedDocumentCount: processedCounts.get(account.id) ?? 0,
    pendingReviewCount: pendingCounts.get(account.id) ?? 0,
  }))
}

export function summarizeWorkspace(accounts: AccountListItem[]): WorkspaceStats {
  return {
    accountCount: accounts.length,
    documentCount: accounts.reduce((sum, a) => sum + a.documentCount, 0),
    processedCount: accounts.reduce((sum, a) => sum + a.processedDocumentCount, 0),
    pendingReviewCount: accounts.reduce((sum, a) => sum + a.pendingReviewCount, 0),
  }
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

export interface DashboardActivity {
  id: string
  title: string
  detail: string
  created_at: string
  actor: AuditEntry['actor']
}

export interface DashboardInsights {
  recentActivity: DashboardActivity[]
  documentTypes: Array<{ type: string; label: string; count: number }>
  confidence: { high: number; medium: number; low: number; average: number; total: number }
}

const AUDIT_LABELS: Record<string, string> = {
  'account.created': 'Account created',
  'document.processed': 'Document processed',
  'document.uploaded': 'Document uploaded',
  'account.analyzed': 'Account analyzed',
  'demo.account_created': 'Sample account created',
  'demo.workspace_seeded': 'Sample data loaded',
  'extraction.approved': 'Field approved',
  'extraction.edited': 'Field edited',
  'extraction.rejected': 'Field rejected',
}

export async function getWorkspaceDashboardInsights(
  workspaceId: string,
): Promise<DashboardInsights> {
  const db = supabaseAdmin()
  const { data: accounts } = await db
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
  const accountIds = (accounts ?? []).map((a) => a.id)
  const accountNames = new Map((accounts ?? []).map((a) => [a.id, a.name]))

  if (accountIds.length === 0) {
    return {
      recentActivity: [],
      documentTypes: [],
      confidence: { high: 0, medium: 0, low: 0, average: 0, total: 0 },
    }
  }

  const [{ data: documents }, { data: extractions }, { data: audit }] = await Promise.all([
    db.from('documents').select('doc_type').in('account_id', accountIds),
    db.from('extractions').select('confidence').in('account_id', accountIds),
    db
      .from('audit_log')
      .select('*')
      .in('account_id', accountIds)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const typeCounts = new Map<string, number>()
  for (const doc of documents ?? []) {
    const key = doc.doc_type ?? 'other'
    typeCounts.set(key, (typeCounts.get(key) ?? 0) + 1)
  }

  const documentTypes = [...typeCounts.entries()]
    .map(([type, count]) => ({
      type,
      label: DOC_TYPE_LABELS[type as keyof typeof DOC_TYPE_LABELS] ?? type,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  let high = 0
  let medium = 0
  let low = 0
  let sum = 0
  for (const row of extractions ?? []) {
    sum += row.confidence
    if (row.confidence >= 0.9) high += 1
    else if (row.confidence >= 0.7) medium += 1
    else low += 1
  }
  const total = extractions?.length ?? 0

  const recentActivity: DashboardActivity[] = (audit ?? []).map((entry) => {
    const accountName = entry.account_id ? accountNames.get(entry.account_id) : null
    const label = AUDIT_LABELS[entry.action] ?? entry.action.replace(/\./g, ' ')
    const detail =
      typeof entry.detail?.name === 'string'
        ? entry.detail.name
        : typeof entry.detail?.filename === 'string'
          ? entry.detail.filename
          : (accountName ?? '')
    return {
      id: entry.id,
      title: accountName ? `${accountName} — ${label}` : label,
      detail,
      created_at: entry.created_at,
      actor: entry.actor,
    }
  })

  return {
    recentActivity,
    documentTypes,
    confidence: {
      high,
      medium,
      low,
      total,
      average: total > 0 ? sum / total : 0,
    },
  }
}

export async function getProfileDisplayName(userId: string): Promise<string | null> {
  const db = supabaseAdmin()
  const { data } = await db
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .maybeSingle()
  return data?.full_name ?? null
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

async function getWorkspaceAccountIds(workspaceId: string) {
  const db = supabaseAdmin()
  const { data: accounts } = await db
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('status', 'active')
  return accounts ?? []
}

export interface WorkspaceDocument extends DocumentRow {
  account_name: string
}

export async function listWorkspaceDocuments(workspaceId: string): Promise<WorkspaceDocument[]> {
  const accounts = await getWorkspaceAccountIds(workspaceId)
  if (accounts.length === 0) return []

  const accountIds = accounts.map((a) => a.id)
  const nameMap = new Map(accounts.map((a) => [a.id, a.name]))
  const db = supabaseAdmin()

  const { data: documents, error } = await db
    .from('documents')
    .select('*')
    .in('account_id', accountIds)
    .order('created_at', { ascending: false })
    .returns<DocumentRow[]>()
  if (error) throw new Error(error.message)

  return (documents ?? []).map((doc) => ({
    ...doc,
    account_name: nameMap.get(doc.account_id) ?? 'Unknown',
  }))
}

export interface WorkspaceExtraction extends Extraction {
  account_name: string
  document_filename: string
}

export async function listPendingReviewExtractions(
  workspaceId: string,
): Promise<WorkspaceExtraction[]> {
  const accounts = await getWorkspaceAccountIds(workspaceId)
  if (accounts.length === 0) return []

  const accountIds = accounts.map((a) => a.id)
  const nameMap = new Map(accounts.map((a) => [a.id, a.name]))
  const db = supabaseAdmin()

  const { data: extractions, error } = await db
    .from('extractions')
    .select('*')
    .in('account_id', accountIds)
    .eq('status', 'pending')
    .order('confidence', { ascending: true })
    .returns<Extraction[]>()
  if (error) throw new Error(error.message)
  if (!extractions?.length) return []

  const docIds = [...new Set(extractions.map((e) => e.document_id))]
  const { data: docs } = await db.from('documents').select('id, filename').in('id', docIds)
  const fileMap = new Map((docs ?? []).map((d) => [d.id, d.filename]))

  return extractions.map((ext) => ({
    ...ext,
    account_name: nameMap.get(ext.account_id) ?? 'Unknown',
    document_filename: fileMap.get(ext.document_id) ?? 'Document',
  }))
}

export interface ExportReadyAccount extends AccountListItem {
  hasAnalysis: boolean
  analysisDate: string | null
}

export async function listExportReadyAccounts(workspaceId: string): Promise<ExportReadyAccount[]> {
  const accounts = await listAccounts(workspaceId)
  if (accounts.length === 0) return []

  const accountIds = accounts.map((a) => a.id)
  const db = supabaseAdmin()
  const { data: analyses } = await db
    .from('account_analyses')
    .select('account_id, created_at')
    .in('account_id', accountIds)
    .order('created_at', { ascending: false })

  const analysisMap = new Map<string, string>()
  for (const row of analyses ?? []) {
    if (!analysisMap.has(row.account_id)) {
      analysisMap.set(row.account_id, row.created_at)
    }
  }

  return accounts.map((account) => ({
    ...account,
    hasAnalysis: analysisMap.has(account.id),
    analysisDate: analysisMap.get(account.id) ?? null,
  }))
}

export interface WorkspaceAnalytics extends DashboardInsights {
  stats: WorkspaceStats
  accounts: AccountListItem[]
  analysisCount: number
  approvedCount: number
  editedCount: number
  rejectedCount: number
}

export async function getWorkspaceAnalytics(workspaceId: string): Promise<WorkspaceAnalytics> {
  const [accounts, insights] = await Promise.all([
    listAccounts(workspaceId),
    getWorkspaceDashboardInsights(workspaceId),
  ])
  const stats = summarizeWorkspace(accounts)
  const accountIds = accounts.map((a) => a.id)

  let analysisCount = 0
  let approvedCount = 0
  let editedCount = 0
  let rejectedCount = 0

  if (accountIds.length > 0) {
    const db = supabaseAdmin()
    const [{ count: analysisTotal }, { data: extractionStats }] = await Promise.all([
      db
        .from('account_analyses')
        .select('id', { count: 'exact', head: true })
        .in('account_id', accountIds),
      db.from('extractions').select('status').in('account_id', accountIds),
    ])
    analysisCount = analysisTotal ?? 0
    for (const row of extractionStats ?? []) {
      if (row.status === 'approved') approvedCount += 1
      else if (row.status === 'edited') editedCount += 1
      else if (row.status === 'rejected') rejectedCount += 1
    }
  }

  return {
    ...insights,
    stats,
    accounts,
    analysisCount,
    approvedCount,
    editedCount,
    rejectedCount,
  }
}

