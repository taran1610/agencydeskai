import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Server-only Supabase client using the service-role key.
 * All platform tables have RLS enabled with no public policies,
 * so this is the only way data is read or written.
 */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy platform/.env.example to platform/.env.local and fill them in.',
    )
  }
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export const DOCUMENTS_BUCKET = 'documents'
