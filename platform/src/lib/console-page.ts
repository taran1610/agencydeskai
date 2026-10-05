import { redirect } from 'next/navigation'
import { getAuthContext, getSignedInUser } from '@/lib/auth/session'
import { removeDemoData } from '@/lib/demo/seed'
import { isSupabaseConfigured } from '@/lib/supabase/admin'
import type { AuthContext } from '@/lib/auth/session'
import { canWrite } from '@/lib/auth/permissions'

export async function requireConsolePage(): Promise<
  | { auth: AuthContext; canCreate: boolean }
  | { noWorkspace: string }
> {
  if (!isSupabaseConfigured()) {
    redirect('/login')
  }

  const auth = await getAuthContext()
  if (!auth) {
    const user = await getSignedInUser()
    if (user) {
      return { noWorkspace: user.email }
    }
    redirect('/login')
  }

  try {
    await removeDemoData(auth.workspaceId, auth.userId)
  } catch (error) {
    console.error('Could not remove sample data:', error)
  }

  return { auth, canCreate: canWrite(auth.role) }
}

export function hasAiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}
