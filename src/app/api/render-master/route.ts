import { NextResponse } from 'next/server'
import { COLORWAYS, getEvermarkProductBySlug } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || 'custom-star-map'
  const product = getEvermarkProductBySlug(slug)

  const colorwayId = searchParams.get('colorway') || product?.defaultColorway || 'midnight_gold'
  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]

  const headline = (searchParams.get('headline') || product?.defaultHeadline || 'THE NIGHT OUR STORY BEGAN').toUpperCase().slice(0, 44)
  const subline = (searchParams.get('subline') || product?.defaultSubline || '').slice(0, 72)
  const locationText = (searchParams.get('location') || product?.defaultLocation || '').toUpperCase().slice(0, 42)
  const dateText = (searchParams.get('date') || product?.defaultDateText || '').toUpperCase().slice(0, 38)
  const coordsText = (searchParams.get('coords') || product?.defaultCoords || '').slice(0, 46)
  const mode = product?.mode || 'starmap'

  const W = 2400
  const H = 3000
  const cx = W / 2
  const cy = 1145
  const R = 760
  const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

  const baseUrl = 'https://www.evermarkprints.com'
  const plateUrl = product?.artworkPlate
    ? `${baseUrl}${product.artworkPlate}`
    : `${baseUrl}/art-plates/celestial-nebula.webp`

  let artworkSvg = ''

  if (mode === 'soundwave') {
    const bars = 88
    const waveW = 1480
    const startX = (W - waveW) / 2
    const stepX = waveW / bars
    const lines: string[] = []
    for (let i = 0; i <= bars; i++) {
      const bSeed = hashSeed(`${seed}-bar-${i}`)
      const env = Math.sin((i / bars) * Math.PI)
      const mod =
        0.35 +
        0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
        0.2 * ((bSeed % 100) / 100)
      const amp = Math.max(12, env * mod * 95)
      const x = (startX + i * stepX).toFixed(1)
      const col = i % 3 === 0 ? colorway.accentHex : colorway.inkHex
      lines.push(
        `<line x1="${x}" y1="${(1960 - amp).toFixed(1)}" x2="${x}" y2="${(1960 + amp).toFixed(
          1
        )}" stroke="${col}" stroke-width="6.5" stroke-linecap="round" />`
      )
    }
    artworkSvg = `
      <image href="${escapeXml(plateUrl)}" x="180" y="180" width="${W - 360}" height="1680" preserveAspectRatio="xMidYMid slice" />
      ${lines.join('\n')}
    `
  } else {
    artworkSvg = `
      <image href="${escapeXml(plateUrl)}" x="180" y="180" width="${W - 360}" height="1840" preserveAspectRatio="xMidYMid slice" />
    `
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${colorway.bgHex}" />
  <rect x="130" y="130" width="${W - 260}" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="5" stroke-opacity="0.55" />
  <rect x="160" y="160" width="${W - 320}" height="${H - 320}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.22" />
  ${artworkSvg}
  <line x1="${cx - 325}" y1="2125" x2="${cx + 325}" y2="2125" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.65" />
  <text x="${cx}" y="2270" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="80">${escapeXml(headline)}</text>
  <text x="${cx}" y="2385" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-style="italic" font-size="52" opacity="0.88">${escapeXml(subline)}</text>
  <text x="${cx}" y="2540" text-anchor="middle" fill="${colorway.accentHex}" font-family="sans-serif" font-weight="bold" font-size="42">${escapeXml(locationText)}   ·   ${escapeXml(dateText)}</text>
  <text x="${cx}" y="2635" text-anchor="middle" fill="${colorway.mutedHex}" font-family="monospace" font-size="37" opacity="0.9">${escapeXml(coordsText)}</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
