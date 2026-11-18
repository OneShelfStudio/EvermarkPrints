import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getEvermarkProductBySlug, FRAME_FINISHES, EVERMARK_CATALOG } from '@/lib/catalog'
import { processCompletedEvermarkOrder } from '@/lib/printify'
import { resolveSanityProjectId } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid session_id is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Fail-safe: guarantee order dossier + Printify dispatch even if webhook is delayed
    if (session.payment_status === 'paid') {
      const sanityProjectId = resolveSanityProjectId()
      const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
      const sanityToken = process.env.SANITY_API_TOKEN
      let existsInSanity = false
      if (sanityProjectId) {
        try {
          const docId = `evermark_order_${session.id.replace(/[^a-zA-Z0-9_-]/g, '')}`
          const q = encodeURIComponent(`*[_id == "${docId}"][0]._id`)
          const headers: Record<string, string> = {}
          if (sanityToken) headers.Authorization = `Bearer ${sanityToken}`
          const checkRes = await fetch(
            `https://${sanityProjectId}.api.sanity.io/v2024-01-01/data/query/${sanityDataset}?query=${q}`,
            { headers, cache: 'no-store' }
          )
          if (checkRes.ok) {
            const checkData = await checkRes.json()
            existsInSanity = Boolean(checkData?.result)
          }
        } catch {
          // Proceed with failsafe processing on query error
        }
      }
      if (!existsInSanity) {
        try {
          await processCompletedEvermarkOrder(session)
        } catch {
          // Non-blocking fallback
        }
      }
    }

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
