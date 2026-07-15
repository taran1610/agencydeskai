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

export const saveWaitlistSignup = async ({
  email,
  role,
  source,
}: WaitlistSignup): Promise<WaitlistSaveResult> => {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, destination: 'local' }
  }

  const { error } = await supabase.from('waitlist_signups').insert({
    email: email.trim().toLowerCase(),
    role: role ?? null,
    source,
  })

  if (!error) {
    return { ok: true, destination: 'supabase' }
  }

  if (isDuplicateEmailError(error)) {
    return { ok: true, destination: 'supabase' }
  }

  return {
    ok: false,
    destination: 'supabase',
    error: error.message,
  }
}
