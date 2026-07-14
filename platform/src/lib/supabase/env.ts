/** Edge-safe env checks (no Supabase client imports). */
export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  return Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
