'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  EvermarkProduct,
  COLORWAYS,
  ColorwayId,
  FRAME_FINISHES,
  FrameFinishId,
  FORMAT_TIERS,
  DIGITAL_BACKUP_BUMP,
  EVERMARK_CATALOG,
} from '@/lib/catalog'
import AdUnit from '@/components/AdUnit'

interface LivePrintCustomizerProps {
  product: EvermarkProduct
  compactHeroMode?: boolean
}

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export default function LivePrintCustomizer({
  product,
  compactHeroMode = false,
}: LivePrintCustomizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [headline, setHeadline] = useState(product.defaultHeadline)
  const [subline, setSubline] = useState(product.defaultSubline)
  const [locationText, setLocationText] = useState(product.defaultLocation)
  const [dateText, setDateText] = useState(product.defaultDateText)
  const [coordsText, setCoordsText] = useState(product.defaultCoords)
  const [colorwayId, setColorwayId] = useState<ColorwayId>(product.defaultColorway)
  const [frameFinishId, setFrameFinishId] = useState<FrameFinishId>(product.defaultFrame)
  const [viewMode, setViewMode] = useState<'room' | 'studio'>('room')
  const [selectedFormatId, setSelectedFormatId] = useState<string>('framed-16x20')
  const [includeDigitalBump, setIncludeDigitalBump] = useState<boolean>(true)
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const frameFinish =
    FRAME_FINISHES.find((f) => f.id === frameFinishId) || FRAME_FINISHES[0]
  const activeFormat =
    FORMAT_TIERS.find((f) => f.id === selectedFormatId) || FORMAT_TIERS[0]

  const showBump = activeFormat.isPhysical
  const totalUsd =
    activeFormat.priceUsd + (showBump && includeDigitalBump ? DIGITAL_BACKUP_BUMP.priceUsd : 0)

  // Real-time high-precision archival print renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 960
    const H = 1200
    canvas.width = W
    canvas.height = H

    const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

    // 1. Archival Paper Fill
    ctx.fillStyle = colorway.bgHex
    ctx.fillRect(0, 0, W, H)

    // Subtle organic paper grain micro-dots
    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.022
    for (let g = 0; g < 600; g++) {
      const gx = ((g * 7919) % W)
      const gy = ((g * 6271) % H)
      ctx.fillRect(gx, gy, 1.5, 1.5)
    }
    ctx.globalAlpha = 1

    // 2. Museum Double-Line Plate Border
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.55
    ctx.lineWidth = 2
    ctx.strokeRect(52, 52, W - 104, H - 104)
    ctx.globalAlpha = 0.22
    ctx.lineWidth = 1
    ctx.strokeRect(64, 64, W - 128, H - 128)
    ctx.globalAlpha = 1

    // Top Plate Header
    ctx.fillStyle = colorway.mutedHex
    ctx.globalAlpha = 0.75
    ctx.font = '500 12px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(product.plateNumber, 84, 92)
    ctx.textAlign = 'right'
    ctx.fillText('ARCHIVE EDITION · 300 DPI', W - 84, 92)
    ctx.globalAlpha = 1

    const cx = W / 2
    const cy = 468
    const R = 304

    // 3. Mathematical Artwork Renderer by Mode
    ctx.save()
    if (product.mode === 'starmap') {
      // Outer celestial degree ring
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      ctx.lineWidth = 1
      ctx.globalAlpha = 0.55
      ctx.beginPath()
      ctx.arc(cx, cy, R - 15, 0, Math.PI * 2)
      ctx.stroke()

      // 72 degree tick marks
      for (let i = 0; i < 72; i++) {
        const ang = (i * Math.PI * 2) / 72
        const inner = i % 6 === 0 ? R - 15 : R - 7
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner)
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R)
        ctx.stroke()
      }

      // Cardinal markers N / E / S / W
      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.85
      ctx.font = '600 13px Georgia, serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', cx, cy - R - 10)
      ctx.fillText('S', cx, cy + R + 20)
      ctx.fillText('E', cx + R + 16, cy + 4)
      ctx.fillText('W', cx - R - 16, cy + 4)

      // Celestial Equator & Ecliptic rings
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(
        cx,
        cy,
        R * 0.82,
        R * 0.52,
        (((seed % 180) * Math.PI) / 180),
        0,
        Math.PI * 2
      )
      ctx.stroke()

      // Clip inside celestial disc
      ctx.beginPath()
      ctx.arc(cx, cy, R - 17, 0, Math.PI * 2)
      ctx.clip()

      // Plot 190 magnitude-calibrated stars
      ctx.fillStyle = colorway.inkHex
      for (let s = 0; s < 190; s++) {
        const sSeed = hashSeed(`${seed}-star-${s}`)
        const rNorm = Math.sqrt((sSeed % 1000) / 1000) * (R - 24)
        const theta = ((sSeed >> 4) % 3600) * (Math.PI / 1800)
        const sx = cx + Math.cos(theta) * rNorm
        const sy = cy + Math.sin(theta) * rNorm
        const mag = s % 15 === 0 ? 3.1 : s % 5 === 0 ? 2.0 : 1.15
        ctx.globalAlpha = s % 15 === 0 ? 0.96 : 0.65
        ctx.beginPath()
        ctx.arc(sx, sy, mag, 0, Math.PI * 2)
        ctx.fill()
      }

      // Plot 5 Major Constellations rotated by Date/Location seed
      const rotOffset = ((seed % 360) * Math.PI) / 180
      const constellations = [
        [
          [-0.55, -0.35],
          [-0.38, -0.22],
          [-0.22, -0.28],
          [-0.1, -0.12],
          [0.05, -0.18],
        ],
        [
          [0.18, -0.52],
          [0.32, -0.4],
          [0.48, -0.45],
          [0.42, -0.22],
          [0.25, -0.25],
          [0.18, -0.52],
        ],
        [
          [-0.45, 0.22],
          [-0.25, 0.35],
          [-0.12, 0.25],
          [0.04, 0.42],
          [0.18, 0.3],
        ],
        [
          [0.25, 0.15],
          [0.42, 0.05],
          [0.55, 0.22],
          [0.38, 0.38],
          [0.25, 0.15],
        ],
        [
          [-0.1, -0.62],
          [0.0, -0.48],
          [0.12, -0.56],
        ],
      ]

      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.5
      for (const poly of constellations) {
        ctx.globalAlpha = 0.72
        ctx.beginPath()
        poly.forEach(([nx, ny], idx) => {
          const rx = nx * Math.cos(rotOffset) - ny * Math.sin(rotOffset)
          const ry = nx * Math.sin(rotOffset) + ny * Math.cos(rotOffset)
          const px = cx + rx * (R - 40)
          const py = cy + ry * (R - 40)
          if (idx === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()

        ctx.fillStyle = colorway.accentHex
        ctx.globalAlpha = 1
        poly.forEach(([nx, ny]) => {
          const rx = nx * Math.cos(rotOffset) - ny * Math.sin(rotOffset)
          const ry = nx * Math.sin(rotOffset) + ny * Math.cos(rotOffset)
          const px = cx + rx * (R - 40)
          const py = cy + ry * (R - 40)
          ctx.beginPath()
          ctx.arc(px, py, 3.6, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    } else if (product.mode === 'soundwave') {
      const bars = 96
      const waveW = 680
      const startX = (W - waveW) / 2
      const stepX = waveW / bars

      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(startX - 20, cy)
      ctx.lineTo(startX + waveW + 20, cy)
      ctx.stroke()

      for (let i = 0; i <= bars; i++) {
        const bSeed = hashSeed(`${seed}-bar-${i}`)
        const env = Math.sin((i / bars) * Math.PI)
        const mod =
          0.35 +
          0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
          0.2 * ((bSeed % 100) / 100)
        const amp = Math.max(8, env * mod * 235)
        const x = startX + i * stepX

        ctx.strokeStyle = i % 4 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = i % 4 === 0 ? 0.95 : 0.78
        ctx.lineWidth = 3.0
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, cy - amp)
        ctx.lineTo(x, cy + amp)
        ctx.stroke()
      }

      ctx.globalAlpha = 0.28
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()
    } else if (product.mode === 'coordinates' || product.mode === 'coastal_chart') {
      ctx.strokeStyle = colorway.accentHex
      for (let ring = 1; ring <= 7; ring++) {
        ctx.globalAlpha = ring === 7 ? 0.85 : 0.3
        ctx.lineWidth = ring === 7 ? 2.2 : 1.2
        ctx.beginPath()
        const radX = (R / 7) * ring
        const radY = radX * (0.82 + ((seed + ring * 13) % 18) * 0.01)
        ctx.ellipse(
          cx,
          cy,
          radX,
          radY,
          (((seed >> ring) % 90) * Math.PI) / 180,
          0,
          Math.PI * 2
        )
        ctx.stroke()
      }

      ctx.globalAlpha = 0.65
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(cx - R - 24, cy)
      ctx.lineTo(cx + R + 24, cy)
      ctx.moveTo(cx, cy - R - 24)
      ctx.lineTo(cx, cy + R + 24)
      ctx.stroke()

      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.9
      ctx.beginPath()
      ctx.moveTo(cx, cy - 48)
      ctx.lineTo(cx + 14, cy - 14)
      ctx.lineTo(cx + 48, cy)
      ctx.lineTo(cx + 14, cy + 14)
      ctx.lineTo(cx, cy + 48)
      ctx.lineTo(cx - 14, cy + 14)
      ctx.lineTo(cx - 48, cy)
      ctx.lineTo(cx - 14, cy - 14)
      ctx.closePath()
      ctx.fill()
    } else if (product.mode === 'pet_memorial') {
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 2.2
      ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.82, 0, Math.PI * 2)
      ctx.stroke()

      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.76, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = colorway.inkHex
      ctx.globalAlpha = 0.92
      ctx.lineWidth = 3.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(cx - 95, cy + 85)
      ctx.quadraticCurveTo(cx - 105, cy - 20, cx - 55, cy - 75)
      ctx.quadraticCurveTo(cx - 85, cy - 15, cx - 45, cy + 5)
      ctx.quadraticCurveTo(cx - 25, cy - 95, cx + 25, cy - 85)
      ctx.quadraticCurveTo(cx + 75, cy - 80, cx + 95, cy - 45)
      ctx.quadraticCurveTo(cx + 100, cy - 15, cx + 55, cy - 5)
      ctx.quadraticCurveTo(cx + 45, cy + 45, cx + 65, cy + 85)
      ctx.stroke()

      ctx.fillStyle = colorway.accentHex
      ctx.beginPath()
      ctx.arc(cx, cy - 145, 4.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.18
      ctx.lineWidth = 1
      for (let gx = 120; gx <= W - 120; gx += 40) {
        ctx.beginPath()
        ctx.moveTo(gx, 140)
        ctx.lineTo(gx, 800)
        ctx.stroke()
      }
      for (let gy = 140; gy <= 800; gy += 40) {
        ctx.beginPath()
        ctx.moveTo(120, gy)
        ctx.lineTo(W - 120, gy)
        ctx.stroke()
      }

      ctx.globalAlpha = 0.9
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.78, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.48, 0, Math.PI * 2)
      ctx.stroke()

      for (let t = 0; t < 24; t++) {
        const ang = (t * Math.PI * 2) / 24
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ang) * (R * 0.48), cy + Math.sin(ang) * (R * 0.48))
        ctx.lineTo(cx + Math.cos(ang) * (R * 0.78), cy + Math.sin(ang) * (R * 0.78))
        ctx.stroke()
      }
    }
    ctx.restore()

    // 4. Museum Typography Block Below Artwork
    ctx.textAlign = 'center'

    // Divider rule
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.65
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 130, 850)
    ctx.lineTo(cx + 130, 850)
    ctx.stroke()

    // Primary Headline
    ctx.globalAlpha = 1
    ctx.fillStyle = colorway.inkHex
    ctx.font = '600 32px Georgia, serif'
    ctx.fillText(headline.toUpperCase().slice(0, 42), cx, 908)

    // Personal Dedication / Subtitle
    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.85
    ctx.font = 'italic 21px Georgia, serif'
    ctx.fillText(subline.slice(0, 68), cx, 954)

    // Location & Date
    ctx.fillStyle = colorway.accentHex
    ctx.globalAlpha = 0.95
    ctx.font = '600 17px sans-serif'
    ctx.fillText(`${locationText.toUpperCase()}   ·   ${dateText.toUpperCase()}`, cx, 1016)

    // Coordinates / Technical Footnote
    ctx.fillStyle = colorway.mutedHex
    ctx.globalAlpha = 0.9
    ctx.font = '500 15px monospace'
    ctx.fillText(coordsText, cx, 1054)

    // Archival Colophon at Bottom
    ctx.globalAlpha = 0.48
    ctx.font = '500 11px monospace'
    ctx.fillText('EVERMARK ARCHIVAL PRESS  ·  310GSM MUSEUM COTTON RAG', cx, 1118)
  }, [
    headline,
    subline,
    locationText,
    dateText,
    coordsText,
    colorway,
    product.mode,
    product.plateNumber,
  ])

  function handleApplyPreset(preset: EvermarkProduct['presets'][number]) {
    setHeadline(preset.headline)
    setSubline(preset.subline)
    setLocationText(preset.location)
    setDateText(preset.dateText)
    setCoordsText(preset.coords)
  }

  function handleDownloadSamplePreview() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${product.slug}-archival-proof.png`
    link.href = dataUrl
    link.click()
  }

  async function handleCheckout() {
    setIsCheckingOut(true)
    setErrorMsg(null)

    try {
      if (typeof window !== 'undefined') {
        const canvas = canvasRef.current
        const previewDataUrl = canvas ? canvas.toDataURL('image/png') : ''
        window.localStorage.setItem(
          'evermark_last_custom_print',
          JSON.stringify({
            productSlug: product.slug,
            productTitle: product.title,
            headline,
            subline,
            locationText,
            dateText,
            coordsText,
            colorwayId,
            frameFinishId,
            formatLabel: `${activeFormat.label} (${frameFinish.label})`,
            previewDataUrl,
          })
        )
      }

      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://evermarkprints.com'

      const lineItems = [
        {
          name: `${product.shortTitle} — ${activeFormat.label}`,
          description: `${colorway.shortLabel} | ${
            activeFormat.isPhysical ? `${frameFinish.label} Frame | ` : ''
          }"${headline}" (${locationText} · ${dateText})`,
          amountCents: activeFormat.priceUsd * 100,
          quantity: 1,
        },
      ]

      if (showBump && includeDigitalBump) {
        lineItems.push({
          name: DIGITAL_BACKUP_BUMP.title,
          description: 'Instant 300 DPI Archival Digital Print Master File',
          amountCents: DIGITAL_BACKUP_BUMP.priceUsd * 100,
          quantity: 1,
        })
      }

      const returnUrl = `${origin}/success?product=${encodeURIComponent(
        product.slug
      )}&format=${encodeURIComponent(activeFormat.id)}&bump=${
        showBump && includeDigitalBump ? '1' : '0'
      }`

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `evermark_${product.sku}`,
          returnUrl,
          collectUsShipping: activeFormat.isPhysical,
          lineItems,
          metadata: {
            brand: 'Evermark Prints',
            productSlug: product.slug,
            sku: product.sku,
            formatId: activeFormat.id,
            colorwayId,
            frameFinishId,
            headline: headline.slice(0, 120),
            subline: subline.slice(0, 180),
            locationText: locationText.slice(0, 120),
            dateText: dateText.slice(0, 120),
            coordsText: coordsText.slice(0, 120),
            includedDigitalBump: showBump && includeDigitalBump ? 'yes' : 'no',
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Unable to start Stripe Checkout right now.')
      }

      window.location.href = data.url
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to start checkout. Please try again.'
      )
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: INTERACTIVE ROOM STAGING & MUSEUM FRAME VIEWER (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-5">
          {/* View Mode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD5C7] pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('room')}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  viewMode === 'room'
                    ? 'bg-[#171513] text-[#F7F4ED] border-[#171513]'
                    : 'bg-[#FCFBF8] text-[#5C554D] border-[#DDD5C7] hover:border-[#171513]'
                }`}
              >
                Gallery Wall Staging
              </button>
              <button
                type="button"
                onClick={() => setViewMode('studio')}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  viewMode === 'studio'
                    ? 'bg-[#171513] text-[#F7F4ED] border-[#171513]'
                    : 'bg-[#FCFBF8] text-[#5C554D] border-[#DDD5C7] hover:border-[#171513]'
                }`}
              >
                Close-Up Frame Detail
              </button>
            </div>

            <span className="text-[11px] font-mono-tech uppercase tracking-[0.12em] text-[#6E655B]">
              {frameFinish.label} · {colorway.shortLabel}
            </span>
          </div>

          {/* Interactive Gallery Wall Stage */}
          <div
            className={`relative overflow-hidden border border-[#D5CCBC] transition-all ${
              viewMode === 'room'
                ? 'gallery-wall-surface pt-10 pb-20 px-6 sm:px-14'
                : 'bg-[#EFEAE0] py-8 px-4 sm:px-10'
            }`}
          >
            {/* Architectural Diagonal Window Light Overlay in Room Mode */}
            {viewMode === 'room' && (
              <>
                <div
                  className="pointer-events-none absolute inset-0 opacity-45"
                  style={{
                    background:
                      'linear-gradient(125deg, rgba(255,253,248,0.85) 0%, rgba(255,253,248,0.0) 46%, rgba(160,146,126,0.22) 100%)',
                  }}
                />
                {/* Top Left Scale Spec Tag */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#6E655B] mb-6">
                  <span>LIVE COMMISSION PREVIEW</span>
                  <span>{activeFormat.dimensions}</span>
                </div>
              </>
            )}

            {/* Physical Hardwood Frame + 8-Ply Museum Mat Board */}
            <div
              className={`relative z-10 mx-auto transition-all duration-300 ${
                viewMode === 'room' ? 'max-w-[390px]' : 'max-w-[490px]'
              }`}
              style={{
                backgroundColor: frameFinish.outerHex,
                padding: viewMode === 'room' ? '14px' : '18px',
                boxShadow:
                  viewMode === 'room'
                    ? '22px 32px 54px rgba(28, 22, 16, 0.34), 4px 8px 16px rgba(28, 22, 16, 0.18)'
                    : '0 24px 48px rgba(28, 22, 16, 0.22)',
                border: `2px solid ${frameFinish.lipHex}`,
              }}
            >
              {/* Inner Hardwood Frame Lip */}
              <div
                style={{
                  border: `2px solid ${frameFinish.innerHex}`,
                  backgroundColor: '#F8F5EE',
                  padding: viewMode === 'room' ? '16px' : '22px',
                }}
              >
                {/* 8-Ply Beveled Archival Mat Opening */}
                <div
                  className="p-[2px]"
                  style={{
                    backgroundColor: '#D6CEC0',
                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.16)',
                  }}
                >
                  <canvas ref={canvasRef} className="w-full h-auto block" />
                </div>
              </div>
            </div>

            {/* Architectural Chair Rail & Walnut Credenza in Room Mode */}
            {viewMode === 'room' && (
              <>
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-[3px] bg-[#D5CBB9] border-b border-[#FAF7F2]" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-[#E3DDD0]" />
                <div
                  className="pointer-events-none absolute bottom-0 left-[10%] right-[10%] h-5 shadow-inner"
                  style={{
                    backgroundColor: frameFinish.outerHex,
                    borderTop: `3px solid ${frameFinish.innerHex}`,
                  }}
                />
              </>
            )}
          </div>

          {/* Proof Bar & Preset Inspiration Pills */}
          <div className="bg-[#FCFBF8] border border-[#DDD5C7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#6E655B]">
                Occasion Presets:
              </span>
              {product.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 border border-[#DDD5C7] hover:border-[#171513] bg-[#F7F4ED] text-[#171513] text-[11px] font-medium transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDownloadSamplePreview}
              className="text-[#171513] hover:text-[#8A643B] underline underline-offset-4 font-semibold shrink-0 text-left sm:text-right"
            >
              Download Proof Image ↓
            </button>
          </div>

          {!compactHeroMode && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {product.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FCFBF8] border border-[#DDD5C7] flex items-start gap-3 text-[#3D3831]"
                >
                  <span className="font-mono-tech text-[#8A643B] font-semibold">
                    0{i + 1}
                  </span>
                  <span className="leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BESPOKE STUDIO CONTROLS & CHECKOUT (5 Cols) */}
        <div className="lg:col-span-5 bg-[#FCFBF8] border border-[#D5CCBC] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-[#E5DEC9] pb-5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#7A6F63]">
              <span>
                {product.plateNumber} · {product.categoryLabel}
              </span>
              <span className="text-[#171513] font-semibold">4.9 / 5.0 (US REVIEWS)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#171513] leading-tight">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554D] leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* STEP 1: Select Archival Paper & Ink Palette */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#171513] font-semibold block">
              01. Select Paper &amp; Ink Palette
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {COLORWAYS.map((c) => {
                const isSel = c.id === colorwayId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorwayId(c.id)}
                    className={`p-3 border text-left transition flex items-center gap-2.5 ${
                      isSel
                        ? 'border-[#171513] bg-[#F3EFE6] ring-1 ring-[#171513]'
                        : 'border-[#DDD5C7] bg-[#FCFBF8] hover:border-[#9E9486]'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-[#9E9486] shrink-0"
                      style={{ backgroundColor: c.bgHex }}
                    />
                    <span className="text-xs font-medium text-[#171513] leading-tight">
                      {c.shortLabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: Select Hardwood Frame Finish */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#171513] font-semibold block">
              02. Select Solid Hardwood Frame
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {FRAME_FINISHES.map((f) => {
                const isSel = f.id === frameFinishId
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrameFinishId(f.id)}
                    className={`p-2.5 border text-left transition flex items-center gap-2 ${
                      isSel
                        ? 'border-[#171513] bg-[#F3EFE6] ring-1 ring-[#171513]'
                        : 'border-[#DDD5C7] bg-[#FCFBF8] hover:border-[#9E9486]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 border border-black/20 shrink-0"
                      style={{ backgroundColor: f.outerHex }}
                    />
                    <span className="text-xs font-medium text-[#171513] truncate">
                      {f.shortLabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 3: Personalize Inscription */}
          <div className="space-y-3.5 pt-1">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#171513] font-semibold block">
              03. Enter Your Inscription (Updates Live)
            </label>

            <div className="space-y-1">
              <span className="text-xs text-[#4A443C] font-medium block">
                Primary Title / Heading
              </span>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={42}
                className="w-full border border-[#CFC6B6] bg-[#FCFBF8] px-3.5 py-2.5 text-sm text-[#171513] focus:border-[#171513] focus:outline-none"
                placeholder="e.g., THE NIGHT OUR STORY BEGAN"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#4A443C] font-medium block">
                Dedication / Subtitle Line
              </span>
              <input
                type="text"
                value={subline}
                onChange={(e) => setSubline(e.target.value)}
                maxLength={68}
                className="w-full border border-[#CFC6B6] bg-[#FCFBF8] px-3.5 py-2.5 text-sm text-[#171513] focus:border-[#171513] focus:outline-none"
                placeholder="e.g., Underneath these exact stars, everything changed."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-[#4A443C] font-medium block">
                  City, Place or Harbor
                </span>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  maxLength={38}
                  className="w-full border border-[#CFC6B6] bg-[#FCFBF8] px-3.5 py-2.5 text-xs sm:text-sm text-[#171513] focus:border-[#171513] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#4A443C] font-medium block">
                  Date / Time / Year
                </span>
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  maxLength={34}
                  className="w-full border border-[#CFC6B6] bg-[#FCFBF8] px-3.5 py-2.5 text-xs sm:text-sm text-[#171513] focus:border-[#171513] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#4A443C] font-medium block">
                Coordinates or Technical Colophon
              </span>
              <input
                type="text"
                value={coordsText}
                onChange={(e) => setCoordsText(e.target.value)}
                maxLength={44}
                className="w-full border border-[#CFC6B6] bg-[#F7F4ED] px-3.5 py-2 text-xs font-mono-tech text-[#171513] focus:border-[#171513] focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 4: Select Size & Framing Tier */}
          <div className="space-y-2.5 pt-2">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#171513] font-semibold block">
              04. Select Edition Size &amp; Format
            </label>

            <div className="space-y-2.5">
              {FORMAT_TIERS.map((tier) => {
                const isSelected = tier.id === activeFormat.id
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedFormatId(tier.id)}
                    className={`w-full text-left p-3.5 border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#F3EFE6] border-[#171513] ring-1 ring-[#171513]'
                        : 'bg-[#FCFBF8] border-[#DDD5C7] hover:border-[#9E9486]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-[#171513]">
                          {tier.label}
                        </span>
                        {tier.badge && (
                          <span className="px-2 py-0.5 bg-[#171513] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C554D]">{tier.subtitle}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-semibold text-[#171513] block">
                        ${tier.priceUsd}
                      </span>
                      {tier.compareAtUsd && (
                        <span className="text-xs text-[#8C8275] line-through block">
                          ${tier.compareAtUsd}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 1-Click Digital Master Backup Order Bump */}
          {showBump && (
            <div className="p-4 bg-[#F3EFE6] border border-[#D5CCBC]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigitalBump}
                  onChange={(e) => setIncludeDigitalBump(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#171513] cursor-pointer"
                />
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-[#171513] block">
                    {DIGITAL_BACKUP_BUMP.title}
                  </span>
                  <p className="text-[#5C554D] leading-relaxed">
                    {DIGITAL_BACKUP_BUMP.description}
                  </p>
                </div>
              </label>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-900">
              {errorMsg}
            </div>
          )}

          {/* Primary Checkout Button */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 px-6 bg-[#171513] hover:bg-[#2E2925] disabled:opacity-60 text-[#F7F4ED] font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] transition flex items-center justify-center gap-3"
            >
              <span>
                {isCheckingOut
                  ? 'Preparing Archival Commission...'
                  : `Commission Custom Print — $${totalUsd}`}
              </span>
              <span>→</span>
            </button>

            <p className="text-[11px] text-[#6E655B] text-center font-mono-tech">
              COMPLIMENTARY US FRAMED DELIVERY (3–5 DAYS) · 310GSM MUSEUM COTTON RAG
            </p>
            <p className="text-[11px] text-[#7A6F63] text-center">
              Protected by our{' '}
              <Link href="/refunds" className="underline underline-offset-2 text-[#171513]">
                100% Damaged-or-Defective Replacement Guarantee
              </Link>{' '}
              ·{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#171513]">
                Terms
              </Link>{' '}
              ·{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#171513]">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {!compactHeroMode && (
        <>
          {/* Verified Collector Reviews */}
          <section className="space-y-6 border-t border-[#DDD5C7] pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#7A6F63]">
                  Verified Collector Notes
                </p>
                <h2 className="text-3xl font-editorial font-semibold text-[#171513]">
                  In American Homes &amp; Studies
                </h2>
              </div>
              <span className="text-xs font-mono-tech text-[#171513]">
                ★★★★★ 4.9 / 5.0 AVERAGE RATING
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#FCFBF8] border border-[#DDD5C7] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[#7A6F63] font-mono-tech">
                    <span className="text-[#171513] font-semibold">★★★★★</span>
                    <span>{rev.formatPurchased}</span>
                  </div>
                  <h3 className="text-xl font-editorial font-semibold text-[#171513]">
                    “{rev.title}”
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed">
                    {rev.body}
                  </p>
                  <p className="text-xs text-[#7A6F63] pt-1 font-mono-tech uppercase tracking-wider">
                    — {rev.author} · {rev.location} (Verified Buyer)
                  </p>
                </div>
              ))}
            </div>
          </section>

          <AdUnit slot="4800798822" />

          {/* Cross-Sell Other Custom Archival Editions */}
          <section className="space-y-6 border-t border-[#DDD5C7] pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#171513]">
                Explore Companion Archival Editions
              </h2>
              <Link
                href="/"
                className="text-xs font-mono-tech uppercase tracking-[0.14em] text-[#171513] underline underline-offset-4"
              >
                View Full Index →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVERMARK_CATALOG.filter((p) => p.slug !== product.slug)
                .slice(0, 3)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/create/${other.slug}`}
                    className="bg-[#FCFBF8] border border-[#DDD5C7] hover:border-[#171513] transition group flex flex-col justify-between overflow-hidden"
                  >
                    <div className="aspect-[5/4] w-full overflow-hidden bg-[#EFEAE0] border-b border-[#DDD5C7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={other.previewImage}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-mono-tech uppercase tracking-[0.16em] text-[#7A6F63] block">
                        {other.plateNumber} · {other.categoryLabel}
                      </span>
                      <h3 className="text-xl font-editorial font-semibold text-[#171513]">
                        {other.shortTitle}
                      </h3>
                      <p className="text-xs text-[#5C554D] line-clamp-2">
                        {other.subtitle}
                      </p>
                      <div className="pt-3 border-t border-[#EAE3D5] flex items-center justify-between text-xs font-medium text-[#171513]">
                        <span>From ${other.popularPriceUsd} Framed</span>
                        <span className="font-mono-tech uppercase tracking-wider text-[11px]">
                          Personalize →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
