import { logAudit } from '@/lib/audit'
import { DEMO_ACCOUNTS } from '@/lib/demo/data'
import { supabaseAdmin } from '@/lib/supabase/admin'

function daysAgoIso(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export interface DemoSeedResult {
  seeded: boolean
  accountCount: number
  reason?: string
}

export async function workspaceHasDemoData(workspaceId: string): Promise<boolean> {
  const db = supabaseAdmin()
  const { count, error } = await db
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('is_demo', true)
  if (error) throw new Error(error.message)
  return (count ?? 0) > 0
}

export async function ensureDemoDataForWorkspace(
  workspaceId: string,
  userId?: string,
): Promise<DemoSeedResult> {
  const db = supabaseAdmin()

  const { count: accountCount, error: countError } = await db
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
  if (countError) throw new Error(countError.message)
  if ((accountCount ?? 0) > 0) {
    return { seeded: false, accountCount: accountCount ?? 0, reason: 'workspace_has_accounts' }
  }

  const { data: workspace, error: wsError } = await db
    .from('workspaces')
    .select('demo_seeded_at')
    .eq('id', workspaceId)
    .single()
  if (wsError) throw new Error(wsError.message)
  if (workspace?.demo_seeded_at) {
    return { seeded: false, accountCount: 0, reason: 'already_seeded' }
  }

  return seedDemoWorkspace(workspaceId, userId)
}

export async function seedDemoWorkspace(
  workspaceId: string,
  userId?: string,
): Promise<DemoSeedResult> {
  const db = supabaseAdmin()

  const { count: existing, error: existingError } = await db
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('is_demo', true)
  if (existingError) throw new Error(existingError.message)
  if ((existing ?? 0) > 0) {
    return { seeded: false, accountCount: existing ?? 0, reason: 'demo_exists' }
  }

  let createdAccounts = 0

  for (const spec of DEMO_ACCOUNTS) {
    const accountCreatedAt = daysAgoIso(spec.daysAgo)

    const { data: account, error: accountError } = await db
      .from('accounts')
      .insert({
        name: spec.name,
        workspace_id: workspaceId,
        is_demo: true,
        created_at: accountCreatedAt,
        updated_at: accountCreatedAt,
      })
      .select('id')
      .single()
    if (accountError || !account) {
      throw new Error(accountError?.message ?? `Could not create demo account ${spec.name}`)
    }
    createdAccounts += 1

    await logAudit({
      accountId: account.id,
      actor: 'system',
      userId: userId ?? null,
      action: 'demo.account_created',
      detail: { name: spec.name },
    })

    for (const docSpec of spec.documents) {
      const processedAt = daysAgoIso(docSpec.daysAgo - 1)
      const docCreatedAt = daysAgoIso(docSpec.daysAgo)

      const { data: document, error: docError } = await db
        .from('documents')
        .insert({
          account_id: account.id,
          filename: docSpec.filename,
          storage_path: `demo/${account.id}/${docSpec.filename}`,
          mime_type: docSpec.mime_type,
          size_bytes: docSpec.size_bytes,
          status: 'processed',
          doc_type: docSpec.doc_type,
          doc_type_confidence: docSpec.doc_type_confidence,
          doc_type_reasoning: docSpec.doc_type_reasoning,
          model: docSpec.model,
          created_at: docCreatedAt,
          processed_at: processedAt,
        })
        .select('id')
        .single()
      if (docError || !document) {
        throw new Error(docError?.message ?? `Could not create demo document ${docSpec.filename}`)
      }

      await logAudit({
        accountId: account.id,
        documentId: document.id,
        actor: 'ai',
        action: 'document.processed',
        detail: {
          filename: docSpec.filename,
          doc_type: docSpec.doc_type,
          demo: true,
        },
      })

      if (docSpec.extractions.length > 0) {
        const { error: extractionError } = await db.from('extractions').insert(
          docSpec.extractions.map((field) => ({
            document_id: document.id,
            account_id: account.id,
            field_key: field.field_key,
            field_label: field.field_label,
            value: field.value,
            confidence: field.confidence,
            source_note: field.source_note,
            status: field.status,
            edited_value: field.edited_value ?? null,
            reviewed_at:
              field.status === 'approved' || field.status === 'edited'
                ? processedAt
                : null,
            reviewed_by:
              field.status === 'edited' && userId ? userId : null,
            created_at: processedAt,
          })),
        )
        if (extractionError) throw new Error(extractionError.message)
      }
    }

    if (spec.analysis) {
      const analysisCreatedAt = daysAgoIso(spec.analysis.daysAgo)
      const { error: analysisError } = await db.from('account_analyses').insert({
        account_id: account.id,
        summary: spec.analysis.summary,
        flags: spec.analysis.flags,
        suggested_updates: spec.analysis.suggested_updates,
        action_items: spec.analysis.action_items,
        crm_export_block: spec.analysis.crm_export_block,
        model: spec.analysis.model,
        created_at: analysisCreatedAt,
      })
      if (analysisError) throw new Error(analysisError.message)

      await logAudit({
        accountId: account.id,
        actor: 'ai',
        action: 'account.analyzed',
        detail: { demo: true, flagCount: spec.analysis.flags.length },
      })
    }
  }

  const { error: markError } = await db
    .from('workspaces')
    .update({ demo_seeded_at: new Date().toISOString() })
    .eq('id', workspaceId)
  if (markError) throw new Error(markError.message)

  await logAudit({
    actor: 'system',
    userId: userId ?? null,
    action: 'demo.workspace_seeded',
    detail: { accountCount: createdAccounts },
  })

  return { seeded: true, accountCount: createdAccounts }
}

export async function removeDemoData(workspaceId: string, userId?: string): Promise<number> {
  const db = supabaseAdmin()

  const { data: demoAccounts, error: listError } = await db
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_demo', true)
  if (listError) throw new Error(listError.message)
  if (!demoAccounts?.length) return 0

  const ids = demoAccounts.map((a) => a.id)
  const { error: deleteError } = await db.from('accounts').delete().in('id', ids)
  if (deleteError) throw new Error(deleteError.message)

  await logAudit({
    actor: 'human',
    userId: userId ?? null,
    action: 'demo.removed',
    detail: { accountIds: ids, names: demoAccounts.map((a) => a.name) },
  })

  return demoAccounts.length
}
