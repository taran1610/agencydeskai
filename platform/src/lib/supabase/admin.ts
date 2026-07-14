import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isSupabaseServerConfigured } from '@/lib/supabase/env'

let cached: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return isSupabaseServerConfigured()
}

/**
 * Server-only Supabase client using the service-role key.
 */
export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
    )
  }
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export const DOCUMENTS_BUCKET = 'documents'
