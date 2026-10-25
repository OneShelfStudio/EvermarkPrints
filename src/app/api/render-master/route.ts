import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { COLORWAYS, getEvermarkProductBySlug } from '@/lib/catalog'
import { buildCompactListenQrUrl, buildScannableQrMatrix } from '@/lib/qrcode'

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

const plateDataUriCache = new Map<string, string>()

function loadPlateAsDataUri(relativePlatePath: string, fallbackOrigin: string): string {
  const cleanRel = relativePlatePath.startsWith('/')
    ? relativePlatePath.slice(1)
    : relativePlatePath
  const cached = plateDataUriCache.get(cleanRel)
  if (cached) return cached

  try {
    const absPath = path.join(process.cwd(), 'public', cleanRel)
    if (fs.existsSync(absPath)) {
      const buf = fs.readFileSync(absPath)
      const mime = cleanRel.endsWith('.png')
        ? 'image/png'
        : cleanRel.endsWith('.jpg') || cleanRel.endsWith('.jpeg')
        ? 'image/jpeg'
        : 'image/webp'
      const uri = `data:${mime};base64,${buf.toString('base64')}`
      plateDataUriCache.set(cleanRel, uri)
      return uri
    }
  } catch {
    // Fallback to absolute URL
  }
  return `${fallbackOrigin}/${cleanRel}`
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || 'custom-star-map'
  const product = getEvermarkProductBySlug(slug)

  const colorwayId =
    searchParams.get('colorway') || product?.defaultColorway || 'midnight_gold'
  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const isDarkPaper =
    colorway.id === 'bourbon_walnut' || colorway.id === 'obsidian_silver'
  const paperFill = isDarkPaper ? colorway.bgHex : '#FAF6F0'

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
  ).slice(0, 76)
  const rawLocation =
    searchParams.get('location') || product?.defaultLocation || ''
  const locationText = rawLocation.toUpperCase().slice(0, 68)
  const rawDate = searchParams.get('date') || product?.defaultDateText || ''
  const dateText = rawDate.toUpperCase().slice(0, 44)
  const coordsText = (
    searchParams.get('coords') ||
    product?.defaultCoords ||
    ''
  ).slice(0, 56)
  const peaksParam = searchParams.get('peaks') || ''
  const audioUrlParam = searchParams.get('audio') || ''
  const photoUrlParam = searchParams.get('photo') || ''
  const mode = product?.mode || 'starmap'

  const W = 2400
  const H = 3000
  const cx = W / 2
  const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

  const baseUrl = 'https://www.evermarkprints.com'
  const plateDataUri = loadPlateAsDataUri(
    product?.artworkPlate || '/art-plates/celestial-nebula.webp',
    baseUrl
  )

  // 1. Base Plate Presentation (Matching LivePrintCustomizer.tsx Dark vs Light Mat Handling)
  let basePlateSvg = ''
  if (
    photoUrlParam &&
    photoUrlParam.startsWith('http') &&
    mode !== 'vinyl_lyric' &&
    mode !== 'soundwave' &&
    mode !== 'starmap'
  ) {
    const wreathUri = loadPlateAsDataUri(
      '/art-plates/watercolor-portrait-backdrop.webp',
      baseUrl
    )
    basePlateSvg = `
      <defs>
        <clipPath id="portraitCircleClip">
          <circle cx="${cx}" cy="1060" r="560" />
        </clipPath>
      </defs>
      <image href="${escapeXml(wreathUri)}" x="90" y="50" width="${W - 180}" height="${
      H - 450
    }" preserveAspectRatio="xMidYMid slice" />
      <image href="${escapeXml(photoUrlParam)}" x="${cx - 560}" y="${
      1060 - 560
    }" width="1120" height="1120" preserveAspectRatio="xMidYMid slice" clip-path="url(#portraitCircleClip)" />
      <circle cx="${cx}" cy="1060" r="548" fill="none" stroke="${
      colorway.accentHex
    }" stroke-width="5" stroke-opacity="0.68" />
    `
  } else if (isDarkPaper && (mode === 'vinyl_lyric' || mode === 'soundwave')) {
    basePlateSvg = `
      <defs>
        <clipPath id="vinylDiscClip">
          <circle cx="${cx}" cy="1050" r="885" />
        </clipPath>
      </defs>
      <image href="${escapeXml(
        plateDataUri
      )}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#vinylDiscClip)" />
      <circle cx="${cx}" cy="1050" r="888" fill="none" stroke="${
      colorway.accentHex
    }" stroke-width="6" stroke-opacity="0.78" />
    `
  } else if (isDarkPaper) {
    basePlateSvg = `
      <defs>
        <clipPath id="darkPlateRect">
          <rect x="195" y="170" width="${W - 390}" height="1838" rx="20" />
        </clipPath>
      </defs>
      <image href="${escapeXml(plateDataUri)}" x="150" y="50" width="${
      W - 300
    }" height="${H - 150}" preserveAspectRatio="xMidYMid slice" clip-path="url(#darkPlateRect)" />
      <rect x="195" y="170" width="${W - 390}" height="1838" rx="20" fill="none" stroke="${
      colorway.accentHex
    }" stroke-width="5" />
    `
  } else {
    basePlateSvg = `
      <defs>
        <linearGradient id="matFadeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
      </defs>
      <image href="${escapeXml(
        plateDataUri
      )}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />
      <rect x="0" y="1900" width="${W}" height="240" fill="url(#matFadeGrad)" />
      <rect x="0" y="2100" width="${W}" height="${H - 2100}" fill="#FAF6F0" />
    `
  }

  let dynamicOverlaySvg = ''

  if (mode === 'starmap' || mode === 'marathon_route') {
    const starNodes: { x: number; y: number; r: number }[] = []
    const starEls: string[] = []
    for (let s = 0; s < 48; s++) {
      const sSeed = hashSeed(`${seed}-dynstar-${s}`)
      const angle = ((sSeed % 3600) / 3600) * Math.PI * 2
      const dist = 120 + ((sSeed >> 5) % 520)
      const sx = cx + Math.cos(angle) * dist
      const sy = 985 + Math.sin(angle) * dist * 0.85
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
          )}" stroke="#E5C178" stroke-width="2.4" stroke-opacity="0.65" />`
        )
      }
    }
    dynamicOverlaySvg = `
      <circle cx="${cx}" cy="985" r="665" fill="none" stroke="#E5C178" stroke-width="3.5" stroke-opacity="0.48" stroke-dasharray="12 10" />
      ${constLines.join('\n')}
      ${starEls.join('\n')}
    `
  } else if (mode === 'family_botanical') {
    const rawParts = rawLocation
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean)
    const count = Math.min(6, Math.max(1, rawParts.length))
    const span = Math.min(1550, Math.max(550, (count - 1) * 340))
    const startX = cx - span / 2
    const tags: string[] = []
    const tagBg = isDarkPaper ? '#261D17' : '#FAF6F0'

    rawParts.slice(0, 6).forEach((entry, idx) => {
      const x = count === 1 ? cx : startX + (idx * span) / (count - 1)
      const tagY = 1790 + (idx % 2 === 0 ? -32 : 40)
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
        <rect x="${(x - 165).toFixed(1)}" y="${tagY.toFixed(
          1
        )}" width="330" height="100" rx="6" fill="${tagBg}" fill-opacity="0.96" stroke="${
          colorway.accentHex
        }" stroke-width="3.5" />
        <rect x="${(x - 157).toFixed(1)}" y="${(tagY + 8).toFixed(
          1
        )}" width="314" height="84" rx="4" fill="none" stroke="${
          colorway.accentHex
        }" stroke-width="1.5" stroke-opacity="0.35" />
        <text x="${x.toFixed(1)}" y="${(tagY + 46).toFixed(
          1
        )}" text-anchor="middle" fill="${
          colorway.inkHex
        }" font-family="Georgia, serif" font-weight="bold" font-size="32">${escapeXml(
          memberName
        )}</text>
        <text x="${x.toFixed(1)}" y="${(tagY + 80).toFixed(
          1
        )}" text-anchor="middle" fill="${
          colorway.accentHex
        }" font-family="Georgia, serif" font-weight="bold" font-size="21">${escapeXml(
          flowerPart.slice(0, 22)
        )}</text>
      `)
    })

    dynamicOverlaySvg = tags.join('\n')
  } else if (mode === 'coastal_chart' || mode === 'patent_blueprint') {
    const pinOffsetX = ((seed % 140) - 70) * 2.0
    const pinOffsetY = (((seed >> 4) % 90) - 45) * 2.0
    const px = cx + pinOffsetX
    const py = 1075 + pinOffsetY
    dynamicOverlaySvg = `
      <line x1="225" y1="${py.toFixed(1)}" x2="${W - 225}" y2="${py.toFixed(
      1
    )}" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.42" stroke-dasharray="10 10" />
      <line x1="${px.toFixed(1)}" y1="275" x2="${px.toFixed(
      1
    )}" y2="1850" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.42" stroke-dasharray="10 10" />
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="40" fill="none" stroke="${
      colorway.accentHex
    }" stroke-width="5" stroke-opacity="0.85" />
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(
      1
    )}" r="16" fill="#9E472A" fill-opacity="0.96" />
    `
  }

  // Center Vinyl Label Foil Text OR Custom Uploaded Medallion Photo + Real Scannable QR Code
  if (mode === 'soundwave' || mode === 'vinyl_lyric') {
    let centerMedallionSvg = ''
    if (mode === 'vinyl_lyric') {
      if (photoUrlParam && photoUrlParam.startsWith('http')) {
        centerMedallionSvg = `
          <defs>
            <clipPath id="vinylMedallionClip">
              <circle cx="${cx}" cy="1065" r="280" />
            </clipPath>
          </defs>
          <image href="${escapeXml(photoUrlParam)}" x="${cx - 280}" y="${
          1065 - 280
        }" width="560" height="560" preserveAspectRatio="xMidYMid slice" clip-path="url(#vinylMedallionClip)" />
          <circle cx="${cx}" cy="1065" r="280" fill="none" stroke="#D8AE64" stroke-width="7.5" />
        `
      } else {
        centerMedallionSvg = `
          <text x="${cx}" y="${1052 - 65}" text-anchor="middle" fill="#F5DFB0" fill-opacity="0.96" font-family="Georgia, serif" font-weight="bold" font-size="26">${escapeXml(
          headline.slice(0, 22)
        )}</text>
          <text x="${cx}" y="${1052 + 75}" text-anchor="middle" fill="#E5C178" font-family="Georgia, serif" font-style="italic" font-size="24">${escapeXml(
          rawLocation.slice(0, 26)
        )}</text>
          <text x="${cx}" y="${1052 + 110}" text-anchor="middle" fill="#E5C178" fill-opacity="0.82" font-family="monospace" font-weight="bold" font-size="19">${escapeXml(
          dateText.slice(0, 24)
        )}</text>
        `
      }
    }

    const bars = 82
    const waveW = 1200
    const startX = cx - waveW / 2 - 90
    const stepX = waveW / bars
    const maxAmp = mode === 'soundwave' ? 85 : 62
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
        amp = Math.max(10, (parsedPeaks[i % parsedPeaks.length] || 0.25) * maxAmp)
      } else {
        const bSeed = hashSeed(`${seed}-bar-${i}`)
        const env = Math.sin((i / bars) * Math.PI)
        const mod =
          0.35 +
          0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
          0.2 * ((bSeed % 100) / 100)
        amp = Math.max(10, env * mod * maxAmp)
      }
      const x = (startX + i * stepX).toFixed(1)
      const col = i % 3 === 0 ? colorway.accentHex : colorway.inkHex
      lines.push(
        `<line x1="${x}" y1="${(1988 - amp).toFixed(1)}" x2="${x}" y2="${(
          1988 + amp
        ).toFixed(1)}" stroke="${col}" stroke-width="6.2" stroke-linecap="round" />`
      )
    }

    // Genuine ISO/IEC 18004 Camera-Scannable QR Code Matrix
    const listenUrl = buildCompactListenQrUrl({
      title: headline,
      song: rawLocation,
      dateText: rawDate,
      subline,
      audioUrl: audioUrlParam || null,
      peaks: parsedPeaks.length > 0 ? parsedPeaks : null,
    })
    const qrMatrix = buildScannableQrMatrix(listenUrl)
    const qrBoxSize = 148
    const qrX = startX + waveW + 46
    const qrY = 1988 - qrBoxSize / 2
    const cellPx = qrBoxSize / qrMatrix.size
    const qrCells: string[] = []

    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.isDark(r, c)) {
          qrCells.push(
            `<rect x="${(qrX + c * cellPx).toFixed(2)}" y="${(
              qrY +
              r * cellPx
            ).toFixed(2)}" width="${(cellPx + 0.35).toFixed(2)}" height="${(
              cellPx + 0.35
            ).toFixed(2)}" fill="#1D1511" />`
          )
        }
      }
    }

    dynamicOverlaySvg = `
      ${centerMedallionSvg}
      ${lines.join('\n')}
      <rect x="${(qrX - 14).toFixed(1)}" y="${(qrY - 14).toFixed(1)}" width="${(
      qrBoxSize + 28
    ).toFixed(1)}" height="${(qrBoxSize + 28).toFixed(
      1
    )}" rx="6" fill="#FAF6F0" stroke="${colorway.accentHex}" stroke-width="3.5" />
      ${qrCells.join('\n')}
    `
  }

  // Helper to compute auto-fitted SVG font size so long titles never overflow
  const fitFontSize = (text: string, basePx: number, minPx: number, maxCharsBeforeShrink: number) => {
    if (text.length <= maxCharsBeforeShrink) return basePx
    const scaled = Math.round((basePx * maxCharsBeforeShrink) / Math.max(1, text.length))
    return Math.max(minPx, scaled)
  }

  const dClean = rawDate.trim()
  const cClean = coordsText.trim()
  const familyHeritageLine =
    dClean.toLowerCase() === cClean.toLowerCase()
      ? dClean.toUpperCase()
      : [dClean, cClean]
          .filter(Boolean)
          .map((s) => s.toUpperCase())
          .join('   ·   ')

  const combinedLocDate = [rawLocation.trim(), rawDate.trim()]
    .filter(Boolean)
    .map((s) => s.toUpperCase())
    .join('   •   ')

  const headlineFontPx = fitFontSize(headline, 80, 44, 24)
  const sublineFontPx = fitFontSize(subline, 50, 32, 42)
  const locDateFontPx = fitFontSize(
    mode === 'family_botanical' ? locationText : combinedLocDate,
    38,
    24,
    46
  )

  const footerSvg =
    mode === 'three_map_triptych'
      ? `
  <rect x="60" y="110" width="675" height="${H - 220}" fill="none" stroke="${colorway.accentHex}" stroke-width="4.5" stroke-opacity="0.52" />
  <rect x="78" y="128" width="639" height="${H - 256}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.2" stroke-opacity="0.22" />

  <rect x="825" y="110" width="700" height="${H - 220}" fill="none" stroke="${colorway.accentHex}" stroke-width="4.5" stroke-opacity="0.52" />
  <rect x="843" y="128" width="664" height="${H - 256}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.2" stroke-opacity="0.22" />

  <rect x="1620" y="110" width="720" height="${H - 220}" fill="none" stroke="${colorway.accentHex}" stroke-width="4.5" stroke-opacity="0.52" />
  <rect x="1638" y="128" width="684" height="${H - 256}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.2" stroke-opacity="0.22" />

  <line x1="230" y1="2120" x2="570" y2="2120" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.75" />
  <text x="398" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">I · WHERE WE MET</text>
  <text x="398" y="2345" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="30">THE BEGINNING</text>
  <text x="398" y="2480" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="${fitFontSize(locationText, 36, 24, 22)}">${escapeXml(locationText)}</text>

  <line x1="1005" y1="2120" x2="1345" y2="2120" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.75" />
  <text x="1175" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">II · WHERE WE ENGAGED</text>
  <text x="1175" y="2345" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="${fitFontSize(headline, 38, 24, 20)}">${escapeXml(headline)}</text>
  <text x="1175" y="2480" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="${fitFontSize(dateText, 36, 24, 22)}">${escapeXml(dateText)}</text>
  <text x="1175" y="2605" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="${fitFontSize(subline, 30, 20, 28)}">${escapeXml(subline)}</text>

  <line x1="1810" y1="2120" x2="2150" y2="2120" stroke="${colorway.accentHex}" stroke-width="3.5" stroke-opacity="0.75" />
  <text x="1980" y="2245" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="44">III · WHERE WE MARRIED</text>
  <text x="1980" y="2345" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="30">FOREVER &amp; ALWAYS</text>
  <text x="1980" y="2480" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="${fitFontSize(coordsText, 36, 24, 22)}">${escapeXml(coordsText.toUpperCase())}</text>
`
      : `
  <rect x="110" y="110" width="${W - 220}" height="${H - 220}" fill="none" stroke="${colorway.accentHex}" stroke-width="5" stroke-opacity="0.52" />
  <rect x="135" y="135" width="${W - 270}" height="${H - 270}" fill="none" stroke="${colorway.accentHex}" stroke-width="2.5" stroke-opacity="0.22" />
  <line x1="${cx - 350}" y1="2135" x2="${cx + 350}" y2="2135" stroke="${colorway.accentHex}" stroke-width="4" stroke-opacity="0.75" />
  <text x="${cx}" y="2280" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-weight="bold" font-size="${headlineFontPx}">${escapeXml(headline)}</text>
  <text x="${cx}" y="2395" text-anchor="middle" fill="${colorway.inkHex}" font-family="Georgia, serif" font-style="italic" font-size="${sublineFontPx}" opacity="0.88">${escapeXml(subline)}</text>
  <text x="${cx}" y="2540" text-anchor="middle" fill="${colorway.accentHex}" font-family="Georgia, serif" font-weight="bold" font-size="${locDateFontPx}">${escapeXml(
          mode === 'family_botanical' ? locationText : combinedLocDate
        )}</text>
  <text x="${cx}" y="2650" text-anchor="middle" fill="${colorway.mutedHex}" font-family="Georgia, serif" font-style="italic" font-size="36" opacity="0.92">${escapeXml(
          mode === 'family_botanical' ? familyHeritageLine : coordsText
        )}</text>
`

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${paperFill}" />
  ${basePlateSvg}
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
