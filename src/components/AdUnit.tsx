'use client'

import Link from 'next/link'

interface AdUnitProps {
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle'
  fallbackVariant?: 'bundle' | 'candle' | 'acrylic'
  className?: string
}

export default function AdUnit({
  fallbackVariant = 'bundle',
  className = '',
}: AdUnitProps) {
  const promoContent =
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
      aria-label="Evermark Collector Privilege"
      className={`w-full overflow-hidden border border-[#CBB89F] bg-[#F8F3EA] p-5 ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-[0.16em] text-[#9E472A] mb-2 font-semibold">
        <span>Collector Privilege · Studio Bundle Pairing</span>
        <span>Evermark Archival Press</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-[#FDFBF7] border border-[#D8C9B6]">
        <div className="space-y-1">
          <p className="text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#1B3027] font-semibold">
            {promoContent.kicker}
          </p>
          <p className="text-sm sm:text-base font-editorial font-semibold text-[#261A13]">
            {promoContent.headline}
          </p>
        </div>
        <Link
          href={promoContent.ctaHref}
          className="px-4 py-2.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] shrink-0 transition text-center"
        >
          {promoContent.ctaLabel}
        </Link>
      </div>
    </aside>
  )
}
