import { NextResponse } from 'next/server'
import { EVERMARK_CATALOG } from '@/lib/catalog'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const SEARCH_INTENT_TITLE_MAP: Record<string, string> = {
  'custom-star-map':
    'Custom Night Sky Star Map Framed Print - Personalized Anniversary, Wedding & Engagement Gift',
  'custom-soundwave-art':
    'Custom Voice & Song Soundwave Crystal Acrylic Block (Scannable QR) - Personalized Wedding & Anniversary Gift',
  'family-tree-botanical-print':
    'Custom Family Birth Month Flower Woven Cotton Throw Blanket - Personalized Gift for Mom, Nana & Grandma',
  'coastal-bathymetry-chart':
    'Custom Nautical Harbor & Bathymetry Chart on Chiseled Stone Slate - Personalized Lake, Boat & Beach House Gift',
  'met-engaged-married-triptych':
    'Custom Met Engaged Married 3-Panel Mountain Watercolor Canvas Triptych - Personalized Couple & Wedding Gift',
  'patent-architectural-triptych':
    'Custom Couple & Family Watercolor Portrait Framed Cotton Canvas - Personalized Wedding & Anniversary Gift',
  'custom-book-stack-print':
    'Custom Family Birth Flower Scented Amber Glass Soy Candle (9oz) - Personalized Mom, Housewarming & Hostess Gift',
  'custom-vinyl-song-portrait':
    'Custom First Dance Metallic Gold Vinyl Record Framed Canvas (Scannable QR) - Personalized Couple Anniversary Gift',
  'custom-pet-memorial':
    'Custom Watercolor Pet Portrait Natural Birch Wood Plaque - Personalized Dog & Cat Loss Memorial Gift',
  'custom-coordinates-print':
    'Custom First Home Watercolor Portrait on Chiseled Stone Slate - Personalized Housewarming & Closing Gift',
  'newborn-birth-stat-portrait':
    'Custom Newborn Baby Birth Stat Framed Cotton Canvas - Personalized Nursery Decor & New Baby Gift',
  'marathon-finisher-route-print':
    'Custom Celestial Star Map & Roman Numeral Date Crystal Acrylic Block - Personalized Nightstand Anniversary Gift',
}

export async function GET() {
  const baseUrl = 'https://www.evermarkprints.com'

  const itemsXml = EVERMARK_CATALOG.flatMap((product) =>
    product.variants.map((variant, idx) => {
      const itemId = idx === 0 ? product.sku : `${product.sku}-${variant.id.toUpperCase()}`
      const seoBaseTitle = SEARCH_INTENT_TITLE_MAP[product.slug] || product.title
      const fullTitle = escapeXml(`${seoBaseTitle} (${variant.label})`)
      const fullDesc = escapeXml(
        `${product.description} (${variant.subtitle}). Handcrafted to order in US studios with live interactive previewing, Instant Printable Gift Presentation Card, and complimentary 3 to 5 day tracked US shipping.`
      )
      const primaryImage = `${baseUrl}${product.previewImage}?v=2`
      const additionalImagesXml = [
        ...product.mockupGallery.slice(1, 4).map((img) => `${baseUrl}${img}?v=2`),
        `${baseUrl}/pins/${product.slug}-pin.webp?v=2`,
      ]
        .map((url) => `<g:additional_image_link>${url}</g:additional_image_link>`)
        .join('\n      ')

      const highlightsXml = (product.highlights || [])
        .slice(0, 4)
        .map((h) => `<g:product_highlight>${escapeXml(h)}</g:product_highlight>`)
        .join('\n      ')

      const regPrice =
        variant.compareAtUsd && variant.compareAtUsd > variant.priceUsd
          ? variant.compareAtUsd
          : variant.priceUsd
      const hasSale = regPrice > variant.priceUsd

      return `
    <item>
      <g:id>${escapeXml(itemId)}</g:id>
      <g:item_group_id>${escapeXml(product.sku)}</g:item_group_id>
      <g:title>${fullTitle}</g:title>
      <g:description>${fullDesc}</g:description>
      <g:link>${baseUrl}/create/${product.slug}</g:link>
      <g:image_link>${primaryImage}</g:image_link>
      ${additionalImagesXml}
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${regPrice}.00 USD</g:price>
      ${hasSale ? `<g:sale_price>${variant.priceUsd}.00 USD</g:sale_price>` : ''}
      <g:brand>Evermark Prints</g:brand>
      <g:mpn>${escapeXml(itemId)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${escapeXml(product.googleProductCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(product.productType)}</g:product_type>
      <g:custom_label_0>${escapeXml(product.physicalMedium)}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(product.categoryLabel)}</g:custom_label_1>
      <g:promotion_id>welcome15_evermark_2026</g:promotion_id>
      ${highlightsXml}
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Complimentary Tracked US Studio Delivery (3-5 Days)</g:service>
        <g:price>0.00 USD</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>2</g:min_transit_time>
        <g:max_transit_time>4</g:max_transit_time>
      </g:shipping>
    </item>`
    })
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Evermark Prints | Bespoke Framed Art, Woven Blankets, Stone Slates &amp; Custom Keepsakes</title>
    <link>${baseUrl}</link>
    <description>Handcrafted US custom keepsakes: astronomical night sky star maps, voice &amp; song acrylic blocks, jacquard woven cotton blankets, chiseled stone slates, 3-panel triptychs, and scented soy candles.</description>
    ${itemsXml}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  })
}
