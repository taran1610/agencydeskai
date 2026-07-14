import { NextResponse } from 'next/server'
import { getAuthContext, isAuthContext, requireAuth } from '@/lib/auth/session'
import { createCheckoutSession } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and STRIPE_PRICE_ID.' },
      { status: 503 },
    )
  }

  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth

  try {
    const url = await createCheckoutSession({
      workspaceId: auth.workspaceId,
      email: auth.email,
      userId: auth.userId,
    })
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 },
    )
  }
}

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ configured: isStripeConfigured() })
}
