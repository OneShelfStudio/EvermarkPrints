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

export async function GET() {
  const baseUrl = 'https://www.evermarkprints.com'

  const itemsXml = EVERMARK_CATALOG.flatMap((product) =>
    product.variants.map((variant, idx) => {
      const itemId = idx === 0 ? product.sku : `${product.sku}-${variant.id.toUpperCase()}`
      const fullTitle = escapeXml(`${product.title} — ${variant.label}`)
      const fullDesc = escapeXml(`${product.description} (${variant.subtitle})`)
      const primaryImage = `${baseUrl}${product.previewImage}`
      const additionalImagesXml = product.mockupGallery
        .slice(1, 4)
        .map((img) => `<g:additional_image_link>${baseUrl}${img}</g:additional_image_link>`)
        .join('\n      ')

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
      <g:price>${variant.priceUsd}.00 USD</g:price>
      <g:brand>Evermark Prints</g:brand>
      <g:mpn>${escapeXml(itemId)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${escapeXml(product.googleProductCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(product.productType)}</g:product_type>
      <g:custom_label_0>${escapeXml(product.physicalMedium)}</g:custom_label_0>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Complimentary Tracked US Studio Delivery (3-5 Days)</g:service>
        <g:price>0.00 USD</g:price>
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
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
