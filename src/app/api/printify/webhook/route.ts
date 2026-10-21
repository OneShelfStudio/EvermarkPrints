import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Receives live Printify order & shipment events (order:shipment:created, order:shipment:delivered)
 * for Shop ID 29416532 and records the USPS/UPS tracking number & URL into Sanity so customers
 * can view it on /track and in the 24/7 Studio Concierge Bot.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const eventType = payload?.type || ''
    const resource = payload?.resource || {}
    const data = resource?.data || {}

    const externalOrderId = data?.external_id || resource?.external_id || ''
    const carrier = data?.carrier?.code || data?.carrier || 'USPS/UPS'
    const trackingNumber = data?.number || data?.tracking_number || ''
    const trackingUrl = data?.url || data?.tracking_url || ''

    console.log(
      `[Evermark Printify Webhook] Event: ${eventType} | External Order: ${externalOrderId} | Tracking: ${trackingNumber}`
    )

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const token = process.env.SANITY_API_TOKEN

    if (projectId && token && externalOrderId && trackingNumber) {
      const docId = `evermark_order_${String(externalOrderId).replace(/[^a-zA-Z0-9_-]/g, '')}`
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
                  trackingCarrier: String(carrier),
                  trackingNumber: String(trackingNumber),
                  trackingUrl: String(trackingUrl),
                  shippedAt: new Date().toISOString(),
                },
              },
            },
          ],
        }),
      })
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    console.error('[Evermark Printify Webhook Error]:', err)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
