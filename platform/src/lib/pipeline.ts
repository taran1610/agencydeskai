import { logAudit } from '@/lib/audit'
import { ACCOUNT_ANALYSIS_SYSTEM, DOCUMENT_READ_SYSTEM } from '@/lib/ai/prompts'
import { generateStructured } from '@/lib/ai/provider'
import { accountAnalysisSchema, documentReadSchema } from '@/lib/ai/schemas'
import { DOCUMENTS_BUCKET, supabaseAdmin } from '@/lib/supabase/admin'
import type { AccountAnalysis, DocumentRow, Extraction } from '@/lib/types'
import { DOC_TYPE_LABELS } from '@/lib/types'

/**
 * The core read step: classify the document and extract every material field,
 * with per-field confidence and source notes. Replaces any previous extractions
 * for the document so reprocessing is idempotent.
 */
export async function processDocument(documentId: string): Promise<DocumentRow> {
  const db = supabaseAdmin()

  const { data: doc, error: docError } = await db
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single<DocumentRow>()
  if (docError || !doc) throw new Error('Document not found')

  await db.from('documents').update({ status: 'processing', error: null }).eq('id', doc.id)

  try {
    const { data: file, error: downloadError } = await db.storage
      .from(DOCUMENTS_BUCKET)
      .download(doc.storage_path)
    if (downloadError || !file) {
      throw new Error(`Could not download document: ${downloadError?.message}`)
    }
    const bytes = new Uint8Array(await file.arrayBuffer())

    const { object, model } = await generateStructured({
      schema: documentReadSchema,
      system: DOCUMENT_READ_SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'file', data: bytes, mediaType: doc.mime_type },
            {
              type: 'text',
              text: `Classify this document (filename: "${doc.filename}") and extract all material insurance fields.`,
            },
          ],
        },
      ],
    })

    await db.from('extractions').delete().eq('document_id', doc.id)

    if (object.fields.length > 0) {
      const { error: insertError } = await db.from('extractions').insert(
        object.fields.map((field) => ({
          document_id: doc.id,
          account_id: doc.account_id,
          field_key: field.key,
          field_label: field.label,
          value: field.value,
          confidence: field.confidence,
          source_note: field.sourceNote,
        })),
      )
      if (insertError) throw new Error(`Saving extractions failed: ${insertError.message}`)
    }

    const { data: updated, error: updateError } = await db
      .from('documents')
      .update({
        status: 'processed',
        doc_type: object.classification.docType,
        doc_type_confidence: object.classification.confidence,
        doc_type_reasoning: object.classification.reasoning,
        model,
        processed_at: new Date().toISOString(),
      })
      .eq('id', doc.id)
      .select('*')
      .single<DocumentRow>()
    if (updateError || !updated) throw new Error('Updating document failed')

    await logAudit({
      accountId: doc.account_id,
      documentId: doc.id,
      actor: 'ai',
      action: 'document.processed',
      detail: {
        docType: object.classification.docType,
        docTypeConfidence: object.classification.confidence,
        fieldsExtracted: object.fields.length,
        model,
      },
    })

    return updated
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await db.from('documents').update({ status: 'failed', error: message }).eq('id', doc.id)
    await logAudit({
      accountId: doc.account_id,
      documentId: doc.id,
      actor: 'system',
      action: 'document.failed',
      detail: { error: message },
    })
    throw error
  }
}

/**
 * The account-level step: turn all reviewed/extracted fields for an account into
 * a summary, flags, suggested CRM updates, and action items.
 */
export async function analyzeAccount(accountId: string): Promise<AccountAnalysis> {
  const db = supabaseAdmin()

  const { data: docs } = await db
    .from('documents')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'processed')
    .returns<DocumentRow[]>()
  if (!docs || docs.length === 0) {
    throw new Error('No processed documents on this account yet.')
  }

  const { data: extractions } = await db
    .from('extractions')
    .select('*')
    .eq('account_id', accountId)
    .neq('status', 'rejected')
    .returns<Extraction[]>()

  const context = docs
    .map((doc) => {
      const rows = (extractions ?? [])
        .filter((extraction) => extraction.document_id === doc.id)
        .map((extraction) => {
          // Human edits override the AI value; approvals raise trust.
          const value =
            extraction.status === 'edited' && extraction.edited_value
              ? extraction.edited_value
              : extraction.value
          const review =
            extraction.status === 'pending'
              ? `unreviewed, confidence ${extraction.confidence.toFixed(2)}`
              : `human-${extraction.status}`
          return `  - ${extraction.field_label}: ${value} (${review}; source: ${extraction.source_note ?? 'n/a'})`
        })
      const typeLabel = doc.doc_type ? DOC_TYPE_LABELS[doc.doc_type] : 'Unclassified'
      return `Document: ${doc.filename}\nType: ${typeLabel}\nFields:\n${rows.join('\n') || '  (no fields extracted)'}`
    })
    .join('\n\n')

  const { object, model } = await generateStructured({
    schema: accountAnalysisSchema,
    system: ACCOUNT_ANALYSIS_SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here is everything extracted from this client account's documents:\n\n${context}\n\nProduce the account summary, flags, suggested CRM updates, and action items.`,
          },
        ],
      },
    ],
  })

  const { data: analysis, error: insertError } = await db
    .from('account_analyses')
    .insert({
      account_id: accountId,
      summary: object.summary,
      flags: object.flags,
      suggested_updates: object.suggestedUpdates,
      action_items: object.actionItems,
      model,
    })
    .select('*')
    .single<AccountAnalysis>()
  if (insertError || !analysis) {
    throw new Error(`Saving analysis failed: ${insertError?.message}`)
  }

  await logAudit({
    accountId,
    actor: 'ai',
    action: 'account.analyzed',
    detail: {
      documents: docs.length,
      flags: object.flags.length,
      suggestedUpdates: object.suggestedUpdates.length,
      model,
    },
  })

  return analysis
}
