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
  resolvePrintifyVariantId,
} from '@/lib/catalog'
import { loadStoredBag, saveStoredBag, OrderBagItem } from '@/components/OrderBagDrawer'
import { buildCompactListenQrUrl, buildScannableQrMatrix } from '@/lib/qrcode'
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

export type DateFormatStyle = 'editorial' | 'european' | 'numeric' | 'roman'

export const DAYS_LIST = Array.from({ length: 31 }, (_, i) => i + 1)
export const YEARS_LIST = Array.from({ length: 78 }, (_, i) => 2026 - i)

function toRomanNumeral(num: number): string {
  const lookup: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let n = Math.max(1, Math.floor(num))
  let out = ''
  for (const [val, sym] of lookup) {
    while (n >= val) {
      out += sym
      n -= val
    }
  }
  return out
}

export function formatStructuredDate(
  monthName: string,
  day: number,
  year: number,
  style: DateFormatStyle
): string {
  const mIdx = Math.max(1, MONTH_NAMES.indexOf(monthName) + 1)
  if (style === 'european') {
    return `${day} ${monthName} ${year}`
  }
  if (style === 'numeric') {
    return `${String(mIdx).padStart(2, '0')} · ${String(day).padStart(2, '0')} · ${year}`
  }
  if (style === 'roman') {
    return `${toRomanNumeral(mIdx)} · ${toRomanNumeral(day)} · ${toRomanNumeral(year)}`
  }
  return `${monthName} ${day}, ${year}`
}

export const CURATED_HEADLINES_BY_SLUG: Record<string, string[]> = {
  'custom-star-map': [
    'THE NIGHT OUR STORY BEGAN',
    'THE NIGHT WE SAID I DO',
    'UNDER THESE EXACT STARS',
    'THE NIGHT YOU WERE BORN',
    'THE NIGHT WE GOT ENGAGED',
    'WRITTEN IN THE STARS',
  ],
  'custom-vinyl-song-portrait': [
    'OUR FIRST DANCE',
    'OUR WEDDING SONG',
    'THE SONG THAT STARTED IT ALL',
    'ALWAYS & FOREVER',
    'OUR ANNIVERSARY ANTHEM',
    'DANCING IN THE KITCHEN',
  ],
  'custom-soundwave-art': [
    'OUR WEDDING VOWS',
    'THE SOUND OF YOUR LAUGH',
    'OUR FIRST DANCE',
    'I LOVE YOU ALWAYS',
    'HEARTBEAT OF OUR FAMILY',
  ],
  'custom-city-map-print': [
    'CHARLESTON HARBOR',
    'NANTUCKET SOUND',
    'NEWPORT HARBOR',
    'SAVANNAH RIVER & SOUND',
    'CHESAPEAKE BAY',
    'PUGET SOUND · SEATTLE',
  ],
  'where-we-met-map': [
    'WHERE IT ALL BEGAN',
    'THE PLACE WE MET',
    'WHERE FOREVER STARTED',
    'OUR FAVORITE CORNER OF THE WORLD',
  ],
  'family-tree-botanical-print': [
    'THE FAMILY GARDEN',
    'NANA’S GARDEN OF LOVE',
    'GRANDMA’S BLOOMING GARDEN',
    'MAMA’S LITTLE WILDFLOWERS',
    'OUR FAMILY BOUQUET',
  ],
  'custom-coordinates-print': [
    'OUR FIRST HOME',
    'HOME SWEET HOME',
    'WHERE OUR STORY LIVES',
    'OUR FOREVER HOME',
    'THE FAMILY HOMESTEAD',
  ],
  'custom-book-stack-print': [
    'MOM’S COZY CORNER',
    'NANA’S SANCTUARY',
    'SLOW SUNDAY MORNINGS',
    'READING & RAINY DAYS',
    'WARMTH & PEACE',
  ],
}

export const CURATED_QUOTES_BY_SLUG: Record<string, string[]> = {
  'custom-star-map': [
    'Underneath these exact stars, everything changed forever.',
    'I have loved the stars too fondly to be fearful of the night.',
    'The sky above the exact moment our forever began.',
    'Every star in the heavens bore witness to our beginning.',
    'Two souls under one unforgettable night sky.',
  ],
  'custom-vinyl-song-portrait': [
    'Every time this song plays, I am right back in your arms.',
    'Take my hand, take my whole life too.',
    'All along there was some invisible string tying you to me.',
    'You are the best thing that’s ever been mine.',
    'At last, my love has come along.',
  ],
  'custom-soundwave-art': [
    'From this day forward, for better, for worse, for all of our days.',
    'A voice we will treasure in our hearts forever.',
    'Every beat of this song carries our favorite memory.',
    'In your voice, I always find my way home.',
  ],
  'family-tree-botanical-print': [
    'Rooted in love, blooming together through every season.',
    'Different flowers from the same cherished garden.',
    'Grandchildren are the brightest flowers in life’s garden.',
    'Planted in grace, growing together in love.',
  ],
  'custom-pet-memorial': [
    'The best companion on every trail, forever in our hearts.',
    'No longer by our side, but forever in our hearts.',
    'You left paw prints of pure love on our lives forever.',
    'Until we meet again at the Rainbow Bridge, sweet friend.',
    'Loved beyond words, missed beyond measure.',
  ],
  'custom-coordinates-print': [
    'Where loud mornings, warm dinners, and lifelong memories are made.',
    'Bless this home and all who gather within its walls.',
    'The exact place where our favorite chapter began.',
    'Built on love, laughter, and late-night conversations.',
  ],
  'met-engaged-married-triptych': [
    'Every mile and mountain path brought us to this moment.',
    'Three chapters, three places, one lifelong love story.',
    'From our first hello to our forever I do.',
    'Different coordinates, one shared destiny.',
  ],
  'newborn-birth-stat-portrait': [
    'Loved beyond measure from your very first breath.',
    'You are the sweetest dream we ever welcomed home.',
    'To the moon and back, forever and always.',
    'Every good and perfect gift comes from above.',
  ],
  'custom-book-stack-print': [
    'Warmth, light, and peace in every season.',
    'May this gentle glow bring calm to your favorite room.',
    'Hand-poured with gratitude for everything you do.',
  ],
}

export const POPULAR_CITIES_LIST: Array<{ label: string; coords: string }> = [
  { label: 'Charleston, South Carolina', coords: '32.7765° N · 79.9311° W' },
  { label: 'New York, New York', coords: '40.7128° N · 74.0060° W' },
  { label: 'Boston, Massachusetts', coords: '42.3601° N · 71.0589° W' },
  { label: 'Savannah, Georgia', coords: '32.0809° N · 81.0912° W' },
  { label: 'Nashville, Tennessee', coords: '36.1627° N · 86.7816° W' },
  { label: 'Asheville, North Carolina', coords: '35.5951° N · 82.5515° W' },
  { label: 'Austin, Texas', coords: '30.2672° N · 97.7431° W' },
  { label: 'Chicago, Illinois', coords: '41.8781° N · 87.6298° W' },
  { label: 'Denver, Colorado', coords: '39.7392° N · 104.9903° W' },
  { label: 'Seattle, Washington', coords: '47.6062° N · 122.3321° W' },
  { label: 'San Diego, California', coords: '32.7157° N · 117.1611° W' },
  { label: 'San Francisco, California', coords: '37.7749° N · 122.4194° W' },
  { label: 'Nantucket, Massachusetts', coords: '41.2835° N · 70.0995° W' },
  { label: 'Newport, Rhode Island', coords: '41.4901° N · 71.3128° W' },
  { label: 'Miami, Florida', coords: '25.7617° N · 80.1918° W' },
]

export const POPULAR_WEDDING_SONGS: string[] = [
  'At Last — Etta James',
  'Can’t Help Falling in Love — Elvis Presley',
  'Beyond — Leon Bridges',
  'Lover — Taylor Swift',
  'Perfect — Ed Sheeran',
  'Thinking Out Loud — Ed Sheeran',
  'You Are the Best Thing — Ray LaMontagne',
  'Make You Feel My Love — Adele',
  'Stand By Me — Ben E. King',
  'Coming Home — Leon Bridges',
  'La Vie En Rose — Louis Armstrong',
  'All of Me — John Legend',
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

  // Guided Dropdown, Structured Date Picker & Coordinate Toggle State
  const [selMonth, setSelMonth] = useState<string>('October')
  const [selDay, setSelDay] = useState<number>(14)
  const [selYear, setSelYear] = useState<number>(2023)
  const [dateFormatStyle, setDateFormatStyle] = useState<DateFormatStyle>('editorial')
  const [isCustomDateMode, setIsCustomDateMode] = useState<boolean>(false)
  const [isCustomHeadlineMode, setIsCustomHeadlineMode] = useState<boolean>(false)
  const [isCustomSublineMode, setIsCustomSublineMode] = useState<boolean>(false)
  const [isCustomLocationMode, setIsCustomLocationMode] = useState<boolean>(false)
  const [showCoordsOnPrint, setShowCoordsOnPrint] = useState<boolean>(true)
  const [isEditingCoordsText, setIsEditingCoordsText] = useState<boolean>(false)

  function applyStructuredDate(
    m: string,
    d: number,
    y: number,
    style: DateFormatStyle
  ) {
    setActiveMockupUrl(null)
    setSelMonth(m)
    setSelDay(d)
    setSelYear(y)
    setDateFormatStyle(style)
    setDateText(formatStructuredDate(m, d, y, style))
  }

  // Interactive 2.2x Magnifier Loupe & Fullscreen High-Res Proof Lightbox State
  const [isZoomedStage, setIsZoomedStage] = useState<boolean>(false)
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false)
  const [fullscreenDataUrl, setFullscreenDataUrl] = useState<string>('')
  const [isFullscreenZoomed, setIsFullscreenZoomed] = useState<boolean>(false)

  function handleStagePointerMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isZoomedStage) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPos({ x, y })
  }

  function handleOpenFullscreenProof() {
    if (activeMockupUrl) {
      setFullscreenDataUrl(activeMockupUrl)
    } else if (cleanCanvasRef.current) {
      try {
        setFullscreenDataUrl(cleanCanvasRef.current.toDataURL('image/png', 0.96))
      } catch {
        setFullscreenDataUrl(product.previewImage)
      }
    } else {
      setFullscreenDataUrl(product.previewImage)
    }
    setIsFullscreenZoomed(false)
    setIsFullscreenModalOpen(true)
  }

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
    const cleanNote = note.trim() || 'LOVE GROWS HERE FOREVER'
    setDateText(cleanNote)
    setCoordsText(cleanNote)
  }

  // Loaded Painterly Base Plate Image & Watercolor Portrait Backdrop
  const [basePlateEl, setBasePlateEl] = useState<HTMLImageElement | null>(null)
  const [portraitBackdropEl, setPortraitBackdropEl] = useState<HTMLImageElement | null>(null)

  // Photo Upload State (Only active on products where supportsPhotoUpload === true)
  const [uploadedPhotoEl, setUploadedPhotoEl] = useState<HTMLImageElement | null>(null)
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null)
  const [photoFilter, setPhotoFilter] = useState<PhotoFilterId>('warm_color')

  // Real Audio Upload & Live Microphone Recorder State (Only active on products where supportsAudioUpload === true)
  const [customAudioPeaks, setCustomAudioPeaks] = useState<number[] | null>(null)
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null)
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null)
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false)

  // GPS Lookup State
  const [isLookingUpGps, setIsLookingUpGps] = useState<boolean>(false)
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null)

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Load painterly base artwork plate whenever product.artworkPlate changes
  useEffect(() => {
    let active = true
    if (!product.artworkPlate) {
      setBasePlateEl(null)
      return
    }
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
    const qFrame = params.get('frame') as FrameFinishId | null
    const qVar = params.get('variant')

    if (qHead) setHeadline(qHead)
    if (qSub) setSubline(qSub)
    if (qLoc) setLocationText(qLoc)
    if (qDate) setDateText(qDate)
    if (qCoords) setCoordsText(qCoords)
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
    setViewMode('room')
    setIsZoomedStage(false)
    setIsCustomHeadlineMode(false)
    setIsCustomSublineMode(false)
    setIsCustomDateMode(false)
    setIsCustomLocationMode(false)
    setShowCoordsOnPrint(true)
    setIsEditingCoordsText(false)
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
      setUploadedPhotoUrl(null)
    }
    if (!nextProd.supportsAudioUpload) {
      setCustomAudioPeaks(null)
      setUploadedAudioName(null)
      setUploadedAudioUrl(null)
    }
    if (!nextProd.artworkPlate) {
      setBasePlateEl(null)
    }
  }

  const colorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0]
  const availableFrames = product.allowedFrames
    ? FRAME_FINISHES.filter((f) => product.allowedFrames?.includes(f.id))
    : FRAME_FINISHES
  const frameFinish =
    availableFrames.find((f) => f.id === frameFinishId) ||
    FRAME_FINISHES.find((f) => f.id === frameFinishId) ||
    availableFrames[0] ||
    FRAME_FINISHES[0]
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants.find((v) => v.badge === 'Most Popular') ||
    product.variants[0]
  const resolvedPrintifyVariantId = resolvePrintifyVariantId(
    activeVariant,
    product.supportsFrameFinish ? frameFinish.id : undefined
  )

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
    const SCALE = 2
    cleanCanvas.width = W * SCALE
    cleanCanvas.height = H * SCALE
    visibleCanvas.width = W * SCALE
    visibleCanvas.height = H * SCALE

    const ctx = cleanCanvas.getContext('2d')
    const vCtx = visibleCanvas.getContext('2d')
    if (!ctx || !vCtx) return

    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)
    vCtx.setTransform(SCALE, 0, 0, SCALE, 0, 0)

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
        ctx.filter = 'grayscale(100%) contrast(114%) sepia(14%)'
      } else if (photoFilter === 'charcoal_sketch') {
        ctx.filter = 'grayscale(100%) contrast(165%) brightness(106%) sepia(24%)'
      } else {
        // Multi-pass Painterly Watercolor Wash (Warm Saturation + Soft Bloom Overlay)
        ctx.filter = 'contrast(106%) saturate(122%) sepia(10%)'
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
      if (photoFilter === 'warm_color') {
        // Second soft-light painterly bloom pass to soften harsh digital phone photo edges into a watercolor wash
        ctx.globalCompositeOperation = 'soft-light'
        ctx.globalAlpha = 0.42
        ctx.filter = 'blur(4px) saturate(135%) contrast(112%)'
        ctx.drawImage(
          uploadedPhotoEl,
          cx - (iw * scale) / 2,
          cy - 10 - (ih * scale) / 2,
          iw * scale,
          ih * scale
        )
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }
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
    } else if (basePlateEl && product.mode !== 'soundwave') {
      if (isDarkPaper && product.mode === 'vinyl_lyric') {
        // Circular Vinyl Disc Clip on Dark Study / Midnight Palettes (Eliminates White Box Around Disc)
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, 420, 354, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(basePlateEl, 0, 0, W, H)
        ctx.restore()

        ctx.save()
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 0.78
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(cx, 420, 355, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      } else if (isDarkPaper) {
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

    // Helper: Draw auto-fitted single-line text so long names/addresses never clip off the mat
    const drawFittedLine = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      basePx: number,
      minPx: number,
      fontPrefix: string
    ) => {
      let px = basePx
      ctx.font = `${fontPrefix} ${px}px Georgia, serif`
      while (px > minPx && ctx.measureText(text).width > maxWidth) {
        px -= 1
        ctx.font = `${fontPrefix} ${px}px Georgia, serif`
      }
      ctx.fillText(text, x, y, maxWidth)
    }

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
      // Woven Parchment Name Ribbon Tags tied cleanly across the watercolor bouquet stems
      ctx.save()
      const activeMembers = familyMembers.filter((m) => m.name.trim().length > 0).slice(0, 6)
      const count = Math.max(1, activeMembers.length)
      const span = Math.min(620, Math.max(220, (count - 1) * 145))
      const startX = cx - span / 2

      activeMembers.forEach((m, idx) => {
        const fx = count === 1 ? cx : startX + (idx * span) / (count - 1)
        const tagY = 720 + (idx % 2 === 0 ? -12 : 16)
        const monthShort = (m.month || 'July').slice(0, 3)
        const flowerName = BIRTH_FLOWERS_DICT[m.month]?.flower || 'Rose'
        const labelTop = m.name.trim().slice(0, 14)
        const labelSub = `${monthShort.toUpperCase()} · ${flowerName.toUpperCase()}`

        // Subtle botanical stem tie line connecting tag to bouquet ribbon knot
        ctx.strokeStyle = '#6E5A4C'
        ctx.globalAlpha = 0.55
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(cx, 625)
        ctx.quadraticCurveTo((cx + fx) / 2, tagY - 12, fx, tagY)
        ctx.stroke()

        const tagW = 132
        const tagH = 40
        ctx.fillStyle = isDarkPaper ? '#261D17' : '#FAF6F0'
        ctx.globalAlpha = 0.96
        ctx.fillRect(fx - tagW / 2, tagY, tagW, tagH)
        ctx.strokeStyle = colorway.accentHex
        ctx.lineWidth = 1.5
        ctx.strokeRect(fx - tagW / 2, tagY, tagW, tagH)
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 0.8
        ctx.strokeRect(fx - tagW / 2 + 3, tagY + 3, tagW - 6, tagH - 6)

        ctx.globalAlpha = 1
        ctx.fillStyle = colorway.inkHex
        ctx.font = '600 13px Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(labelTop, fx, tagY + 18)

        ctx.fillStyle = colorway.accentHex
        ctx.font = '600 8.5px Georgia, serif'
        ctx.fillText(labelSub.slice(0, 22), fx, tagY + 32)
      })
      ctx.restore()
    } else if (product.mode === 'vinyl_lyric' && !uploadedPhotoEl) {
      // Custom Champagne-Gold Foil Record Center Label Inscription (Centered in Crimson Band)
      ctx.save()
      const medY = 421
      ctx.textAlign = 'center'
      ctx.fillStyle = '#F5DFB0'
      ctx.globalAlpha = 0.96
      ctx.font = '600 10.5px Georgia, serif'
      ctx.fillText(headline.toUpperCase().slice(0, 22), cx, medY - 26, 134)

      ctx.font = 'italic 9.5px Georgia, serif'
      ctx.fillStyle = '#E5C178'
      ctx.fillText(locationText.slice(0, 26), cx, medY + 30, 134)

      ctx.font = '600 7.5px monospace'
      ctx.globalAlpha = 0.82
      ctx.fillText(dateText.toUpperCase().slice(0, 24), cx, medY + 44, 126)
      ctx.restore()
    } else if (
      product.mode === 'coastal_chart' ||
      product.mode === 'patent_blueprint'
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
    } else if (product.mode === 'soundwave') {
      // 3C. Crystal Acrylic Plaque: Centered Golden Voice Waveform & Scannable QR Layout
      ctx.save()

      // Double hairline border around the plaque face
      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.68
      ctx.lineWidth = 1.8
      ctx.strokeRect(52, 52, W - 104, H - 104)
      ctx.globalAlpha = 0.28
      ctx.lineWidth = 1
      ctx.strokeRect(64, 64, W - 128, H - 128)

      // Top Plaque Milestone Heading
      ctx.textAlign = 'center'
      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.95
      drawFittedLine(
        headline.toUpperCase().slice(0, 48),
        cx,
        155,
        W - 180,
        16,
        12,
        '600'
      )

      // Central Symmetrical Golden Voice Waveform
      const bars = 76
      const span = 620
      const sx0 = cx - span / 2
      const wy = 415
      const maxAmp = 120

      for (let i = 0; i <= bars; i++) {
        let amp: number
        if (customAudioPeaks && customAudioPeaks.length > 0) {
          const pk = customAudioPeaks[i % customAudioPeaks.length] || 0.2
          amp = Math.max(8, pk * maxAmp)
        } else {
          const bSeed = hashSeed(`${seed}-wave-${i}`)
          const env = Math.sin((i / bars) * Math.PI)
          const harmonic =
            0.4 +
            0.45 * Math.abs(Math.sin(i * 0.32 + (seed % 19))) +
            0.15 * ((bSeed % 100) / 100)
          amp = Math.max(6, env * harmonic * maxAmp)
        }
        const x = sx0 + (i * span) / bars
        ctx.strokeStyle = i % 4 === 0 ? '#F3D282' : colorway.accentHex
        ctx.globalAlpha = i % 4 === 0 ? 0.98 : 0.88
        ctx.lineWidth = 3.6
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x, wy - amp)
        ctx.lineTo(x, wy + amp)
        ctx.stroke()
      }

      // Time indicators on left and right of waveform
      ctx.fillStyle = colorway.mutedHex
      ctx.globalAlpha = 0.85
      ctx.font = '500 12px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('0:00', sx0 - 6, wy + 4)
      ctx.textAlign = 'right'
      ctx.fillText(coordsText.trim() || '3:02', sx0 + span + 6, wy + 4)

      // Genuine Camera-Scannable Audio QR Code centered below waveform
      const listenQrUrl = buildCompactListenQrUrl({
        title: headline,
        song: locationText,
        dateText,
        subline,
        audioUrl: uploadedAudioUrl,
        peaks: customAudioPeaks,
      })
      const qrMatrix = buildScannableQrMatrix(listenQrUrl)
      const qrSize = 92
      const qrX = cx - qrSize / 2
      const qrY = 575
      ctx.fillStyle = '#FAF6F0'
      ctx.globalAlpha = 1
      ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16)
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.6
      ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16)

      const cellPx = qrSize / qrMatrix.size
      ctx.fillStyle = '#1D1511'
      for (let r = 0; r < qrMatrix.size; r++) {
        for (let c = 0; c < qrMatrix.size; c++) {
          if (qrMatrix.isDark(r, c)) {
            ctx.fillRect(
              qrX + c * cellPx,
              qrY + r * cellPx,
              cellPx + 0.15,
              cellPx + 0.15
            )
          }
        }
      }

      // Typography Below QR Code
      ctx.textAlign = 'center'
      const maxMatW = W - 180

      // Song Title & Artist: "AT LAST" — ETTA JAMES
      ctx.fillStyle = colorway.inkHex
      ctx.globalAlpha = 0.98
      drawFittedLine(
        `“${locationText.replace(/[“"]/g, '').toUpperCase()}”`,
        cx,
        742,
        maxMatW,
        25,
        16,
        '600'
      )

      // Dedication / Couple Names & Date: SARAH & MICHAEL · OCT 14, 2023
      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.95
      const coupleLine = [subline.replace(/[“”]/g, '').trim(), dateText.trim()]
        .filter(Boolean)
        .join('   ·   ')
      drawFittedLine(
        coupleLine.toUpperCase(),
        cx,
        786,
        maxMatW,
        15,
        11,
        '600'
      )

      // Instruction: SCAN QR TO PLAY RECORDING
      ctx.fillStyle = colorway.mutedHex
      ctx.globalAlpha = 0.8
      ctx.font = '500 11px monospace'
      ctx.fillText('SCAN QR TO PLAY RECORDING', cx, 824)

      ctx.restore()
    }

    // 3B. Acoustic Waveform + Scannable QR Code Overlay (For Vinyl Lyric products)
    if (
      product.supportsAudioUpload &&
      product.mode !== 'soundwave' &&
      (product.mode === 'vinyl_lyric' ||
        (customAudioPeaks && customAudioPeaks.length > 0))
    ) {
      ctx.save()
      const bars = 82
      const span = 480
      const sx0 = cx - span / 2 - 36
      const wy = 795
      const maxAmp = 25

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

      // Draw Genuine ISO/IEC 18004 Camera-Scannable Audio QR Code Matrix next to the waveform
      const listenQrUrl = buildCompactListenQrUrl({
        title: headline,
        song: locationText,
        dateText,
        subline,
        audioUrl: uploadedAudioUrl,
        peaks: customAudioPeaks,
      })
      const qrMatrix = buildScannableQrMatrix(listenQrUrl)
      const qrSize = 58
      const qrX = sx0 + span + 18
      const qrY = wy - qrSize / 2
      ctx.fillStyle = '#FAF6F0'
      ctx.globalAlpha = 0.99
      ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10)
      ctx.strokeStyle = colorway.accentHex
      ctx.lineWidth = 1.5
      ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10)

      const cellPx = qrSize / qrMatrix.size
      ctx.fillStyle = '#1D1511'
      for (let r = 0; r < qrMatrix.size; r++) {
        for (let c = 0; c < qrMatrix.size; c++) {
          if (qrMatrix.isDark(r, c)) {
            ctx.fillRect(
              qrX + c * cellPx,
              qrY + r * cellPx,
              cellPx + 0.15,
              cellPx + 0.15
            )
          }
        }
      }
      ctx.restore()
    }

    if (product.mode === 'three_map_triptych') {
      // 4A. Three-Panel Split Triptych Borders & Dedicated Per-Panel Milestone Columns
      // Wall-gap dividers sit at left=32.5% (x=312) and left=65.5% (x=629)
      const panels = [
        {
          x0: 24,
          x1: 294,
          roman: 'I · WHERE WE MET',
          sub: 'THE BEGINNING',
          milestone: locationText || 'Boston, MA · June 2019',
        },
        {
          x0: 330,
          x1: 610,
          roman: 'II · WHERE WE ENGAGED',
          sub: headline || 'SARAH & MICHAEL',
          milestone: dateText || 'Big Sur, CA · Oct 2021',
        },
        {
          x0: 648,
          x1: 936,
          roman: 'III · WHERE WE MARRIED',
          sub: 'FOREVER & ALWAYS',
          milestone: coordsText || 'Asheville, NC · Sept 2023',
        },
      ]

      ctx.save()
      ctx.textAlign = 'center'
      panels.forEach((p, idx) => {
        const pw = p.x1 - p.x0
        const pcx = p.x0 + pw / 2
        const maxTextW = pw - 26

        // Individual panel double-line border
        ctx.strokeStyle = colorway.accentHex
        ctx.globalAlpha = 0.52
        ctx.lineWidth = 1.8
        ctx.strokeRect(p.x0, 44, pw, H - 88)
        ctx.globalAlpha = 0.22
        ctx.lineWidth = 1
        ctx.strokeRect(p.x0 + 7, 51, pw - 14, H - 102)

        // Gold horizontal rule inside panel
        ctx.globalAlpha = 0.75
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(pcx - 68, 848)
        ctx.lineTo(pcx + 68, 848)
        ctx.stroke()

        // Roman Milestone Header
        ctx.globalAlpha = 1
        ctx.fillStyle = colorway.inkHex
        drawFittedLine(p.roman, pcx, 898, maxTextW, 18, 12, '600')

        // Panel Subtitle / Couple Names
        ctx.fillStyle = idx === 1 ? colorway.inkHex : colorway.mutedHex
        ctx.globalAlpha = idx === 1 ? 0.96 : 0.85
        drawFittedLine(
          p.sub.toUpperCase(),
          pcx,
          938,
          maxTextW,
          idx === 1 ? 16 : 12,
          10,
          idx === 1 ? '600' : 'italic'
        )

        // Milestone Location & Date
        ctx.fillStyle = colorway.accentHex
        ctx.globalAlpha = 0.96
        drawFittedLine(p.milestone.toUpperCase(), pcx, 992, maxTextW, 15, 10, '600')

        // Center Panel also displays the couple's custom dedication subline
        if (idx === 1 && subline.trim()) {
          ctx.fillStyle = colorway.mutedHex
          ctx.globalAlpha = 0.9
          drawFittedLine(subline.trim(), pcx, 1042, maxTextW, 13, 9, 'italic')
        }
      })
      ctx.restore()
    } else if (product.mode === 'soundwave') {
      // 4B. Crystal acrylic plaque layout is rendered completely in Section 3C above
    } else {
      // 4C. Standard Museum Double-Line Archival Frame Border
      ctx.save()
      ctx.strokeStyle = colorway.accentHex
      ctx.globalAlpha = 0.52
      ctx.lineWidth = 2
      ctx.strokeRect(44, 44, W - 88, H - 88)
      ctx.globalAlpha = 0.22
      ctx.lineWidth = 1
      ctx.strokeRect(54, 54, W - 108, H - 108)
      ctx.restore()

      // 5. Clean Luxury Serif Typography Block at Bottom (Auto-Fitted Within 780px Mat Width)
      const maxMatW = W - 160
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
      drawFittedLine(headline.toUpperCase().slice(0, 44), cx, 912, maxMatW, 33, 18, '600')

      ctx.fillStyle = colorway.inkHex
      ctx.globalAlpha = 0.88
      drawFittedLine(subline.slice(0, 76), cx, 958, maxMatW, 21, 13, 'italic')

      ctx.fillStyle = colorway.accentHex
      ctx.globalAlpha = 0.96
      if (product.mode === 'family_botanical') {
        // On Family Botanical Blanket, display the family member roster on line 1 and deduplicated Established note below
        drawFittedLine(locationText.toUpperCase(), cx, 1012, maxMatW, 15, 10, '600')
        ctx.fillStyle = colorway.mutedHex
        ctx.globalAlpha = 0.92
        const dClean = dateText.trim()
        const cClean = coordsText.trim()
        const heritageLine =
          dClean.toLowerCase() === cClean.toLowerCase()
            ? dClean.toUpperCase()
            : [dClean, cClean]
                .filter(Boolean)
                .map((s) => s.toUpperCase())
                .join('   ·   ')
        drawFittedLine(heritageLine, cx, 1056, maxMatW, 14, 10, 'italic')
      } else {
        const combinedLocDate = [locationText.trim(), dateText.trim()]
          .filter(Boolean)
          .map((s) => s.toUpperCase())
          .join('   •   ')
        drawFittedLine(combinedLocDate, cx, 1018, maxMatW, 17, 11, '600')

        if (showCoordsOnPrint && coordsText.trim().length > 0) {
          ctx.fillStyle = colorway.mutedHex
          ctx.globalAlpha = 0.92
          drawFittedLine(coordsText, cx, 1062, maxMatW, 16, 11, 'italic')
        }
      }
      ctx.restore()
    }

    // =========================================================================
    // PASS 2: Copy to Visible Preview Canvas + Subtle Archival Proof Seal
    // =========================================================================
    vCtx.clearRect(0, 0, W, H)
    vCtx.drawImage(cleanCanvas, 0, 0, W, H)

    vCtx.save()
    vCtx.textAlign = 'center'
    vCtx.font = '500 13px monospace'
    vCtx.fillStyle = colorway.mutedHex
    vCtx.globalAlpha = 0.35
    vCtx.fillText(
      product.mode === 'three_map_triptych'
        ? 'EVERMARK PRINTS · 3-PANEL STUDIO PROOF'
        : 'EVERMARK PRINTS · LIVE STUDIO PROOF',
      cx,
      H - 64
    )
    vCtx.restore()
  }, [
    headline,
    subline,
    locationText,
    dateText,
    coordsText,
    showCoordsOnPrint,
    colorway,
    customAudioPeaks,
    uploadedAudioUrl,
    uploadedPhotoEl,
    photoFilter,
    product.mode,
    product.formFactor,
    product.supportsPhotoUpload,
    product.supportsAudioUpload,
    basePlateEl,
    portraitBackdropEl,
    familyMembers,
    activeMockupUrl,
    viewMode,
    activeProductSlug,
  ])

  function handleApplyPreset(preset: EvermarkProduct['presets'][number]) {
    setActiveMockupUrl(null)
    setHeadline(preset.headline)
    setSubline(preset.subline)
    setLocationText(preset.location)
    setDateText(preset.dateText)
    setCoordsText(preset.coords)

    if (product.slug === 'family-tree-botanical-print' && preset.location.includes('•')) {
      const parsed = preset.location
        .split('•')
        .map((part, idx) => {
          const clean = part.trim()
          const namePart = clean.split('(')[0]?.trim() || `Member ${idx + 1}`
          const matchedMonth =
            MONTH_NAMES.find((m) =>
              clean.toLowerCase().includes(m.slice(0, 3).toLowerCase())
            ) || MONTH_NAMES[idx % 12]
          return { id: String(idx + 1), name: namePart, month: matchedMonth }
        })
        .filter((m) => m.name.length > 0)
      if (parsed.length > 0) {
        setFamilyMembers(parsed)
      }
      setFamilyNote(preset.coords)
    }
  }

  // Handle Custom Photo / Portrait Attachment
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      const img = new Image()
      img.onload = () => {
        setActiveMockupUrl(null)
        setUploadedPhotoEl(img)
        setUploadedPhotoName(file.name)
      }
      img.src = dataUrl

      fetch('/api/artwork-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl,
          productSlug: `${product.slug}-photo`,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const cdn = d?.url || d?.masterArtworkUrl
          if (cdn) setUploadedPhotoUrl(String(cdn))
        })
        .catch(() => {})
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

      // Persist uploaded audio clip so scanning the QR code plays the customer's actual audio recording
      const audioReader = new FileReader()
      audioReader.onload = () => {
        fetch('/api/audio-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: String(audioReader.result),
            slug: product.slug,
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d?.audioUrl || d?.url) {
              setUploadedAudioUrl(String(d.audioUrl || d.url))
            }
          })
          .catch(() => {})
      }
      audioReader.readAsDataURL(file)
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
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
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

          // Persist live voice note so scanning the QR code plays the customer's exact voice recording
          const blobReader = new FileReader()
          blobReader.onload = () => {
            fetch('/api/audio-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dataUrl: String(blobReader.result),
                slug: `${product.slug}-voice`,
              }),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((d) => {
                if (d?.audioUrl || d?.url) {
                  setUploadedAudioUrl(String(d.audioUrl || d.url))
                }
              })
              .catch(() => {})
          }
          blobReader.readAsDataURL(blob)
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
    let customThumb = product.previewImage
    if (typeof window !== 'undefined' && cleanCanvasRef.current) {
      try {
        customThumb = cleanCanvasRef.current.toDataURL('image/jpeg', 0.72)
      } catch {
        // Fallback to static preview image
      }
    }

    const items: OrderBagItem[] = [
      {
        bagItemId: `${product.slug}-${activeVariant.id}-${Date.now()}`,
        productSlug: product.slug,
        sku: product.sku,
        printifyProductId: product.printifyProductId,
        printifyBlueprintId: product.printifyBlueprintId,
        printifyProviderId: product.printifyProviderId,
        printifyVariantId: resolvedPrintifyVariantId,
        title: product.title,
        shortTitle: product.shortTitle,
        physicalMedium: product.physicalMedium,
        variantLabel: activeVariant.label,
        colorwayId,
        colorwayLabel: colorway.shortLabel,
        frameFinishId: product.supportsFrameFinish ? frameFinishId : undefined,
        frameFinishLabel: product.supportsFrameFinish ? frameFinish.shortLabel : undefined,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: isGiftOrder ? giftNote : undefined,
        priceUsd: activeVariant.priceUsd,
        quantity: 1,
        previewImage: customThumb,
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
        printifyVariantId: resolvedPrintifyVariantId,
        title: `${product.title} (2nd Gift Copy, 25% Off)`,
        shortTitle: `${product.shortTitle} (2nd Gift Copy, 25% Off)`,
        physicalMedium: product.physicalMedium,
        variantLabel: activeVariant.label,
        colorwayId,
        colorwayLabel: colorway.shortLabel,
        frameFinishId: product.supportsFrameFinish ? frameFinishId : undefined,
        frameFinishLabel: product.supportsFrameFinish ? frameFinish.shortLabel : undefined,
        headline,
        subline,
        locationText,
        dateText,
        coordsText,
        giftNote: isGiftOrder ? giftNote : undefined,
        priceUsd: secondCopyPriceUsd,
        quantity: 1,
        previewImage: customThumb,
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
        const previewDataUrl = cleanCanvas ? cleanCanvas.toDataURL('image/jpeg', 0.92) : ''
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
            customAudioUrl: uploadedAudioUrl || '',
            customPhotoUrl: uploadedPhotoUrl || '',
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
              const resolvedMaster = upData.masterArtworkUrl || upData.url
              if (resolvedMaster) {
                customMasterUrl = String(resolvedMaster)
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
            printifyVariantId: String(resolvedPrintifyVariantId),
            formatId: activeVariant.id,
            colorwayId,
            frameFinishId: product.supportsFrameFinish ? frameFinish.id : 'standard',
            headline: headline.slice(0, 120),
            subline: subline.slice(0, 180),
            locationText: locationText.slice(0, 120),
            dateText: dateText.slice(0, 120),
            coordsText: coordsText.slice(0, 120),
            giftNote: isGiftOrder ? giftNote.slice(0, 240) : '',
            customPeaks: serializedPeaks.slice(0, 350),
            customAudioUrl: (uploadedAudioUrl || '').slice(0, 480),
            customPhotoUrl: (uploadedPhotoUrl || '').slice(0, 480),
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

  function renderGuidedHeadlineControl(
    label: string,
    placeholder: string,
    maxLen = 42,
    isPersonalNameField = false
  ) {
    const baseOptions = CURATED_HEADLINES_BY_SLUG[product.slug] || []
    const allOptions = Array.from(
      new Set([product.defaultHeadline, ...baseOptions].filter(Boolean))
    )
    const isMatchedOption = allOptions.includes(headline)
    const selectVal =
      isCustomHeadlineMode || !isMatchedOption ? '__custom__' : headline

    if (isPersonalNameField) {
      return (
        <div className="space-y-1">
          <span className="text-xs text-[#4A3B31] font-medium block">{label}</span>
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setActiveMockupUrl(null)
              setHeadline(e.target.value)
            }}
            maxLength={maxLen}
            className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
            placeholder={placeholder}
          />
        </div>
      )
    }

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#4A3B31] font-medium">{label}</span>
          <button
            type="button"
            onClick={() => setIsCustomHeadlineMode(!isCustomHeadlineMode)}
            className="text-[11px] font-mono-tech text-[#9E472A] hover:text-[#1B3027] underline underline-offset-2 font-semibold"
          >
            {selectVal === '__custom__' ? '▾ Choose Popular Title' : '✎ Type Custom Names/Title'}
          </button>
        </div>
        <select
          value={selectVal}
          onChange={(e) => {
            const val = e.target.value
            setActiveMockupUrl(null)
            if (val === '__custom__') {
              setIsCustomHeadlineMode(true)
            } else {
              setIsCustomHeadlineMode(false)
              setHeadline(val)
            }
          }}
          className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2.5 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
        >
          {allOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__custom__">✎ Type Custom Title or Couple Names...</option>
        </select>
        {selectVal === '__custom__' && (
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setActiveMockupUrl(null)
              setHeadline(e.target.value)
            }}
            maxLength={maxLen}
            className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-sm text-[#261A13] focus:outline-none"
            placeholder={placeholder}
          />
        )}
      </div>
    )
  }

  function renderGuidedSublineControl(label: string, placeholder: string) {
    const baseQuotes = CURATED_QUOTES_BY_SLUG[product.slug] || []
    const allQuotes = Array.from(
      new Set([product.defaultSubline, ...baseQuotes].filter(Boolean))
    )
    const isBlank = subline.trim() === ''
    const isMatchedQuote = allQuotes.includes(subline)
    const selectVal = isCustomSublineMode
      ? '__custom__'
      : isBlank
      ? '__none__'
      : isMatchedQuote
      ? subline
      : '__custom__'

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#4A3B31] font-medium">{label}</span>
          <button
            type="button"
            onClick={() => {
              if (selectVal === '__custom__') {
                setIsCustomSublineMode(false)
                setSubline(allQuotes[0] || product.defaultSubline)
              } else {
                setIsCustomSublineMode(true)
              }
            }}
            className="text-[11px] font-mono-tech text-[#9E472A] hover:text-[#1B3027] underline underline-offset-2 font-semibold"
          >
            {selectVal === '__custom__' ? '▾ Choose Curated Quote' : '✎ Write Custom Quote'}
          </button>
        </div>
        <select
          value={selectVal}
          onChange={(e) => {
            const val = e.target.value
            setActiveMockupUrl(null)
            if (val === '__custom__') {
              setIsCustomSublineMode(true)
            } else if (val === '__none__') {
              setIsCustomSublineMode(false)
              setSubline('')
            } else {
              setIsCustomSublineMode(false)
              setSubline(val)
            }
          }}
          className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2.5 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
        >
          {allQuotes.map((q) => (
            <option key={q} value={q}>
              “{q}”
            </option>
          ))}
          <option value="__none__">🚫 No Subtitle / Quote (Clean Minimalist Look)</option>
          <option value="__custom__">✎ Write Custom Dedication or Song Lyric...</option>
        </select>
        {selectVal === '__custom__' && (
          <input
            type="text"
            value={subline}
            onChange={(e) => {
              setActiveMockupUrl(null)
              setSubline(e.target.value)
            }}
            maxLength={68}
            className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-sm text-[#261A13] focus:outline-none"
            placeholder={placeholder}
          />
        )}
      </div>
    )
  }

  function renderStructuredDateControl(label = 'Date / Milestone Anniversary') {
    const formatOptions: Array<{ id: DateFormatStyle; label: string }> = [
      { id: 'editorial', label: 'Oct 14, 2023' },
      { id: 'european', label: '14 Oct 2023' },
      { id: 'numeric', label: '10 · 14 · 2023' },
      { id: 'roman', label: 'Roman (X·XIV)' },
    ]
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#4A3B31] font-medium">{label}</span>
          <button
            type="button"
            onClick={() => setIsCustomDateMode(!isCustomDateMode)}
            className="text-[11px] font-mono-tech text-[#9E472A] hover:text-[#1B3027] underline underline-offset-2 font-semibold"
          >
            {isCustomDateMode ? '📅 Use Date Dropdowns' : '✎ Custom Date/Time'}
          </button>
        </div>

        {!isCustomDateMode ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              <select
                aria-label="Month"
                value={selMonth}
                onChange={(e) =>
                  applyStructuredDate(e.target.value, selDay, selYear, dateFormatStyle)
                }
                className="border border-[#CBB89F] bg-[#FDFBF7] px-2 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
              >
                {MONTH_NAMES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                aria-label="Day"
                value={selDay}
                onChange={(e) =>
                  applyStructuredDate(
                    selMonth,
                    Number(e.target.value),
                    selYear,
                    dateFormatStyle
                  )
                }
                className="border border-[#CBB89F] bg-[#FDFBF7] px-2 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
              >
                {DAYS_LIST.map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
              <select
                aria-label="Year"
                value={selYear}
                onChange={(e) =>
                  applyStructuredDate(
                    selMonth,
                    selDay,
                    Number(e.target.value),
                    dateFormatStyle
                  )
                }
                className="border border-[#CBB89F] bg-[#FDFBF7] px-2 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
              >
                {YEARS_LIST.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 4-Way Date Format Toggle Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {formatOptions.map((fmt) => {
                const isSelected = dateFormatStyle === fmt.id
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() =>
                      applyStructuredDate(selMonth, selDay, selYear, fmt.id)
                    }
                    className={`px-2 py-1 text-[10px] font-mono-tech uppercase tracking-wider border transition ${
                      isSelected
                        ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027] font-semibold'
                        : 'bg-[#F8F3EA] text-[#4A3B31] border-[#D8C9B6] hover:border-[#7A331E]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={dateText}
            onChange={(e) => {
              setActiveMockupUrl(null)
              setDateText(e.target.value)
            }}
            maxLength={36}
            className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#261A13] focus:outline-none"
            placeholder="e.g., October 14, 2023 · 8:30 PM"
          />
        )}
      </div>
    )
  }

  function renderCoordsToggleControl(label = 'GPS Coordinates / Bottom Inscription') {
    return (
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#4A3B31] font-medium">{label}</span>
          <div className="flex items-center gap-1.5">
            {gpsStatusMsg && (
              <span className="text-[10px] font-mono-tech text-[#1B3027]">
                {gpsStatusMsg}
              </span>
            )}
            <div className="inline-flex border border-[#CBB89F] bg-[#F8F3EA] p-0.5">
              <button
                type="button"
                onClick={() => {
                  setActiveMockupUrl(null)
                  setShowCoordsOnPrint(true)
                }}
                className={`px-2 py-0.5 text-[10px] font-mono-tech uppercase tracking-wider transition ${
                  showCoordsOnPrint
                    ? 'bg-[#1B3027] text-[#F7F4ED] font-semibold'
                    : 'text-[#5C4D42] hover:text-[#261A13]'
                }`}
              >
                ✓ Show on Print
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMockupUrl(null)
                  setShowCoordsOnPrint(false)
                  setIsEditingCoordsText(false)
                }}
                className={`px-2 py-0.5 text-[10px] font-mono-tech uppercase tracking-wider transition ${
                  !showCoordsOnPrint
                    ? 'bg-[#7A331E] text-[#F7F4ED] font-semibold'
                    : 'text-[#5C4D42] hover:text-[#261A13]'
                }`}
              >
                ✕ Hide
              </button>
            </div>
            {showCoordsOnPrint && (
              <button
                type="button"
                onClick={() => setIsEditingCoordsText(!isEditingCoordsText)}
                className="text-[10px] font-mono-tech text-[#9E472A] hover:text-[#1B3027] underline font-semibold ml-1"
              >
                {isEditingCoordsText ? 'Done' : '✎ Edit'}
              </button>
            )}
          </div>
        </div>

        {showCoordsOnPrint && !isEditingCoordsText && (
          <div className="px-3 py-1.5 bg-[#F6EFE4] border border-[#D8C9B6] flex items-center justify-between text-xs font-mono-tech text-[#261A13]">
            <span className="truncate">{coordsText || 'Auto-plotted from location'}</span>
            {product.supportsGpsLookup && (
              <button
                type="button"
                disabled={isLookingUpGps}
                onClick={handleLookupCoordinates}
                className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] hover:text-[#1B3027] font-semibold shrink-0 ml-2"
              >
                {isLookingUpGps ? 'Plotting...' : '↻ Sync GPS'}
              </button>
            )}
          </div>
        )}

        {showCoordsOnPrint && isEditingCoordsText && (
          <input
            type="text"
            value={coordsText}
            onChange={(e) => {
              setActiveMockupUrl(null)
              setCoordsText(e.target.value)
            }}
            maxLength={44}
            className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-xs font-mono-tech text-[#261A13] focus:outline-none"
          />
        )}
      </div>
    )
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

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: STICKY INTERACTIVE FORM-FACTOR STAGE & 2.2X DETAIL ZOOM (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-20 self-start space-y-3">
          {/* View Mode & Interactive Zoom Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8C9B6] pb-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveMockupUrl(null)
                  setIsZoomedStage(false)
                  setViewMode('room')
                }}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.13em] font-semibold transition border ${
                  !activeMockupUrl && viewMode === 'room' && !isZoomedStage
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                    : 'bg-[#FDFBF7] text-[#5C4D42] border-[#D8C9B6] hover:border-[#1B3027]'
                }`}
              >
                ✦ Live Customizer
              </button>
              <button
                type="button"
                onClick={() => setIsZoomedStage((prev) => !prev)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.13em] font-semibold transition border ${
                  isZoomedStage
                    ? 'bg-[#9E472A] text-[#FDFBF7] border-[#9E472A] shadow-sm'
                    : 'bg-[#FDFBF7] text-[#261A13] border-[#D8C9B6] hover:border-[#9E472A]'
                }`}
              >
                {isZoomedStage ? '🔍 2.2x Zoom Active (Click to Reset)' : '🔍 Zoom Detail (2.2x)'}
              </button>
              <button
                type="button"
                onClick={handleOpenFullscreenProof}
                className="px-3 py-1.5 text-[11px] uppercase tracking-[0.13em] font-semibold transition border bg-[#FDFBF7] text-[#261A13] border-[#D8C9B6] hover:border-[#1B3027]"
              >
                ⛶ Fullscreen Proof
              </button>
              {product.mockupGallery.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomedStage(false)
                    setActiveMockupUrl(product.mockupGallery[0])
                  }}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.13em] font-semibold transition border ${
                    activeMockupUrl
                      ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                      : 'bg-[#FDFBF7] text-[#9E472A] border-[#D8C9B6] hover:border-[#9E472A]'
                  }`}
                >
                  📷 3D Photos ({product.mockupGallery.length})
                </button>
              )}
            </div>

            <span className="hidden xl:inline-block text-[10px] font-mono-tech uppercase tracking-[0.12em] text-[#7A331E] font-medium">
              {product.physicalMedium}
            </span>
          </div>

          {/* Interactive Gallery Wall Stage OR Real Printify 3D Camera Mockup Viewer */}
          <div
            onMouseMove={handleStagePointerMove}
            onClick={() => setIsZoomedStage((prev) => !prev)}
            title={
              isZoomedStage
                ? 'Move cursor to pan 2.2x detail · Click to reset to 1x'
                : 'Click anywhere on artwork to zoom in 2.2x and inspect fine details'
            }
            className={`relative overflow-hidden border border-[#CBB89F] transition-all select-none ${
              isZoomedStage ? 'cursor-zoom-out' : 'cursor-zoom-in'
            } ${
              viewMode === 'room'
                ? 'gallery-wall-surface pt-4 pb-8 px-4 sm:px-8'
                : 'bg-[#E9DFCF] py-5 px-4 sm:px-8'
            }`}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech uppercase tracking-[0.14em] text-[#5C4D42] mb-3 pointer-events-none">
              <span>
                {activeMockupUrl
                  ? `3D STUDIO GALLERY PHOTOGRAPH · ${product.physicalMedium.toUpperCase()}`
                  : `LIVE INTERACTIVE PROOF · ${product.physicalMedium.toUpperCase()}`}
              </span>
              <span className="px-2 py-0.5 bg-[#FDFBF7]/90 border border-[#CBB89F] text-[#261A13] font-semibold">
                {isZoomedStage
                  ? '🔍 2.2x LOUPE ACTIVE · MOVE CURSOR TO PAN'
                  : '🔍 CLICK ARTWORK TO ZOOM 2.2X'}
              </span>
            </div>

            <div
              className="transition-transform duration-150 ease-out"
              style={
                isZoomedStage
                  ? {
                      transform: 'scale(2.2)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            >
              {activeMockupUrl && (
                <div className="relative z-10 mx-auto max-w-[420px] bg-white border border-[#D8C9B6] shadow-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeMockupUrl}
                    alt={product.title}
                    className="w-full h-auto block"
                  />
                </div>
              )}
              {/* Authentic Physical Form-Factor Renderer Wrapping Live Canvas (Kept mounted so switching back from 3D photos is instant and never blank!) */}
              <div
                className={`${
                  activeMockupUrl ? 'hidden' : 'block'
                } relative z-10 mx-auto transition-all duration-300 ${
                  viewMode === 'room' ? 'max-w-[355px]' : 'max-w-[430px]'
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
            </div>
          </div>

          {/* 3D Studio Camera Angle Thumbnails + Live Proof Toggle + Wall-Scale Visualizer */}
          <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech uppercase tracking-wider text-[#7A331E]">
              <span>SWITCH VIEW OR INSPECT DETAILS:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenFullscreenProof}
                  className="px-2.5 py-1 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] font-semibold transition"
                >
                  ⛶ Open Fullscreen Hi-Res Proof
                </button>
                <button
                  type="button"
                  onClick={() => setShowScaleVisualizer((prev) => !prev)}
                  className="px-2.5 py-1 bg-[#F3E9DA] hover:bg-[#E8D9C3] border border-[#9E472A] text-[#261A13] font-semibold transition"
                >
                  {showScaleVisualizer ? '✕ Close Size Scale' : '📐 Size Scale'}
                </button>
              </div>
            </div>

            {showScaleVisualizer && (
              <div className="p-3 bg-[#EFE6D8] border border-[#CBB89F] space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider text-[#261A13]">
                  <span className="font-semibold">
                    PROPORTIONAL SCALE ABOVE A STANDARD 78&quot; LIVING ROOM SOFA
                  </span>
                  <span className="text-[#9E472A]">Click any size to select</span>
                </div>
                <div className="relative bg-[#FAF6F0] border border-[#D8C9B6] pt-4 pb-2.5 px-4 flex flex-col items-center space-y-3">
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
                          className={`flex flex-col items-center gap-1 group transition ${
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
                  <div className="w-4/5 max-w-xs pt-1 flex flex-col items-center">
                    <div className="w-full h-4 bg-[#CBB89F] rounded-t-md border border-[#A69177]" />
                    <div className="w-[106%] h-3.5 bg-[#B59F84] rounded-sm border border-[#8C7A6B] flex items-center justify-center">
                      <span className="text-[8px] font-mono-tech uppercase tracking-widest text-[#261A13] font-semibold">
                        78&quot; Standard 3-Seat Sofa Width Reference
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setActiveMockupUrl(null)}
                className={`px-3 py-1.5 border text-xs font-semibold shrink-0 transition ${
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
                  className={`relative w-12 h-12 border overflow-hidden shrink-0 transition ${
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
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-block px-2.5 py-1 bg-[#F3E9DA] border border-[#D8C9B6] text-[11px] font-mono-tech text-[#261A13]">
                Physical Medium: <strong>{product.physicalMedium}</strong>
              </span>
              <span className="text-[11px] font-mono-tech text-[#1B3027] font-semibold">
                ✓ Free 3–5 Day US Shipping
              </span>
            </div>

            {/* Above-the-Fold Price + WELCOME15 Instant Clarity Bar */}
            <div className="mt-2 p-3 bg-[#F8F3EA] border border-[#CBB89F] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-editorial font-bold text-[#261A13]">
                  ${appliedPromoCode ? Math.round(totalUsd * 0.85) : totalUsd}
                </span>
                {activeVariant.compareAtUsd && (
                  <span className="text-xs text-[#8C7A6B] line-through">
                    ${activeVariant.compareAtUsd}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-[#1B3027] text-[#E5C178] text-[10px] font-mono-tech uppercase tracking-wider font-semibold">
                  ${Math.round(totalUsd * 0.85)} with code WELCOME15 (-15%)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAppliedPromoCode('WELCOME15')}
                className="text-[10px] font-mono-tech uppercase tracking-wider font-semibold underline text-[#9E472A] hover:text-[#1B3027]"
              >
                {appliedPromoCode === 'WELCOME15' ? '✓ WELCOME15 Applied' : 'Apply 15% Off →'}
              </button>
            </div>
          </div>

          {/* STEP 1: Contextual Inscription & Personalization (Immediate Live Canvas Updates) */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-2">
              <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
                {product.slug === 'family-tree-botanical-print'
                  ? '01. Personalize Family Bouquet & Birth Flowers'
                  : product.slug === 'newborn-birth-stat-portrait'
                  ? '01. Personalize Baby Name & Birth Stats'
                  : product.slug === 'custom-book-stack-print'
                  ? '01. Personalize Apothecary Candle Label'
                  : product.slug === 'custom-pet-memorial'
                  ? '01. Personalize Pet Name & Memorial Tribute'
                  : product.slug === 'custom-coordinates-print'
                  ? '01. Personalize First Home Address & Year'
                  : product.slug === 'met-engaged-married-triptych'
                  ? '01. Personalize Couple Names & 3 Milestones'
                  : '01. Personalize Your Inscription (Live Proof)'}
              </label>
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A]">
                Updates Live On Artwork
              </span>
            </div>

            {/* 1-Click Occasion Presets Right Inside Step 01 */}
            {product.presets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 bg-[#F8F3EA] border border-[#D8C9B6] p-2.5">
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.1em] text-[#7A331E] font-semibold mr-1">
                  Quick Examples:
                </span>
                {product.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2 py-1 border border-[#CBB89F] hover:border-[#1B3027] bg-[#FDFBF7] text-[#261A13] text-[11px] font-medium transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {product.supportsPhotoUpload && (
              <div className="p-3 bg-[#F6EFE4] border border-[#CBB89F] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#261A13] block">
                      {product.photoUploadLabel || 'Upload Your Custom Photo'}
                    </span>
                    <span className="text-[11px] text-[#5C4D42] block">
                      {product.photoUploadHint ||
                        'Automatically framed inside our watercolor botanical wreath with soft painterly edges.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition shadow-sm"
                    >
                      {uploadedPhotoName ? '📷 Change Photo' : '📷 Upload Photo (.JPG/.PNG)'}
                    </button>
                    {uploadedPhotoEl && (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhotoEl(null)
                          setUploadedPhotoName(null)
                          setUploadedPhotoUrl(null)
                        }}
                        className="px-2 py-1.5 border border-[#CBB89F] bg-[#FDFBF7] text-[10px] font-mono-tech uppercase text-[#9E472A] hover:text-[#261A13]"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {uploadedPhotoEl && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D8C9B6]">
                    <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold truncate max-w-[180px]">
                      ✓ {uploadedPhotoName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(
                        [
                          { id: 'warm_color', label: 'Watercolor Wash' },
                          { id: 'bw_film', label: 'Classic B&W' },
                          { id: 'charcoal_sketch', label: 'Fine Sketch' },
                        ] as { id: PhotoFilterId; label: string }[]
                      ).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setPhotoFilter(f.id)}
                          className={`px-2 py-1 text-[10px] font-mono-tech uppercase border transition ${
                            photoFilter === f.id
                              ? 'bg-[#9E472A] text-[#FDFBF7] border-[#9E472A] font-semibold'
                              : 'bg-[#FDFBF7] text-[#4A3B31] border-[#CBB89F]'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {product.supportsAudioUpload && (
              <div className="p-3 bg-[#F6EFE4] border border-[#CBB89F] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[#261A13] block">
                      Attach Custom Song Clip or Voice Memo (Optional)
                    </span>
                    <span className="text-[11px] text-[#5C4D42] block">
                      Plots your exact acoustic waveform &amp; links it to the camera-scannable QR code on your artwork.
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/x-m4a,audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider font-semibold transition shadow-sm"
                    >
                      {uploadedAudioName ? '🎵 Change Audio' : '🎵 Upload Audio (.MP3/.WAV)'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRecordMicrophone}
                      disabled={isRecordingMic}
                      className={`px-2.5 py-1.5 border text-[10px] font-mono-tech uppercase tracking-wider font-semibold transition ${
                        isRecordingMic
                          ? 'bg-[#9E472A] text-white border-[#9E472A] animate-pulse'
                          : 'bg-[#FDFBF7] hover:bg-[#F3E9DA] text-[#261A13] border-[#9E472A]'
                      }`}
                    >
                      {isRecordingMic ? '● Recording (5s)...' : '🎙 Record Voice (5s)'}
                    </button>
                    {uploadedAudioName && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAudioPeaks(null)
                          setUploadedAudioName(null)
                          setUploadedAudioUrl(null)
                        }}
                        className="px-2 py-1.5 border border-[#CBB89F] bg-[#FDFBF7] text-[10px] font-mono-tech uppercase text-[#9E472A] hover:text-[#261A13]"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D8C9B6] text-[11px] font-mono-tech text-[#1B3027]">
                  <span className="truncate max-w-[260px]">
                    {uploadedAudioName
                      ? `✓ Plotted: ${uploadedAudioName}`
                      : '✓ Auto-Plots Soundwave & Camera-Scannable Song QR'}
                  </span>
                  <Link
                    href={`/listen?title=${encodeURIComponent(headline)}&subline=${encodeURIComponent(
                      subline
                    )}&song=${encodeURIComponent(locationText)}&date=${encodeURIComponent(
                      dateText
                    )}${uploadedAudioUrl ? `&audio=${encodeURIComponent(uploadedAudioUrl)}` : ''}`}
                    target="_blank"
                    className="underline font-semibold text-[#9E472A] hover:text-[#1B3027]"
                  >
                    ♫ Test Scannable QR Player ↗
                  </Link>
                </div>
              </div>
            )}

            {/* 1. FAMILY BIRTH FLOWER BOUQUET BLANKET */}
            {product.slug === 'family-tree-botanical-print' ? (
              <div className="space-y-4">
                {renderGuidedHeadlineControl(
                  'Family Title / Blanket Heading',
                  'e.g., THE MILLER FAMILY GARDEN'
                )}

                {renderGuidedSublineControl(
                  'Dedication Subtitle Line',
                  'e.g., Rooted in love, blooming together through every season.'
                )}

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
                    {familyMembers.map((member, idx) => (
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
                    ))}
                  </div>

                  <div className="pt-2 space-y-1.5">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Family Heritage / Established Note
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <select
                        value={
                          [
                            'LOVE GROWS HERE FOREVER',
                            'THREE GENERATIONS OF LOVE',
                            'BLESSED BEYOND MEASURE',
                            'FOREVER FAMILY ROOTS',
                          ].includes(familyNote)
                            ? familyNote
                            : '__custom__'
                        }
                        onChange={(e) => {
                          if (e.target.value !== '__custom__') {
                            setFamilyNote(e.target.value)
                            syncFamilyMembersToCanvas(familyMembers, e.target.value)
                          }
                        }}
                        className="border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        <option value="LOVE GROWS HERE FOREVER">Love Grows Here Forever</option>
                        <option value="THREE GENERATIONS OF LOVE">Three Generations of Love</option>
                        <option value="BLESSED BEYOND MEASURE">Blessed Beyond Measure</option>
                        <option value="FOREVER FAMILY ROOTS">Forever Family Roots</option>
                        <option value="__custom__">✎ Established Year / Custom...</option>
                      </select>
                      <select
                        aria-label="Established Year"
                        onChange={(e) => {
                          const val = `ESTABLISHED ${e.target.value} · LOVE GROWS HERE`
                          setFamilyNote(val)
                          syncFamilyMembersToCanvas(familyMembers, val)
                        }}
                        defaultValue="1988"
                        className="border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        {YEARS_LIST.map((y) => (
                          <option key={y} value={y}>
                            Est. {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : product.slug === 'newborn-birth-stat-portrait' ? (
              /* 2. STORYBOOK SLEEPING MOON & BABY BIRTH STATS */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  "Baby's Full Name",
                  'e.g., LEO ALEXANDER BROOKS',
                  42,
                  true
                )}

                {renderGuidedSublineControl(
                  'Welcome & Dedication Line',
                  'e.g., Loved Beyond Measure From Your Very First Breath'
                )}

                {renderStructuredDateControl('Birth Date (Select Month / Day / Year)')}

                <div className="grid sm:grid-cols-2 gap-3">
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
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., 7 LBS 11 OZ · 20.5 INCHES"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Birthplace City
                    </span>
                    <input
                      type="text"
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      maxLength={42}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., Boston, Massachusetts"
                    />
                  </div>
                </div>
              </div>
            ) : product.slug === 'custom-book-stack-print' ? (
              /* 3. BOTANICAL SCENTED SOY CANDLE */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  'Candle Label Title / Recipient',
                  "e.g., MOM'S COZY CORNER"
                )}

                {renderGuidedSublineControl(
                  'Dedication Quote or Blend Note',
                  'e.g., Warmth, Light & Peace in Every Season'
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Botanical Scent Caption
                    </span>
                    <select
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                    >
                      <option value="White Sage & Lavender · USA">White Sage &amp; Lavender · USA</option>
                      <option value="Clean Cotton & Bergamot · USA">Clean Cotton &amp; Bergamot · USA</option>
                      <option value="Sea Salt & Orchid · USA">Sea Salt &amp; Orchid · USA</option>
                      <option value="Cinnamon Vanilla Bean · USA">Cinnamon Vanilla Bean · USA</option>
                      <option value="Apothecary Reserve · Hand Poured">Apothecary Reserve · Hand Poured</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Occasion / Established Year
                    </span>
                    <select
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                    >
                      <option value="Hand-Poured · 2026 Edition">Hand-Poured · 2026 Edition</option>
                      <option value="Mother’s Day Reserve">Mother&apos;s Day Reserve</option>
                      <option value="Housewarming Edition">Housewarming Edition</option>
                      <option value="Botanical Sanctuary Reserve">Botanical Sanctuary Reserve</option>
                      <option value="With Gratitude & Love">With Gratitude &amp; Love</option>
                    </select>
                  </div>
                </div>

                {renderCoordsToggleControl('Bottom Apothecary Seal')}
              </div>
            ) : product.slug === 'custom-pet-memorial' ? (
              /* 4. SOLID BIRCH WOOD PET MEMORIAL */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  "Pet's Name",
                  'e.g., BARNABY',
                  32,
                  true
                )}

                {renderGuidedSublineControl(
                  'Loving Tribute Quote',
                  'e.g., The best boy on every trail, always in our hearts.'
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Epitaph / Tribute Subtitle
                    </span>
                    <select
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                    >
                      <option value="Forever Our Loyal Companion">Forever Our Loyal Companion</option>
                      <option value="Forever In Our Hearts">Forever In Our Hearts</option>
                      <option value="The Best Boy On Every Trail">The Best Boy On Every Trail</option>
                      <option value="The Sweetest Soul We Ever Knew">The Sweetest Soul We Ever Knew</option>
                      <option value="Our Faithful Best Friend">Our Faithful Best Friend</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Years of Life (Start – End Year)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        aria-label="Birth Year"
                        defaultValue="2012"
                        onChange={(e) => {
                          const endYr = dateText.split('–')[1]?.trim() || '2026'
                          setActiveMockupUrl(null)
                          setDateText(`${e.target.value} – ${endYr}`)
                        }}
                        className="border border-[#CBB89F] bg-[#FDFBF7] px-2 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        {YEARS_LIST.slice(0, 30).map((y) => (
                          <option key={y} value={y}>
                            From {y}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Passing Year"
                        defaultValue="2026"
                        onChange={(e) => {
                          const startYr =
                            dateText.split('–')[0]?.replace(/[^0-9]/g, '') || '2012'
                          setActiveMockupUrl(null)
                          setDateText(`${startYr} – ${e.target.value}`)
                        }}
                        className="border border-[#CBB89F] bg-[#FDFBF7] px-2 py-2 text-xs text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        {YEARS_LIST.slice(0, 15).map((y) => (
                          <option key={y} value={y}>
                            To {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {renderCoordsToggleControl('Bottom Dedication Line')}
              </div>
            ) : product.slug === 'custom-coordinates-print' ? (
              /* 5. OUR FIRST HOME CHISELED SLATE */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  'Home / Family Heading',
                  'e.g., OUR FIRST HOME'
                )}

                {renderGuidedSublineControl(
                  'Dedication Subtitle',
                  'e.g., Where loud mornings, warm dinners, and lifelong memories are made.'
                )}

                <div className="grid sm:grid-cols-2 gap-3">
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
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs sm:text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="e.g., 742 Evergreen Terrace · Charleston, SC"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#4A3B31] font-medium block">
                      Established Year
                    </span>
                    <select
                      aria-label="Established Year"
                      defaultValue="2024"
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(`ESTABLISHED ${e.target.value}`)
                      }}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                    >
                      {YEARS_LIST.slice(0, 50).map((y) => (
                        <option key={y} value={y}>
                          Established {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {renderCoordsToggleControl('Exact Home GPS Coordinates')}
              </div>
            ) : product.slug === 'met-engaged-married-triptych' ? (
              /* 6. THREE MILESTONES FLOATING FRAMED CANVAS TRIPTYCH */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  'Couple Names / Triptych Heading',
                  'e.g., SARAH & MICHAEL',
                  36,
                  true
                )}

                {renderGuidedSublineControl(
                  'Triptych Dedication Line',
                  'e.g., Every mountain path brought us to this moment.'
                )}

                <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="space-y-1.5 p-2.5 bg-[#F8F3EA] border border-[#D8C9B6]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 1: Where We Met
                    </span>
                    <select
                      aria-label="Panel 1 Popular City"
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-white px-2 py-1 text-[11px] text-[#261A13] font-medium"
                    >
                      <option value="">▾ Quick-Pick City...</option>
                      {POPULAR_CITIES_LIST.map((c) => {
                        const shortCity = c.label.split(',')[0].toUpperCase()
                        return (
                          <option key={c.label} value={`${shortCity} · JUNE 2019`}>
                            {c.label}
                          </option>
                        )
                      })}
                    </select>
                    <input
                      type="text"
                      value={locationText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setLocationText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-1.5 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="DENVER · JUNE 2018"
                    />
                  </div>

                  <div className="space-y-1.5 p-2.5 bg-[#F8F3EA] border border-[#D8C9B6]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 2: Engaged
                    </span>
                    <select
                      aria-label="Panel 2 Popular City"
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-white px-2 py-1 text-[11px] text-[#261A13] font-medium"
                    >
                      <option value="">▾ Quick-Pick City...</option>
                      {POPULAR_CITIES_LIST.map((c) => {
                        const shortCity = c.label.split(',')[0].toUpperCase()
                        return (
                          <option key={c.label} value={`${shortCity} · OCT 2021`}>
                            {c.label}
                          </option>
                        )
                      })}
                    </select>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setDateText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-1.5 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="ASPEN · OCT 2021"
                    />
                  </div>

                  <div className="space-y-1.5 p-2.5 bg-[#F8F3EA] border border-[#D8C9B6]">
                    <span className="text-[11px] font-mono-tech uppercase text-[#9E472A] font-semibold block">
                      Panel 3: Married
                    </span>
                    <select
                      aria-label="Panel 3 Popular City"
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      className="w-full border border-[#CBB89F] bg-white px-2 py-1 text-[11px] text-[#261A13] font-medium"
                    >
                      <option value="">▾ Quick-Pick City...</option>
                      {POPULAR_CITIES_LIST.map((c) => {
                        const shortCity = c.label.split(',')[0].toUpperCase()
                        return (
                          <option key={c.label} value={`${shortCity} · SEPT 2023`}>
                            {c.label}
                          </option>
                        )
                      })}
                    </select>
                    <input
                      type="text"
                      value={coordsText}
                      onChange={(e) => {
                        setActiveMockupUrl(null)
                        setCoordsText(e.target.value)
                      }}
                      maxLength={32}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-2.5 py-1.5 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                      placeholder="VAIL · SEPT 2023"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* 7. CELESTIAL / CARTOGRAPHIC / ACOUSTIC EDITIONS (Star Map, Vinyl Song, Soundwave, Nautical Chart, Tapestry) */
              <div className="space-y-3.5">
                {renderGuidedHeadlineControl(
                  product.supportsAudioUpload
                    ? 'Record / Plaque Title (Select or Type Custom)'
                    : 'Primary Title / Milestone Heading',
                  product.supportsAudioUpload
                    ? 'e.g., OUR FIRST DANCE'
                    : 'e.g., THE NIGHT OUR STORY BEGAN'
                )}

                {renderGuidedSublineControl(
                  product.supportsAudioUpload
                    ? 'Dedication Quote or Song Lyric'
                    : 'Dedication / Subtitle Line',
                  'e.g., Underneath these exact stars, everything changed.'
                )}

                {/* Guided Song Selector OR Popular US City Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#4A3B31] font-medium">
                      {product.supportsAudioUpload
                        ? 'Song Title & Artist (Select Classic or Type Custom)'
                        : 'City, Place or Port (Select City or Type Any Place)'}
                    </span>
                    <div className="flex items-center gap-2">
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
                      <button
                        type="button"
                        onClick={() => setIsCustomLocationMode(!isCustomLocationMode)}
                        className="text-[11px] font-mono-tech text-[#1B3027] hover:text-[#9E472A] underline font-semibold"
                      >
                        {isCustomLocationMode ? '▾ Popular List' : '✎ Type Custom'}
                      </button>
                    </div>
                  </div>

                  {product.supportsAudioUpload ? (
                    <>
                      <select
                        value={
                          isCustomLocationMode
                            ? '__custom__'
                            : POPULAR_WEDDING_SONGS.includes(locationText)
                            ? locationText
                            : '__custom__'
                        }
                        onChange={(e) => {
                          setActiveMockupUrl(null)
                          if (e.target.value === '__custom__') {
                            setIsCustomLocationMode(true)
                          } else {
                            setIsCustomLocationMode(false)
                            setLocationText(e.target.value)
                          }
                        }}
                        className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2.5 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        <option value={product.defaultLocation}>
                          ♫ {product.defaultLocation}
                        </option>
                        {POPULAR_WEDDING_SONGS.map((song) => (
                          <option key={song} value={song}>
                            ♫ {song}
                          </option>
                        ))}
                        <option value="__custom__">
                          ✎ Type Any Custom Song Title &amp; Artist...
                        </option>
                      </select>
                      {(isCustomLocationMode ||
                        (!POPULAR_WEDDING_SONGS.includes(locationText) &&
                          locationText !== product.defaultLocation)) && (
                        <input
                          type="text"
                          value={locationText}
                          onChange={(e) => {
                            setActiveMockupUrl(null)
                            setLocationText(e.target.value)
                          }}
                          maxLength={38}
                          placeholder="e.g., Your Song — Elton John"
                          className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#261A13] focus:outline-none"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        value={
                          isCustomLocationMode
                            ? '__custom__'
                            : POPULAR_CITIES_LIST.some((c) => c.label === locationText)
                            ? locationText
                            : locationText === product.defaultLocation
                            ? product.defaultLocation
                            : '__custom__'
                        }
                        onChange={(e) => {
                          setActiveMockupUrl(null)
                          const val = e.target.value
                          if (val === '__custom__') {
                            setIsCustomLocationMode(true)
                          } else {
                            setIsCustomLocationMode(false)
                            setLocationText(val)
                            const matched = POPULAR_CITIES_LIST.find((c) => c.label === val)
                            if (matched) {
                              setCoordsText(matched.coords)
                              setGpsStatusMsg('✓ Coordinates synced')
                            }
                          }
                        }}
                        className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2.5 text-xs sm:text-sm text-[#261A13] font-medium focus:border-[#1B3027] focus:outline-none"
                      >
                        <option value={product.defaultLocation}>
                          ⌖ {product.defaultLocation}
                        </option>
                        {POPULAR_CITIES_LIST.filter(
                          (c) => c.label !== product.defaultLocation
                        ).map((city) => (
                          <option key={city.label} value={city.label}>
                            ⌖ {city.label} ({city.coords})
                          </option>
                        ))}
                        <option value="__custom__">
                          ✎ Type Any Custom City, Town or Venue...
                        </option>
                      </select>
                      {(isCustomLocationMode ||
                        (!POPULAR_CITIES_LIST.some((c) => c.label === locationText) &&
                          locationText !== product.defaultLocation)) && (
                        <input
                          type="text"
                          value={locationText}
                          onChange={(e) => {
                            setActiveMockupUrl(null)
                            setLocationText(e.target.value)
                          }}
                          maxLength={38}
                          placeholder="Type any city or address (then click Auto-Find GPS ⌖)"
                          className="w-full border border-[#1B3027] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#261A13] focus:outline-none"
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Structured Date Picker ([Month ▾] [Day ▾] [Year ▾] + 4 Format Toggle Pills) */}
                {renderStructuredDateControl('Date / Anniversary (Select Month · Day · Year)')}

                {/* Coordinates / Bottom Line Toggle ([✓ Show on Print] / [✕ Hide]) */}
                {renderCoordsToggleControl(
                  product.supportsGpsLookup
                    ? 'GPS Coordinates on Print'
                    : 'Bottom Inscription / Audio Duration Line'
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Select Hardwood Frame / Wood Base Finish (ONLY shown on products that have a wood frame/base!) */}
          {product.supportsFrameFinish && (
            <div className="space-y-2.5 pt-2">
              <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
                02. Select Solid Hardwood Frame Finish
              </label>
              <div
                className={`grid gap-2.5 ${
                  availableFrames.length === 2
                    ? 'grid-cols-2'
                    : availableFrames.length === 4
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : 'grid-cols-3'
                }`}
              >
                {availableFrames.map((f) => {
                  const isSel = f.id === frameFinish.id
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

          {/* STEP 3: Select Real Product Size / Scent / Variant */}
          <div className="space-y-2.5 pt-2">
            <label className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#261A13] font-semibold block">
              {product.supportsFrameFinish ? '03.' : '02.'} Select Physical Size / Edition (
              {product.physicalMedium})
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

          {/* Optional 2nd Identical Copy Privilege (25% Off) */}
          <div className="p-3.5 bg-[#F6EFE4] border border-[#CBB89F]">
            <label className="flex items-start justify-between gap-3 cursor-pointer">
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
                    Strike a second matching {product.shortTitle} in the same shipment with free combined US delivery.
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
                  : '🔗 Copy Shareable Link'}
              </button>
            </div>
            <form onSubmit={handleEmailSavedProof} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={saveProofEmail}
                onChange={(e) => setSaveProofEmail(e.target.value)}
                placeholder="Enter your email to save this exact design + 15% off..."
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

          {!compactHeroMode && (
            <div className="grid sm:grid-cols-2 gap-2.5 text-xs pt-2 border-t border-[#E5D9C5]">
              {product.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#F8F3EA] border border-[#D8C9B6] flex items-start gap-2.5 text-[#3D2E24]"
                >
                  <span className="font-mono-tech text-[#9E472A] font-semibold text-[11px]">
                    0{i + 1}
                  </span>
                  <span className="leading-snug text-[11px]">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN HIGH-RESOLUTION PROOF LIGHTBOX MODAL */}
      {isFullscreenModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#14100D]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-[#FAF6F0] border border-[#CBB89F] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#1B3027] text-[#F7F4ED] border-b border-[#D8AE64]/30">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#E5C178] font-semibold">
                  HIGH-RESOLUTION STUDIO PROOF INSPECTOR
                </span>
                <span className="hidden sm:inline text-xs text-[#E2D9C8]">
                  · {product.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullscreenZoomed((prev) => !prev)}
                  className="px-3 py-1 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition"
                >
                  {isFullscreenZoomed ? '🔍 Reset to Fit (1x)' : '🔍 Zoom In (2x Hi-Res)'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-10 bg-[#E9DFCF] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullscreenDataUrl}
                alt={`${product.title} High-Resolution Proof`}
                onClick={() => setIsFullscreenZoomed((prev) => !prev)}
                className={`block bg-white shadow-2xl border border-[#CBB89F] transition-all duration-200 ${
                  isFullscreenZoomed
                    ? 'w-[960px] max-w-none cursor-zoom-out'
                    : 'max-h-[74vh] w-auto cursor-zoom-in'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {!compactHeroMode && (
        <>
          {/* Materials, Framing & US Studio Guarantee (3-Card Architectural Breakdown) */}
          <section className="grid md:grid-cols-3 gap-6 border-t border-[#D8C9B6] pt-12">
            <div className="p-6 bg-[#FDFBF7] border border-[#CBB89F] space-y-2.5">
              <span className="text-[10px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
                01 · ARCHIVAL MEDIUM &amp; FINISH
              </span>
              <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                {product.physicalMedium}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
                Crafted to museum conservation standards using 12-color archival pigment inks, kiln-dried solid American hardwood, chiseled natural stone, optical crystal, or 100% cotton jacquard weave. Arrives ready to display out of the box.
              </p>
            </div>

            <div className="p-6 bg-[#FDFBF7] border border-[#CBB89F] space-y-2.5">
              <span className="text-[10px] font-mono-tech uppercase tracking-[0.18em] text-[#1B3027] font-semibold">
                02 · EXACT LIVE PROOF GUARANTEE
              </span>
              <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                Printed Word-for-Word From Your Proof
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
                Your live studio canvas is rendered at 300 DPI master print resolution and locked directly to your order. Spot a typo after checkout? Edit your inscription live for 2 hours at{' '}
                <Link href="/track" className="underline font-semibold text-[#1B3027]">
                  evermarkprints.com/track
                </Link>
                .
              </p>
            </div>

            <div className="p-6 bg-[#FDFBF7] border border-[#CBB89F] space-y-2.5">
              <span className="text-[10px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
                03 · COMPLIMENTARY 3–5 DAY US SHIPPING
              </span>
              <h3 className="text-xl font-editorial font-semibold text-[#261A13]">
                Gift-Ready Protective Packaging
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
                Ships free from our domestic US studios via tracked USPS, UPS, or FedEx with reinforced corner guards and zero price tags inside—plus an instant printable Gift Presentation Certificate immediately after checkout.
              </p>
            </div>
          </section>

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
        </>
      )}

      {/* Sticky Mobile Commission & Live Proof Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#CBB89F] px-3.5 py-2.5 shadow-[0_-8px_24px_rgba(38,26,19,0.12)] flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold truncate">
            <span>★★★★★ 4.9</span>
            <span>·</span>
            <span className="truncate">{product.shortTitle}</span>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-[#261A13]">
              ${appliedPromoCode ? Math.round(totalUsd * 0.85) : totalUsd}
            </span>
            {!appliedPromoCode && (
              <span className="text-[10px] font-mono-tech text-[#1B3027] font-semibold">
                (${Math.round(totalUsd * 0.85)} w/ WELCOME15)
              </span>
            )}
            <span className="text-[10px] font-mono-tech text-[#5C4D42]">
              · Free US Ship
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenFullscreenProof}
            className="px-2.5 py-2.5 border border-[#CBB89F] bg-[#F8F3EA] text-[#261A13] text-[10px] font-mono-tech uppercase tracking-wider font-semibold"
          >
            🔍 Proof
          </button>
          <button
            type="button"
            disabled={isCheckingOut}
            onClick={handleCheckout}
            className="px-3.5 py-2.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold shadow-sm"
          >
            {isCheckingOut ? 'Preparing...' : 'Checkout →'}
          </button>
        </div>
      </div>
    </div>
  )
}
