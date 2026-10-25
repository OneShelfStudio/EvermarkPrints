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
      promoCode,
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

    const cleanMetadata: Record<string, string> = {
      projectId: String(projectId || 'evermark_prints_order'),
    }
    for (const [k, v] of Object.entries(metadata)) {
      if (v !== undefined && v !== null) {
        cleanMetadata[k] = String(v).slice(0, 490)
      }
    }

    // Optional auto-applied Stripe Promotion Code (e.g. WELCOME15 from saved proof email or 1-click apply)
    let resolvedPromoId: string | null = null
    if (typeof promoCode === 'string' && promoCode.trim().length > 0) {
      try {
        const promoList = await stripe.promotionCodes.list({
          code: promoCode.trim().toUpperCase(),
          active: true,
          limit: 1,
        })
        if (promoList.data.length > 0) {
          resolvedPromoId = promoList.data[0].id
          cleanMetadata.appliedPromoCode = promoCode.trim().toUpperCase()
        }
      } catch {
        // Fallback to manual promotion code box at checkout
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: formattedLineItems,
      mode: 'payment',
      ...(resolvedPromoId
        ? { discounts: [{ promotion_code: resolvedPromoId }] }
        : { allow_promotion_codes: true }),
      ...(collectUsShipping
        ? {
            shipping_address_collection: {
              allowed_countries: ['US'],
            },
            phone_number_collection: {
              enabled: true,
            },
          }
        : {}),
      payment_intent_data: {
        metadata: cleanMetadata,
      },
      success_url: `${returnUrl}${separator}success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}${separator}canceled=true`,
      metadata: cleanMetadata,
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
