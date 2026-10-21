import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { EVERMARK_CATALOG, getEvermarkProductBySlug } from '@/lib/catalog'
import LivePrintCustomizer from '@/components/LivePrintCustomizer'

export function generateStaticParams() {
  return EVERMARK_CATALOG.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const product = getEvermarkProductBySlug(params.slug)
  if (!product) {
    return { title: 'Edition Not Found | Evermark Prints' }
  }
  return {
    title: `${product.title} | Evermark Prints`,
    description: product.description,
  }
}

export default function CreateCustomPrintPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = getEvermarkProductBySlug(params.slug)
  if (!product) {
    notFound()
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Evermark Prints',
    },
    offers: {
      '@type': 'Offer',
      url: `https://evermarkprints.com/create/${product.slug}`,
      priceCurrency: 'USD',
      price: product.popularPriceUsd,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD5C7] pb-4 text-xs text-[#5C554D] font-mono-tech">
        <Link
          href="/"
          className="text-[#171513] hover:text-[#6E4E2E] uppercase tracking-[0.14em] font-semibold"
        >
          ← Return to Archival Plate Index
        </Link>
        <span className="uppercase tracking-[0.12em]">
          {product.plateNumber} · COMPLIMENTARY US FRAMED DELIVERY (3–5 DAYS)
        </span>
      </div>

      <LivePrintCustomizer product={product} />
    </div>
  )
}
