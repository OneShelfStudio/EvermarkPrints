import Link from 'next/link'
import { EVERMARK_CATALOG } from '@/lib/catalog'
import LivePrintCustomizer from '@/components/LivePrintCustomizer'
import AdUnit from '@/components/AdUnit'

export default function EvermarkHomePage() {
  const flagshipStarMap = EVERMARK_CATALOG[0]

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-14 space-y-16">
      {/* Hero Header */}
      <section className="space-y-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <span>★★★★★ Rated 4.9/5 by US Families &amp; Gift Buyers</span>
          <span>•</span>
          <span>Ships Ready-to-Hang from US Studios in 3–5 Days</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#f7f4ef] leading-[1.12]">
          Turn the Moment Everything Changed Into{' '}
          <span className="italic font-normal text-amber-300">Museum-Framed Art.</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Type your date, city, song, or dedication into our live studio customizer below and watch your print update in real time. Crafted on heavyweight archival canvas in the USA.
        </p>
      </section>

      {/* Interactive Live Customizer Right on the Homepage */}
      <section id="live-studio">
        <LivePrintCustomizer product={flagshipStarMap} compactHeroMode />
      </section>

      {/* All 6 Custom Archival Editions */}
      <section className="space-y-8 border-t border-white/10 pt-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Choose Your Custom Edition
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7f4ef]">
              Six Bespoke Archival Keepsakes
            </h2>
            <p className="text-sm text-slate-300">
              Every edition includes our live real-time preview builder, four timeless archival colorways, and free 3–5 day US shipping on all framed canvases.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVERMARK_CATALOG.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl bg-[#0d121f]/90 border border-white/15 hover:border-amber-400/50 p-6 flex flex-col justify-between space-y-6 transition shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="font-bold text-amber-300">{item.badge}</span>
                  <span className="text-slate-400">★★★★★ 4.9</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#f7f4ef] group-hover:text-amber-300 transition">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {item.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-lg font-bold text-[#f7f4ef] block">
                    ${item.popularPriceUsd} Framed
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    or ${item.startingPriceUsd} Instant 300 DPI Digital
                  </span>
                </div>

                <Link
                  href={`/create/${item.slug}`}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-md shrink-0"
                >
                  Personalize Live →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot="4800798822" />

      {/* Why Evermark Prints */}
      <section className="rounded-2xl bg-[#0d121f]/80 border border-white/15 p-7 sm:p-10 grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            01 · True Mathematical Precision
          </span>
          <h3 className="text-xl font-serif font-bold text-[#f7f4ef]">
            Zero Generic Templates
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every star chart, acoustic soundwave, and coordinate map is plotted dynamically from your exact date, location, and inscription at 300 DPI archival resolution.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            02 · Crafted &amp; Framed in the USA
          </span>
          <h3 className="text-xl font-serif font-bold text-[#f7f4ef]">
            3–5 Day Free US Delivery
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Produced on museum-grade cotton-blend canvas with solid wood float frames in our US partner studios and shipped straight to your door via USPS/UPS.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            03 · Instant Digital Option
          </span>
          <h3 className="text-xl font-serif font-bold text-[#f7f4ef]">
            Need a Last-Minute Gift Today?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Choose the Instant 300 DPI Digital Print Master (or add it to any physical frame order) to download your print-ready artwork immediately after checkout.
          </p>
        </div>
      </section>
    </div>
  )
}
