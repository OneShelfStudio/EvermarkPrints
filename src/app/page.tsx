import Link from 'next/link'
import { EVERMARK_CATALOG } from '@/lib/catalog'
import LivePrintCustomizer from '@/components/LivePrintCustomizer'
import AdUnit from '@/components/AdUnit'

export default function EvermarkHomePage() {
  const flagshipStarMap = EVERMARK_CATALOG[0]

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-14 space-y-20">
      {/* Warm Heritage Editorial Hero Banner */}
      <section className="rounded-none bg-gradient-to-br from-[#1B3027] via-[#223B30] to-[#261A13] text-[#F7F4ED] border border-[#D8AE64]/40 p-7 sm:p-12 shadow-xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3 py-1 bg-[#9E472A] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-[0.18em]">
              <span>HANDCRAFTED IN US STUDIOS</span>
              <span>·</span>
              <span>FRAMED ART · ACRYLIC STANDS · WOVEN BLANKETS · CHISELED SLATE · SOY CANDLES</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-editorial font-normal tracking-tight text-[#F7F4ED] leading-[1.06]">
              Painterly Keepsakes &amp;{' '}
              <span className="italic text-[#E5C178]">
                Bespoke Heirloom Decor.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#E2D9C8] max-w-2xl leading-relaxed">
              Explore 12 distinct physical gifts and hand-illustrated artwork editions below—from 100% cotton jacquard-woven fringed blankets, raw chiseled natural stone slate plaques, and crystal acrylic desk stands to 3-panel split gallery triptychs, wood-topped tapestries, and scented amber soy candles.
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#261A13]/85 border border-[#D8AE64]/35 p-6 space-y-4">
            <p className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#E5C178]">
              WHY 14,000+ US FAMILIES GIFT EVERMARK
            </p>
            <ul className="space-y-2.5 text-xs text-[#EDE4D4]">
              <li className="flex items-start gap-2">
                <span className="text-[#E5C178] font-bold">✓</span>
                <span>Painterly Milky Way, Redouté Botanical &amp; Watercolor Art</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5C178] font-bold">✓</span>
                <span>9 Authentic Printify US Formats (Blankets, Slate, Acrylic, Wood)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5C178] font-bold">✓</span>
                <span>Attach Custom Photos (.JPG/.PNG) &amp; Live Voice/Song Audio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E5C178] font-bold">✓</span>
                <span>Free 3–5 Day US Delivery · Gift-Ready With Zero Price Tags</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-mono-tech text-[#E5C178]">
              <span>★★★★★ 4.9 / 5.0 RATING</span>
              <Link href="/track" className="underline text-white">
                Track Existing Order →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Studio Customizer Right on the Homepage (With 12-Product Switcher!) */}
      <section id="live-studio" className="space-y-6">
        <LivePrintCustomizer product={flagshipStarMap} compactHeroMode />
      </section>

      {/* Curated Gallery Catalog — All 12 Real Printify 3D Studio Products */}
      <section id="collection" className="space-y-10 border-t border-[#CBB89F] pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#9E472A] font-semibold">
              THE COMPLETE ARCHIVE · 12 BESPOKE PHYSICAL EDITIONS
            </p>
            <h2 className="text-3xl sm:text-5xl font-editorial font-semibold text-[#261A13]">
              Explore Our Twelve Custom Keepsakes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D42] max-w-md">
            Each edition is crafted to order in our US Printify partner studios—featuring real 3D studio photography, custom photo &amp; voice uploads, and free 3–5 day US shipping.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVERMARK_CATALOG.map((item) => (
            <article
              key={item.slug}
              className="bg-[#FDFBF7] border border-[#CBB89F] hover:border-[#1B3027] shadow-sm hover:shadow-xl flex flex-col justify-between transition group"
            >
              <div>
                {/* Real Printify 3D Studio Product Photograph */}
                <Link
                  href={`/create/${item.slug}`}
                  className="block aspect-square w-full overflow-hidden bg-[#F5EFE6] border-b border-[#D8C9B6] relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1B3027] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-[0.14em] shadow">
                    {item.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#261A13]/90 text-[#E5C178] text-[10px] font-mono-tech uppercase tracking-wider">
                    {item.physicalMedium}
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#9E472A] font-semibold">
                    <span>{item.categoryLabel}</span>
                    <span className="text-[#1B3027]">★★★★★ 4.9</span>
                  </div>

                  <Link href={`/create/${item.slug}`}>
                    <h3 className="text-2xl font-editorial font-semibold text-[#261A13] group-hover:text-[#9E472A] transition">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-[11px] font-mono-tech text-[#7A6858] pt-1">
                    {item.paperSpec}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#F3E9DA] border-t border-[#D8C9B6] flex items-center justify-between gap-4">
                <div>
                  <span className="text-base font-semibold text-[#261A13] block">
                    From ${item.startingPriceUsd} Physical Edition
                  </span>
                  <span className="text-[11px] text-[#6E5A4C] block">
                    Most Popular Size: ${item.popularPriceUsd} · Free US Shipping
                  </span>
                </div>

                <Link
                  href={`/create/${item.slug}`}
                  className="px-4 py-2.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] font-medium transition shrink-0"
                >
                  Customize →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AdUnit slot="4800798822" />

      {/* Warm Craftsmanship & Guarantee Banner */}
      <section className="bg-[#FDFBF7] border border-[#CBB89F] p-8 sm:p-12 grid md:grid-cols-3 gap-8 shadow-sm">
        <div className="space-y-3 md:border-r md:border-[#D8C9B6] md:pr-6">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
            01 · PAINTERLY MUSEUM ARTWORK
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#261A13]">
            Hand-Illustrated Depth &amp; Warmth
          </h3>
          <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
            Every edition pairs museum-grade watercolor, Redouté botanical, and celestial nebula illustrations with your custom typography, coordinates, uploaded portraits, and voice waveforms.
          </p>
        </div>

        <div className="space-y-3 md:border-r md:border-[#D8C9B6] md:pr-6">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#1B3027] font-semibold">
            02 · DIVERSE US PHYSICAL MEDIUMS
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#261A13]">
            Woven, Chiseled, Cast &amp; Framed
          </h3>
          <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
            From 100% cotton jacquard-woven fringed blankets and raw chiseled natural stone slate plaques to crystal acrylic desk blocks, 3-panel split triptychs, and scented amber soy candles.
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
            03 · 2-HOUR PROOF &amp; LIVE TRACKING
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#261A13]">
            Stress-Free Custom Ordering
          </h3>
          <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
            Spot a typo after ordering? Visit our <Link href="/track" className="underline font-semibold text-[#1B3027]">Live Order Tracker</Link> within 2 hours of checkout to edit your wording instantly, add matching keepsakes onto your existing order, or track your USPS/UPS shipment.
          </p>
        </div>
      </section>
    </div>
  )
}
