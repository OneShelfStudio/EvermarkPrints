'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle'
  fallbackVariant?: 'bundle' | 'candle' | 'acrylic'
  className?: string
}

export default function AdUnit({
  slot,
  format = 'auto',
  fallbackVariant = 'bundle',
  className = '',
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const pushedRef = useRef(false)
  const [showHouseFallback, setShowHouseFallback] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || pushedRef.current) return

    const tryPushAd = () => {
      const el = adRef.current
      if (!el) return
      if (el.offsetWidth > 0) {
        try {
          const w = window as unknown as { adsbygoogle?: Record<string, unknown>[] }
          w.adsbygoogle = w.adsbygoogle || []
          w.adsbygoogle.push({})
          pushedRef.current = true
        } catch {
          setShowHouseFallback(true)
        }
      }
    }

    const t1 = window.setTimeout(tryPushAd, 250)
    const t2 = window.setTimeout(() => {
      const el = adRef.current
      const status = el?.getAttribute('data-ad-status')
      if (!el || status === 'unfilled' || el.offsetHeight < 16) {
        setShowHouseFallback(true)
      }
    }, 2800)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  const fallbackContent =
    fallbackVariant === 'candle'
      ? {
          kicker: 'BESPOKE STUDIO COMPANION · HAND-POURED IN USA',
          headline:
            'Pair Your Keepsake With a Custom Label 9oz Scented Amber Glass Soy Candle ($48 · Free US Shipping)',
          ctaLabel: 'Customize Soy Candle →',
          ctaHref: '/create/custom-book-stack-print',
        }
      : fallbackVariant === 'acrylic'
        ? {
            kicker: 'FREESTANDING DESKTOP HEIRLOOM · 1" THICK OPTICAL CRYSTAL',
            headline:
              'Design a Custom Voice & Song Waveform Crystal Acrylic Block With Solid Wood LED Stand',
            ctaLabel: 'Design Acrylic Block →',
            ctaHref: '/create/custom-soundwave-art',
          }
        : {
            kicker: 'TWO-KEEPSAKE FAMILY BUNDLE · SAVE 25% + COMPLIMENTARY US DELIVERY',
            headline:
              'Add a 2nd Identical Copy for Family or Grandparents at 25% Off With Free Combined Shipping',
            ctaLabel: 'Explore Collector Pair →',
            ctaHref: '/create/custom-star-map',
          }

  return (
    <aside
      aria-label="Sponsored Studio Spotlight"
      className={`w-full overflow-hidden border border-[#DDD5C7] bg-[#FCFBF8] p-4 ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-[0.16em] text-[#8C8275] mb-2">
        <span>Sponsored · Collector Pairing</span>
        <span>Evermark Archival Press</span>
      </div>

      {!showHouseFallback && (
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client="ca-pub-7651037308656903"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}

      {showHouseFallback && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-3 bg-[#F3EFE6] border border-[#DDD5C7]">
          <div className="space-y-1">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#6E4E2E] font-semibold">
              {fallbackContent.kicker}
            </p>
            <p className="text-sm font-editorial font-semibold text-[#171513]">
              {fallbackContent.headline}
            </p>
          </div>
          <Link
            href={fallbackContent.ctaHref}
            className="px-4 py-2 bg-[#171513] hover:bg-[#2E2925] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] shrink-0 transition"
          >
            {fallbackContent.ctaLabel}
          </Link>
        </div>
      )}
    </aside>
  )
}
