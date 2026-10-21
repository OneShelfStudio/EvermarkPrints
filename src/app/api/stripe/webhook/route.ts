import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured.' },
      { status: 503 }
    )
  }

  const body = await req.text()
  const sig = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log(
      `[Evermark Webhook] Completed Order: ${session.id} | SKU: ${session.metadata?.sku} | Headline: ${session.metadata?.headline}`
    )
  }

  return NextResponse.json({ received: true })
}
