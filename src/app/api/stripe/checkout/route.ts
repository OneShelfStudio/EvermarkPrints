import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

interface CustomLineItem {
  name: string
  description?: string
  amountCents: number
  quantity?: number
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this server.' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const {
      currency = 'usd',
      projectId,
      returnUrl,
      lineItems,
      collectUsShipping = true,
      metadata = {},
    } = body

    if (!Array.isArray(lineItems) || lineItems.length === 0 || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters: lineItems, returnUrl' },
        { status: 400 }
      )
    }

    const formattedLineItems = (lineItems as CustomLineItem[]).map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
        },
        unit_amount: Math.round(item.amountCents),
      },
      quantity: item.quantity || 1,
    }))

    const separator = returnUrl.includes('?') ? '&' : '?'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: formattedLineItems,
      mode: 'payment',
      allow_promotion_codes: true,
      ...(collectUsShipping
        ? {
            shipping_address_collection: {
              allowed_countries: ['US'],
            },
          }
        : {}),
      success_url: `${returnUrl}${separator}success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}${separator}canceled=true`,
      metadata: {
        projectId: projectId || 'evermark_prints_order',
        ...metadata,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Evermark Stripe Checkout Error:', err)
    return NextResponse.json(
      { error: 'Error creating Stripe checkout session' },
      { status: 500 }
    )
  }
}
