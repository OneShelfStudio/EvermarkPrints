import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getEvermarkProductBySlug, FORMAT_TIERS, FRAME_FINISHES } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

export interface TrackedOrderRecord {
  orderId: string
  createdAtIso: string
  minutesSinceOrder: number
  canEditInscription: boolean
  amountUsd: number
  customerEmail: string
  customerName: string
  productSlug: string
  productTitle: string
  formatId: string
  formatLabel: string
  isPhysical: boolean
  includedDigitalBump: boolean
  colorwayId: string
  frameFinishId: string
  headline: string
  subline: string
  locationText: string
  dateText: string
  coordsText: string
  giftNote: string
  stageIndex: number // 1 = Verified, 2 = 2-Hour Proof Window, 3 = In US Framing Workshop, 4 = Shipped
  stageLabel: string
  trackingCarrier?: string
  trackingNumber?: string
  trackingUrl?: string
  masterRenderUrl: string
}

async function fetchSanityShipmentInfo(orderId: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  if (!projectId) return null

  try {
    const docId = `evermark_order_${orderId.replace(/[^a-zA-Z0-9_-]/g, '')}`
    const query = `*[_id == "${docId}"][0]`
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(
        query
      )}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.result || null
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = (searchParams.get('q') || '').trim()

    if (!query) {
      return NextResponse.json(
        { error: 'Please enter your order email address or Order ID (cs_...).' },
        { status: 400 }
      )
    }

    const matchedSessions = []

    if (query.startsWith('cs_')) {
      try {
        const s = await stripe.checkout.sessions.retrieve(query)
        if (s && s.payment_status === 'paid') {
          matchedSessions.push(s)
        }
      } catch {
        // Not found by direct ID
      }
    } else if (query.includes('@')) {
      const list = await stripe.checkout.sessions.list({ limit: 40 })
      const lowerEmail = query.toLowerCase()
      for (const s of list.data) {
        if (
          s.payment_status === 'paid' &&
          s.customer_details?.email?.toLowerCase() === lowerEmail
        ) {
          matchedSessions.push(s)
        }
      }
    }

    const orders: TrackedOrderRecord[] = []

    for (const s of matchedSessions) {
      const sanityDoc = await fetchSanityShipmentInfo(s.id)
      const meta = s.metadata || {}
      const productSlug = sanityDoc?.productSlug || meta.productSlug || 'custom-star-map'
      const product = getEvermarkProductBySlug(productSlug)
      const formatId = sanityDoc?.formatId || meta.formatId || 'framed-16x20'
      const formatObj = FORMAT_TIERS.find((f) => f.id === formatId) || FORMAT_TIERS[0]
      const frameFinishId = sanityDoc?.frameFinishId || meta.frameFinishId || 'walnut'
      const frameObj = FRAME_FINISHES.find((f) => f.id === frameFinishId) || FRAME_FINISHES[0]

      const headline = sanityDoc?.headline || meta.headline || product?.defaultHeadline || ''
      const subline = sanityDoc?.subline || meta.subline || product?.defaultSubline || ''
      const locationText =
        sanityDoc?.locationText || meta.locationText || product?.defaultLocation || ''
      const dateText = sanityDoc?.dateText || meta.dateText || product?.defaultDateText || ''
      const coordsText = sanityDoc?.coordsText || meta.coordsText || product?.defaultCoords || ''
      const colorwayId =
        sanityDoc?.colorwayId || meta.colorwayId || product?.defaultColorway || 'midnight_gold'

      const createdMs = s.created * 1000
      const minutesSinceOrder = Math.max(0, Math.floor((Date.now() - createdMs) / 60000))
      const canEditInscription = minutesSinceOrder <= 120 && !sanityDoc?.trackingNumber

      let stageIndex = 2
      let stageLabel = 'In 2-Hour Proof & Inscription Review Window'
      if (sanityDoc?.trackingNumber) {
        stageIndex = 4
        stageLabel = `Dispatched via ${sanityDoc.trackingCarrier || 'USPS/UPS'}`
      } else if (!formatObj.isPhysical) {
        stageIndex = 4
        stageLabel = 'Instant Digital Master Ready for Download'
      } else if (minutesSinceOrder > 120) {
        stageIndex = 3
        stageLabel = 'In Archival Production & Hardwood Framing (US Studio)'
      }

      const masterRenderUrl = `/api/render-master?slug=${encodeURIComponent(
        productSlug
      )}&colorway=${encodeURIComponent(colorwayId)}&headline=${encodeURIComponent(
        headline
      )}&subline=${encodeURIComponent(subline)}&location=${encodeURIComponent(
        locationText
      )}&date=${encodeURIComponent(dateText)}&coords=${encodeURIComponent(coordsText)}`

      orders.push({
        orderId: s.id,
        createdAtIso: new Date(createdMs).toISOString(),
        minutesSinceOrder,
        canEditInscription,
        amountUsd: s.amount_total ? s.amount_total / 100 : formatObj.priceUsd,
        customerEmail: s.customer_details?.email || '',
        customerName: s.customer_details?.name || '',
        productSlug,
        productTitle: product?.title || 'Evermark Custom Print',
        formatId,
        formatLabel: formatObj.isPhysical
          ? `${formatObj.label} (${frameObj.label})`
          : formatObj.label,
        isPhysical: formatObj.isPhysical,
        includedDigitalBump: meta.includedDigitalBump === 'yes',
        colorwayId,
        frameFinishId,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: sanityDoc?.giftNote || meta.giftNote || '',
        stageIndex,
        stageLabel,
        trackingCarrier: sanityDoc?.trackingCarrier || undefined,
        trackingNumber: sanityDoc?.trackingNumber || undefined,
        trackingUrl: sanityDoc?.trackingUrl || undefined,
        masterRenderUrl,
      })
    }

    return NextResponse.json({ orders })
  } catch (err: unknown) {
    console.error('[Evermark Order Lookup Error]:', err)
    return NextResponse.json(
      { error: 'Unable to look up orders right now.' },
      { status: 500 }
    )
  }
}

/**
 * Self-Service 2-Hour Inscription Modification Endpoint
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, headline, subline, locationText, dateText, coordsText } = body

    if (!orderId || !orderId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid Order ID required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(orderId)
    const minutesSince = Math.floor((Date.now() - session.created * 1000) / 60000)

    if (minutesSince > 130) {
      return NextResponse.json(
        {
          error:
            'The 2-hour modification window has elapsed and your print is already queued in our framing studio.',
        },
        { status: 400 }
      )
    }

    const updatedMeta = {
      ...(session.metadata || {}),
      headline: String(headline || '').slice(0, 120),
      subline: String(subline || '').slice(0, 180),
      locationText: String(locationText || '').slice(0, 120),
      dateText: String(dateText || '').slice(0, 120),
      coordsText: String(coordsText || '').slice(0, 120),
    }

    await stripe.checkout.sessions.update(orderId, {
      metadata: updatedMeta,
    })

    // Also update Sanity record if configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN

    if (projectId && token) {
      const docId = `evermark_order_${orderId.replace(/[^a-zA-Z0-9_-]/g, '')}`
      await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: docId,
                set: {
                  headline: updatedMeta.headline,
                  subline: updatedMeta.subline,
                  locationText: updatedMeta.locationText,
                  dateText: updatedMeta.dateText,
                  coordsText: updatedMeta.coordsText,
                },
              },
            },
          ],
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ updated: true })
  } catch (err: unknown) {
    console.error('[Evermark Inscription Edit Error]:', err)
    return NextResponse.json(
      { error: 'Unable to update inscription. Please email ryanb@digital-dads-llc.com.' },
      { status: 500 }
    )
  }
}
