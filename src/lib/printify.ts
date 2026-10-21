import Stripe from 'stripe'
import { getEvermarkProductBySlug, EVERMARK_CATALOG } from '@/lib/catalog'

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
 * Records a completed Stripe Checkout commission to Sanity CMS and dispatches
 * the Printify US fulfillment order for Shop ID 29416532.
 */
export async function processCompletedEvermarkOrder(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {}
  const shopId = process.env.PRINTIFY_SHOP_ID || '29416532'
  const printifyToken = process.env.PRINTIFY_API_TOKEN
  const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const sanityToken = process.env.SANITY_API_TOKEN

  const product =
    getEvermarkProductBySlug(meta.productSlug || 'custom-star-map') || EVERMARK_CATALOG[0]
  const variantIdNum =
    Number(meta.printifyVariantId) || product.variants[0].printifyVariantId

  const masterRenderUrl = `https://www.evermarkprints.com/api/render-master?slug=${encodeURIComponent(
    product.slug
  )}&colorway=${encodeURIComponent(
    meta.colorwayId || product.defaultColorway
  )}&headline=${encodeURIComponent(meta.headline || '')}&subline=${encodeURIComponent(
    meta.subline || ''
  )}&location=${encodeURIComponent(meta.locationText || '')}&date=${encodeURIComponent(
    meta.dateText || ''
  )}&coords=${encodeURIComponent(meta.coordsText || '')}`

  let printifyOrderId: string | null = null

  // 1. Submit fulfillment order to Printify Shop 29416532 when API token and shipping address exist
  const legacyShipping = (
    session as unknown as {
      shipping_details?: {
        name?: string | null
        address?: Stripe.Address | null
      } | null
    }
  ).shipping_details
  const shippingDetails = legacyShipping || session.customer_details
  const addr = shippingDetails?.address
  if (printifyToken && addr?.line1 && addr?.city && addr?.postal_code) {
    try {
      const fullName = (shippingDetails?.name || session.customer_details?.name || 'Evermark Collector').trim()
      const parts = fullName.split(/\s+/)
      const firstName = parts[0] || 'Evermark'
      const lastName = parts.slice(1).join(' ') || 'Collector'

      const orderPayload = {
        external_id: session.id.slice(0, 48),
        label: `${product.sku} - ${meta.headline || product.shortTitle}`.slice(0, 48),
        line_items: [
          {
            product_id: meta.printifyProductId || product.printifyProductId,
            variant_id: variantIdNum,
            quantity: 1,
          },
        ],
        shipping_method: 1,
        is_printify_express: false,
        send_shipping_notification: false,
        address_to: {
          first_name: firstName,
          last_name: lastName,
          email: session.customer_details?.email || 'orders@evermarkprints.com',
          phone: session.customer_details?.phone || '0000000000',
          country: addr.country || 'US',
          region: addr.state || '',
          address1: addr.line1,
          address2: addr.line2 || '',
          city: addr.city,
          zip: addr.postal_code,
        },
      }

      const pRes = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${printifyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (pRes.ok) {
        const pData = await pRes.json()
        printifyOrderId = pData?.id || null
      } else {
        const errTxt = await pRes.text()
        console.warn('[Evermark Printify Order Submit Warning]:', pRes.status, errTxt)
      }
    } catch (err) {
      console.error('[Evermark Printify Order Dispatch Error]:', err)
    }
  }

  // 2. Persist order dossier to Sanity production dataset if token is present
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
                  parentOrderSessionId: meta.parentOrderSessionId || null,
                  printifyOrderId,
                  createdAt: new Date().toISOString(),
                  amountUsd: session.amount_total ? session.amount_total / 100 : 0,
                  customerEmail: session.customer_details?.email || '',
                  customerName: session.customer_details?.name || '',
                  shippingAddress: addr || null,
                  sku: meta.sku || product.sku,
                  productSlug: product.slug,
                  formatId: meta.formatId || product.variants[0].id,
                  colorwayId: meta.colorwayId || product.defaultColorway,
                  frameFinishId: meta.frameFinishId || product.defaultFrame,
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
    printifyOrderId,
    masterRenderUrl,
  }
}
