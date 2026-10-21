import Link from 'next/link'
import { EVERMARK_CATALOG } from '@/lib/catalog'
import LivePrintCustomizer from '@/components/LivePrintCustomizer'
import AdUnit from '@/components/AdUnit'

export default function EvermarkHomePage() {
  const flagshipStarMap = EVERMARK_CATALOG[0]

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-16 space-y-20">
      {/* Editorial Exhibition Header */}
      <section className="border-b border-[#DDD5C7] pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#7A6F63]">
              <span>ARCHIVAL MONOGRAPH STUDIO</span>
              <span>·</span>
              <span>310GSM GERMAN ETCHING COTTON RAG</span>
              <span>·</span>
              <span>SOLID AMERICAN HARDWOOD</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-editorial font-normal tracking-tight text-[#171513] leading-[1.06]">
              The Exact Moment Everything Changed,{' '}
              <span className="italic font-normal text-[#6E4E2E]">
                Framed for Permanence.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:border-l lg:border-[#DDD5C7] lg:pl-8">
            <p className="text-sm text-[#4A443C] leading-relaxed">
              Every piece is plotted from your exact astronomical date, acoustic recording, or meridian coordinates—printed on heavyweight acid-free cotton rag and framed in solid walnut, oak, or gallery black ash.
            </p>
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#171513] pt-2 border-t border-[#EAE3D5]">
              <span>★★★★★ 4.9/5 (US COLLECTORS)</span>
              <span>3–5 DAY US DELIVERY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Studio Customizer Right on the Homepage */}
      <section id="live-studio" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD5C7] pb-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#171513] font-semibold">
            INTERACTIVE COMMISSION BENCH — PLATE NO. 01 (THE NIGHT SKY)
          </span>
          <span className="text-xs text-[#5C554D]">
            Type below to preview your custom inscription &amp; hardwood frame in real time
          </span>
        </div>

        <LivePrintCustomizer product={flagshipStarMap} compactHeroMode />
      </section>

      {/* Curated Gallery Catalog — All 6 Archival Plates with Framed Room Photography */}
      <section className="space-y-10 border-t border-[#DDD5C7] pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#7A6F63]">
              CURATED ARCHIVE · SIX COMMISSIONS
            </p>
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#171513]">
              Select an Archival Plate to Personalize
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C554D] max-w-md">
            Each plate includes live real-time previewing, four museum paper &amp; ink palettes, three solid hardwood frame finishes, and complimentary US shipping.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVERMARK_CATALOG.map((item) => (
            <article
              key={item.slug}
              className="bg-[#FCFBF8] border border-[#D5CCBC] hover:border-[#171513] flex flex-col justify-between transition group"
            >
              <div>
                {/* Framed Interior Gallery Room Photograph */}
                <Link
                  href={`/create/${item.slug}`}
                  className="block aspect-[5/4] w-full overflow-hidden bg-[#EFEAE0] border-b border-[#DDD5C7] relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FCFBF8]/95 border border-[#DDD5C7] text-[10px] font-mono-tech uppercase tracking-[0.14em] text-[#171513]">
                    {item.plateNumber}
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#7A6F63]">
                    <span>{item.categoryLabel}</span>
                    <span className="text-[#171513]">★ 4.9</span>
                  </div>

                  <Link href={`/create/${item.slug}`}>
                    <h3 className="text-2xl font-editorial font-semibold text-[#171513] group-hover:text-[#6E4E2E] transition">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#5C554D] leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-[11px] font-mono-tech text-[#7A6F63] pt-1">
                    {item.paperSpec}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#F3EFE6] border-t border-[#DDD5C7] flex items-center justify-between gap-4">
                <div>
                  <span className="text-base font-semibold text-[#171513] block">
                    ${item.popularPriceUsd} Framed
                  </span>
                  <span className="text-[11px] text-[#6E655B] block">
                    or ${item.startingPriceUsd} Instant 300 DPI Master
                  </span>
                </div>

                <Link
                  href={`/create/${item.slug}`}
                  className="px-4 py-2.5 bg-[#171513] hover:bg-[#2E2925] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] font-medium transition shrink-0"
                >
                  Personalize →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AdUnit slot="4800798822" />

      {/* Architectural Materials & Craftsmanship Spec */}
      <section className="bg-[#EFEAE0] border border-[#D5CCBC] p-8 sm:p-12 grid md:grid-cols-3 gap-8">
        <div className="space-y-3 md:border-r md:border-[#D5CCBC] md:pr-6">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#6E4E2E] font-semibold">
            01 · 310GSM MUSEUM COTTON RAG
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#171513]">
            True Archival Weight &amp; Texture
          </h3>
          <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed">
            We never print on thin glossy poster stock. Every edition is struck on 310gsm acid-free cotton rag with carbon-based pigment inks rated for over a century of lightfast permanence.
          </p>
        </div>

        <div className="space-y-3 md:border-r md:border-[#D5CCBC] md:pr-6">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#6E4E2E] font-semibold">
            02 · KILN-DRIED HARDWOOD FRAMES
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#171513]">
            Mitered &amp; Assembled in the USA
          </h3>
          <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed">
            Choose between American Black Walnut, Natural White Oak, or Matte Gallery Black Ash. Each frame is hand-joined in our US partner studios and arrives wired and ready to hang in 3–5 business days.
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#6E4E2E] font-semibold">
            03 · SAME-DAY DIGITAL MASTER
          </span>
          <h3 className="text-2xl font-editorial font-semibold text-[#171513]">
            Immediate 300 DPI Archival File
          </h3>
          <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed">
            Need a last-minute anniversary or closing gift today? Select the 300 DPI Archival Print Master—or include it with any framed order—to download your high-resolution file immediately after checkout.
          </p>
        </div>
      </section>
    </div>
  )
}
