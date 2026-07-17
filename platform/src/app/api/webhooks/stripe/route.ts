import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { sendPurchaseEmail } from '@/lib/email/send'
import { CHECKOUT_PLANS, parseCheckoutPlan } from '@/lib/plans'
import {
  markWorkspaceSubscriptionCanceled,
  syncSubscriptionToWorkspace,
} from '@/lib/stripe/billing'
import { getStripe } from '@/lib/stripe/client'
export const runtime = 'nodejs'

async function sendCheckoutPurchaseEmail(session: Stripe.Checkout.Session) {
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    null
  if (!email) return

  const planId = parseCheckoutPlan(session.metadata?.plan)
  const planLabel = CHECKOUT_PLANS[planId].label

  try {
    await sendPurchaseEmail({
      email,
      userId: session.metadata?.user_id ?? null,
      workspaceId: session.metadata?.workspace_id ?? session.client_reference_id ?? null,
      fullName: session.customer_details?.name ?? null,
      planLabel,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Purchase email failed:', error)
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid signature' },
      { status: 400 },
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            String(session.subscription),
          )
          await syncSubscriptionToWorkspace(subscription)
        }
        await sendCheckoutPurchaseEmail(session)
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        await syncSubscriptionToWorkspace(event.data.object as Stripe.Subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await markWorkspaceSubscriptionCanceled(sub.id)
        break
      }
      default:
        break
    }
  } catch (error) {
    console.error('Stripe webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
