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
  const plateNumber = product?.plateNumber || 'PLATE NO. 01'
  const mode = product?.mode || 'starmap'

  const W = 2400
  const H = 3000
  const cx = W / 2
  const cy = 1170
  const R = 760
  const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

  let artworkSvg = ''

  if (mode === 'starmap') {
    const stars: string[] = []
    for (let s = 0; s < 190; s++) {
      const sSeed = hashSeed(`${seed}-star-${s}`)
      const rNorm = Math.sqrt((sSeed % 1000) / 1000) * (R - 55)
      const theta = ((sSeed >> 4) % 3600) * (Math.PI / 1800)
      const sx = (cx + Math.cos(theta) * rNorm).toFixed(1)
      const sy = (cy + Math.sin(theta) * rNorm).toFixed(1)
      const mag = s % 15 === 0 ? 7.5 : s % 5 === 0 ? 4.8 : 2.8
      const op = s % 15 === 0 ? 0.96 : 0.65
      stars.push(`<circle cx="${sx}" cy="${sy}" r="${mag}" fill="${colorway.inkHex}" fill-opacity="${op}" />`)
    }
    artworkSvg = `
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${colorway.accentHex}" stroke-width="5.5" />
      <circle cx="${cx}" cy="${cy}" r="${R - 36}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.55" />
      <circle cx="${cx}" cy="${cy}" r="${(R * 0.68).toFixed(1)}" fill="none" stroke="${colorway.accentHex}" stroke-width="2" stroke-opacity="0.24" />
      ${stars.join('\n')}
    `
  } else if (mode === 'soundwave') {
    const bars = 96
    const waveW = 1680
    const startX = (W - waveW) / 2
    const stepX = waveW / bars
    const lines: string[] = []
    for (let i = 0; i <= bars; i++) {
      const bSeed = hashSeed(`${seed}-bar-${i}`)
      const env = Math.sin((i / bars) * Math.PI)
      const mod = 0.35 + 0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) + 0.2 * ((bSeed % 100) / 100)
      const amp = Math.max(20, env * mod * 580)
      const x = (startX + i * stepX).toFixed(1)
      const col = i % 4 === 0 ? colorway.accentHex : colorway.inkHex
      lines.push(`<line x1="${x}" y1="${(cy - amp).toFixed(1)}" x2="${x}" y2="${(cy + amp).toFixed(1)}" stroke="${col}" stroke-width="7.5" stroke-linecap="round" />`)
    }
    artworkSvg = `
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${colorway.accentHex}" stroke-width="3" stroke-opacity="0.28" />
      ${lines.join('\n')}
    `
  } else {
    const rings: string[] = []
    for (let ring = 1; ring <= 7; ring++) {
      const rx = ((R / 7) * ring).toFixed(1)
      const ry = ((R / 7) * ring * 0.84).toFixed(1)
      rings.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${colorway.accentHex}" stroke-width="${ring === 7 ? 5 : 2.5}" stroke-opacity="${ring === 7 ? 0.85 : 0.32}" />`)
    }
    artworkSvg = rings.join('\n')
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${colorway.bgHex}" />
  <rect x="130" y="130" width="${W - 260}" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="5" stroke-opacity="0.55" />
  <rect x="160" y="160" width="${W - 320}" height="${H - 320}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.22" />
  <text x="210" y="230" fill="${colorway.mutedHex}" font-family="monospace" font-size="30" opacity="0.75">${escapeXml(plateNumber)}</text>
  <text x="${W - 210}" y="230" text-anchor="end" fill="${colorway.mutedHex}" font-family="monospace" font-size="30" opacity="0.75">ARCHIVE EDITION · 300 DPI</text>
  ${artworkSvg}
  <line x1="${cx - 325}" y1="2125" x2="${cx + 325}" y2="2125" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.65" />
  <text x="${cx}" y="2270" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="80">${escapeXml(headline)}</text>
  <text x="${cx}" y="2385" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-style="italic" font-size="52" opacity="0.85">${escapeXml(subline)}</text>
  <text x="${cx}" y="2540" text-anchor="middle" fill="${colorway.accentHex}" font-family="sans-serif" font-weight="bold" font-size="42">${escapeXml(locationText)}   ·   ${escapeXml(dateText)}</text>
  <text x="${cx}" y="2635" text-anchor="middle" fill="${colorway.mutedHex}" font-family="monospace" font-size="37" opacity="0.9">${escapeXml(coordsText)}</text>
  <text x="${cx}" y="2795" text-anchor="middle" fill="${colorway.mutedHex}" font-family="monospace" font-size="27" opacity="0.48">EVERMARK ARCHIVAL PRESS  ·  310GSM MUSEUM COTTON RAG</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
