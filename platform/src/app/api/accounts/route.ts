import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Account } from '@/lib/types'

export async function POST(request: Request) {
  let name: unknown
  try {
    ;({ name } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json(
      { error: 'Account name must be at least 2 characters.' },
      { status: 400 },
    )
  }

  const { data: account, error } = await supabaseAdmin()
    .from('accounts')
    .insert({ name: name.trim() })
    .select('*')
    .single<Account>()
  if (error || !account) {
    return NextResponse.json(
      { error: error?.message ?? 'Could not create account' },
      { status: 500 },
    )
  }

  await logAudit({
    accountId: account.id,
    actor: 'human',
    action: 'account.created',
    detail: { name: account.name },
  })

  return NextResponse.json({ account }, { status: 201 })
}
