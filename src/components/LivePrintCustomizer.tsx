'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  EvermarkProduct,
  COLORWAYS,
  ColorwayId,
  FRAME_FINISHES,
  FrameFinishId,
  PhotoFilterId,
  FORMAT_TIERS,
  DIGITAL_BACKUP_BUMP,
  EVERMARK_CATALOG,
} from '@/lib/catalog'
import AdUnit from '@/components/AdUnit'

interface LivePrintCustomizerProps {
  product: EvermarkProduct
  compactHeroMode?: boolean
}

const FAST_US_COORDS: Record<string, string> = {
  'charleston, sc': '32.7765° N · 79.9311° W',
  'charleston, south carolina': '32.7765° N · 79.9311° W',
  'new york, ny': '40.7128° N · 74.0060° W',
  'boston, ma': '42.3601° N · 71.0589° W',
  'boston, massachusetts': '42.3601° N · 71.0589° W',
  'nashville, tn': '36.1627° N · 86.7816° W',
  'savannah, ga': '32.0809° N · 81.0912° W',
  'savannah, georgia': '32.0809° N · 81.0912° W',
  'austin, tx': '30.2672° N · 97.7431° W',
  'denver, co': '39.7392° N · 104.9903° W',
  'seattle, wa': '47.6062° N · 122.3321° W',
  'chicago, il': '41.8781° N · 87.6298° W',
  'san diego, ca': '32.7157° N · 117.1611° W',
  'san francisco, ca': '37.7749° N · 122.4194° W',
  'nantucket, ma': '41.2835° N · 70.0995° W',
  'newport, ri': '41.4901° N · 71.3128° W',
  'providence, ri': '41.8240° N · 71.4128° W',
  'providence, rhode island': '41.8240° N · 71.4128° W',
  'miami, fl': '25.7617° N · 80.1918° W',
  'charlotte, nc': '35.2271° N · 80.8431° W',
}

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function formatDurationClock(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.max(1, Math.round(sec % 60))
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function LivePrintCustomizer({
  product: initialProduct,
  compactHeroMode = false,
}: LivePrintCustomizerProps) {
  const [activeProductSlug, setActiveProductSlug] = useState<string>(initialProduct.slug)
  const product =
    EVERMARK_CATALOG.find((p) => p.slug === activeProductSlug) || initialProduct

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cleanCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioInputRef = useRef<HTMLInputElement | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null)

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
  const [isGiftOrder, setIsGiftOrder] = useState<boolean>(false)
  const [giftNote, setGiftNote] = useState<string>('')

  // Photo Upload State
  const [uploadedPhotoEl, setUploadedPhotoEl] = useState<HTMLImageElement | null>(null)
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null)
  const [photoFilter, setPhotoFilter] = useState<PhotoFilterId>('warm_color')

  // Real Audio Upload & Live Microphone Recorder State
  const [customAudioPeaks, setCustomAudioPeaks] = useState<number[] | null>(null)
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null)
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false)

  // GPS Lookup State
  const [isLookingUpGps, setIsLookingUpGps] = useState<boolean>(false)
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null)

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Sync defaults when switching products in compactHeroMode
  function handleSwitchProduct(newSlug: string) {
    const nextProd = EVERMARK_CATALOG.find((p) => p.slug === newSlug)
    if (!nextProd) return
    setActiveProductSlug(newSlug)
    setHeadline(nextProd.defaultHeadline)
    setSubline(nextProd.defaultSubline)
    setLocationText(nextProd.defaultLocation)
    setDateText(nextProd.defaultDateText)
    setCoordsText(nextProd.defaultCoords)
    setColorwayId(nextProd.defaultColorway)
    setFrameFinishId(nextProd.defaultFrame)
  }

  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const frameFinish =
    FRAME_FINISHES.find((f) => f.id === frameFinishId) || FRAME_FINISHES[0]
  const activeFormat =
    FORMAT_TIERS.find((f) => f.id === selectedFormatId) || FORMAT_TIERS[0]

  const showBump = activeFormat.isPhysical
  const totalUsd =
    activeFormat.priceUsd + (showBump && includeDigitalBump ? DIGITAL_BACKUP_BUMP.priceUsd : 0)

  // Two-Pass Renderer:
  // Pass 1 renders the pure, clean artwork (no technical DPI/Plate text) to cleanCanvasRef.
  // Pass 2 copies to visible canvasRef and overlays the Anti-AI Guilloché Security Watermark Mesh.
  useEffect(() => {
    const visibleCanvas = canvasRef.current
    if (!visibleCanvas) return

    if (!cleanCanvasRef.current) {
      cleanCanvasRef.current = document.createElement('canvas')
    }
    const cleanCanvas = cleanCanvasRef.current

    const W = 960
    const H = 1200
    cleanCanvas.width = W
    cleanCanvas.height = H
    visibleCanvas.width = W
    visibleCanvas.height = H

    const ctx = cleanCanvas.getContext('2d')
    const vCtx = visibleCanvas.getContext('2d')
    if (!ctx || !vCtx) return

    const seed = hashSeed(`${headline}|${locationText}|${dateText}|${coordsText}`)

    // 1. Archival Paper Fill
    ctx.fillStyle = colorway.bgHex
    ctx.fillRect(0, 0, W, H)

    // Subtle organic paper grain micro-dots
    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.024
    for (let g = 0; g < 650; g++) {
      const gx = (g * 7919) % W
      const gy = (g * 6271) % H
      ctx.fillRect(gx, gy, 1.5, 1.5)
    }
    ctx.globalAlpha = 1

    // 2. Clean Museum Double-Line Border (Zero technical DPI / Plate text!)
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.58
    ctx.lineWidth = 2
    ctx.strokeRect(52, 52, W - 104, H - 104)
    ctx.globalAlpha = 0.24
    ctx.lineWidth = 1
    ctx.strokeRect(64, 64, W - 128, H - 128)
    ctx.globalAlpha = 1

    const cx = W / 2
    const cy = 458
    const R = 304

    // Helper to draw uploaded photo inside a circular medallion with selected filter
    const drawUploadedPhotoMedallion = (radius: number, centerY = cy) => {
      if (!uploadedPhotoEl) return false
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, centerY, radius, 0, Math.PI * 2)
      ctx.clip()

      if (photoFilter === 'bw_film') {
        ctx.filter = 'grayscale(100%) contrast(112%) sepia(12%)'
      } else if (photoFilter === 'charcoal_sketch') {
        ctx.filter = 'grayscale(100%) contrast(165%) brightness(106%) sepia(22%)'
      } else {
        ctx.filter = 'contrast(104%) saturate(105%)'
      }

      const iw = uploadedPhotoEl.width
      const ih = uploadedPhotoEl.height
      const scale = Math.max((radius * 2) / iw, (radius * 2) / ih)
      const dw = iw * scale
      const dh = ih * scale
      ctx.drawImage(uploadedPhotoEl, cx - dw / 2, centerY - dh / 2, dw, dh)
      ctx.filter = 'none'
      ctx.restore()

      // Warm double bezel around photo medallion
      ctx.save()
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(cx, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.arc(cx, centerY, radius + 10, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
      return true
    }

    // 3. Artwork Renderer by Mode
    ctx.save()
    if (product.mode === 'starmap') {
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

      for (let i = 0; i < 72; i++) {
        const ang = (i * Math.PI * 2) / 72
        const inner = i % 6 === 0 ? R - 15 : R - 7
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner)
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R)
        ctx.stroke()
      }

      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.85
      ctx.font = '600 13px Georgia, serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', cx, cy - R - 10)
      ctx.fillText('S', cx, cy + R + 20)
      ctx.fillText('E', cx + R + 16, cy + 4)
      ctx.fillText('W', cx - R - 16, cy + 4)

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
        ((seed % 180) * Math.PI) / 180,
        0,
        Math.PI * 2
      )
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, R - 17, 0, Math.PI * 2)
      ctx.clip()

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

      if (uploadedPhotoEl) {
        drawUploadedPhotoMedallion(112, cy)
      }
    } else if (product.mode === 'soundwave') {
      const waveCenterY = uploadedPhotoEl ? cy + 125 : cy
      if (uploadedPhotoEl) {
        drawUploadedPhotoMedallion(135, cy - 95)
      }

      const bars = 96
      const waveW = 680
      const startX = (W - waveW) / 2
      const stepX = waveW / bars
      const maxAmp = uploadedPhotoEl ? 110 : 230

      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(startX - 20, waveCenterY)
      ctx.lineTo(startX + waveW + 20, waveCenterY)
      ctx.stroke()

      for (let i = 0; i <= bars; i++) {
        let amp: number
        if (customAudioPeaks && customAudioPeaks.length > 0) {
          const peakVal = customAudioPeaks[i % customAudioPeaks.length] || 0.15
          amp = Math.max(8, peakVal * maxAmp)
        } else {
          const bSeed = hashSeed(`${seed}-bar-${i}`)
          const env = Math.sin((i / bars) * Math.PI)
          const mod =
            0.35 +
            0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
            0.2 * ((bSeed % 100) / 100)
          amp = Math.max(8, env * mod * maxAmp)
        }

        const x = startX + i * stepX
        ctx.strokeStyle = i % 4 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = i % 4 === 0 ? 0.95 : 0.78
        ctx.lineWidth = 3.0
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, waveCenterY - amp)
        ctx.lineTo(x, waveCenterY + amp)
        ctx.stroke()
      }

      if (!uploadedPhotoEl) {
        ctx.globalAlpha = 0.28
        ctx.strokeStyle = colorway.accentHex
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, R, 0, Math.PI * 2)
        ctx.stroke()
      }
    } else if (product.mode === 'vinyl_lyric') {
      // Concentric Vinyl Grooves & Spiral Lyric Ring
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.stroke()

      for (let ring = 118; ring < R - 8; ring += 11) {
        ctx.strokeStyle = ring % 33 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = ring % 33 === 0 ? 0.65 : 0.24
        ctx.lineWidth = ring % 33 === 0 ? 1.6 : 1
        ctx.beginPath()
        ctx.arc(cx, cy, ring, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Center Vinyl Label or Uploaded Couple Photo
      ctx.globalAlpha = 1
      if (!drawUploadedPhotoMedallion(108, cy)) {
        ctx.fillStyle = colorway.accentHex
        ctx.beginPath()
        ctx.arc(cx, cy, 106, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = colorway.bgHex
        ctx.font = 'bold 14px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(locationText.slice(0, 24).toUpperCase(), cx, cy - 36)
        ctx.font = 'italic 12px Georgia, serif'
        ctx.fillText(dateText.slice(0, 26), cx, cy + 48)

        // Spindle hole
        ctx.beginPath()
        ctx.arc(cx, cy, 14, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (product.mode === 'pet_memorial' || product.mode === 'birth_stat') {
      if (!drawUploadedPhotoMedallion(215, cy)) {
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
        ctx.arc(cx, cy - 145, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (product.mode === 'three_map_triptych') {
      const offsets = [-225, 0, 225]
      const labels = ['MET', 'ENGAGED', 'MARRIED']
      offsets.forEach((off, idx) => {
        const mcx = cx + off
        const mr = 98
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 0.9
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.arc(mcx, cy, mr, 0, Math.PI * 2)
        ctx.stroke()

        for (let r = 22; r < mr; r += 18) {
          ctx.globalAlpha = 0.28
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.ellipse(mcx, cy, r, r * 0.82, (idx + 1) * 0.4, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.fillStyle = colorway.accentHex
        ctx.globalAlpha = 0.95
        ctx.font = '600 13px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(labels[idx], mcx, cy + mr + 28)
      })
      if (uploadedPhotoEl) {
        drawUploadedPhotoMedallion(96, cy)
      }
    } else if (product.mode === 'family_botanical') {
      if (!drawUploadedPhotoMedallion(195, cy)) {
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 0.55
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2)
        ctx.stroke()

        // Botanical stems & leaves
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 0.9
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx, cy + 185)
        ctx.quadraticCurveTo(cx - 12, cy, cx, cy - 175)
        ctx.stroke()

        const leafPairs = [-120, -65, -10, 45, 100]
        leafPairs.forEach((ly, i) => {
          const dir = i % 2 === 0 ? 1 : -1
          ctx.fillStyle = i % 2 === 0 ? colorway.accentHex : colorway.inkHex
          ctx.globalAlpha = 0.82
          ctx.beginPath()
          ctx.ellipse(
            cx + dir * 52,
            cy + ly,
            46,
            18,
            dir * -0.35,
            0,
            Math.PI * 2
          )
          ctx.fill()
        })
      }
    } else if (product.mode === 'marathon_route') {
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 2.5
      ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2)
      ctx.stroke()

      if (!drawUploadedPhotoMedallion(175, cy)) {
        const coursePts = [
          [cx - 175, cy + 115],
          [cx - 105, cy + 25],
          [cx - 45, cy + 58],
          [cx + 15, cy - 55],
          [cx + 95, cy - 22],
          [cx + 165, cy - 125],
        ]
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 1
        ctx.lineWidth = 6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        coursePts.forEach(([px, py], idx) => {
          if (idx === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()

        ctx.fillStyle = colorway.inkHex
        ;[coursePts[0], coursePts[coursePts.length - 1]].forEach(([px, py]) => {
          ctx.beginPath()
          ctx.arc(px, py, 9, 0, Math.PI * 2)
          ctx.fill()
        })
      }
    } else if (product.mode === 'book_stack') {
      const books = [
        { w: 460, h: 52, title: headline.slice(0, 28) },
        { w: 410, h: 46, title: locationText.slice(0, 28) },
        { w: 490, h: 56, title: subline.slice(0, 32) },
        { w: 435, h: 48, title: dateText.slice(0, 28) },
        { w: 515, h: 58, title: coordsText.slice(0, 28) },
      ]
      let curY = cy - 135
      books.forEach((b, idx) => {
        const bx = cx - b.w / 2
        ctx.strokeStyle = idx % 2 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.lineWidth = 2.4
        ctx.globalAlpha = 0.9
        ctx.strokeRect(bx, curY, b.w, b.h)
        ctx.strokeRect(bx + 24, curY + 6, b.w - 48, b.h - 12)

        ctx.fillStyle = colorway.inkHex
        ctx.font = '600 15px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(b.title.toUpperCase(), cx, curY + b.h / 2 + 5)
        curY += b.h + 10
      })
    } else if (product.mode === 'coordinates' || product.mode === 'coastal_chart') {
      if (!drawUploadedPhotoMedallion(205, cy)) {
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
      }
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

    // Optional Secondary Soundwave Bar under any print if audio was uploaded on a non-soundwave mode
    if (product.mode !== 'soundwave' && customAudioPeaks && customAudioPeaks.length > 0) {
      ctx.save()
      const bars = 64
      const span = 380
      const sx0 = cx - span / 2
      const wy = 805
      for (let i = 0; i <= bars; i++) {
        const pk = customAudioPeaks[i % customAudioPeaks.length] || 0.2
        const amp = Math.max(4, pk * 26)
        const x = sx0 + (i * span) / bars
        ctx.strokeStyle = i % 3 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = 0.85
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(x, wy - amp)
        ctx.lineTo(x, wy + amp)
        ctx.stroke()
      }
      ctx.restore()
    }

    // 4. Clean Museum Typography Block Below Artwork (Zero technical DPI stamps!)
    ctx.textAlign = 'center'

    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.65
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - 130, 850)
    ctx.lineTo(cx + 130, 850)
    ctx.stroke()

    ctx.globalAlpha = 1
    ctx.fillStyle = colorway.inkHex
    ctx.font = '600 32px Georgia, serif'
    ctx.fillText(headline.toUpperCase().slice(0, 42), cx, 908)

    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.88
    ctx.font = 'italic 21px Georgia, serif'
    ctx.fillText(subline.slice(0, 68), cx, 956)

    ctx.fillStyle = colorway.accentHex
    ctx.globalAlpha = 0.95
    ctx.font = '600 17px sans-serif'
    ctx.fillText(`${locationText.toUpperCase()}   ·   ${dateText.toUpperCase()}`, cx, 1020)

    ctx.fillStyle = colorway.mutedHex
    ctx.globalAlpha = 0.9
    ctx.font = '500 15px monospace'
    ctx.fillText(coordsText, cx, 1062)

    // =========================================================================
    // PASS 2: Copy to Visible Preview Canvas + Overlay Anti-AI Security Watermark
    // =========================================================================
    vCtx.clearRect(0, 0, W, H)
    vCtx.drawImage(cleanCanvas, 0, 0)

    // Anti-AI-Inpainting Guilloché Sinusoidal Wave Lattice + Multi-Angle Security Stamp
    vCtx.save()
    // 1. Intersecting sinusoidal Guilloché waves crossing high-frequency artwork & text edges
    for (let wIdx = 0; wIdx < 14; wIdx++) {
      const baseY = 120 + wIdx * 76
      vCtx.beginPath()
      for (let x = 60; x <= W - 60; x += 8) {
        const y1 =
          baseY +
          Math.sin(x * 0.022 + wIdx * 0.7) * 28 +
          Math.cos(x * 0.055 - wIdx) * 10
        if (x === 60) vCtx.moveTo(x, y1)
        else vCtx.lineTo(x, y1)
      }
      vCtx.strokeStyle = wIdx % 2 === 0 ? colorway.accentHex : colorway.inkHex
      vCtx.globalAlpha = 0.16
      vCtx.lineWidth = 1.35
      vCtx.stroke()
    }

    // 2. Diagonal Cross-Hatching Security Grid over Center Medallion & Typography
    vCtx.translate(W / 2, H / 2)
    vCtx.rotate(-0.42)
    vCtx.textAlign = 'center'
    vCtx.font = 'bold 19px monospace'

    for (let row = -520; row <= 520; row += 105) {
      for (let col = -420; col <= 420; col += 360) {
        vCtx.fillStyle = colorway.inkHex
        vCtx.globalAlpha = 0.19
        vCtx.fillText(
          'EVERMARK PRINTS · PROOF ONLY · DO NOT COPY',
          col + (row % 210 === 0 ? 90 : 0),
          row
        )
        vCtx.fillStyle = colorway.accentHex
        vCtx.globalAlpha = 0.17
        vCtx.fillText(
          'EVERMARK PRINTS · PROOF ONLY · DO NOT COPY',
          col + 1.5 + (row % 210 === 0 ? 90 : 0),
          row + 1.5
        )
      }
    }

    // 3. Central Security Seal Ring over Focal Point
    vCtx.rotate(0.42)
    vCtx.strokeStyle = colorway.accentHex
    vCtx.globalAlpha = 0.24
    vCtx.lineWidth = 2
    vCtx.setLineDash([8, 6])
    vCtx.beginPath()
    vCtx.arc(0, -142, 168, 0, Math.PI * 2)
    vCtx.stroke()
    vCtx.restore()
  }, [
    headline,
    subline,
    locationText,
    dateText,
    coordsText,
    colorway,
    customAudioPeaks,
    uploadedPhotoEl,
    photoFilter,
    product.mode,
  ])

  function handleApplyPreset(preset: EvermarkProduct['presets'][number]) {
    setHeadline(preset.headline)
    setSubline(preset.subline)
    setLocationText(preset.location)
    setDateText(preset.dateText)
    setCoordsText(preset.coords)
  }

  // Handle Custom Photo / Portrait Attachment
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        setUploadedPhotoEl(img)
        setUploadedPhotoName(file.name)
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // 1-Click City/Address -> GPS Coordinates Auto-Lookup
  async function handleLookupCoordinates() {
    const query = locationText.trim()
    if (!query) return

    setIsLookingUpGps(true)
    setGpsStatusMsg(null)

    const normalized = query.toLowerCase()
    if (FAST_US_COORDS[normalized]) {
      setCoordsText(FAST_US_COORDS[normalized])
      setGpsStatusMsg('Exact coordinates plotted.')
      setIsLookingUpGps(false)
      return
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        const latDir = lat >= 0 ? 'N' : 'S'
        const lonDir = lon >= 0 ? 'E' : 'W'
        const formatted = `${Math.abs(lat).toFixed(4)}° ${latDir} · ${Math.abs(lon).toFixed(
          4
        )}° ${lonDir}`
        setCoordsText(formatted)
        setGpsStatusMsg('Exact GPS coordinates plotted from location.')
      } else {
        setGpsStatusMsg('Location not found — try "City, State" format.')
      }
    } catch {
      setGpsStatusMsg('Unable to reach coordinate service — you may type coordinates directly.')
    } finally {
      setIsLookingUpGps(false)
    }
  }

  // Real Voice Note / Song Audio File Waveform Extractor (Web Audio API)
  async function handleAudioFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const arrayBuffer = await file.arrayBuffer()
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioCtx = new AudioCtx()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      const rawData = audioBuffer.getChannelData(0)

      const bars = 97
      const blockSize = Math.max(1, Math.floor(rawData.length / bars))
      const peaks: number[] = []
      let maxPeak = 0.01

      for (let i = 0; i < bars; i++) {
        let sum = 0
        const start = i * blockSize
        for (let j = 0; j < blockSize; j++) {
          const sample = rawData[start + j] || 0
          sum += sample * sample
        }
        const rms = Math.sqrt(sum / blockSize)
        if (rms > maxPeak) maxPeak = rms
        peaks.push(rms)
      }

      const normalized = peaks.map((p) =>
        Math.min(1, Math.max(0.08, Math.pow(p / maxPeak, 0.75)))
      )
      setCustomAudioPeaks(normalized)
      setUploadedAudioName(file.name)
      setCoordsText(`00:00 —————————●———— ${formatDurationClock(audioBuffer.duration)}`)
      await audioCtx.close()
    } catch {
      setErrorMsg(
        'Could not decode that audio file. Please upload a standard .mp3, .wav, or .m4a file.'
      )
    }
  }

  // Live 5-Second Microphone Voice Note Recorder
  async function handleRecordMicrophone() {
    if (isRecordingMic) return
    setErrorMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsRecordingMic(true)
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setIsRecordingMic(false)
        try {
          const blob = new Blob(chunks)
          const arrayBuffer = await blob.arrayBuffer()
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          const audioCtx = new AudioCtx()
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
          const rawData = audioBuffer.getChannelData(0)
          const bars = 97
          const blockSize = Math.max(1, Math.floor(rawData.length / bars))
          const peaks: number[] = []
          let maxPeak = 0.01
          for (let i = 0; i < bars; i++) {
            let sum = 0
            const start = i * blockSize
            for (let j = 0; j < blockSize; j++) {
              const s = rawData[start + j] || 0
              sum += s * s
            }
            const rms = Math.sqrt(sum / blockSize)
            if (rms > maxPeak) maxPeak = rms
            peaks.push(rms)
          }
          const normalized = peaks.map((p) =>
            Math.min(1, Math.max(0.1, Math.pow(p / maxPeak, 0.75)))
          )
          setCustomAudioPeaks(normalized)
          setUploadedAudioName('Live Voice Recording (5s)')
          setCoordsText(`00:00 —————————●———— ${formatDurationClock(audioBuffer.duration)}`)
          await audioCtx.close()
        } catch {
          setUploadedAudioName('Voice Note Plotted')
        }
      }
      recorder.start()
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, 4500)
    } catch {
      setIsRecordingMic(false)
      setErrorMsg(
        'Microphone permission was declined or unavailable. You can upload an audio file (.MP3/.M4A/.WAV) instead.'
      )
    }
  }

  async function handleCheckout() {
    setIsCheckingOut(true)
    setErrorMsg(null)

    try {
      const serializedPeaks = customAudioPeaks
        ? customAudioPeaks.map((n) => Math.round(n * 100)).join(',')
        : ''

      if (typeof window !== 'undefined') {
        // Save the CLEAN unwatermarked canvas in localStorage so /success unlocks the unwatermarked print after Stripe payment!
        const cleanCanvas = cleanCanvasRef.current
        const previewDataUrl = cleanCanvas ? cleanCanvas.toDataURL('image/png') : ''
        window.localStorage.setItem(
          'evermark_last_custom_print',
          JSON.stringify({
            productSlug: product.slug,
            productTitle: product.title,
            mode: product.mode,
            plateNumber: product.plateNumber,
            headline,
            subline,
            locationText,
            dateText,
            coordsText,
            colorwayId,
            frameFinishId,
            formatLabel: `${activeFormat.label} (${frameFinish.label})`,
            giftNote: isGiftOrder ? giftNote : '',
            customPeaks: serializedPeaks,
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
          description: 'Instant Unwatermarked High-Resolution Digital Print Master File',
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
            giftNote: isGiftOrder ? giftNote.slice(0, 240) : '',
            customPeaks: serializedPeaks.slice(0, 350),
            hasCustomPhoto: uploadedPhotoName ? 'yes' : 'no',
            hasCustomAudio: uploadedAudioName ? 'yes' : 'no',
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
    <div className="space-y-12">
      {/* Homepage Interactive Product Style Switcher */}
      {compactHeroMode && (
        <div className="bg-[#FDFBF7] border border-[#D4C3AE] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#7A331E] font-semibold">
              CHOOSE YOUR KEEPSAKE STYLE TO CUSTOMIZE LIVE (12 BESPOKE EDITIONS):
            </span>
            <span className="text-xs text-[#5C4D42]">
              Supports Custom Photos, Voice/Song Audio, &amp; 1-Click GPS Coordinates
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {EVERMARK_CATALOG.map((item) => {
              const isCurrent = item.slug === product.slug
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleSwitchProduct(item.slug)}
                  className={`p-2.5 text-left border transition flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027] shadow-sm'
                      : 'bg-[#F8F3EA] text-[#261A13] border-[#D8C9B6] hover:border-[#7A331E]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono-tech uppercase tracking-wider block ${
                      isCurrent ? 'text-[#E5C178]' : 'text-[#8C583A]'
                    }`}
                  >
                    {item.categoryLabel.split(' ')[0]}
                  </span>
                  <span className="text-xs font-semibold leading-snug mt-0.5 line-clamp-1">
                    {item.shortTitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: INTERACTIVE ROOM STAGING & MUSEUM FRAME VIEWER (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          {/* View Mode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8C9B6] pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('room')}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  viewMode === 'room'
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                Warm Gallery Room View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('studio')}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  viewMode === 'studio'
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                Close-Up Frame View
              </button>
            </div>

            <span className="text-[11px] font-mono-tech uppercase tracking-[0.12em] text-[#7A331E] font-medium">
              {frameFinish.label} · {colorway.shortLabel}
            </span>
          </div>

          {/* Interactive Gallery Wall Stage */}
          <div
            className={`relative overflow-hidden border border-[#CBB89F] transition-all select-none ${
              viewMode === 'room'
                ? 'gallery-wall-surface pt-10 pb-20 px-6 sm:px-14'
                : 'bg-[#E9DFCF] py-8 px-4 sm:px-10'
            }`}
            onContextMenu={(e) => e.preventDefault()}
          >
            {viewMode === 'room' && (
              <>
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    background:
                      'linear-gradient(125deg, rgba(255,248,235,0.88) 0%, rgba(242,226,202,0.15) 48%, rgba(156,122,88,0.28) 100%)',
                  }}
                />
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#5C4D42] mb-6">
                  <span>LIVE INTERACTIVE STUDIO PREVIEW</span>
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
                    ? '24px 34px 58px rgba(38, 24, 14, 0.38), 4px 8px 16px rgba(38, 24, 14, 0.2)'
                    : '0 24px 48px rgba(38, 24, 14, 0.25)',
                border: `2px solid ${frameFinish.lipHex}`,
              }}
            >
              <div
                style={{
                  border: `2px solid ${frameFinish.innerHex}`,
                  backgroundColor: '#F8F4EC',
                  padding: viewMode === 'room' ? '16px' : '22px',
                }}
              >
                <div
                  className="p-[2px]"
                  style={{
                    backgroundColor: '#D4C7B4',
                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.18)',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                    className="w-full h-auto block pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>

            {viewMode === 'room' && (
              <>
                <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-[3px] bg-[#CBB89F] border-b border-[#FAF5EC]" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-[#DDD0BC]" />
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

          {/* Security Watermark Notice & Occasion Presets (Zero Free Downloads!) */}
          <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#7A331E] font-semibold">
                Quick Presets:
              </span>
              {product.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 border border-[#D8C9B6] hover:border-[#1B3027] bg-[#F8F3EA] text-[#261A13] text-[11px] font-medium transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#6E5A4C] font-mono-tech">
              🔒 Security Watermark Removed on Final Print
            </span>
          </div>

          {!compactHeroMode && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {product.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FDFBF7] border border-[#D8C9B6] flex items-start gap-3 text-[#3D2E24]"
                >
                  <span className="font-mono-tech text-[#9E472A] font-semibold">
                    0{i + 1}
                  </span>
                  <span className="leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BESPOKE STUDIO CONTROLS & CHECKOUT (5 Cols) */}
        <div className="lg:col-span-5 bg-[#FDFBF7] border border-[#CBB89F] p-6 sm:p-8 shadow-md space-y-6">
          <div className="space-y-2 border-b border-[#E5D9C5] pb-5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#9E472A] font-semibold">
              <span>{product.categoryLabel}</span>
              <span className="text-[#1B3027]">★★★★★ 4.9 / 5.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#261A13] leading-tight">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* STEP 1: Select 8 Rich Designer Palettes */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              01. Choose Designer Color Palette (8 Archival Editions)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLORWAYS.map((c) => {
                const isSel = c.id === colorwayId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorwayId(c.id)}
                    className={`p-2.5 border text-left transition flex items-center gap-2.5 ${
                      isSel
                        ? 'border-[#1B3027] bg-[#F3E9DA] ring-1 ring-[#1B3027]'
                        : 'border-[#D8C9B6] bg-[#FDFBF7] hover:border-[#9E472A]'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/25 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: c.bgHex }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: c.accentHex }}
                      />
                    </span>
                    <span className="text-xs font-medium text-[#261A13] leading-tight truncate">
                      {c.shortLabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: Select Hardwood Frame Finish */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
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
                        ? 'border-[#1B3027] bg-[#F3E9DA] ring-1 ring-[#1B3027]'
                        : 'border-[#D8C9B6] bg-[#FDFBF7] hover:border-[#9E472A]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 border border-black/20 shrink-0"
                      style={{ backgroundColor: f.outerHex }}
                    />
                    <span className="text-xs font-medium text-[#261A13] truncate">
                      {f.shortLabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 3: Attach Custom Photo OR Voice/Song Audio (Always Visible!) */}
          <div className="space-y-3 pt-1">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              03. Attach Photo Portrait or Voice/Song Audio (Optional)
            </label>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {/* Photo Attachment Box */}
              <div className="p-3 bg-[#F6EFE4] border border-[#D8C9B6] space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
                    Custom Photo Medallion
                  </span>
                  <p className="text-[11px] text-[#5C4D42] leading-snug mt-0.5">
                    Embed a couple, baby, pet, or home photo into your print.
                  </p>
                </div>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider transition"
                  >
                    {uploadedPhotoName ? 'Change Photo...' : '+ Attach Photo (.JPG/.PNG)'}
                  </button>

                  {uploadedPhotoEl && (
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {(['warm_color', 'bw_film', 'charcoal_sketch'] as PhotoFilterId[]).map(
                        (filt) => (
                          <button
                            key={filt}
                            type="button"
                            onClick={() => setPhotoFilter(filt)}
                            className={`px-1.5 py-0.5 text-[10px] border ${
                              photoFilter === filt
                                ? 'bg-[#261A13] text-[#F7F4ED] border-[#261A13]'
                                : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6]'
                            }`}
                          >
                            {filt === 'warm_color'
                              ? 'Warm'
                              : filt === 'bw_film'
                              ? 'B&W'
                              : 'Sketch'}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhotoEl(null)
                          setUploadedPhotoName(null)
                        }}
                        className="text-[10px] text-rose-800 underline px-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Voice / Song Audio Attachment & Live Mic Box */}
              <div className="p-3 bg-[#F6EFE4] border border-[#D8C9B6] space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold block">
                    Voice or Song Soundwave
                  </span>
                  <p className="text-[11px] text-[#5C4D42] leading-snug mt-0.5">
                    Upload a song/voicemail clip or record 5s from your mic.
                  </p>
                </div>

                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="w-full py-1.5 px-2.5 bg-[#261A13] hover:bg-[#3A281D] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider transition"
                  >
                    {uploadedAudioName ? '✓ Audio Attached' : '+ Upload Audio (.MP3/.WAV)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRecordMicrophone}
                    disabled={isRecordingMic}
                    className="w-full py-1.5 px-2.5 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-wider transition"
                  >
                    {isRecordingMic ? '● Recording Mic (5s)...' : '🎙 Record Voice Note (5s)'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Personalize Inscription */}
          <div className="space-y-3.5 pt-1">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              04. Personalize Your Inscription (Updates Live)
            </label>

            <div className="space-y-1">
              <span className="text-xs text-[#4A3B31] font-medium block">
                Primary Title / Heading
              </span>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={42}
                className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                placeholder="e.g., THE NIGHT OUR STORY BEGAN"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#4A3B31] font-medium block">
                Dedication / Subtitle Line
              </span>
              <input
                type="text"
                value={subline}
                onChange={(e) => setSubline(e.target.value)}
                maxLength={68}
                className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                placeholder="e.g., Underneath these exact stars, everything changed."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4A3B31] font-medium">
                    City, Place or Names
                  </span>
                  <button
                    type="button"
                    disabled={isLookingUpGps}
                    onClick={handleLookupCoordinates}
                    className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9E472A] hover:text-[#1B3027] underline underline-offset-2 font-semibold"
                  >
                    {isLookingUpGps ? 'Plotting...' : 'Auto-Find GPS ⌖'}
                  </button>
                </div>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  maxLength={38}
                  className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#4A3B31] font-medium block">
                  Date / Time / Year
                </span>
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  maxLength={34}
                  className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4A3B31] font-medium">
                  Coordinates or Bottom Line
                </span>
                {gpsStatusMsg && (
                  <span className="text-[11px] font-mono-tech text-[#1B3027]">
                    {gpsStatusMsg}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={coordsText}
                onChange={(e) => setCoordsText(e.target.value)}
                maxLength={44}
                className="w-full border border-[#CBB89F] bg-[#F6EFE4] px-3.5 py-2 text-xs font-mono-tech text-[#261A13] focus:border-[#1B3027] focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 5: Select Size & Framing Tier */}
          <div className="space-y-2.5 pt-2">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              05. Select Edition Size &amp; Format
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
                        ? 'bg-[#F3E9DA] border-[#1B3027] ring-1 ring-[#1B3027]'
                        : 'bg-[#FDFBF7] border-[#D8C9B6] hover:border-[#9E472A]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-[#261A13]">
                          {tier.label}
                        </span>
                        {tier.badge && (
                          <span className="px-2 py-0.5 bg-[#1B3027] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C4D42]">{tier.subtitle}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-semibold text-[#261A13] block">
                        ${tier.priceUsd}
                      </span>
                      {tier.compareAtUsd && (
                        <span className="text-xs text-[#8C7A6B] line-through block">
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
            <div className="p-4 bg-[#F6EFE4] border border-[#CBB89F]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigitalBump}
                  onChange={(e) => setIncludeDigitalBump(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#1B3027] cursor-pointer"
                />
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-[#1B3027] block">
                    {DIGITAL_BACKUP_BUMP.title}
                  </span>
                  <p className="text-[#5C4D42] leading-relaxed">
                    {DIGITAL_BACKUP_BUMP.description}
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Gift Order & Complimentary Gift Note Option */}
          <div className="p-3.5 bg-[#FDFBF7] border border-[#D8C9B6] space-y-2.5">
            <label className="flex items-center justify-between gap-3 cursor-pointer text-xs">
              <span className="flex items-center gap-2.5 font-medium text-[#261A13]">
                <input
                  type="checkbox"
                  checked={isGiftOrder}
                  onChange={(e) => setIsGiftOrder(e.target.checked)}
                  className="h-4 w-4 accent-[#1B3027] cursor-pointer"
                />
                This Commission is a Gift (Add Complimentary Gift Note)
              </span>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A]">
                No Prices on Packing Slip
              </span>
            </label>

            {isGiftOrder && (
              <textarea
                rows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                maxLength={220}
                placeholder="Write your personal gift message here (included on your printable gift presentation card & order dossier)..."
                className="w-full border border-[#CBB89F] bg-[#F6EFE4] px-3 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
              />
            )}
          </div>

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
              className="w-full py-4 px-6 bg-[#1B3027] hover:bg-[#264437] disabled:opacity-60 text-[#F7F4ED] font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] transition flex items-center justify-center gap-3 shadow-md"
            >
              <span>
                {isCheckingOut
                  ? 'Preparing Archival Commission...'
                  : `Commission Custom Print — $${totalUsd}`}
              </span>
              <span>→</span>
            </button>

            <p className="text-[11px] text-[#5C4D42] text-center font-mono-tech">
              COMPLIMENTARY US FRAMED DELIVERY (3–5 DAYS) · SHIPS GIFT-READY WITH ZERO PRICE TAGS
            </p>
            <p className="text-[11px] text-[#7A6858] text-center">
              Protected by our{' '}
              <Link href="/refunds" className="underline underline-offset-2 text-[#261A13]">
                100% Damaged-or-Defective Replacement Guarantee
              </Link>{' '}
              ·{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#261A13]">
                Terms
              </Link>{' '}
              ·{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#261A13]">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {!compactHeroMode && (
        <>
          {/* Verified Collector Reviews */}
          <section className="space-y-6 border-t border-[#D8C9B6] pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
                  Verified Collector Notes
                </p>
                <h2 className="text-3xl font-editorial font-semibold text-[#261A13]">
                  In American Homes &amp; Studies
                </h2>
              </div>
              <span className="text-xs font-mono-tech text-[#1B3027] font-semibold">
                ★★★★★ 4.9 / 5.0 AVERAGE RATING
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#FDFBF7] border border-[#D8C9B6] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[#7A6858] font-mono-tech">
                    <span className="text-[#9E472A] font-semibold">★★★★★</span>
                    <span>{rev.formatPurchased}</span>
                  </div>
                  <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                    “{rev.title}”
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
                    {rev.body}
                  </p>
                  <p className="text-xs text-[#7A6858] pt-1 font-mono-tech uppercase tracking-wider">
                    — {rev.author} · {rev.location} (Verified Buyer)
                  </p>
                </div>
              ))}
            </div>
          </section>

          <AdUnit slot="4800798822" />

          {/* Cross-Sell Other Custom Archival Editions */}
          <section className="space-y-6 border-t border-[#D8C9B6] pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#261A13]">
                Explore More Custom Keepsake Collections
              </h2>
              <Link
                href="/"
                className="text-xs font-mono-tech uppercase tracking-[0.14em] text-[#1B3027] underline underline-offset-4"
              >
                View All 12 Collections →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVERMARK_CATALOG.filter((p) => p.slug !== product.slug)
                .slice(0, 3)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/create/${other.slug}`}
                    className="bg-[#FDFBF7] border border-[#D8C9B6] hover:border-[#1B3027] transition group flex flex-col justify-between overflow-hidden"
                  >
                    <div className="aspect-[5/4] w-full overflow-hidden bg-[#EFE5D6] border-b border-[#D8C9B6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={other.previewImage}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-mono-tech uppercase tracking-[0.16em] text-[#9E472A] font-semibold block">
                        {other.categoryLabel}
                      </span>
                      <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                        {other.shortTitle}
                      </h3>
                      <p className="text-xs text-[#5C4D42] line-clamp-2">
                        {other.subtitle}
                      </p>
                      <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between text-xs font-medium text-[#1B3027]">
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
