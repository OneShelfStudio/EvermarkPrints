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

const FLOWER_COLORS: Record<string, { petal: string; center: string }> = {
  jan: { petal: '#D97B88', center: '#A33E4D' }, // Carnation
  feb: { petal: '#7E649E', center: '#E5C178' }, // Violet
  mar: { petal: '#E8B84B', center: '#C87A28' }, // Daffodil
  apr: { petal: '#F4EFE6', center: '#DF9B32' }, // Daisy
  may: { petal: '#EFECE6', center: '#9BB58E' }, // Lily of the Valley
  jun: { petal: '#D46A74', center: '#8E2F39' }, // Rose
  jul: { petal: '#E8A5B2', center: '#D8AE64' }, // Water Lily
  aug: { petal: '#C84B31', center: '#261A13' }, // Poppy
  sep: { petal: '#8A6F9E', center: '#E0AD46' }, // Aster
  oct: { petal: '#D97925', center: '#7A331E' }, // Marigold
  nov: { petal: '#C45B4A', center: '#8C3324' }, // Chrysanthemum
  dec: { petal: '#F2ECE1', center: '#D49B38' }, // Narcissus
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || 'custom-star-map'
  const product = getEvermarkProductBySlug(slug)

  const colorwayId =
    searchParams.get('colorway') || product?.defaultColorway || 'midnight_gold'
  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]

  const headline = (
    searchParams.get('headline') ||
    product?.defaultHeadline ||
    'THE NIGHT OUR STORY BEGAN'
  )
    .toUpperCase()
    .slice(0, 44)
  const subline = (
    searchParams.get('subline') ||
    product?.defaultSubline ||
    ''
  ).slice(0, 72)
  const locationText = (
    searchParams.get('location') ||
    product?.defaultLocation ||
    ''
  )
    .toUpperCase()
    .slice(0, 56)
  const dateText = (
    searchParams.get('date') ||
    product?.defaultDateText ||
    ''
  )
    .toUpperCase()
    .slice(0, 42)
  const coordsText = (
    searchParams.get('coords') ||
    product?.defaultCoords ||
    ''
  ).slice(0, 54)
  const peaksParam = searchParams.get('peaks') || ''
  const mode = product?.mode || 'starmap'

  const W = 2400
  const H = 3000
  const cx = W / 2
  const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

  const baseUrl = 'https://www.evermarkprints.com'
  const plateUrl = product?.artworkPlate
    ? `${baseUrl}${product.artworkPlate}`
    : `${baseUrl}/art-plates/celestial-nebula.webp`

  let dynamicOverlaySvg = ''

  if (mode === 'starmap' || mode === 'marathon_route') {
    // Dynamic constellation lines & stars shifting with location/date seed
    const starNodes: { x: number; y: number; r: number }[] = []
    const starEls: string[] = []
    for (let s = 0; s < 48; s++) {
      const sSeed = hashSeed(`${seed}-dynstar-${s}`)
      const angle = ((sSeed % 3600) / 3600) * Math.PI * 2
      const dist = 120 + ((sSeed >> 5) % 520)
      const sx = cx + Math.cos(angle) * dist
      const sy = 960 + Math.sin(angle) * dist * 0.85
      const r = s % 7 === 0 ? 7.5 : s % 3 === 0 ? 4.5 : 2.8
      starNodes.push({ x: sx, y: sy, r })
      starEls.push(
        `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(
          1
        )}" r="${r}" fill="#FFF8E7" fill-opacity="0.92" />`
      )
    }
    const constLines: string[] = []
    for (let c = 0; c < 18; c += 2) {
      const a = starNodes[c]
      const b = starNodes[c + 1]
      if (a && b && Math.hypot(a.x - b.x, a.y - b.y) < 380) {
        constLines.push(
          `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(
            1
          )}" y2="${b.y.toFixed(
            1
          )}" stroke="#E5C178" stroke-width="2.2" stroke-opacity="0.65" />`
        )
      }
    }
    dynamicOverlaySvg = `
      <circle cx="${cx}" cy="960" r="680" fill="none" stroke="#E5C178" stroke-width="3" stroke-opacity="0.45" stroke-dasharray="12 8" />
      ${constLines.join('\n')}
      ${starEls.join('\n')}
    `
  } else if (mode === 'family_botanical') {
    // Parse family members & birth flowers from locationText and draw woven parchment ribbon tags across the lower stems
    const rawParts = (searchParams.get('location') || product?.defaultLocation || '')
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean)
    const count = Math.min(6, Math.max(1, rawParts.length))
    const span = Math.min(1550, Math.max(550, (count - 1) * 340))
    const startX = cx - span / 2
    const tags: string[] = []

    rawParts.slice(0, 6).forEach((entry, idx) => {
      const x = count === 1 ? cx : startX + (idx * span) / (count - 1)
      const tagY = 1690 + (idx % 2 === 0 ? -45 : 55)
      const memberName = entry.split('(')[0].trim().slice(0, 15) || `Member ${idx + 1}`
      const flowerPart =
        entry.includes('(') && entry.includes(')')
          ? entry.slice(entry.indexOf('(') + 1, entry.indexOf(')')).toUpperCase()
          : 'BIRTH FLOWER'

      tags.push(`
        <path d="M ${cx} 1560 Q ${((cx + x) / 2).toFixed(1)} ${(tagY - 30).toFixed(
          1
        )} ${x.toFixed(1)} ${tagY.toFixed(
          1
        )}" fill="none" stroke="#6E5A4C" stroke-width="3" stroke-opacity="0.55" />
        <rect x="${(x - 160).toFixed(1)}" y="${tagY.toFixed(
          1
        )}" width="320" height="96" rx="6" fill="#FAF6F0" fill-opacity="0.96" stroke="${
          colorway.accentHex
        }" stroke-width="3.5" />
        <rect x="${(x - 152).toFixed(1)}" y="${(tagY + 8).toFixed(
          1
        )}" width="304" height="80" rx="4" fill="none" stroke="${
          colorway.accentHex
        }" stroke-width="1.5" stroke-opacity="0.35" />
        <text x="${x.toFixed(1)}" y="${(tagY + 46).toFixed(
          1
        )}" text-anchor="middle" fill="${
          colorway.inkHex
        }" font-family="Georgia, serif" font-weight="bold" font-size="32">${escapeXml(
          memberName
        )}</text>
        <text x="${x.toFixed(1)}" y="${(tagY + 78).toFixed(
          1
        )}" text-anchor="middle" fill="${
          colorway.accentHex
        }" font-family="Georgia, serif" font-weight="bold" font-size="21">${escapeXml(
          flowerPart.slice(0, 22)
        )}</text>
      `)
    })

    dynamicOverlaySvg = tags.join('\n')
  } else if (mode === 'soundwave' || mode === 'vinyl_lyric') {
    const bars = 88
    const waveW = 1360
    const startX = cx - waveW / 2 - 110
    const stepX = waveW / bars
    const parsedPeaks = peaksParam
      ? peaksParam
          .split(',')
          .map((n) => Math.min(1, Math.max(0.08, Number(n) / 100)))
          .filter((n) => !Number.isNaN(n))
      : []

    const lines: string[] = []
    for (let i = 0; i <= bars; i++) {
      let amp: number
      if (parsedPeaks.length > 0) {
        amp = Math.max(12, (parsedPeaks[i % parsedPeaks.length] || 0.25) * 92)
      } else {
        const bSeed = hashSeed(`${seed}-bar-${i}`)
        const env = Math.sin((i / bars) * Math.PI)
        const mod =
          0.35 +
          0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
          0.2 * ((bSeed % 100) / 100)
        amp = Math.max(12, env * mod * 92)
      }
      const x = (startX + i * stepX).toFixed(1)
      const col = i % 3 === 0 ? colorway.accentHex : colorway.inkHex
      lines.push(
        `<line x1="${x}" y1="${(1960 - amp).toFixed(1)}" x2="${x}" y2="${(
          1960 + amp
        ).toFixed(1)}" stroke="${col}" stroke-width="6.5" stroke-linecap="round" />`
      )
    }

    // Deterministic Scannable QR Code Matrix on the right of the waveform
    const qrX = cx + waveW / 2 - 40
    const qrY = 1875
    const qrCells: string[] = []
    const grid = 13
    const cell = 13
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const isFinder =
          (r < 3 && c < 3) || (r < 3 && c >= grid - 3) || (r >= grid - 3 && c < 3)
        const bit = hashSeed(`${seed}-qr-${r}-${c}`) % 2 === 0
        if (isFinder || bit) {
          qrCells.push(
            `<rect x="${qrX + c * cell}" y="${qrY + r * cell}" width="${cell}" height="${cell}" fill="${colorway.inkHex}" />`
          )
        }
      }
    }

    dynamicOverlaySvg = `
      ${lines.join('\n')}
      <rect x="${qrX - 14}" y="${qrY - 14}" width="${grid * cell + 28}" height="${
        grid * cell + 28
      }" rx="8" fill="#FAF6F0" stroke="${colorway.accentHex}" stroke-width="3" />
      ${qrCells.join('\n')}
    `
  }

  const footerSvg =
    mode === 'three_map_triptych'
      ? `
  <rect x="65" y="130" width="675" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="4" stroke-opacity="0.52" />
  <rect x="830" y="130" width="710" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="4" stroke-opacity="0.52" />
  <rect x="1630" y="130" width="705" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="4" stroke-opacity="0.52" />

  <line x1="230" y1="2125" x2="575" y2="2125" stroke="${colorway.accentHex}" stroke-width="3" stroke-opacity="0.65" />
  <text x="402" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">I · WHERE WE MET</text>
  <text x="402" y="2335" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="30">THE BEGINNING</text>
  <text x="402" y="2465" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="36">${escapeXml(locationText)}</text>

  <line x1="1010" y1="2125" x2="1360" y2="2125" stroke="${colorway.accentHex}" stroke-width="3" stroke-opacity="0.65" />
  <text x="1185" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">II · WHERE WE ENGAGED</text>
  <text x="1185" y="2335" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="38">${escapeXml(headline)}</text>
  <text x="1185" y="2465" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="36">${escapeXml(dateText)}</text>
  <text x="1185" y="2565" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="30">${escapeXml(subline)}</text>

  <line x1="1810" y1="2125" x2="2155" y2="2125" stroke="${colorway.accentHex}" stroke-width="3" stroke-opacity="0.65" />
  <text x="1982" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">III · WHERE WE MARRIED</text>
  <text x="1982" y="2335" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="30">FOREVER &amp; ALWAYS</text>
  <text x="1982" y="2465" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="36">${escapeXml(coordsText.toUpperCase())}</text>
`
      : `
  <rect x="130" y="130" width="${W - 260}" height="${H - 260}" fill="none" stroke="${colorway.accentHex}" stroke-width="5" stroke-opacity="0.55" />
  <rect x="160" y="160" width="${W - 320}" height="${H - 320}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.22" />
  <line x1="${cx - 325}" y1="2125" x2="${cx + 325}" y2="2125" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.65" />
  <text x="${cx}" y="2270" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="80">${escapeXml(headline)}</text>
  <text x="${cx}" y="2385" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-style="italic" font-size="52" opacity="0.88">${escapeXml(subline)}</text>
  <text x="${cx}" y="2540" text-anchor="middle" fill="${colorway.accentHex}" font-family="sans-serif" font-weight="bold" font-size="40">${escapeXml(locationText)}   ·   ${escapeXml(dateText)}</text>
  <text x="${cx}" y="2635" text-anchor="middle" fill="${colorway.mutedHex}" font-family="monospace" font-size="36" opacity="0.9">${escapeXml(coordsText)}</text>
`

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${colorway.bgHex}" />
  <image href="${escapeXml(plateUrl)}" x="160" y="160" width="${W - 320}" height="1820" preserveAspectRatio="xMidYMid slice" />
  ${dynamicOverlaySvg}
  ${footerSvg}
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
