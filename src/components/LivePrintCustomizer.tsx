'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  EvermarkProduct,
  COLORWAYS,
  ColorwayId,
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
  const [colorwayId, setColorwayId] = useState<ColorwayId>('midnight_gold')
  const [selectedFormatId, setSelectedFormatId] = useState<string>('framed-16x20')
  const [includeDigitalBump, setIncludeDigitalBump] = useState<boolean>(true)
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const activeFormat =
    FORMAT_TIERS.find((f) => f.id === selectedFormatId) || FORMAT_TIERS[0]

  const showBump = activeFormat.isPhysical
  const totalUsd =
    activeFormat.priceUsd + (showBump && includeDigitalBump ? DIGITAL_BACKUP_BUMP.priceUsd : 0)

  // Real-time mathematical & typographic vector canvas renderer (Zero AI Slop)
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

    // 1. Background Fill
    ctx.fillStyle = colorway.bgHex
    ctx.fillRect(0, 0, W, H)

    // 2. Double Archival Mat Border
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.45
    ctx.lineWidth = 2
    ctx.strokeRect(48, 48, W - 96, H - 96)
    ctx.globalAlpha = 0.2
    ctx.lineWidth = 1
    ctx.strokeRect(60, 60, W - 120, H - 120)
    ctx.globalAlpha = 1

    const cx = W / 2
    const cy = 475
    const R = 310

    // 3. Mathematical Artwork Renderer by Mode
    ctx.save()
    if (product.mode === 'starmap') {
      // Outer degree bezel
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      ctx.lineWidth = 1
      ctx.globalAlpha = 0.55
      ctx.beginPath()
      ctx.arc(cx, cy, R - 14, 0, Math.PI * 2)
      ctx.stroke()

      // 72 degree tick marks
      for (let i = 0; i < 72; i++) {
        const ang = (i * Math.PI * 2) / 72
        const inner = i % 6 === 0 ? R - 14 : R - 7
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner)
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R)
        ctx.stroke()
      }

      // Celestial Equator & Ecliptic rings
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(cx, cy, R * 0.82, R * 0.52, ((seed % 180) * Math.PI) / 180, 0, Math.PI * 2)
      ctx.stroke()

      // Clip inside celestial disc
      ctx.beginPath()
      ctx.arc(cx, cy, R - 16, 0, Math.PI * 2)
      ctx.clip()

      // Plot 180 deterministic stars
      ctx.fillStyle = colorway.inkHex
      for (let s = 0; s < 180; s++) {
        const sSeed = hashSeed(`${seed}-star-${s}`)
        const rNorm = Math.sqrt((sSeed % 1000) / 1000) * (R - 24)
        const theta = ((sSeed >> 4) % 3600) * (Math.PI / 1800)
        const sx = cx + Math.cos(theta) * rNorm
        const sy = cy + Math.sin(theta) * rNorm
        const mag = s % 14 === 0 ? 3.2 : s % 5 === 0 ? 2.1 : 1.15
        ctx.globalAlpha = s % 14 === 0 ? 0.98 : 0.65
        ctx.beginPath()
        ctx.arc(sx, sy, mag, 0, Math.PI * 2)
        ctx.fill()
      }

      // Plot 6 Major Constellations rotated by Date/Location seed
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
      ctx.lineWidth = 1.6
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

        // Star nodes on constellation vertices
        ctx.fillStyle = colorway.accentHex
        ctx.globalAlpha = 1
        poly.forEach(([nx, ny]) => {
          const rx = nx * Math.cos(rotOffset) - ny * Math.sin(rotOffset)
          const ry = nx * Math.sin(rotOffset) + ny * Math.cos(rotOffset)
          const px = cx + rx * (R - 40)
          const py = cy + ry * (R - 40)
          ctx.beginPath()
          ctx.arc(px, py, 3.8, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    } else if (product.mode === 'soundwave') {
      // Architectural Soundwave Frame
      const bars = 96
      const waveW = 680
      const startX = (W - waveW) / 2
      const stepX = waveW / bars

      // Subtle horizontal reference axis
      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(startX - 20, cy)
      ctx.lineTo(startX + waveW + 20, cy)
      ctx.stroke()

      // Harmonic bars generated deterministically from the user's message/song
      for (let i = 0; i <= bars; i++) {
        const bSeed = hashSeed(`${seed}-bar-${i}`)
        const env = Math.sin((i / bars) * Math.PI)
        const mod =
          0.35 +
          0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
          0.2 * ((bSeed % 100) / 100)
        const amp = Math.max(8, env * mod * 240)
        const x = startX + i * stepX

        ctx.strokeStyle = i % 4 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = i % 4 === 0 ? 0.95 : 0.75
        ctx.lineWidth = 3.2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, cy - amp)
        ctx.lineTo(x, cy + amp)
        ctx.stroke()
      }

      // Outer harmonic ring
      ctx.globalAlpha = 0.25
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()
    } else if (product.mode === 'coordinates' || product.mode === 'coastal_chart') {
      // Topographic & Mariner Compass Rose
      ctx.strokeStyle = colorway.accentHex
      for (let ring = 1; ring <= 7; ring++) {
        ctx.globalAlpha = ring === 7 ? 0.85 : 0.28
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

      // Crosshairs & Cardinal Compass Lines
      ctx.globalAlpha = 0.65
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(cx - R - 24, cy)
      ctx.lineTo(cx + R + 24, cy)
      ctx.moveTo(cx, cy - R - 24)
      ctx.lineTo(cx, cy + R + 24)
      ctx.stroke()

      // Center Diamond Compass Star
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
      // Dignified Archival Medallion & Line-Art Silhouette
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

      // Minimalist continuous line-art crest in center
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

      // Small warm gold star above
      ctx.fillStyle = colorway.accentHex
      ctx.beginPath()
      ctx.arc(cx, cy - 145, 5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Patent & Engineering Blueprint Mode
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

      // Concentric mechanical gear & escapement draftsmanship
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

    // Divider ornament
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.65
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 140, 855)
    ctx.lineTo(cx + 140, 855)
    ctx.stroke()

    // Primary Headline
    ctx.globalAlpha = 1
    ctx.fillStyle = colorway.inkHex
    ctx.font = 'bold 34px Georgia, serif'
    ctx.fillText(headline.toUpperCase().slice(0, 42), cx, 912)

    // Personal Dedication / Subtitle
    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.85
    ctx.font = 'italic 21px Georgia, serif'
    ctx.fillText(subline.slice(0, 68), cx, 956)

    // Location & Date
    ctx.fillStyle = colorway.accentHex
    ctx.globalAlpha = 0.95
    ctx.font = '600 18px Inter, sans-serif'
    ctx.fillText(`${locationText.toUpperCase()}  •  ${dateText.toUpperCase()}`, cx, 1018)

    // Coordinates / Technical Footnote
    ctx.fillStyle = colorway.mutedHex
    ctx.globalAlpha = 0.9
    ctx.font = '500 15px monospace'
    ctx.fillText(coordsText, cx, 1054)

    // Archival Stamp at Bottom
    ctx.globalAlpha = 0.45
    ctx.font = '600 11px Inter, sans-serif'
    ctx.fillText('EVERMARK ARCHIVAL STUDIO  •  300 DPI MUSEUM EDITION', cx, 1118)
  }, [headline, subline, locationText, dateText, coordsText, colorway, product.mode])

  function handleDownloadSamplePreview() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${product.slug}-preview.png`
    link.href = dataUrl
    link.click()
  }

  async function handleCheckout() {
    setIsCheckingOut(true)
    setErrorMsg(null)

    try {
      // Save custom print design in localStorage so /success can render & export 300 DPI master immediately
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
            formatLabel: activeFormat.label,
            previewDataUrl,
          })
        )
      }

      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://evermarkprints.com'

      const lineItems = [
        {
          name: `${product.shortTitle} — ${activeFormat.label}`,
          description: `${colorway.label} | "${headline}" (${locationText} · ${dateText})`,
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
    <div className="space-y-14">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: LIVE FRAMED MUSEUM PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-2xl p-5 sm:p-10 bg-gradient-to-b from-[#131824] to-[#090c14] border border-white/15 shadow-2xl flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 mb-4">
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Interactive Archival Preview
              </span>
              <span className="text-slate-400 font-mono">300 DPI Vector Master</span>
            </div>

            {/* Museum Wood Float Frame */}
            <div className="p-3 sm:p-4 rounded-sm bg-[#1c1613] shadow-[0_28px_70px_rgba(0,0,0,0.85)] border-4 border-[#2b221e] max-w-[440px] w-full">
              <div className="p-1 bg-[#0b0e14]">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto block rounded-[1px]"
                />
              </div>
            </div>

            <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mt-4 pt-3 border-t border-white/10">
              <span>Colorway: {colorway.label}</span>
              <button
                type="button"
                onClick={handleDownloadSamplePreview}
                className="text-amber-300 hover:text-amber-200 underline underline-offset-4 font-medium"
              >
                Save Proof Image to Phone/PC ↓
              </button>
            </div>
          </div>

          {!compactHeroMode && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {product.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-slate-200"
                >
                  <span className="text-amber-300 font-bold">✓</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE CUSTOMIZER CONTROLS & STRIPE CHECKOUT (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0d121f]/95 border border-amber-400/35 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                {product.badge}
              </span>
              <span className="text-amber-300 font-semibold">★★★★★ 4.9/5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f7f4ef]">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* STEP 1: Choose Archival Colorway */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              1. Select Archival Colorway:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {COLORWAYS.map((c) => {
                const isSel = c.id === colorwayId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorwayId(c.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSel
                        ? 'border-amber-400 bg-amber-400/15 shadow-md'
                        : 'border-white/15 bg-[#070a12] hover:border-white/35'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: c.bgHex }}
                    />
                    <span className="text-xs font-semibold text-[#f7f4ef] leading-tight">
                      {c.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: Personalize Your Print Text & Coordinates */}
          <div className="space-y-3.5 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              2. Personalize Your Inscription (Updates Live):
            </label>

            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-medium block">
                Main Headline / Title
              </span>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={42}
                className="w-full rounded-xl border border-white/15 bg-[#070a12] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                placeholder="e.g., THE NIGHT OUR STORY BEGAN"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-medium block">
                Personal Dedication / Quote Line
              </span>
              <input
                type="text"
                value={subline}
                onChange={(e) => setSubline(e.target.value)}
                maxLength={68}
                className="w-full rounded-xl border border-white/15 bg-[#070a12] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                placeholder="e.g., Underneath these exact stars, everything changed."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs text-slate-300 font-medium block">
                  City, Place or Subtitle
                </span>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  maxLength={38}
                  className="w-full rounded-xl border border-white/15 bg-[#070a12] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-300 font-medium block">
                  Date / Milestone Year
                </span>
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  maxLength={34}
                  className="w-full rounded-xl border border-white/15 bg-[#070a12] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-medium block">
                Coordinates or Bottom Archival Line
              </span>
              <input
                type="text"
                value={coordsText}
                onChange={(e) => setCoordsText(e.target.value)}
                maxLength={44}
                className="w-full rounded-xl border border-white/15 bg-[#070a12] px-3.5 py-2 text-xs font-mono text-amber-200 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 3: Choose Framed Canvas Size or Instant Digital Format */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              3. Select Frame Size or Instant Download:
            </label>

            <div className="space-y-2.5">
              {FORMAT_TIERS.map((tier) => {
                const isSelected = tier.id === activeFormat.id
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedFormatId(tier.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 shadow-lg'
                        : 'bg-[#070a12] border-white/15 hover:border-white/35'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#f7f4ef]">
                          {tier.label}
                        </span>
                        {tier.badge && (
                          <span className="px-2 py-0.5 rounded bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{tier.subtitle}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-bold text-[#f7f4ef] block">
                        ${tier.priceUsd}
                      </span>
                      {tier.compareAtUsd && (
                        <span className="text-xs text-slate-400 line-through block">
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
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/35">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigitalBump}
                  onChange={(e) => setIncludeDigitalBump(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber-400 rounded cursor-pointer"
                />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-emerald-300 block">
                    {DIGITAL_BACKUP_BUMP.title}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {DIGITAL_BACKUP_BUMP.description}
                  </p>
                </div>
              </label>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-400/40 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Primary Checkout Button */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-bold text-sm sm:text-base transition shadow-xl flex items-center justify-center gap-2"
            >
              <span>
                {isCheckingOut
                  ? 'Preparing Your Archival Order...'
                  : `Order Custom Print — $${totalUsd}`}
              </span>
              <span>→</span>
            </button>

            <p className="text-[11px] text-slate-300 text-center">
              🇺🇸 Framed prints ship free from US archival studios in 3–5 business days · 100% Satisfaction Guarantee
            </p>
          </div>
        </div>
      </div>

      {!compactHeroMode && (
        <>
          {/* Verified Buyer Reviews */}
          <section className="space-y-6 border-t border-white/10 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Verified US Orders
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f7f4ef]">
                  What Families &amp; Gift Buyers Are Saying
                </h2>
              </div>
              <span className="text-sm font-semibold text-amber-300">
                ★★★★★ 4.9 / 5 Average Rating
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0d121f]/80 border border-white/10 p-6 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-bold">★★★★★</span>
                    <span className="text-emerald-300 font-medium">
                      Verified Buyer · {rev.formatPurchased}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#f7f4ef]">
                    {rev.title}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    &ldquo;{rev.body}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400">
                    — {rev.author} ({rev.location})
                  </p>
                </div>
              ))}
            </div>
          </section>

          <AdUnit slot="4800798822" />

          {/* More Custom Prints */}
          <section className="space-y-6 border-t border-white/10 pt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#f7f4ef]">
                Explore More Custom Archival Prints
              </h2>
              <Link href="/" className="text-xs font-bold text-amber-300 hover:text-amber-200">
                View All 6 Editions →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {EVERMARK_CATALOG.filter((p) => p.slug !== product.slug)
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/create/${item.slug}`}
                    className="rounded-2xl bg-[#0d121f]/80 border border-white/10 hover:border-amber-400/50 p-6 transition flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                        {item.badge}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#f7f4ef] group-hover:text-amber-300 transition">
                        {item.shortTitle}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                      <span className="text-[#f7f4ef]">
                        From ${item.startingPriceUsd} · Framed ${item.popularPriceUsd}
                      </span>
                      <span className="text-amber-300">Customize →</span>
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
