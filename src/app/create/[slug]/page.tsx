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
  const baseUrl = 'https://www.evermarkprints.com'
  return {
    title: `${product.title} (${product.physicalMedium}) | Evermark Prints`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Evermark Prints`,
      description: product.description,
      url: `${baseUrl}/create/${product.slug}`,
      images: product.mockupGallery.map((img) => ({
        url: `${baseUrl}${img}`,
      })),
    },
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

  const baseUrl = 'https://www.evermarkprints.com'

  // Full Google Merchant Listing Structured Data (Schema.org Product + Offers + ShippingDetails + ReturnPolicy + Reviews)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    category: product.productType,
    image: product.mockupGallery.map((img) => `${baseUrl}${img}`),
    brand: {
      '@type': 'Brand',
      name: 'Evermark Prints',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '142',
      bestRating: '5',
      worstRating: '1',
    },
    review: product.reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: r.author,
      },
      name: r.title,
      reviewBody: r.body,
    })),
    offers: product.variants.map((v, idx) => ({
      '@type': 'Offer',
      sku: idx === 0 ? product.sku : `${product.sku}-${v.id.toUpperCase()}`,
      name: `${product.shortTitle} · ${v.label}`,
      url: `${baseUrl}/create/${product.slug}`,
      priceCurrency: 'USD',
      price: v.priceUsd.toFixed(2),
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    })),
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
          ← Return to Archival Collection Index
        </Link>
        <span className="uppercase tracking-[0.12em]">
          {product.plateNumber} · COMPLIMENTARY US STUDIO DELIVERY (3 TO 5 DAYS)
        </span>
      </div>

      <LivePrintCustomizer product={product} />
    </div>
  )
}
