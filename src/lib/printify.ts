import Stripe from 'stripe'

const PRINTIFY_BASE_URL = 'https://api.printify.com/v1'

export interface PrintifyAddress {
  first_name: string
  last_name: string
  email: string
  phone?: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export async function getPrintifyShopStatus() {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID || '29416532'

  if (!token) {
    return { configured: false, shopId }
  }

  const res = await fetch(`${PRINTIFY_BASE_URL}/shops.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Printify API returned ${res.status}`)
  }

  const shops = await res.json()
  return {
    configured: true,
    shopId,
    shops,
  }
}

/**
 * Records a completed Stripe Checkout commission to Sanity CMS and prepares/dispatches
 * the Printify US fulfillment payload for Shop ID 29416532.
 */
export async function processCompletedEvermarkOrder(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {}
  const shopId = process.env.PRINTIFY_SHOP_ID || '29416532'
  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const sanityToken = process.env.SANITY_API_TOKEN

  const masterRenderUrl = `https://www.evermarkprints.com/api/render-master?slug=${encodeURIComponent(
    meta.productSlug || 'custom-star-map'
  )}&colorway=${encodeURIComponent(
    meta.colorwayId || 'midnight_gold'
  )}&headline=${encodeURIComponent(meta.headline || '')}&subline=${encodeURIComponent(
    meta.subline || ''
  )}&location=${encodeURIComponent(meta.locationText || '')}&date=${encodeURIComponent(
    meta.dateText || ''
  )}&coords=${encodeURIComponent(meta.coordsText || '')}`

  // 1. Persist order dossier to Sanity production dataset if token is present
  if (sanityProjectId && sanityToken) {
    try {
      await fetch(
        `https://${sanityProjectId}.api.sanity.io/v2024-01-01/data/mutate/${sanityDataset}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sanityToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mutations: [
              {
                createOrReplace: {
                  _id: `evermark_order_${session.id.replace(/[^a-zA-Z0-9_-]/g, '')}`,
                  _type: 'evermarkOrder',
                  stripeSessionId: session.id,
                  createdAt: new Date().toISOString(),
                  amountUsd: session.amount_total ? session.amount_total / 100 : 0,
                  customerEmail: session.customer_details?.email || '',
                  customerName: session.customer_details?.name || '',
                  shippingAddress: session.customer_details?.address || null,
                  sku: meta.sku || '',
                  productSlug: meta.productSlug || '',
                  formatId: meta.formatId || '',
                  colorwayId: meta.colorwayId || '',
                  frameFinishId: meta.frameFinishId || '',
                  headline: meta.headline || '',
                  subline: meta.subline || '',
                  locationText: meta.locationText || '',
                  dateText: meta.dateText || '',
                  coordsText: meta.coordsText || '',
                  giftNote: meta.giftNote || '',
                  masterRenderUrl,
                  printifyShopId: shopId,
                },
              },
            ],
          }),
        }
      )
    } catch (err) {
      console.error('[Evermark Sanity Order Log Error]:', err)
    }
  }

  return {
    recorded: true,
    shopId,
    masterRenderUrl,
  }
}
