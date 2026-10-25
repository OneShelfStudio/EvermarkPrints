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
  COMPANION_ADD_ONS,
  EVERMARK_CATALOG,
} from '@/lib/catalog'
import { loadStoredBag, saveStoredBag, OrderBagItem } from '@/components/OrderBagDrawer'
import AdUnit from '@/components/AdUnit'

interface LivePrintCustomizerProps {
  product: EvermarkProduct
  compactHeroMode?: boolean
}

const FAST_US_COORDS: Record<string, string> = {
  'charleston, sc': '32.7765° N · 79.9311° W',
  'charleston, south carolina': '32.7765° N · 79.9311° W',
  'charleston harbor · south carolina': '32.7765° N · 79.9311° W',
  'asheville, nc': '35.5951° N · 82.5515° W',
  'asheville, north carolina': '35.5951° N · 82.5515° W',
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
  'nantucket, massachusetts': '41.2835° N · 70.0995° W',
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

export interface FamilyMemberFlower {
  id: string
  name: string
  month: string
}

export const BIRTH_FLOWERS_DICT: Record<string, { flower: string; symbol: string }> = {
  January: { flower: 'Carnation', symbol: '🌸' },
  February: { flower: 'Iris', symbol: '🌿' },
  March: { flower: 'Daffodil', symbol: '🌼' },
  April: { flower: 'Daisy', symbol: '🌺' },
  May: { flower: 'Lily of the Valley', symbol: '🌱' },
  June: { flower: 'Rose', symbol: '🌹' },
  July: { flower: 'Water Lily', symbol: '🪷' },
  August: { flower: 'Poppy', symbol: '🌾' },
  September: { flower: 'Morning Glory', symbol: '🌻' },
  October: { flower: 'Marigold', symbol: '🍂' },
  November: { flower: 'Chrysanthemum', symbol: '🍁' },
  December: { flower: 'Holly', symbol: '❄️' },
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

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

  const defaultVariant =
    product.variants.find((v) => v.badge === 'Most Popular') || product.variants[0]

  const [headline, setHeadline] = useState(product.defaultHeadline)
  const [subline, setSubline] = useState(product.defaultSubline)
  const [locationText, setLocationText] = useState(product.defaultLocation)
  const [dateText, setDateText] = useState(product.defaultDateText)
  const [coordsText, setCoordsText] = useState(product.defaultCoords)
  const [colorwayId, setColorwayId] = useState<ColorwayId>(product.defaultColorway)
  const [frameFinishId, setFrameFinishId] = useState<FrameFinishId>(product.defaultFrame)
  const [viewMode, setViewMode] = useState<'room' | 'studio'>('room')
  const [activeMockupUrl, setActiveMockupUrl] = useState<string | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(defaultVariant.id)

  // Companion Physical Add-Ons & Multi-Copy Bundle Options (Replaces nonsensical Digital Master)
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([])
  const [includeSecondCopyDiscount, setIncludeSecondCopyDiscount] = useState<boolean>(false)
  const [includePriorityStudioProof, setIncludePriorityStudioProof] = useState<boolean>(false)
  const [bagAddedToast, setBagAddedToast] = useState<string | null>(null)

  const [isGiftOrder, setIsGiftOrder] = useState<boolean>(false)
  const [giftNote, setGiftNote] = useState<string>('')

  // Wall-Scale Size Visualizer & Saved Proof Email Recovery State
  const [showScaleVisualizer, setShowScaleVisualizer] = useState<boolean>(false)
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false)
  const [saveProofEmail, setSaveProofEmail] = useState<string>('')
  const [isSavingProof, setIsSavingProof] = useState<boolean>(false)
  const [savedProofSuccessMsg, setSavedProofSuccessMsg] = useState<string | null>(null)
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFlower[]>([
    { id: '1', name: 'Emma', month: 'July' },
    { id: '2', name: 'Liam', month: 'October' },
    { id: '3', name: 'Olivia', month: 'April' },
  ])
  const [familyNote, setFamilyNote] = useState('Established 1984 · Three Generations')

  function syncFamilyMembersToCanvas(members: FamilyMemberFlower[], note: string) {
    const formatted = members
      .filter((m) => m.name.trim().length > 0)
      .map(
        (m) =>
          `${m.name.trim()} (${m.month.slice(0, 3)} · ${
            BIRTH_FLOWERS_DICT[m.month]?.flower || 'Rose'
          })`
      )
      .join('  •  ')
    setLocationText(formatted || 'Family Botanical Garden')
    setCoordsText(note || 'LOVE GROWS HERE FOREVER')
  }

  // Loaded Painterly Base Plate Image & Watercolor Portrait Backdrop
  const [basePlateEl, setBasePlateEl] = useState<HTMLImageElement | null>(null)
  const [portraitBackdropEl, setPortraitBackdropEl] = useState<HTMLImageElement | null>(null)

  // Photo Upload State (Only active on products where supportsPhotoUpload === true)
  const [uploadedPhotoEl, setUploadedPhotoEl] = useState<HTMLImageElement | null>(null)
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null)
  const [photoFilter, setPhotoFilter] = useState<PhotoFilterId>('warm_color')

  // Real Audio Upload & Live Microphone Recorder State (Only active on products where supportsAudioUpload === true)
  const [customAudioPeaks, setCustomAudioPeaks] = useState<number[] | null>(null)
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null)
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false)

  // GPS Lookup State
  const [isLookingUpGps, setIsLookingUpGps] = useState<boolean>(false)
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null)

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Load painterly base artwork plate whenever product.artworkPlate changes
  useEffect(() => {
    let active = true
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (active) setBasePlateEl(img)
    }
    img.src = product.artworkPlate
    return () => {
      active = false
    }
  }, [product.artworkPlate])

  // Preload watercolor portrait laurel backdrop for custom photo uploads
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setPortraitBackdropEl(img)
    img.src = '/art-plates/watercolor-portrait-backdrop.webp'
  }, [])

  // Restore shared or emailed custom design parameters from URL query string
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const qHead = params.get('headline')
    const qSub = params.get('subline')
    const qLoc = params.get('loc')
    const qDate = params.get('date')
    const qCoords = params.get('coords')
    const qColor = params.get('colorway') as ColorwayId | null
    const qFrame = params.get('frame') as FrameFinishId | null
    const qVar = params.get('variant')

    if (qHead) setHeadline(qHead)
    if (qSub) setSubline(qSub)
    if (qLoc) setLocationText(qLoc)
    if (qDate) setDateText(qDate)
    if (qCoords) setCoordsText(qCoords)
    if (qColor && COLORWAYS.some((c) => c.id === qColor)) setColorwayId(qColor)
    if (qFrame && FRAME_FINISHES.some((f) => f.id === qFrame)) setFrameFinishId(qFrame)
    if (qVar && product.variants.some((v) => v.id === qVar)) setSelectedVariantId(qVar)
    const qPromo = params.get('promo')
    if (qPromo && qPromo.trim().length > 0) {
      setAppliedPromoCode(qPromo.trim().toUpperCase())
    }
  }, [product.variants])

  function buildShareableDesignUrl(): string {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://www.evermarkprints.com'
    const p = new URLSearchParams({
      headline,
      subline,
      loc: locationText,
      date: dateText,
      coords: coordsText,
      colorway: colorwayId,
      frame: frameFinishId,
      variant: selectedVariantId,
      promo: 'WELCOME15',
    })
    return `${origin}/create/${product.slug}?${p.toString()}`
  }

  function handleCopyShareLink() {
    if (typeof window === 'undefined') return
    const url = buildShareableDesignUrl()
    navigator.clipboard?.writeText(url).catch(() => {})
    setShareLinkCopied(true)
    setTimeout(() => setShareLinkCopied(false), 4500)
  }

  async function handleEmailSavedProof(e: React.FormEvent) {
    e.preventDefault()
    if (!saveProofEmail.trim() || isSavingProof) return
    setIsSavingProof(true)
    setSavedProofSuccessMsg(null)
    try {
      const shareUrl = buildShareableDesignUrl()
      const res = await fetch('/api/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveProofEmail.trim(),
          productSlug: product.slug,
          productTitle: product.title,
          variantLabel: activeVariant.label,
          colorwayLabel: colorway.shortLabel,
          headline,
          subline,
          locationText,
          dateText,
          coordsText,
          shareUrl,
        }),
      })
      if (res.ok) {
        setAppliedPromoCode('WELCOME15')
        setSavedProofSuccessMsg(
          'Saved! Code WELCOME15 (15% Off) is now auto-applied to your checkout & emailed to your inbox.'
        )
        setSaveProofEmail('')
      } else {
        setSavedProofSuccessMsg('Please enter a valid email address.')
      }
    } catch {
      setSavedProofSuccessMsg('Unable to send email right now. You can copy your link directly.')
    } finally {
      setIsSavingProof(false)
    }
  }

  // Sync defaults when switching products in compactHeroMode
  function handleSwitchProduct(newSlug: string) {
    const nextProd = EVERMARK_CATALOG.find((p) => p.slug === newSlug)
    if (!nextProd) return
    const nextDefaultVar =
      nextProd.variants.find((v) => v.badge === 'Most Popular') || nextProd.variants[0]
    setActiveProductSlug(newSlug)
    setActiveMockupUrl(null)
    setHeadline(nextProd.defaultHeadline)
    setSubline(nextProd.defaultSubline)
    setLocationText(nextProd.defaultLocation)
    setDateText(nextProd.defaultDateText)
    setCoordsText(nextProd.defaultCoords)
    setColorwayId(nextProd.defaultColorway)
    setFrameFinishId(nextProd.defaultFrame)
    setSelectedVariantId(nextDefaultVar.id)
    if (newSlug === 'family-tree-botanical-print') {
      syncFamilyMembersToCanvas(familyMembers, familyNote)
    }
    if (!nextProd.supportsPhotoUpload) {
      setUploadedPhotoEl(null)
      setUploadedPhotoName(null)
    }
    if (!nextProd.supportsAudioUpload) {
      setCustomAudioPeaks(null)
      setUploadedAudioName(null)
    }
  }

  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const frameFinish =
    FRAME_FINISHES.find((f) => f.id === frameFinishId) || FRAME_FINISHES[0]
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants.find((v) => v.badge === 'Most Popular') ||
    product.variants[0]

  const secondCopyPriceUsd = Math.round(activeVariant.priceUsd * 0.75)
  const addOnsTotalUsd = selectedAddOnIds.reduce((sum, id) => {
    const found = COMPANION_ADD_ONS.find((a) => a.id === id)
    return sum + (found ? found.priceUsd : 0)
  }, 0)

  const totalUsd =
    activeVariant.priceUsd +
    (includeSecondCopyDiscount ? secondCopyPriceUsd : 0) +
    (includePriorityStudioProof ? 9 : 0) +
    addOnsTotalUsd

  function toggleCompanionAddOn(addOnId: string) {
    setSelectedAddOnIds((prev) =>
      prev.includes(addOnId) ? prev.filter((x) => x !== addOnId) : [...prev, addOnId]
    )
  }

  // Two-Pass Painterly Renderer:
  // Pass 1 renders the museum-grade painterly illustration plate + live custom photo/audio/typography to cleanCanvasRef.
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
    const isDarkPaper =
      colorway.id === 'bourbon_walnut' || colorway.id === 'obsidian_silver'

    // 1. Warm Archival Paper Fill (#FAF6F0 or Deep Gallery Dark)
    ctx.fillStyle = isDarkPaper ? colorway.bgHex : '#FAF6F0'
    ctx.fillRect(0, 0, W, H)

    const cx = W / 2
    const cy = 435

    // 2. Draw Painterly Artwork Plate (Full Bleed or Framed Plate Area)
    ctx.save()
    if (
      product.supportsPhotoUpload &&
      uploadedPhotoEl &&
      product.mode !== 'vinyl_lyric' &&
      product.mode !== 'soundwave' &&
      product.mode !== 'starmap'
    ) {
      // Draw watercolor laurel wreath backdrop + uploaded customer portrait in the center
      if (portraitBackdropEl) {
        ctx.drawImage(portraitBackdropEl, 36, 20, W - 72, H - 180)
      }
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 225, 0, Math.PI * 2)
      ctx.clip()
      if (photoFilter === 'bw_film') {
        ctx.filter = 'grayscale(100%) contrast(112%) sepia(12%)'
      } else if (photoFilter === 'charcoal_sketch') {
        ctx.filter = 'grayscale(100%) contrast(160%) brightness(106%) sepia(24%)'
      } else {
        ctx.filter = 'contrast(104%) saturate(105%)'
      }
      const iw = uploadedPhotoEl.width
      const ih = uploadedPhotoEl.height
      const scale = Math.max(450 / iw, 450 / ih)
      ctx.drawImage(
        uploadedPhotoEl,
        cx - (iw * scale) / 2,
        cy - 10 - (ih * scale) / 2,
        iw * scale,
        ih * scale
      )
      ctx.filter = 'none'
      ctx.restore()

      // Soft Watercolor Edge Feathering + Deckled Brushstroke Ring around uploaded portrait
      const featherGrad = ctx.createRadialGradient(cx, cy - 10, 178, cx, cy - 10, 228)
      featherGrad.addColorStop(0, 'rgba(250, 246, 240, 0)')
      featherGrad.addColorStop(0.72, 'rgba(250, 246, 240, 0.25)')
      featherGrad.addColorStop(1, isDarkPaper ? colorway.bgHex : '#FAF6F0')
      ctx.fillStyle = featherGrad
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 230, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.65
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy - 10, 218, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    } else if (basePlateEl) {
      if (isDarkPaper) {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(78, 68, W - 156, 735, 8)
        ctx.clip()
        ctx.drawImage(basePlateEl, 60, 20, W - 120, H - 60)
        ctx.restore()
        ctx.strokeStyle = colorway.accentHex
        ctx.lineWidth = 2
        ctx.strokeRect(78, 68, W - 156, 735)
      } else {
        ctx.drawImage(basePlateEl, 0, 0, W, H)
        const grad = ctx.createLinearGradient(0, 760, 0, 845)
        grad.addColorStop(0, 'rgba(250, 246, 240, 0)')
        grad.addColorStop(1, '#FAF6F0')
        ctx.fillStyle = grad
        ctx.fillRect(0, 760, W, 100)
        ctx.fillStyle = '#FAF6F0'
        ctx.fillRect(0, 840, W, H - 840)
      }

      // If customer uploaded a photo on First Dance Vinyl Song Portrait, embed it inside the center record label!
      if (product.supportsPhotoUpload && uploadedPhotoEl) {
        const medRadius = 112
        const medY = 426
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, medY, medRadius, 0, Math.PI * 2)
        ctx.clip()
        if (photoFilter === 'bw_film') {
          ctx.filter = 'grayscale(100%) contrast(112%) sepia(12%)'
        } else if (photoFilter === 'charcoal_sketch') {
          ctx.filter = 'grayscale(100%) contrast(160%) brightness(106%) sepia(24%)'
        }
        const iw = uploadedPhotoEl.width
        const ih = uploadedPhotoEl.height
        const scale = Math.max((medRadius * 2) / iw, (medRadius * 2) / ih)
        ctx.drawImage(
          uploadedPhotoEl,
          cx - (iw * scale) / 2,
          medY - (ih * scale) / 2,
          iw * scale,
          ih * scale
        )
        ctx.filter = 'none'
        ctx.restore()

        ctx.strokeStyle = '#D8AE64'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(cx, medY, medRadius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    ctx.restore()

    // 3. Dynamic Product-Specific Live Canvas Plotting (Stars, Birth Flowers, Nautical Pin, Soundwave + QR)
    if (product.mode === 'starmap' || product.mode === 'marathon_route') {
      // Dynamic Constellation Lines, Stars & Celestial Compass Ticks shifting with Location/Date/Coords
      ctx.save()
      const starCy = 395
      const starR = 265
      ctx.strokeStyle = '#E5C178'
      ctx.globalAlpha = 0.48
      ctx.lineWidth = 1.4
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      ctx.arc(cx, starCy, starR, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      const pts: { x: number; y: number }[] = []
      for (let s = 0; s < 38; s++) {
        const sSeed = hashSeed(`${seed}-star-${s}`)
        const ang = ((sSeed % 3600) / 3600) * Math.PI * 2
        const dist = 35 + ((sSeed >> 4) % (starR - 45))
        const sx = cx + Math.cos(ang) * dist
        const sy = starCy + Math.sin(ang) * dist * 0.88
        pts.push({ x: sx, y: sy })
        ctx.fillStyle = '#FFF9EB'
        ctx.globalAlpha = s % 5 === 0 ? 0.95 : 0.72
        ctx.beginPath()
        ctx.arc(sx, sy, s % 7 === 0 ? 3.1 : s % 3 === 0 ? 2.0 : 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.strokeStyle = '#E5C178'
      ctx.globalAlpha = 0.62
      ctx.lineWidth = 1.1
      for (let i = 0; i < 16; i += 2) {
        const p1 = pts[i]
        const p2 = pts[i + 1]
        if (p1 && p2 && Math.hypot(p1.x - p2.x, p1.y - p2.y) < 165) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
      ctx.restore()
    } else if (product.mode === 'family_botanical') {
      // Dynamic Birth Flower Bouquet Stems, Colored Blossoms & Family Member Name Ribbons
      ctx.save()
      const paletteMap: Record<string, { petal: string; center: string }> = {
        jan: { petal: '#D97B88', center: '#A33E4D' },
        feb: { petal: '#7E649E', center: '#E5C178' },
        mar: { petal: '#E8B84B', center: '#C87A28' },
        apr: { petal: '#F4EFE6', center: '#DF9B32' },
        may: { petal: '#EFECE6', center: '#9BB58E' },
        jun: { petal: '#D46A74', center: '#8E2F39' },
        jul: { petal: '#E8A5B2', center: '#D8AE64' },
        aug: { petal: '#C84B31', center: '#261A13' },
        sep: { petal: '#8A6F9E', center: '#E0AD46' },
        oct: { petal: '#D97925', center: '#7A331E' },
        nov: { petal: '#C45B4A', center: '#8C3324' },
        dec: { petal: '#F2ECE1', center: '#D49B38' },
      }
      const activeMembers = familyMembers.filter((m) => m.name.trim().length > 0).slice(0, 8)
      const count = Math.max(1, activeMembers.length)
      const span = Math.min(540, count * 105)
      const startX = cx - span / 2

      activeMembers.forEach((m, idx) => {
        const fx = count === 1 ? cx : startX + (idx * span) / (count - 1)
        const fy = 265 + (idx % 2 === 0 ? -24 : 18)
        const monthShort = (m.month || 'jun').slice(0, 3).toLowerCase()
        const pal = paletteMap[monthShort] || paletteMap.jun

        // Botanical stem curving down to bouquet knot
        ctx.strokeStyle = '#33543F'
        ctx.globalAlpha = 0.88
        ctx.lineWidth = 3.2
        ctx.beginPath()
        ctx.moveTo(cx, 720)
        ctx.quadraticCurveTo(fx + (idx % 2 === 0 ? -16 : 16), 510, fx, fy)
        ctx.stroke()

        // 8-petal birth flower blossom
        for (let p = 0; p < 8; p++) {
          ctx.save()
          ctx.translate(fx, fy)
          ctx.rotate((p * Math.PI) / 4)
          ctx.fillStyle = pal.petal
          ctx.globalAlpha = 0.92
          ctx.beginPath()
          ctx.ellipse(0, -18, 9.5, 19, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#261A13'
          ctx.globalAlpha = 0.25
          ctx.lineWidth = 0.8
          ctx.stroke()
          ctx.restore()
        }

        // Flower center
        ctx.fillStyle = pal.center
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(fx, fy, 9.5, 0, Math.PI * 2)
        ctx.fill()

        // Botanical Name Tag Ribbon below blossom
        const tagW = 86
        const tagH = 22
        const tagY = fy + 40
        ctx.fillStyle = '#FAF6F0'
        ctx.globalAlpha = 0.94
        ctx.fillRect(fx - tagW / 2, tagY, tagW, tagH)
        ctx.strokeStyle = colorway.accentHex
        ctx.lineWidth = 1.2
        ctx.strokeRect(fx - tagW / 2, tagY, tagW, tagH)

        ctx.fillStyle = '#261A13'
        ctx.font = '600 11px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(m.name.trim().slice(0, 12), fx, tagY + 15)
      })
      ctx.restore()
    } else if (
      product.mode === 'coastal_chart' ||
      product.mode === 'patent_blueprint' ||
      product.mode === 'coordinates'
    ) {
      // Dynamic Coordinate Graticule Crosshair & Plotted Golden Location Pin
      ctx.save()
      const pinOffsetX = ((seed % 140) - 70) * 0.8
      const pinOffsetY = (((seed >> 4) % 90) - 45) * 0.8
      const px = cx + pinOffsetX
      const py = 430 + pinOffsetY

      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.42
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(90, py)
      ctx.lineTo(W - 90, py)
      ctx.moveTo(px, 110)
      ctx.lineTo(px, 740)
      ctx.stroke()
      ctx.setLineDash([])

      // Pulse Ring + Solid Gold Pin
      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.85
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(px, py, 16, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#9E472A'
      ctx.globalAlpha = 0.96
      ctx.beginPath()
      ctx.arc(px, py, 6.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // 3B. Acoustic Waveform + Scannable QR Code Overlay (For Soundwave & Vinyl Lyric products)
    if (
      product.supportsAudioUpload &&
      (product.mode === 'soundwave' ||
        product.mode === 'vinyl_lyric' ||
        (customAudioPeaks && customAudioPeaks.length > 0))
    ) {
      ctx.save()
      const bars = 82
      const span = 480
      const sx0 = cx - span / 2 - 36
      const wy = 795
      const maxAmp = product.mode === 'soundwave' ? 34 : 25

      for (let i = 0; i <= bars; i++) {
        let amp: number
        if (customAudioPeaks && customAudioPeaks.length > 0) {
          const pk = customAudioPeaks[i % customAudioPeaks.length] || 0.2
          amp = Math.max(4, pk * maxAmp)
        } else {
          const bSeed = hashSeed(`${seed}-bar-${i}`)
          const env = Math.sin((i / bars) * Math.PI)
          const mod =
            0.35 +
            0.45 * Math.abs(Math.sin(i * 0.28 + (seed % 17))) +
            0.2 * ((bSeed % 100) / 100)
          amp = Math.max(4, env * mod * maxAmp)
        }
        const x = sx0 + (i * span) / bars
        ctx.strokeStyle = i % 3 === 0 ? colorway.accentHex : colorway.inkHex
        ctx.globalAlpha = i % 3 === 0 ? 0.95 : 0.78
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, wy - amp)
        ctx.lineTo(x, wy + amp)
        ctx.stroke()
      }

      // Draw Scannable Audio QR Code Matrix next to the waveform
      const qrSize = 56
      const qrX = sx0 + span + 20
      const qrY = wy - qrSize / 2
      ctx.fillStyle = '#FAF6F0'
      ctx.globalAlpha = 0.95
      ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8)
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.2
      ctx.strokeRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8)

      const cells = 11
      const cellPx = qrSize / cells
      ctx.fillStyle = colorway.inkHex
      for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
          const isCorner =
            (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3)
          const bit = hashSeed(`${seed}-qr-${r}-${c}`) % 2 === 0
          if (isCorner || bit) {
            ctx.fillRect(qrX + c * cellPx, qrY + r * cellPx, cellPx - 0.5, cellPx - 0.5)
          }
        }
      }
      ctx.restore()
    }

    // 4. Museum Double-Line Archival Frame Border
    ctx.save()
    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.52
    ctx.lineWidth = 2
    ctx.strokeRect(44, 44, W - 88, H - 88)
    ctx.globalAlpha = 0.22
    ctx.lineWidth = 1
    ctx.strokeRect(54, 54, W - 108, H - 108)
    ctx.restore()

    // 5. Clean Luxury Serif Typography Block at Bottom
    ctx.save()
    ctx.textAlign = 'center'

    ctx.strokeStyle = colorway.accentHex
    ctx.globalAlpha = 0.75
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(cx - 140, 854)
    ctx.lineTo(cx + 140, 854)
    ctx.stroke()

    ctx.globalAlpha = 1
    ctx.fillStyle = colorway.inkHex
    ctx.font = '600 33px Georgia, serif'
    ctx.fillText(headline.toUpperCase().slice(0, 42), cx, 912)

    ctx.fillStyle = colorway.inkHex
    ctx.globalAlpha = 0.88
    ctx.font = 'italic 21px Georgia, serif'
    ctx.fillText(subline.slice(0, 68), cx, 958)

    ctx.fillStyle = colorway.accentHex
    ctx.globalAlpha = 0.96
    ctx.font = '600 17px Georgia, serif'
    ctx.fillText(
      `${locationText.toUpperCase()}   •   ${dateText.toUpperCase()}`,
      cx,
      1018
    )

    ctx.fillStyle = colorway.mutedHex
    ctx.globalAlpha = 0.92
    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText(coordsText, cx, 1062)
    ctx.restore()

    // =========================================================================
    // PASS 2: Copy to Visible Preview Canvas + Subtle Archival Proof Seal
    // =========================================================================
    vCtx.clearRect(0, 0, W, H)
    vCtx.drawImage(cleanCanvas, 0, 0)

    vCtx.save()
    vCtx.textAlign = 'center'
    vCtx.font = '500 13px monospace'
    vCtx.fillStyle = colorway.mutedHex
    vCtx.globalAlpha = 0.35
    vCtx.fillText('EVERMARK PRINTS · LIVE STUDIO PROOF', cx, H - 64)
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
    product.supportsPhotoUpload,
    product.supportsAudioUpload,
    basePlateEl,
    portraitBackdropEl,
    familyMembers,
  ])

  function handleApplyPreset(preset: EvermarkProduct['presets'][number]) {
    setActiveMockupUrl(null)
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
        setActiveMockupUrl(null)
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
        setGpsStatusMsg('Location not found. Try "City, State" format.')
      }
    } catch {
      setGpsStatusMsg('Unable to reach coordinate service. You may type coordinates directly.')
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
      setActiveMockupUrl(null)
      setCustomAudioPeaks(normalized)
      setUploadedAudioName(file.name)
      setCoordsText(`00:00  • • • • • ● • • •  ${formatDurationClock(audioBuffer.duration)}`)
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
          setActiveMockupUrl(null)
          setCustomAudioPeaks(normalized)
          setUploadedAudioName('Live Voice Recording (5s)')
          setCoordsText(`00:00  • • • • • ● • • •  ${formatDurationClock(audioBuffer.duration)}`)
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

  // Build OrderBagItems for current configuration + any selected companion add-ons
  function buildCurrentBagItems(): OrderBagItem[] {
    const items: OrderBagItem[] = [
      {
        bagItemId: `${product.slug}-${activeVariant.id}-${Date.now()}`,
        productSlug: product.slug,
        sku: product.sku,
        printifyProductId: product.printifyProductId,
        printifyBlueprintId: product.printifyBlueprintId,
        printifyProviderId: product.printifyProviderId,
        printifyVariantId: activeVariant.printifyVariantId,
        title: product.title,
        shortTitle: product.shortTitle,
        physicalMedium: product.physicalMedium,
        variantLabel: activeVariant.label,
        colorwayLabel: colorway.shortLabel,
        frameFinishLabel: product.supportsFrameFinish ? frameFinish.shortLabel : undefined,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: isGiftOrder ? giftNote : undefined,
        priceUsd: activeVariant.priceUsd,
        quantity: 1,
        previewImage: product.previewImage,
      },
    ]

    if (includeSecondCopyDiscount) {
      items.push({
        bagItemId: `${product.slug}-${activeVariant.id}-copy2-${Date.now()}`,
        productSlug: product.slug,
        sku: product.sku,
        printifyProductId: product.printifyProductId,
        printifyBlueprintId: product.printifyBlueprintId,
        printifyProviderId: product.printifyProviderId,
        printifyVariantId: activeVariant.printifyVariantId,
        title: `${product.title} (2nd Gift Copy, 25% Off)`,
        shortTitle: `${product.shortTitle} (2nd Gift Copy, 25% Off)`,
        physicalMedium: product.physicalMedium,
        variantLabel: activeVariant.label,
        colorwayLabel: colorway.shortLabel,
        frameFinishLabel: product.supportsFrameFinish ? frameFinish.shortLabel : undefined,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: isGiftOrder ? giftNote : undefined,
        priceUsd: secondCopyPriceUsd,
        quantity: 1,
        previewImage: product.previewImage,
      })
    }

    for (const addOnId of selectedAddOnIds) {
      const addOn = COMPANION_ADD_ONS.find((a) => a.id === addOnId)
      if (!addOn) continue
      const targetProd = EVERMARK_CATALOG.find((p) => p.slug === addOn.targetProductSlug)
      items.push({
        bagItemId: `${addOn.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productSlug: addOn.targetProductSlug,
        sku: addOn.sku,
        printifyProductId: addOn.printifyProductId,
        printifyBlueprintId: addOn.printifyBlueprintId,
        printifyProviderId: addOn.printifyProviderId,
        printifyVariantId: addOn.printifyVariantId,
        title: addOn.shortTitle,
        shortTitle: addOn.shortTitle,
        physicalMedium: targetProd?.physicalMedium || 'Matching Physical Companion',
        variantLabel: 'Matching Custom Inscription Edition',
        colorwayLabel: colorway.shortLabel,
        frameFinishLabel: frameFinish.shortLabel,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: isGiftOrder ? giftNote : undefined,
        priceUsd: addOn.priceUsd,
        quantity: 1,
        previewImage: addOn.previewImage,
      })
    }

    if (includePriorityStudioProof) {
      items.push({
        bagItemId: `priority-proof-${product.slug}-${Date.now()}`,
        productSlug: product.slug,
        sku: `${product.sku}-VIP-PROOF`,
        printifyProductId: product.printifyProductId,
        printifyBlueprintId: product.printifyBlueprintId,
        printifyProviderId: product.printifyProviderId,
        printifyVariantId: activeVariant.printifyVariantId,
        title: 'Priority Studio Master Proofing & Instant 300 DPI Printable Keep-Copy',
        shortTitle: 'Priority Studio Proofing + Instant 300 DPI Keep-Copy',
        physicalMedium: 'Senior Typographer Alignment Check + Digital Master PDF',
        variantLabel: 'Front-of-Line Queue + Instant Printable File',
        colorwayLabel: colorway.shortLabel,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        priceUsd: 9,
        quantity: 1,
        previewImage: product.previewImage,
      })
    }

    return items
  }

  function handleAddToOrderBag() {
    const existing = loadStoredBag()
    const newItems = buildCurrentBagItems()
    saveStoredBag([...existing, ...newItems], true)
    setBagAddedToast(
      `Added ${newItems.length} customized ${
        newItems.length === 1 ? 'keepsake' : 'keepsakes'
      } to your Order Bag! You can customize another item or checkout anytime from the top-right Order Bag.`
    )
    setTimeout(() => setBagAddedToast(null), 7000)
  }

  async function handleCheckout() {
    setIsCheckingOut(true)
    setErrorMsg(null)

    try {
      const serializedPeaks = customAudioPeaks
        ? customAudioPeaks.map((n) => Math.round(n * 100)).join(',')
        : ''

      let customMasterUrl = ''
      if (typeof window !== 'undefined') {
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
            formatLabel: `${product.physicalMedium} · ${activeVariant.label}`,
            giftNote: isGiftOrder ? giftNote : '',
            customPeaks: serializedPeaks,
            previewDataUrl,
          })
        )

        if (previewDataUrl) {
          try {
            const upRes = await fetch('/api/artwork-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dataUrl: previewDataUrl,
                productSlug: product.slug,
                sku: product.sku,
                headline,
              }),
            })
            if (upRes.ok) {
              const upData = await upRes.json()
              if (upData.masterArtworkUrl) {
                customMasterUrl = String(upData.masterArtworkUrl)
              }
            }
          } catch {
            // Non-blocking fallback to deterministic /api/render-master URL
          }
        }
      }

      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://www.evermarkprints.com'

      const currentItems = buildCurrentBagItems()
      const existingBag = loadStoredBag()
      const allCheckoutItems = [...existingBag, ...currentItems]

      const lineItems = allCheckoutItems.map((item) => ({
        name: `${item.shortTitle} · ${item.variantLabel}`,
        description: `${item.colorwayLabel}${
          item.frameFinishLabel ? ` | ${item.frameFinishLabel}` : ''
        } | "${item.headline}" (${item.locationText} · ${item.dateText})`,
        amountCents: item.priceUsd * 100,
        quantity: item.quantity,
      }))

      const returnUrl = `${origin}/success?product=${encodeURIComponent(
        product.slug
      )}&format=${encodeURIComponent(activeVariant.id)}&count=${allCheckoutItems.length}`

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `evermark_${product.sku}`,
          returnUrl,
          collectUsShipping: true,
          promoCode: appliedPromoCode || undefined,
          lineItems,
          metadata: {
            brand: 'Evermark Prints',
            productSlug: product.slug,
            sku: product.sku,
            printifyProductId: product.printifyProductId,
            printifyBlueprintId: String(product.printifyBlueprintId),
            printifyVariantId: String(activeVariant.printifyVariantId),
            formatId: activeVariant.id,
            colorwayId,
            frameFinishId: product.supportsFrameFinish ? frameFinishId : 'standard',
            headline: headline.slice(0, 120),
            subline: subline.slice(0, 180),
            locationText: locationText.slice(0, 120),
            dateText: dateText.slice(0, 120),
            coordsText: coordsText.slice(0, 120),
            giftNote: isGiftOrder ? giftNote.slice(0, 240) : '',
            customPeaks: serializedPeaks.slice(0, 350),
            hasCustomPhoto: uploadedPhotoName ? 'yes' : 'no',
            hasCustomAudio: uploadedAudioName ? 'yes' : 'no',
            customMasterUrl: customMasterUrl.slice(0, 480),
            bundleCount: String(allCheckoutItems.length),
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
      {/* Homepage Interactive Product Style Switcher (12 Bespoke Studio Editions) */}
      {compactHeroMode && (
        <div className="bg-[#FDFBF7] border border-[#D4C3AE] p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#7A331E] font-semibold">
              CHOOSE YOUR PHYSICAL PRODUCT &amp; ARTWORK TO CUSTOMIZE LIVE (12 BESPOKE STUDIO EDITIONS):
            </span>
            <span className="text-xs text-[#5C4D42]">
              Framed Prints · Acrylic Stands · Woven Blankets · Chiseled Slate · 3-Panel Triptychs · Soy Candles
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
                  className={`p-2 text-left border transition flex items-center gap-2.5 ${
                    isCurrent
                      ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027] shadow-sm'
                      : 'bg-[#F8F3EA] text-[#261A13] border-[#D8C9B6] hover:border-[#7A331E]'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewImage}
                    alt={item.shortTitle}
                    className="w-10 h-10 object-cover border border-black/15 shrink-0 bg-white"
                  />
                  <div className="min-w-0">
                    <span
                      className={`text-[9px] font-mono-tech uppercase tracking-wider block truncate ${
                        isCurrent ? 'text-[#E5C178]' : 'text-[#8C583A]'
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] font-semibold leading-tight block truncate mt-0.5">
                      {item.shortTitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: INTERACTIVE FORM-FACTOR STAGE & PRINTIFY 3D STUDIO CAMERA VIEWS (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          {/* View Mode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8C9B6] pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMockupUrl(null)
                  setViewMode('room')
                }}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  !activeMockupUrl && viewMode === 'room'
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                ✦ Live Interactive Customizer
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMockupUrl(null)
                  setViewMode('studio')
                }}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                  !activeMockupUrl && viewMode === 'studio'
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                Close-Up Artwork Proof
              </button>
              {product.mockupGallery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveMockupUrl(product.mockupGallery[0])}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition border ${
                    activeMockupUrl
                      ? 'bg-[#9E472A] text-[#FDFBF7] border-[#9E472A]'
                      : 'bg-[#FDFBF7] text-[#9E472A] border-[#D8C9B6] hover:border-[#9E472A]'
                  }`}
                >
                  📷 3D Studio Photos ({product.mockupGallery.length})
                </button>
              )}
            </div>

            <span className="text-[11px] font-mono-tech uppercase tracking-[0.12em] text-[#7A331E] font-medium">
              {product.physicalMedium}
            </span>
          </div>

          {/* Interactive Gallery Wall Stage OR Real Printify 3D Camera Mockup Viewer */}
          <div
            className={`relative overflow-hidden border border-[#CBB89F] transition-all select-none ${
              viewMode === 'room'
                ? 'gallery-wall-surface pt-8 pb-16 px-6 sm:px-12'
                : 'bg-[#E9DFCF] py-8 px-4 sm:px-10'
            }`}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#5C4D42] mb-5">
              <span>
                {activeMockupUrl
                  ? `3D STUDIO GALLERY PHOTOGRAPH · ${product.physicalMedium.toUpperCase()}`
                  : `LIVE INTERACTIVE PROOF · ${product.physicalMedium.toUpperCase()}`}
              </span>
              {activeMockupUrl && (
                <button
                  type="button"
                  onClick={() => setActiveMockupUrl(null)}
                  className="underline text-[#9E472A] font-semibold"
                >
                  ← Back to Live Customizer
                </button>
              )}
            </div>

            {activeMockupUrl ? (
              <div className="relative z-10 mx-auto max-w-[520px] bg-white border border-[#D8C9B6] shadow-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeMockupUrl}
                  alt={product.title}
                  className="w-full h-auto block"
                />
              </div>
            ) : (
              /* Authentic Physical Form-Factor Renderer Wrapping Live Canvas */
              <div
                className={`relative z-10 mx-auto transition-all duration-300 ${
                  viewMode === 'room' ? 'max-w-[400px]' : 'max-w-[490px]'
                }`}
              >
                {product.formFactor === 'acrylic-stand' ? (
                  /* Crystal Acrylic Block + Solid Carved Hardwood Stand */
                  <div className="flex flex-col items-center">
                    <div
                      className="w-full p-[10px] relative"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.5) 100%)',
                        border: '2px solid rgba(255,255,255,0.85)',
                        boxShadow:
                          '0 22px 48px rgba(28, 20, 14, 0.32), inset 0 0 14px rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className="w-full h-auto block pointer-events-none select-none shadow-sm"
                      />
                    </div>
                    {/* Solid Carved Hardwood Base */}
                    <div
                      className="w-[74%] h-10 -mt-1 rounded-b-sm relative flex items-center justify-center"
                      style={{
                        background: `linear-gradient(90deg, ${frameFinish.lipHex} 0%, ${frameFinish.outerHex} 25%, ${frameFinish.innerHex} 50%, ${frameFinish.outerHex} 80%, ${frameFinish.lipHex} 100%)`,
                        boxShadow: '0 18px 30px rgba(20, 12, 6, 0.45)',
                        borderTop: '3px solid #E5C178',
                      }}
                    >
                      <span className="text-[9px] font-mono-tech uppercase tracking-[0.25em] text-[#F7F4ED]/75">
                        EVERMARK HARDWOOD STAND
                      </span>
                    </div>
                  </div>
                ) : product.formFactor === 'chiseled-slate' ? (
                  /* Raw Hand-Chiseled Natural Stone Slate Plaque + Display Feet */
                  <div className="flex flex-col items-center">
                    <div
                      className="w-full p-[14px] relative"
                      style={{
                        background:
                          'linear-gradient(145deg, #2B2D2F 0%, #1C1D1F 50%, #383A3D 100%)',
                        boxShadow:
                          '20px 30px 52px rgba(15, 15, 15, 0.48), inset 0 0 0 3px #484A4E',
                        borderRadius: '6px',
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className="w-full h-auto block pointer-events-none select-none rounded-[2px]"
                      />
                    </div>
                    {/* Two Matte Black Slate Display Feet */}
                    <div className="w-[68%] flex justify-between -mt-2 relative z-20 px-4">
                      <div className="w-7 h-7 bg-gradient-to-b from-[#2A2A2A] to-[#111] rounded-b-sm shadow-lg border-t border-white/20" />
                      <div className="w-7 h-7 bg-gradient-to-b from-[#2A2A2A] to-[#111] rounded-b-sm shadow-lg border-t border-white/20" />
                    </div>
                  </div>
                ) : product.formFactor === 'woven-blanket' ? (
                  /* Jacquard Woven Cotton Throw Blanket with Braided Fringe Edges */
                  <div
                    className="p-[14px] relative"
                    style={{
                      background:
                        'repeating-linear-gradient(45deg, #D8C3A5, #D8C3A5 4px, #9E472A 4px, #9E472A 8px, #1B3027 8px, #1B3027 12px)',
                      boxShadow: '18px 28px 48px rgba(38, 24, 14, 0.34)',
                      borderRadius: '4px',
                    }}
                  >
                    <div className="bg-[#FAF6F0] p-1 shadow-inner">
                      <canvas
                        ref={canvasRef}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className="w-full h-auto block pointer-events-none select-none"
                      />
                    </div>
                  </div>
                ) : product.formFactor === 'wood-tapestry' ? (
                  /* Wood-Topped Wall Tapestry with Hanging Twine & Bottom Wood Dowel */
                  <div className="flex flex-col items-center">
                    {/* Hanging Twine Triangle */}
                    <div className="w-36 h-10 relative flex justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#B8924A] shadow z-10 -mt-1" />
                      <svg
                        viewBox="0 0 140 40"
                        className="absolute inset-0 w-full h-full stroke-[#8C6D46]"
                        fill="none"
                        strokeWidth="2.5"
                      >
                        <path d="M 70 2 L 8 40 M 70 2 L 132 40" />
                      </svg>
                    </div>
                    {/* Top Solid Wood Hanger Bar */}
                    <div
                      className="w-[104%] h-4 rounded-sm shadow-md z-10"
                      style={{
                        background: `linear-gradient(180deg, ${frameFinish.innerHex}, ${frameFinish.outerHex})`,
                        border: `1px solid ${frameFinish.lipHex}`,
                      }}
                    />
                    <div className="w-full shadow-2xl">
                      <canvas
                        ref={canvasRef}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                        className="w-full h-auto block pointer-events-none select-none"
                      />
                    </div>
                    {/* Bottom Weighted Wood Bar */}
                    <div
                      className="w-[104%] h-4 rounded-sm shadow-lg z-10"
                      style={{
                        background: `linear-gradient(180deg, ${frameFinish.innerHex}, ${frameFinish.outerHex})`,
                        border: `1px solid ${frameFinish.lipHex}`,
                      }}
                    />
                  </div>
                ) : product.formFactor === 'triptych-acrylic' ? (
                  /* 3-Panel Split Optical Acrylic Triptych */
                  <div className="relative shadow-2xl">
                    <canvas
                      ref={canvasRef}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      className="w-full h-auto block pointer-events-none select-none"
                    />
                    {/* Two vertical wall-gap split dividers */}
                    <div className="pointer-events-none absolute inset-y-0 left-[32.5%] w-[10px] bg-[#E8DFD1] shadow-inner border-x border-black/15" />
                    <div className="pointer-events-none absolute inset-y-0 left-[65.5%] w-[10px] bg-[#E8DFD1] shadow-inner border-x border-black/15" />
                  </div>
                ) : product.formFactor === 'amber-candle' ? (
                  /* Apothecary Amber Glass Soy Candle Jar */
                  <div className="flex flex-col items-center pt-2">
                    {/* Candle Flame */}
                    <div className="w-4 h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_24px_8px_rgba(251,191,36,0.75)] mb-1 animate-pulse" />
                    {/* Amber Jar Rim */}
                    <div className="w-[68%] h-5 rounded-t-md bg-gradient-to-r from-[#3D1C08] via-[#7A3B12] to-[#3D1C08] border-b border-amber-400/40 shadow" />
                    {/* Amber Glass Body Wrapping Label */}
                    <div
                      className="w-[78%] p-4 rounded-b-2xl relative"
                      style={{
                        background:
                          'linear-gradient(90deg, #2B1204 0%, #6E320C 18%, #8F4516 50%, #6E320C 82%, #2B1204 100%)',
                        boxShadow:
                          '0 24px 48px rgba(38, 18, 6, 0.45), inset 0 0 18px rgba(251, 191, 36, 0.25)',
                      }}
                    >
                      <div className="rounded-sm overflow-hidden shadow-md">
                        <canvas
                          ref={canvasRef}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          className="w-full h-auto block pointer-events-none select-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : product.formFactor === 'birch-plaque' ? (
                  /* 0.75" Solid Birch Hardwood Wall Plaque + Braided Jute Hanging Cord */
                  <div className="flex flex-col items-center">
                    {/* Brass Wall Peg + Braided Jute Hanging Cord */}
                    <div className="w-32 h-11 relative flex justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#B8924A] border border-[#7A5C22] shadow z-10 -mt-1" />
                      <svg
                        viewBox="0 0 128 44"
                        className="absolute inset-0 w-full h-full stroke-[#9A7B4F]"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <path d="M 64 3 L 26 44 M 64 3 L 102 44" />
                      </svg>
                    </div>
                    {/* Solid Natural Birch Wood Plaque Edge */}
                    <div
                      className="w-full p-[12px] rounded-xl relative"
                      style={{
                        background:
                          'linear-gradient(135deg, #E6D3B3 0%, #D5BC94 48%, #C4A77D 100%)',
                        boxShadow:
                          '18px 28px 48px rgba(38, 24, 14, 0.34), inset 0 0 0 2px #B39366',
                      }}
                    >
                      <div className="rounded-lg overflow-hidden shadow-inner bg-[#FAF6F0]">
                        <canvas
                          ref={canvasRef}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          className="w-full h-auto block pointer-events-none select-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Museum Solid Hardwood Frame + 8-Ply Mat Board (Default Framed Print / Floating Canvas) */
                  <div
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
                        padding:
                          product.formFactor === 'framed-canvas'
                            ? '6px'
                            : viewMode === 'room'
                            ? '16px'
                            : '22px',
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
                )}
              </div>
            )}
          </div>

          {/* 3D Studio Camera Angle Thumbnails + Live Proof Toggle + Wall-Scale Visualizer */}
          <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech uppercase tracking-wider text-[#7A331E]">
              <span>SWITCH BETWEEN LIVE CUSTOMIZER &amp; 3D STUDIO GALLERY PHOTOS:</span>
              <button
                type="button"
                onClick={() => setShowScaleVisualizer((prev) => !prev)}
                className="px-2.5 py-1 bg-[#F3E9DA] hover:bg-[#E8D9C3] border border-[#9E472A] text-[#261A13] font-semibold transition"
              >
                {showScaleVisualizer ? '✕ Close Wall Size Scale' : '📐 Compare Wall Size Scale'}
              </button>
            </div>

            {showScaleVisualizer && (
              <div className="p-4 bg-[#EFE6D8] border border-[#CBB89F] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-wider text-[#261A13]">
                  <span className="font-semibold">
                    PROPORTIONAL SCALE ABOVE A STANDARD 78&quot; LIVING ROOM SOFA
                  </span>
                  <span className="text-[#9E472A]">Click any size to select</span>
                </div>
                <div className="relative bg-[#FAF6F0] border border-[#D8C9B6] pt-6 pb-3 px-4 flex flex-col items-center space-y-4">
                  <div className="flex items-end justify-center gap-4 w-full">
                    {product.variants.map((v, idx) => {
                      const isSel = v.id === activeVariant.id
                      const boxSizes = [
                        { w: 'w-14', h: 'h-18', tag: 'Compact' },
                        { w: 'w-20', h: 'h-24', tag: 'Most Popular' },
                        { w: 'w-28', h: 'h-32', tag: 'Statement' },
                      ]
                      const sz = boxSizes[Math.min(idx, boxSizes.length - 1)]
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`flex flex-col items-center gap-1.5 group transition ${
                            isSel ? 'scale-105' : 'opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div
                            className={`${sz.w} ${sz.h} border-2 flex flex-col items-center justify-center p-1.5 text-center shadow-sm transition ${
                              isSel
                                ? 'border-[#1B3027] bg-[#F3E9DA] ring-2 ring-[#9E472A]'
                                : 'border-[#8C7A6B] bg-white'
                            }`}
                          >
                            <span className="text-[10px] font-mono-tech font-bold text-[#261A13] leading-tight">
                              {v.label.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-[#9E472A] font-semibold mt-0.5">
                              ${v.priceUsd}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono-tech text-[#4A3B31] font-medium">
                            {isSel ? '● Selected' : 'Select'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {/* 78" Sofa Silhouette */}
                  <div className="w-4/5 max-w-xs pt-2 flex flex-col items-center">
                    <div className="w-full h-5 bg-[#CBB89F] rounded-t-md border border-[#A69177]" />
                    <div className="w-[106%] h-4 bg-[#B59F84] rounded-sm border border-[#8C7A6B] flex items-center justify-center">
                      <span className="text-[9px] font-mono-tech uppercase tracking-widest text-[#261A13] font-semibold">
                        78&quot; Standard 3-Seat Sofa Width Reference
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveMockupUrl(null)}
                className={`px-3 py-2 border text-xs font-semibold shrink-0 transition ${
                  !activeMockupUrl
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#F8F3EA] text-[#261A13] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                ✦ Live Customizer Proof
              </button>
              {product.mockupGallery.map((mUrl, idx) => (
                <button
                  key={mUrl}
                  type="button"
                  onClick={() => setActiveMockupUrl(mUrl)}
                  className={`relative w-14 h-14 border overflow-hidden shrink-0 transition ${
                    activeMockupUrl === mUrl
                      ? 'border-[#9E472A] ring-2 ring-[#9E472A]'
                      : 'border-[#D8C9B6] opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mUrl}
                    alt={`3D Studio Angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Save & Email Custom Proof + Shareable Design Link Bar */}
          <div className="bg-[#F6EFE4] border border-[#CBB89F] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold">
                ✉ Save Your Custom Proof &amp; Lock In 15% Off (Code: WELCOME15)
              </span>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9E472A] hover:text-[#1B3027] underline font-semibold"
              >
                {shareLinkCopied
                  ? '✓ Custom Design Link Copied!'
                  : '🔗 Copy Shareable Link to This Design'}
              </button>
            </div>
            <form onSubmit={handleEmailSavedProof} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={saveProofEmail}
                onChange={(e) => setSaveProofEmail(e.target.value)}
                placeholder="Enter your email to send this exact custom design link + 15% off..."
                className="flex-1 border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSavingProof}
                className="px-4 py-2 bg-[#261A13] hover:bg-[#3A281D] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold shrink-0 transition"
              >
                {isSavingProof ? 'Sending...' : 'Email My Proof →'}
              </button>
            </form>
            {savedProofSuccessMsg && (
              <p className="text-[11px] font-mono-tech text-[#1B3027] font-semibold">
                ✓ {savedProofSuccessMsg}
              </p>
            )}
          </div>

          {/* Occasion Presets */}
          <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#7A331E] font-semibold">
                Quick Occasion Presets:
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
            <div className="pt-1">
              <span className="inline-block px-2.5 py-1 bg-[#F3E9DA] border border-[#D8C9B6] text-[11px] font-mono-tech text-[#261A13]">
                Physical Medium: <strong>{product.physicalMedium}</strong>
              </span>
            </div>
          </div>

          {/* STEP 1: Select 8 Rich Designer Palettes */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              01. Choose Typography &amp; Border Palette (8 Archival Editions)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLORWAYS.map((c) => {
                const isSel = c.id === colorwayId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveMockupUrl(null)
                      setColorwayId(c.id)
                    }}
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
                        className="w-2.5 h-2.5 rounded-full"
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

          {/* STEP 2: Select Hardwood Frame / Wood Base Finish (ONLY shown on products that have a wood frame/base!) */}
          {product.supportsFrameFinish && (
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
                02. Select Solid Hardwood Finish (Frame / Stand / Trim)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {FRAME_FINISHES.map((f) => {
                  const isSel = f.id === frameFinishId
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setActiveMockupUrl(null)
                        setFrameFinishId(f.id)
                      }}
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
          )}

          {/* CONTEXTUAL STEP: Custom Photo Upload OR Voice/Song Audio Upload (ONLY rendered when supported by this product!) */}
          {(product.supportsPhotoUpload || product.supportsAudioUpload) && (
            <div className="space-y-3 pt-1">
              <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
                {product.supportsPhotoUpload && product.supportsAudioUpload
                  ? 'Attach Custom Center Photo & Song Audio'
                  : product.supportsPhotoUpload
                  ? 'Attach Custom Portrait Photo (Pet / Home / Baby)'
                  : 'Attach Voice Note or Song Audio'}
              </label>

              <div
                className={`grid gap-2.5 ${
                  product.supportsPhotoUpload && product.supportsAudioUpload
                    ? 'sm:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {product.supportsPhotoUpload && (
                  <div className="p-3.5 bg-[#F6EFE4] border border-[#D8C9B6] space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
                        Custom Portrait Photo Upload
                      </span>
                      <p className="text-[11px] text-[#5C4D42] leading-snug mt-0.5">
                        Upload your photo to frame inside the central watercolor medallion.
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
                        {uploadedPhotoName ? 'Change Photo...' : '+ Upload Photo (.JPG/.PNG)'}
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
                )}

                {product.supportsAudioUpload && (
                  <div className="p-3.5 bg-[#F6EFE4] border border-[#D8C9B6] space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold block">
                        Voice Note or Song Soundwave
                      </span>
                      <p className="text-[11px] text-[#5C4D42] leading-snug mt-0.5">
                        Upload an audio file (.MP3/.WAV/.M4A) or record a 5-second voice note live.
                      </p>
                    </div>

                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row gap-1.5">
                      <button
                        type="button"
                        onClick={() => audioInputRef.current?.click()}
                        className="flex-1 py-2 px-2.5 bg-[#261A13] hover:bg-[#3A281D] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider transition"
                      >
                        {uploadedAudioName ? '✓ Audio Plotted' : '+ Upload Audio File'}
                      </button>
                      <button
                        type="button"
                        onClick={handleRecordMicrophone}
                        disabled={isRecordingMic}
                        className="flex-1 py-2 px-2.5 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-wider transition"
                      >
                        {isRecordingMic ? '● Recording 5s...' : '🎙 Record Voice (5s)'}
                      </button>
                    </div>
                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono-tech text-[#1B3027]">
                      <span>✓ Scannable Acoustic QR Plotted on Artwork</span>
                      <Link
                        href={`/listen?title=${encodeURIComponent(headline)}&sub=${encodeURIComponent(subline)}&loc=${encodeURIComponent(locationText)}&date=${encodeURIComponent(dateText)}`}
                        target="_blank"
                        className="underline font-semibold text-[#9E472A] hover:text-[#1B3027]"
                      >
                        ♫ Test QR Audio Player ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Contextual Inscription & Personalization */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-2">
              <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
                {product.slug === 'family-tree-botanical-print'
                  ? 'Personalize Family Bouquet & Birth Flowers'
                  : product.slug === 'newborn-birth-stat-portrait'
                  ? 'Personalize Baby Name & Birth Stats'
                  : product.slug === 'custom-book-stack-print'
                  ? 'Personalize Apothecary Candle Label'
                  : product.slug === 'custom-pet-memorial'
                  ? 'Personalize Pet Name & Memorial Tribute'
                  : product.slug === 'custom-coordinates-print'
                  ? 'Personalize First Home Address & Year'
                  : product.slug === 'met-engaged-married-triptych'
                  ? 'Personalize Couple Names & 3 Milestones'
                  : 'Personalize Your Inscription (Live Canvas Proof)'}
              </label>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A]">
                Updates Live On Artwork
              </span>
            </div>

            {/* 1. FAMILY BIRTH FLOWER BOUQUET BLANKET */}
            {product.slug === 'family-tree-botanical-print' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Family Title / Blanket Heading
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., THE MILLER FAMILY GARDEN"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Dedication Subtitle Line
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Rooted in love, blooming together through every season."
                  />
                </div>

                {/* Interactive Birth Flower Stems Selector */}
                <div className="space-y-3 p-4 bg-[#F8F3EA] border border-[#D8C9B6]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8C9B6] pb-2.5">
                    <div>
                      <span className="text-xs font-semibold text-[#1B3027] uppercase tracking-wider block">
                        Family Members &amp; Birth Flowers ({familyMembers.length} of 6 Stems)
                      </span>
                      <span className="text-[11px] text-[#5C4D42]">
                        Select each person&apos;s birth month to bloom their authentic watercolor botanical flower.
                      </span>
                    </div>
                    {familyMembers.length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextMonth = MONTH_NAMES[familyMembers.length % 12]
                          const updated = [
                            ...familyMembers,
                            { id: String(Date.now()), name: '', month: nextMonth },
                          ]
                          setFamilyMembers(updated)
                          syncFamilyMembersToCanvas(updated, familyNote)
                        }}
                        className="px-2.5 py-1 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider transition"
                      >
                        + Add Member
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {familyMembers.map((member, idx) => {
                      const flowerInfo =
                        BIRTH_FLOWERS_DICT[member.month] || BIRTH_FLOWERS_DICT['July']
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 bg-[#FDFBF7] border border-[#D8C9B6]"
                        >
                          <span className="text-[10px] font-mono-tech text-[#8C583A] w-6 shrink-0 font-bold">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...familyMembers]
                              updated[idx].name = e.target.value
                              setFamilyMembers(updated)
                              syncFamilyMembersToCanvas(updated, familyNote)
                            }}
                            placeholder="Name (e.g. Emma, Mom, Nana)"
                            maxLength={18}
                            className="flex-1 min-w-0 border border-[#CBB89F] px-2.5 py-1.5 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <select
                              value={member.month}
                              onChange={(e) => {
                                const updated = [...familyMembers]
                                updated[idx].month = e.target.value
                                setFamilyMembers(updated)
                                syncFamilyMembersToCanvas(updated, familyNote)
                              }}
                              className="border border-[#CBB89F] bg-white px-2 py-1.5 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none font-medium"
                            >
                              {MONTH_NAMES.map((m) => {
                                const f = BIRTH_FLOWERS_DICT[m]
                                return (
                                  <option key={m} value={m}>
                                    {m} · {f.flower} {f.symbol}
                                  </option>
                                )
                              })}
                            </select>
                            {familyMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = familyMembers.filter((_, i) => i !== idx)
                                  setFamilyMembers(updated)
                                  syncFamilyMembersToCanvas(updated, familyNote)
                                }}
                                className="text-[#9E472A] hover:text-[#7A331E] text-xs px-1.5 font-bold"
                                title="Remove member"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-2 space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Family Heritage / Established Note
                    </span>
                    <input
                      type="text"
                      value={familyNote}
                      onChange={(e) => {
                        setFamilyNote(e.target.value)
                        syncFamilyMembersToCanvas(familyMembers, e.target.value)
                      }}
                      placeholder="e.g., Established 1984 · Three Generations of Love"
                      maxLength={48}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : product.slug === 'newborn-birth-stat-portrait' ? (
              /* 2. STORYBOOK SLEEPING MOON & BABY BIRTH STATS */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Baby&apos;s Full Name
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., LEO ALEXANDER BROOKS"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Welcome &amp; Dedication Line
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Loved Beyond Measure From Your Very First Breath"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Birth Date &amp; Time
                    </span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={38}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., August 19, 2025 at 4:18 AM"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Birth Weight &amp; Length
                    </span>
                    <input
                      type="text"
                      value={coordsText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      maxLength={34}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., 7 LBS 11 OZ · 20.5 INCHES"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Birthplace City &amp; Hospital
                  </span>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setLocationText(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Boston, Massachusetts · St. Luke's"
                  />
                </div>
              </div>
            ) : product.slug === 'custom-book-stack-print' ? (
              /* 3. BOTANICAL SCENTED SOY CANDLE */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Candle Label Title / Recipient
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., MOM'S COZY CORNER"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Dedication Quote or Blend Note
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Warmth, Light &amp; Peace in Every Season"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Dedicated By &amp; Special Date
                  </span>
                  <input
                    type="text"
                    value={coordsText}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setCoordsText(e.target.value)
                    }}
                    maxLength={44}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., With all our love, Sarah &amp; Michael · 2024"
                  />
                </div>
              </div>
            ) : product.slug === 'custom-pet-memorial' ? (
              /* 4. SOLID BIRCH WOOD PET MEMORIAL */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Pet&apos;s Name
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={32}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., BARNABY"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Loving Tribute Quote
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., The best boy on every trail, always in our hearts."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Years of Life / Memory Dates
                    </span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={30}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., 2014 to 2026"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Family Dedication
                    </span>
                    <input
                      type="text"
                      value={coordsText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      maxLength={38}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., THE HEART OF OUR HOME"
                    />
                  </div>
                </div>
              </div>
            ) : product.slug === 'custom-coordinates-print' ? (
              /* 5. OUR FIRST HOME CHISELED SLATE */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Home / Family Heading
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., OUR FIRST HOME"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4A3B31] font-medium">
                      Street Address &amp; Town
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
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setLocationText(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., 742 Evergreen Terrace · Charleston, SC"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Established Year / Family Line
                    </span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={34}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., The Harrington Family · Est. 2024"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#4A3B31] font-medium">
                        GPS Coordinates
                      </span>
                      {gpsStatusMsg && (
                        <span className="text-[10px] font-mono-tech text-[#1B3027]">
                          {gpsStatusMsg}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={coordsText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      maxLength={44}
                      className="w-full border border-[#CBB89F] bg-[#F6EFE4] px-3.5 py-2 text-xs font-mono-tech text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Dedication Subtitle
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Where loud mornings, warm dinners, and lifelong memories are made."
                  />
                </div>
              </div>
            ) : product.slug === 'met-engaged-married-triptych' ? (
              /* 6. THREE MILESTONES ACRYLIC TRIPTYCH */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Couple Names / Heading
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={36}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., SARAH &amp; MICHAEL"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    Triptych Dedication Line
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Every mountain path brought us to this moment."
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 1: Met
                    </span>
                    <input
                      type="text"
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="DENVER · JUNE 2018"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 2: Engaged
                    </span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="ASPEN · OCT 2021"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 3: Married
                    </span>
                    <input
                      type="text"
                      value={coordsText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="VAIL · SEPT 2023"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* 7. CELESTIAL / CARTOGRAPHIC / ACOUSTIC EDITIONS (Star Map, Soundwave, Nautical Chart, Tapestry) */
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    {product.supportsAudioUpload
                      ? 'Song Title & Artist / Audio Title'
                      : 'Primary Title / Milestone Heading'}
                  </span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setHeadline(e.target.value)
                    }}
                    maxLength={42}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., THE NIGHT OUR STORY BEGAN"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#4A3B31] font-medium block">
                    {product.supportsAudioUpload
                      ? 'Wedding Vows or Special Dedication'
                      : 'Dedication / Subtitle Line'}
                  </span>
                  <input
                    type="text"
                    value={subline}
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setSubline(e.target.value)
                    }}
                    maxLength={68}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    placeholder="e.g., Underneath these exact stars, everything changed."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#4A3B31] font-medium">
                        {product.supportsAudioUpload
                          ? 'City, Venue or Place'
                          : 'City, Place or Port'}
                      </span>
                      {product.supportsGpsLookup && (
                        <button
                          type="button"
                          disabled={isLookingUpGps}
                          onClick={handleLookupCoordinates}
                          className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9E472A] hover:text-[#1B3027] underline underline-offset-2 font-semibold"
                        >
                          {isLookingUpGps ? 'Plotting...' : 'Auto-Find GPS ⌖'}
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      maxLength={38}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Date / Time / Anniversary
                    </span>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={34}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4A3B31] font-medium">
                      {product.supportsGpsLookup
                        ? 'Exact Coordinates or Bottom Line'
                        : 'Bottom Line / Audio Duration'}
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
                    onChange={(e) => {
                      setActiveMockupUrl(null)
                      setCoordsText(e.target.value)
                    }}
                    maxLength={44}
                    className="w-full border border-[#CBB89F] bg-[#F6EFE4] px-3.5 py-2 text-xs font-mono-tech text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: Select Real Product Size / Scent / Variant */}
          <div className="space-y-2.5 pt-2">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              Select Physical Size / Edition ({product.physicalMedium})
            </label>

            <div className="space-y-2.5">
              {product.variants.map((variant) => {
                const isSelected = variant.id === activeVariant.id
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full text-left p-3.5 border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#F3E9DA] border-[#1B3027] ring-1 ring-[#1B3027]'
                        : 'bg-[#FDFBF7] border-[#D8C9B6] hover:border-[#9E472A]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-[#261A13]">
                          {variant.label}
                        </span>
                        {variant.badge && (
                          <span className="px-2 py-0.5 bg-[#1B3027] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider">
                            {variant.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5C4D42]">{variant.subtitle}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-semibold text-[#261A13] block">
                        ${variant.priceUsd}
                      </span>
                      {variant.compareAtUsd && (
                        <span className="text-xs text-[#8C7A6B] line-through block">
                          ${variant.compareAtUsd}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 5: Add Companion Keepsakes to Your Order (Replaces Digital Master Bump!) */}
          <div className="p-4 bg-[#F6EFE4] border border-[#CBB89F] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#9E472A] font-semibold">
                Bundle &amp; Save · Add to This Order (Free Combined Shipping)
              </span>
            </div>

            {/* Option A: 2nd Duplicate Copy at 25% Off */}
            <label className="flex items-start justify-between gap-3 p-2.5 bg-[#FDFBF7] border border-[#D8C9B6] cursor-pointer hover:border-[#1B3027] transition">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={includeSecondCopyDiscount}
                  onChange={(e) => setIncludeSecondCopyDiscount(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#1B3027] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#261A13] block">
                    + Add 2nd Identical Copy for Family / Grandparents (25% Off)
                  </span>
                  <span className="text-[11px] text-[#5C4D42]">
                    Strike a second matching {product.shortTitle} in the same shipment.
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-[#1B3027] block">
                  +${secondCopyPriceUsd}
                </span>
                <span className="text-[10px] text-[#8C7A6B] line-through block">
                  ${activeVariant.priceUsd}
                </span>
              </div>
            </label>

            {/* Option A2: +$9 Priority Studio Master Proofing + Instant Printable High-Res Keep-Copy */}
            <label className="flex items-start justify-between gap-3 p-2.5 bg-[#FDFBF7] border border-[#D8C9B6] cursor-pointer hover:border-[#1B3027] transition">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={includePriorityStudioProof}
                  onChange={(e) => setIncludePriorityStudioProof(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#1B3027] cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#261A13] block">
                    + Priority Front-of-Line Studio Proofing &amp; Instant 300 DPI Printable File (+$9)
                  </span>
                  <span className="text-[11px] text-[#5C4D42]">
                    Senior typographer verifies alignment &amp; contrast + unlocks immediate 300 DPI digital master download at checkout.
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-[#1B3027] block">+$9</span>
                <span className="text-[10px] text-[#8C7A6B] line-through block">$24</span>
              </div>
            </label>

            {/* Option B & C: Companion Physical Add-Ons (Candle + Acrylic Plaque) */}
            {COMPANION_ADD_ONS.filter((a) => a.targetProductSlug !== product.slug).map(
              (addOn) => {
                const checked = selectedAddOnIds.includes(addOn.id)
                return (
                  <label
                    key={addOn.id}
                    className="flex items-start justify-between gap-3 p-2.5 bg-[#FDFBF7] border border-[#D8C9B6] cursor-pointer hover:border-[#1B3027] transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCompanionAddOn(addOn.id)}
                        className="mt-1 h-4 w-4 accent-[#1B3027] cursor-pointer"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={addOn.previewImage}
                        alt={addOn.title}
                        className="w-10 h-10 object-cover border border-[#D8C9B6] shrink-0 bg-white mt-0.5"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#261A13] block">
                          {addOn.title}
                        </span>
                        <span className="text-[11px] text-[#5C4D42] leading-snug block">
                          {addOn.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-[#1B3027] block">
                        +${addOn.priceUsd}
                      </span>
                      <span className="text-[10px] text-[#8C7A6B] line-through block">
                        ${addOn.compareAtUsd}
                      </span>
                    </div>
                  </label>
                )
              }
            )}
          </div>

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

          {bagAddedToast && (
            <div className="p-3.5 bg-emerald-950/90 border border-emerald-700 text-xs text-[#F7F4ED] leading-relaxed">
              ✓ {bagAddedToast}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-900">
              {errorMsg}
            </div>
          )}

          {/* Live Dynamic US Delivery Date Estimator + Instant Printable Gift Card Rescue */}
          <div className="p-3.5 bg-[#EDF4EF] border border-[#1B3027]/30 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#1B3027]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span>
                  <strong>Order today:</strong> Estimated US delivery{' '}
                  <strong className="underline decoration-[#9E472A] underline-offset-2">
                    {(() => {
                      const addBusinessDays = (start: Date, days: number) => {
                        const d = new Date(start)
                        let added = 0
                        while (added < days) {
                          d.setDate(d.getDate() + 1)
                          const dow = d.getDay()
                          if (dow !== 0 && dow !== 6) added++
                        }
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }
                      const now = new Date()
                      return `${addBusinessDays(now, 3)} to ${addBusinessDays(now, 5)}`
                    })()}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold shrink-0">
                FREE TRACKED US SHIPPING
              </span>
            </div>
            <p className="text-[11px] text-[#264437] border-t border-[#1B3027]/15 pt-1.5 leading-snug">
              🎁 <strong>Gifting within 48 hours?</strong> Every order includes an{' '}
              <strong>Instant Printable Gift Presentation Card &amp; Preview Certificate</strong>{' '}
              immediately after checkout so you have something meaningful to hand them tonight while your physical heirloom ships.
            </p>
          </div>

          {/* 1-Click Collector Privilege Promo Code Banner + Primary Checkout */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#F3E9DA] border border-[#CBB89F] text-xs">
              <div className="flex items-center gap-2 text-[#261A13]">
                <span className="text-[#9E472A] font-bold">✦</span>
                <span>
                  {appliedPromoCode ? (
                    <>
                      Code <strong className="text-[#1B3027]">{appliedPromoCode}</strong> Active:{' '}
                      <strong>15% Off (${Math.round(totalUsd * 0.85)})</strong> at Checkout
                    </>
                  ) : (
                    <>
                      Collector Privilege: Save <strong>15% Off</strong> with code{' '}
                      <strong className="font-mono-tech text-[#9E472A]">WELCOME15</strong>
                    </>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAppliedPromoCode((prev) => (prev === 'WELCOME15' ? null : 'WELCOME15'))
                }
                className={`px-2.5 py-1 text-[10px] font-mono-tech uppercase tracking-wider font-semibold transition shrink-0 ${
                  appliedPromoCode
                    ? 'bg-[#1B3027] text-[#F7F4ED]'
                    : 'bg-[#261A13] hover:bg-[#1B3027] text-[#F7F4ED]'
                }`}
              >
                {appliedPromoCode ? '✓ 15% Off Applied' : 'Apply 15% Off'}
              </button>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 px-6 bg-[#1B3027] hover:bg-[#264437] disabled:opacity-60 text-[#F7F4ED] font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] transition flex items-center justify-center gap-3 shadow-md"
            >
              <span>
                {isCheckingOut
                  ? 'Preparing Archival Commission...'
                  : appliedPromoCode
                  ? `Commission Custom Keepsake · $${Math.round(totalUsd * 0.85)} (15% Off)`
                  : `Commission Custom Keepsake · $${totalUsd}`}
              </span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={handleAddToOrderBag}
              className="w-full py-3 px-4 bg-[#F3E9DA] hover:bg-[#E8D9C3] border border-[#9E472A] text-[#261A13] font-mono-tech text-xs uppercase tracking-[0.14em] font-semibold transition"
            >
              + Add to Order Bag &amp; Customize Another Item
            </button>

            {/* Reaction-First Product-Specific Emotional Micro-Testimonial */}
            <div className="p-3 bg-[#F8F3EA] border border-[#D8C9B6] text-[11px] text-[#4A3B31] italic text-center leading-relaxed">
              {product.slug === 'family-tree-botanical-print'
                ? '“My mom cried the second she unfolded the woven blanket and saw all 5 grandkids’ names with their exact birth month flowers.” — Caroline V., Verified US Buyer ★★★★★'
                : product.slug === 'custom-pet-memorial'
                ? '“I sent this birch wood portrait to my sister the week she lost her Golden Retriever. She said it is the most meaningful gift anyone has ever given her.” — Mark D., Verified US Buyer ★★★★★'
                : product.slug === 'custom-soundwave-art' || product.slug === 'custom-vinyl-song-portrait'
                ? '“Scanning the QR code on the artwork and hearing our wedding vows and first dance song made our whole family tear up.” — Marcus & Elena R., Verified US Buyer ★★★★★'
                : product.slug === 'custom-coordinates-print'
                ? '“We gave the chiseled stone slate of our parents’ childhood home at Christmas. My dad stared at it for five minutes straight.” — Lauren K., Verified US Buyer ★★★★★'
                : product.slug === 'newborn-birth-stat-portrait'
                ? '“Hanging above our daughter’s crib right now. The storybook sleeping moon and birth stats look like an heirloom book illustration.” — Jenna & Sam P., Verified US Buyer ★★★★★'
                : '“My husband isn’t a crier and he choked up the second he read the exact date and coordinates of the night we met.” — Rachel T., Verified US Buyer ★★★★★'}
            </div>

            <p className="text-[11px] text-[#5C4D42] text-center font-mono-tech">
              COMPLIMENTARY US STUDIO DELIVERY (3 TO 5 DAYS) · SHIPS GIFT-READY WITH ZERO PRICE TAGS
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
                    Verified Buyer · {rev.author} · {rev.location}
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
                        {other.physicalMedium}
                      </span>
                      <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                        {other.shortTitle}
                      </h3>
                      <p className="text-xs text-[#5C4D42] line-clamp-2">
                        {other.subtitle}
                      </p>
                      <div className="pt-3 border-t border-[#E5D9C5] flex items-center justify-between text-xs font-medium text-[#1B3027]">
                        <span>From ${other.startingPriceUsd}</span>
                        <span className="font-mono-tech uppercase tracking-wider text-[11px]">
                          Personalize →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Sticky Mobile Commission & Price Bar */}
          <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#CBB89F] px-4 py-2.5 shadow-[0_-8px_24px_rgba(38,26,19,0.12)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold truncate">
                <span>★★★★★ 4.9</span>
                <span>·</span>
                <span className="truncate">{product.shortTitle}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-[#261A13]">
                  ${appliedPromoCode ? Math.round(totalUsd * 0.85) : totalUsd}
                </span>
                {appliedPromoCode ? (
                  <span className="text-xs text-[#8C7A6B] line-through">${totalUsd}</span>
                ) : activeVariant.compareAtUsd ? (
                  <span className="text-xs text-[#8C7A6B] line-through">
                    ${activeVariant.compareAtUsd}
                  </span>
                ) : null}
                <span className="text-[10px] font-mono-tech text-[#1B3027] font-semibold">
                  FREE US SHIP
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="px-4 py-2.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold shrink-0 shadow-sm"
            >
              {isCheckingOut ? 'Preparing...' : 'Commission Now →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
