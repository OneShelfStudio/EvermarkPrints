import { NextResponse } from 'next/server'
import { EVERMARK_CATALOG } from '@/lib/catalog'

export async function GET() {
  const baseUrl = 'https://evermarkprints.com'

  const itemsXml = EVERMARK_CATALOG.map((product) => {
    const escapedTitle = product.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
    const escapedDesc = product.description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

    return `
    <item>
      <g:id>${product.sku}</g:id>
      <g:title>${escapedTitle}</g:title>
      <g:description>${escapedDesc}</g:description>
      <g:link>${baseUrl}/create/${product.slug}</g:link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${product.popularPriceUsd}.00 USD</g:price>
      <g:brand>Evermark Prints</g:brand>
      <g:mpn>${product.sku}</g:mpn>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Free US Framed Shipping</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Evermark Prints | Custom Night Sky Star Maps &amp; Archival Art</title>
    <link>${baseUrl}</link>
    <description>Custom astronomical night sky star maps, voice &amp; song waveform prints, home coordinate charts, and pet tribute keepsakes.</description>
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
