import { sendWelcomeEmail } from '@/lib/email/send'
import { supabaseAdmin } from '@/lib/supabase/admin'

type EnsureUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown> | null
}

function workspaceNameFor(user: EnsureUser) {
  const meta = user.user_metadata ?? {}
  const fromMeta =
    (typeof meta.workspace_name === 'string' && meta.workspace_name.trim()) ||
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.name === 'string' && meta.name.trim()) ||
    ''
  const fromEmail = user.email?.split('@')[0]?.trim() || ''
  return fromMeta || fromEmail || 'My Agency'
}

function fullNameFor(user: EnsureUser) {
  const meta = user.user_metadata ?? {}
  if (typeof meta.full_name === 'string' && meta.full_name.trim()) return meta.full_name.trim()
  if (typeof meta.name === 'string' && meta.name.trim()) return meta.name.trim()
  return user.email?.split('@')[0] ?? null
}

/**
 * Ensures the signed-in user owns/belongs to a workspace.
 * Used after Google/Apple OAuth and as a safety net for older accounts.
 */
export async function ensureUserWorkspace(user: EnsureUser) {
  const admin = supabaseAdmin()

  const { data: existing, error: existingError } = await admin
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (existingError) throw new Error(existingError.message)

  const fullName = fullNameFor(user)

  let membership = existing

  if (!membership) {
    // Profile may already exist from the auth trigger; upsert to be safe.
    if (user.email) {
      await admin.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
        },
        { onConflict: 'id' },
      )
    }

    const { data: workspace, error: workspaceError } = await admin
      .from('workspaces')
      .insert({ name: workspaceNameFor(user) })
      .select('id')
      .single()

    if (workspaceError || !workspace) {
      throw new Error(workspaceError?.message ?? 'Could not create workspace')
    }

    const { data: created, error: memberError } = await admin
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner',
      })
      .select('workspace_id, role')
      .single()

    if (memberError || !created) {
      throw new Error(memberError?.message ?? 'Could not join workspace')
    }

    membership = created
  }

  // Auth trigger often creates the workspace before this runs — welcome is
  // idempotent (one send per email) so first login still gets the thank-you.
  if (user.email) {
    try {
      await sendWelcomeEmail({
        email: user.email,
        userId: user.id,
        workspaceId: membership.workspace_id,
        fullName,
      })
    } catch (error) {
      console.error('Welcome email failed:', error)
    }
  }

  return membership
}
