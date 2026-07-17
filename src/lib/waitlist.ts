import { site } from '../config/site'
import { isSupabaseConfigured, supabase } from './supabase'

export type WaitlistSignup = {
  email: string
  role?: string
  source: 'hero' | 'final'
}

export type WaitlistSaveResult =
  | { ok: true; destination: 'supabase' | 'local' }
  | { ok: false; destination: 'supabase'; error: string }

const isDuplicateEmailError = (error: { code?: string; message?: string }) =>
  error.code === '23505' ||
  /duplicate|unique|already exists/i.test(error.message ?? '')

async function notifyWaitlistEmail(email: string) {
  try {
    await fetch(`${site.appUrl}/api/email/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch {
    // Non-blocking — signup already saved.
  }
}

export const saveWaitlistSignup = async ({
  email,
  role,
  source,
}: WaitlistSignup): Promise<WaitlistSaveResult> => {
  const normalized = email.trim().toLowerCase()

  if (!isSupabaseConfigured || !supabase) {
    void notifyWaitlistEmail(normalized)
    return { ok: true, destination: 'local' }
  }

  const { error } = await supabase.from('waitlist_signups').insert({
    email: normalized,
    role: role ?? null,
    source,
  })

  if (!error) {
    void notifyWaitlistEmail(normalized)
    return { ok: true, destination: 'supabase' }
  }

  if (isDuplicateEmailError(error)) {
    void notifyWaitlistEmail(normalized)
    return { ok: true, destination: 'supabase' }
  }

  return {
    ok: false,
    destination: 'supabase',
    error: error.message,
  }
}
