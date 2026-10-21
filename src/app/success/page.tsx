'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { COMPANION_ADD_ONS, EVERMARK_CATALOG } from '@/lib/catalog'
import { saveStoredBag } from '@/components/OrderBagDrawer'

interface SavedCustomPrint {
  productSlug: string
  productTitle: string
  mode?: string
  plateNumber?: string
  headline: string
  subline: string
  locationText: string
  dateText: string
  coordsText: string
  colorwayId: string
  frameFinishId?: string
  formatLabel: string
  giftNote?: string
  customPeaks?: string
  previewDataUrl?: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') || ''

  const [savedDesign, setSavedDesign] = useState<SavedCustomPrint | null>(null)
  const [loadingSession, setLoadingSession] = useState<boolean>(false)
  const [addingItemSlug, setAddingItemSlug] = useState<string | null>(null)

  // 1. Clear Order Bag upon successful checkout, check localStorage, then sync from Stripe Session API
  useEffect(() => {
    saveStoredBag([])
    let foundLocal = false
    try {
      const raw = window.localStorage.getItem('evermark_last_custom_print')
      if (raw) {
        const parsed = JSON.parse(raw)
        setSavedDesign(parsed)
        foundLocal = true
      }
    } catch {
      // Ignore storage errors
    }

    if (sessionId && sessionId.startsWith('cs_')) {
      setLoadingSession(!foundLocal)
      fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.design) {
            setSavedDesign((prev) => ({
              ...data.design,
              previewDataUrl: prev?.previewDataUrl || undefined,
            }))
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSession(false))
    }
  }, [sessionId])

  const highResSvgUrl = savedDesign
    ? `/api/render-master?slug=${encodeURIComponent(
        savedDesign.productSlug || 'custom-star-map'
      )}&colorway=${encodeURIComponent(
        savedDesign.colorwayId || 'midnight_gold'
      )}&headline=${encodeURIComponent(
        savedDesign.headline || ''
      )}&subline=${encodeURIComponent(
        savedDesign.subline || ''
      )}&location=${encodeURIComponent(
        savedDesign.locationText || ''
      )}&date=${encodeURIComponent(
        savedDesign.dateText || ''
      )}&coords=${encodeURIComponent(savedDesign.coordsText || '')}`
    : ''

  async function handleAddOntoExistingOrder(opts: {
    slug: string
    title: string
    priceUsd: number
    printifyProductId: string
    printifyBlueprintId: number
    printifyVariantId: number
  }) {
    setAddingItemSlug(opts.slug)
    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://www.evermarkprints.com'
      const design = savedDesign || {
        productSlug: opts.slug,
        productTitle: opts.title,
        headline: 'OUR STORY',
        subline: 'Crafted in our US studio',
        locationText: 'United States',
        dateText: new Date().getFullYear().toString(),
        coordsText: '',
        colorwayId: 'midnight_gold',
        frameFinishId: 'walnut',
        formatLabel: opts.title,
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `evermark_addon_${opts.slug}`,
          returnUrl: `${origin}/success?product=${encodeURIComponent(opts.slug)}&addon=1`,
          collectUsShipping: true,
          lineItems: [
            {
              name: `${opts.title} (Added Onto Existing Order — Free Combined Shipping)`,
              description: `Matching Inscription: "${design.headline}" (${design.locationText} · ${design.dateText})`,
              amountCents: opts.priceUsd * 100,
              quantity: 1,
            },
          ],
          metadata: {
            brand: 'Evermark Prints',
            parentOrderSessionId: sessionId.slice(0, 64),
            isExistingOrderAddOn: 'yes',
            productSlug: opts.slug,
            printifyProductId: opts.printifyProductId,
            printifyBlueprintId: String(opts.printifyBlueprintId),
            printifyVariantId: String(opts.printifyVariantId),
            colorwayId: design.colorwayId || 'midnight_gold',
            frameFinishId: design.frameFinishId || 'walnut',
            headline: (design.headline || '').slice(0, 120),
            subline: (design.subline || '').slice(0, 180),
            locationText: (design.locationText || '').slice(0, 120),
            dateText: (design.dateText || '').slice(0, 120),
            coordsText: (design.coordsText || '').slice(0, 120),
          },
        }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setAddingItemSlug(null)
      }
    } catch {
      setAddingItemSlug(null)
    }
  }

  const matchedCatalogProduct =
    EVERMARK_CATALOG.find((p) => p.slug === savedDesign?.productSlug) || EVERMARK_CATALOG[0]
  const duplicateDiscountPrice = Math.round(matchedCatalogProduct.popularPriceUsd * 0.75)

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-8 sm:p-12 shadow-sm space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B3027] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.16em]">
          <span>COMMISSION CONFIRMED · US STUDIO PRODUCTION QUEUED</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-editorial font-semibold text-[#261A13]">
            Thank You for Your Commission.
          </h1>
          <p className="text-sm sm:text-base text-[#4A3B31] leading-relaxed">
            Your custom keepsake order has been verified via Stripe and queued for production in our US studio. We will email your live USPS/UPS tracking link as soon as your package is dispatched (3–5 business days).
          </p>
        </div>

        {sessionId && (
          <p className="text-xs text-[#7A6F63] font-mono-tech">
            ORDER REFERENCE: {sessionId.slice(0, 28)}... ·{' '}
            <Link href="/track" className="underline text-[#1B3027] font-semibold">
              Track Order or Edit Typo (2-Hour Window) →
            </Link>
          </p>
        )}

        {loadingSession && (
          <div className="p-6 bg-[#F3EFE6] border border-[#DDD5C7] text-xs font-mono-tech text-[#5C554D]">
            Retrieving your verified inscription dossier from Stripe...
          </div>
        )}

        {savedDesign && (
          <div className="p-6 bg-[#F3EFE6] border border-[#DDD5C7] grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={savedDesign.previewDataUrl || highResSvgUrl || matchedCatalogProduct.previewImage}
                alt={savedDesign.headline}
                className="w-44 h-auto border-4 border-[#3B261A] shadow-md bg-[#FCFBF8]"
              />
            </div>

            <div className="sm:col-span-8 space-y-2 text-xs text-[#4A443C]">
              <span className="text-[#9E472A] font-mono-tech uppercase tracking-[0.16em] font-semibold block">
                Recorded Physical Commission Dossier
              </span>
              <p className="text-xl font-editorial font-semibold text-[#171513]">
                {savedDesign.productTitle}
              </p>
              <p>
                <strong className="text-[#171513]">Physical Edition:</strong>{' '}
                {savedDesign.formatLabel}
              </p>
              <p>
                <strong className="text-[#171513]">Primary Title:</strong>{' '}
                {savedDesign.headline}
              </p>
              <p>
                <strong className="text-[#171513]">Dedication:</strong>{' '}
                {savedDesign.subline}
              </p>
              <p>
                <strong className="text-[#171513]">Place &amp; Date:</strong>{' '}
                {savedDesign.locationText} · {savedDesign.dateText}
              </p>
              <p>
                <strong className="text-[#171513]">Bottom Line / Coordinates:</strong>{' '}
                <span className="font-mono-tech">{savedDesign.coordsText}</span>
              </p>

              {savedDesign.giftNote && (
                <p className="p-2.5 bg-[#FCFBF8] border border-[#DDD5C7] italic text-[#171513]">
                  <strong>Gift Note:</strong> “{savedDesign.giftNote}”
                </p>
              )}
            </div>
          </div>
        )}

        {/* ADD ON TO EXISTING ORDER WORKFLOW (25% Off + Free Combined US Shipping) */}
        <div className="p-6 sm:p-8 bg-[#F6EFE4] border-2 border-[#9E472A] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#9E472A] font-semibold block">
                ACTIVE 2-HOUR STUDIO WINDOW · FREE COMBINED US SHIPPING
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#261A13]">
                Add Additional Keepsakes Onto Your Existing Order
              </h2>
            </div>
            <span className="px-3 py-1 bg-[#1B3027] text-[#E5C178] text-[11px] font-mono-tech uppercase tracking-wider">
              25% Collector Privilege Active
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
            Because your commission is currently in our 2-hour studio queue, you can add a matching second copy for family or bundle a companion physical keepsake with your exact same custom inscription—with <strong>free combined US delivery</strong>.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* 1. Second Identical Copy at 25% Off */}
            <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={matchedCatalogProduct.previewImage}
                  alt={matchedCatalogProduct.shortTitle}
                  className="w-full h-32 object-cover border border-[#E5D9C5]"
                />
                <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
                  25% OFF DUPLICATE GIFT COPY
                </span>
                <h3 className="text-base font-editorial font-semibold text-[#261A13]">
                  2nd Copy: {matchedCatalogProduct.shortTitle}
                </h3>
                <p className="text-[11px] text-[#5C4D42]">
                  Ideal for parents, grandparents, or your office desk with identical custom wording.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E5D9C5] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-[#1B3027]">
                    +${duplicateDiscountPrice}
                  </span>
                  <span className="text-xs text-[#8C7A6B] line-through">
                    ${matchedCatalogProduct.popularPriceUsd}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={addingItemSlug === matchedCatalogProduct.slug}
                  onClick={() =>
                    handleAddOntoExistingOrder({
                      slug: matchedCatalogProduct.slug,
                      title: `2nd Identical Copy — ${matchedCatalogProduct.shortTitle}`,
                      priceUsd: duplicateDiscountPrice,
                      printifyProductId: matchedCatalogProduct.printifyProductId,
                      printifyBlueprintId: matchedCatalogProduct.printifyBlueprintId,
                      printifyVariantId: matchedCatalogProduct.variants[0].printifyVariantId,
                    })
                  }
                  className="w-full py-2.5 px-3 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition"
                >
                  {addingItemSlug === matchedCatalogProduct.slug
                    ? 'Adding to Order...'
                    : '+ Add Onto Order →'}
                </button>
              </div>
            </div>

            {/* 2 & 3. Companion Physical Add-Ons (Amber Candle & Acrylic Stand) */}
            {COMPANION_ADD_ONS.map((addOn) => (
              <div
                key={addOn.id}
                className="bg-[#FDFBF7] border border-[#D8C9B6] p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={addOn.previewImage}
                    alt={addOn.title}
                    className="w-full h-32 object-cover border border-[#E5D9C5]"
                  />
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
                    MATCHING INSCRIPTION COMPANION
                  </span>
                  <h3 className="text-base font-editorial font-semibold text-[#261A13]">
                    {addOn.title.replace('+ Add ', '')}
                  </h3>
                  <p className="text-[11px] text-[#5C4D42]">{addOn.description}</p>
                </div>
                <div className="pt-2 border-t border-[#E5D9C5] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-[#1B3027]">
                      +${addOn.priceUsd}
                    </span>
                    <span className="text-xs text-[#8C7A6B] line-through">
                      ${addOn.compareAtUsd}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={addingItemSlug === addOn.targetProductSlug}
                    onClick={() =>
                      handleAddOntoExistingOrder({
                        slug: addOn.targetProductSlug,
                        title: addOn.title.replace('+ Add ', ''),
                        priceUsd: addOn.priceUsd,
                        printifyProductId: addOn.printifyProductId,
                        printifyBlueprintId: addOn.printifyBlueprintId,
                        printifyVariantId: addOn.printifyVariantId,
                      })
                    }
                    className="w-full py-2.5 px-3 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition"
                  >
                    {addingItemSlug === addOn.targetProductSlug
                      ? 'Adding to Order...'
                      : '+ Add Onto Order →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-[#DDD5C7] flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-[#5C554D]">
            Concierge support or 2-hour inscription adjustments:{' '}
            <a
              href="mailto:ryanb@digital-dads-llc.com"
              className="text-[#171513] underline underline-offset-4 font-semibold"
            >
              ryanb@digital-dads-llc.com
            </a>
          </span>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/track"
              className="px-4 py-2.5 bg-[#FDFBF7] hover:bg-[#EFEAE0] border border-[#D5CCBC] text-[#171513] font-mono-tech uppercase tracking-[0.14em] text-[11px] transition"
            >
              Track Order Status
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] font-mono-tech uppercase tracking-[0.14em] text-[11px] transition"
            >
              ← Customize Another Keepsake
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-[#5C554D]">
          Retrieving your archival commission dossier...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
