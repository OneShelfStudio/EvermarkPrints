import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getEvermarkProductBySlug, FRAME_FINISHES, EVERMARK_CATALOG } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid session_id is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const meta = session.metadata || {}

    const productSlug = meta.productSlug || 'custom-star-map'
    const product = getEvermarkProductBySlug(productSlug) || EVERMARK_CATALOG[0]
    const variantObj =
      product.variants.find((v) => v.id === meta.formatId) ||
      product.variants.find((v) => v.badge === 'Most Popular') ||
      product.variants[0]
    const frameObj = FRAME_FINISHES.find((f) => f.id === meta.frameFinishId) || FRAME_FINISHES[0]

    return NextResponse.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      amountTotalUsd: session.amount_total ? session.amount_total / 100 : variantObj.priceUsd,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      design: {
        productSlug,
        productTitle: product.title,
        mode: product.mode,
        plateNumber: product.plateNumber,
        headline: meta.headline || product.defaultHeadline,
        subline: meta.subline || product.defaultSubline,
        locationText: meta.locationText || product.defaultLocation,
        dateText: meta.dateText || product.defaultDateText,
        coordsText: meta.coordsText || product.defaultCoords,
        colorwayId: meta.colorwayId || product.defaultColorway,
        frameFinishId: meta.frameFinishId || product.defaultFrame,
        formatId: variantObj.id,
        formatLabel: product.supportsFrameFinish
          ? `${variantObj.label} (${frameObj.label})`
          : variantObj.label,
        giftNote: meta.giftNote || '',
        customPeaks: meta.customPeaks || '',
      },
    })
  } catch (err: unknown) {
    console.error('Error retrieving Stripe session:', err)
    return NextResponse.json(
      { error: 'Unable to retrieve order session' },
      { status: 500 }
    )
  }
}
