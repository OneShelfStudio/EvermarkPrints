import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getEvermarkProductBySlug, FORMAT_TIERS, FRAME_FINISHES } from '@/lib/catalog'

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
    const product = getEvermarkProductBySlug(productSlug)
    const formatObj = FORMAT_TIERS.find((f) => f.id === meta.formatId) || FORMAT_TIERS[0]
    const frameObj = FRAME_FINISHES.find((f) => f.id === meta.frameFinishId) || FRAME_FINISHES[0]

    return NextResponse.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      amountTotalUsd: session.amount_total ? session.amount_total / 100 : formatObj.priceUsd,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || '',
      design: {
        productSlug,
        productTitle: product?.title || 'Evermark Custom Archival Print',
        mode: product?.mode || 'starmap',
        plateNumber: product?.plateNumber || 'PLATE NO. 01',
        headline: meta.headline || product?.defaultHeadline || 'THE NIGHT OUR STORY BEGAN',
        subline: meta.subline || product?.defaultSubline || '',
        locationText: meta.locationText || product?.defaultLocation || '',
        dateText: meta.dateText || product?.defaultDateText || '',
        coordsText: meta.coordsText || product?.defaultCoords || '',
        colorwayId: meta.colorwayId || product?.defaultColorway || 'midnight_gold',
        frameFinishId: meta.frameFinishId || product?.defaultFrame || 'walnut',
        formatId: meta.formatId || 'framed-16x20',
        formatLabel: `${formatObj.label} (${frameObj.label})`,
        includedDigitalBump: meta.includedDigitalBump === 'yes',
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
