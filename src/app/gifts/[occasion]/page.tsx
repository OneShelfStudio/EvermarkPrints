import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  OCCASION_GUIDES,
  getOccasionGuideBySlug,
  getProductsForOccasionGuide,
} from '@/lib/occasion-guides'
import LivePrintCustomizer from '@/components/LivePrintCustomizer'

export function generateStaticParams() {
  return OCCASION_GUIDES.map((g) => ({ occasion: g.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { occasion: string }
}): Metadata {
  const guide = getOccasionGuideBySlug(params.occasion)
  if (!guide) {
    return { title: 'Custom Keepsake Gift Guide | Evermark Prints' }
  }
  const url = `https://www.evermarkprints.com/gifts/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      type: 'website',
    },
  }
}

export default function OccasionGiftGuidePage({
  params,
}: {
  params: { occasion: string }
}) {
  const guide = getOccasionGuideBySlug(params.occasion)
  if (!guide) notFound()

  const products = getProductsForOccasionGuide(guide)
  const featuredProduct = products[0]
  const baseUrl = 'https://www.evermarkprints.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: guide.title,
        description: guide.metaDescription,
        numberOfItems: products.length,
        itemListElement: products.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${baseUrl}/create/${item.slug}`,
          name: item.title,
          image: `${baseUrl}${item.previewImage}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Occasion Gift Guide Editorial Header */}
      <section className="bg-gradient-to-br from-[#1B3027] via-[#223B30] to-[#261A13] text-[#F7F4ED] border border-[#D8AE64]/40 p-7 sm:p-11 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 bg-[#9E472A] text-[#FDFBF7] text-[11px] font-mono-tech uppercase tracking-[0.18em]">
            {guide.kicker}
          </span>
          <span className="text-xs font-mono-tech text-[#E5C178]">
            USE CODE <strong className="underline">WELCOME15</strong> FOR 15% OFF · FREE 3 TO 5 DAY US SHIPPING
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-editorial font-normal tracking-tight text-[#F7F4ED] leading-tight">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-[#E2D9C8] max-w-3xl leading-relaxed">
          {guide.intro}
        </p>

        <div className="p-4 bg-[#261A13]/85 border border-[#D8AE64]/35 text-xs text-[#EDE4D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>✦ {guide.highlightTip}</span>
          <Link
            href="#featured-customizer"
            className="px-4 py-2 bg-[#E5C178] text-[#261A13] font-mono-tech text-[11px] uppercase tracking-wider font-semibold shrink-0 text-center"
          >
            Customize Live Below ↓
          </Link>
        </div>
      </section>

      {/* Curated Products for This Occasion */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#CBB89F] pb-4">
          <div>
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
              CURATED KEEPSAKE EDITIONS ({products.length} DESIGNS)
            </p>
            <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#261A13]">
              Select a Keepsake to Personalize
            </h2>
          </div>
          <Link
            href="/"
            className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] underline"
          >
            ← View All 12 Studio Keepsakes
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <article
              key={item.slug}
              className="bg-[#FDFBF7] border border-[#CBB89F] hover:border-[#1B3027] shadow-sm hover:shadow-xl flex flex-col justify-between transition group"
            >
              <div>
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

      {/* Interactive Live Customizer for the Featured Occasion Keepsake */}
      {featuredProduct && (
        <section id="featured-customizer" className="space-y-6 border-t border-[#CBB89F] pt-14">
          <div className="space-y-1">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
              LIVE INTERACTIVE STUDIO CUSTOMIZER
            </p>
            <h2 className="text-2xl sm:text-4xl font-editorial font-semibold text-[#261A13]">
              Design Your {featuredProduct.shortTitle} Now
            </h2>
          </div>
          <LivePrintCustomizer product={featuredProduct} compactHeroMode />
        </section>
      )}

      {/* Occasion Frequently Asked Questions */}
      <section className="space-y-6 border-t border-[#CBB89F] pt-14">
        <h2 className="text-2xl sm:text-3xl font-editorial font-semibold text-[#261A13]">
          Occasion Gift Guide Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {guide.faqs.map((faq, i) => (
            <div key={i} className="bg-[#FDFBF7] border border-[#CBB89F] p-6 space-y-2">
              <h3 className="text-lg font-editorial font-semibold text-[#261A13]">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3B31] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse Other Occasion Guides */}
      <section className="bg-[#F3E9DA] border border-[#CBB89F] p-6 sm:p-8 space-y-4">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
          EXPLORE OTHER MILESTONE GIFT GUIDES
        </p>
        <div className="flex flex-wrap gap-2.5">
          {OCCASION_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/gifts/${g.slug}`}
              className={`px-4 py-2 text-xs font-mono-tech uppercase tracking-wider border transition ${
                g.slug === guide.slug
                  ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                  : 'bg-[#FDFBF7] text-[#261A13] border-[#CBB89F] hover:border-[#9E472A]'
              }`}
            >
              {g.kicker.split('·')[0].trim()} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
