import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { getWorkspaceBilling } from '@/lib/stripe/billing'
import { isStripeConfigured } from '@/lib/stripe/client'
import { isSubscriptionActive } from '@/lib/stripe/status'

export async function GET() {
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const billing = await getWorkspaceBilling(auth.workspaceId)
  const status = billing?.subscription_status ?? 'none'

  return NextResponse.json({
    configured: isStripeConfigured(),
    status,
    active: isSubscriptionActive(status),
    plan: billing?.subscription_plan ?? null,
    renewsAt: billing?.subscription_current_period_end ?? null,
    role: auth.role,
  })
}
