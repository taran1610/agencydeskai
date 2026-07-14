import { NextResponse } from 'next/server'
import { isAuthContext, requireAuth } from '@/lib/auth/session'
import { createBillingPortalSession } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth

  try {
    const url = await createBillingPortalSession(auth.workspaceId)
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not open billing portal' },
      { status: 500 },
    )
  }
}
