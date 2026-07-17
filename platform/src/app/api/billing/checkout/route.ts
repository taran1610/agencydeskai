import { NextResponse } from 'next/server'
import { getAuthContext, isAuthContext, requireAuth } from '@/lib/auth/session'
import { parseCheckoutPlan } from '@/lib/plans'
import { createCheckoutSession } from '@/lib/stripe/billing'
import { isStripeConfigured, isStripePlanConfigured } from '@/lib/stripe/client'
import { friendlyStripeError } from '@/lib/stripe/errors'

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and STRIPE_PRICE_ID.' },
      { status: 503 },
    )
  }

  const auth = await requireAuth('owner')
  if (!isAuthContext(auth)) return auth

  let plan = parseCheckoutPlan(null)
  try {
    const body = (await request.json()) as { plan?: string }
    plan = parseCheckoutPlan(body.plan)
  } catch {
    // Empty body is fine — default to Solo.
  }

  if (!isStripePlanConfigured(plan)) {
    return NextResponse.json(
      { error: `Checkout for the ${plan} plan is not configured yet.` },
      { status: 503 },
    )
  }

  try {
    const url = await createCheckoutSession({
      workspaceId: auth.workspaceId,
      email: auth.email,
      userId: auth.userId,
      plan,
    })
    return NextResponse.json({ url })
  } catch (error) {
    const raw = error instanceof Error ? error.message : 'Checkout failed'
    return NextResponse.json({ error: friendlyStripeError(raw) }, { status: 500 })
  }
}

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ configured: isStripeConfigured() })
}
