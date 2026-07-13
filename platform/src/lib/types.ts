export type DocType =
  | 'acord_application'
  | 'loss_run'
  | 'dec_page'
  | 'certificate_of_insurance'
  | 'policy_document'
  | 'endorsement'
  | 'quote'
  | 'correspondence'
  | 'other'

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed'
export type ExtractionStatus = 'pending' | 'approved' | 'edited' | 'rejected'

export interface Account {
  id: string
  name: string
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
}

export interface DocumentRow {
  id: string
  account_id: string
  filename: string
  storage_path: string
  mime_type: string
  size_bytes: number
  status: DocumentStatus
  doc_type: DocType | null
  doc_type_confidence: number | null
  doc_type_reasoning: string | null
  error: string | null
  model: string | null
  created_at: string
  processed_at: string | null
}

export interface Extraction {
  id: string
  document_id: string
  account_id: string
  field_key: string
  field_label: string
  value: string
  confidence: number
  source_note: string | null
  status: ExtractionStatus
  edited_value: string | null
  created_at: string
  reviewed_at: string | null
}

export interface AnalysisFlag {
  type: 'missing' | 'inconsistent' | 'expiring' | 'other'
  severity: 'high' | 'medium' | 'low'
  title: string
  detail: string
}

export interface SuggestedUpdate {
  field: string
  suggestedValue: string
  source: string
}

export interface ActionItem {
  title: string
  detail: string
  priority: 'high' | 'medium' | 'low'
}

export interface AccountAnalysis {
  id: string
  account_id: string
  summary: string
  flags: AnalysisFlag[]
  suggested_updates: SuggestedUpdate[]
  action_items: ActionItem[]
  model: string | null
  created_at: string
}

export interface AuditEntry {
  id: string
  account_id: string | null
  document_id: string | null
  actor: 'ai' | 'human' | 'system'
  action: string
  detail: Record<string, unknown>
  created_at: string
}

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  acord_application: 'ACORD application',
  loss_run: 'Loss run',
  dec_page: 'Declarations page',
  certificate_of_insurance: 'Certificate of insurance',
  policy_document: 'Policy document',
  endorsement: 'Endorsement',
  quote: 'Quote',
  correspondence: 'Correspondence',
  other: 'Other',
}
