import { NextResponse } from 'next/server'
import { resolveSanityProjectId } from '@/lib/sanity'
import { sendShipmentNotificationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * Receives live Printify order & shipment events (order:shipment:created, order:shipment:delivered)
 * for Shop ID 29416532 and records the USPS/UPS tracking number & URL into Sanity so customers
 * can view it on /track and in the 24/7 Studio Concierge Bot, and sends an automated branded dispatch email.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const eventType = payload?.type || ''
    const resource = payload?.resource || {}
    const data = resource?.data || {}

    const printifyOrderId = resource?.id || data?.order_id || payload?.order_id || ''
    const externalOrderId = data?.external_id || resource?.external_id || resource?.data?.shop_order_id || ''
    const carrier = data?.carrier?.code || data?.carrier || 'USPS'
    const trackingNumber = data?.number || data?.tracking_number || ''
    const trackingUrl =
      data?.url ||
      data?.tracking_url ||
      `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(trackingNumber)}`

    console.log(
      `[Evermark Printify Webhook] Event: ${eventType} | Printify ID: ${printifyOrderId} | External: ${externalOrderId} | Tracking: ${trackingNumber}`
    )

    const projectId = resolveSanityProjectId()
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN

    let matchedDoc: {
      _id: string
      stripeSessionId?: string
      customerEmail?: string
      customerName?: string
      productTitle?: string
      formatLabel?: string
    } | null = null

    if (projectId && token && (printifyOrderId || externalOrderId) && trackingNumber) {
      // 1. Locate the order document in Sanity by Printify Order ID, External Order ID, or direct session ID
      try {
        const query = `*[_type == "evermarkOrder" && (
          printifyOrderId == "${printifyOrderId}" || 
          stripeSessionId match "${externalOrderId}*" || 
          _id match "*${externalOrderId}*"
        )][0]`

        const searchRes = await fetch(
          `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (searchRes.ok) {
          const sJson = await searchRes.json()
          matchedDoc = sJson?.result || null
        }
      } catch (err) {
        console.warn('[Evermark Printify Webhook Lookup Warning]:', err)
      }

      const targetDocId = matchedDoc?._id || `evermark_order_${String(externalOrderId).replace(/[^a-zA-Z0-9_-]/g, '')}`

      // 2. Patch Sanity order record with carrier tracking
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
                id: targetDocId,
                set: {
                  trackingCarrier: String(carrier).toUpperCase(),
                  trackingNumber: String(trackingNumber),
                  trackingUrl: String(trackingUrl),
                  shippedAt: new Date().toISOString(),
                },
              },
            },
          ],
        }),
      }).catch(() => {})

      // 3. Dispatch branded Evermark shipment notification email
      const customerEmail = matchedDoc?.customerEmail || data?.address_to?.email || undefined
      if (customerEmail) {
        await sendShipmentNotificationEmail({
          orderId: matchedDoc?.stripeSessionId || externalOrderId || printifyOrderId,
          customerEmail,
          customerName: matchedDoc?.customerName || data?.address_to?.first_name || 'Collector',
          productTitle: matchedDoc?.productTitle || 'Custom Keepsake',
          formatLabel: matchedDoc?.formatLabel || 'Studio Edition',
          trackingCarrier: String(carrier).toUpperCase(),
          trackingNumber: String(trackingNumber),
          trackingUrl: String(trackingUrl),
        }).catch((err) => console.warn('[Shipment Email Non-Blocking Error]:', err))
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error('[Evermark Printify Webhook Error]:', err)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
