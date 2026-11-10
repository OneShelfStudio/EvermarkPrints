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
  const canonicalUrl = `${baseUrl}/create/${product.slug}`
  return {
    title: `${product.title} (${product.physicalMedium})`,
    description: product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | Evermark Prints`,
      description: product.description,
      url: canonicalUrl,
      siteName: 'Evermark Prints',
      locale: 'en_US',
      type: 'website',
      images: product.mockupGallery.map((img) => ({
        url: `${baseUrl}${img}?v=2`,
        width: 1200,
        height: 1200,
        alt: `${product.title} (${product.physicalMedium})`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Evermark Prints`,
      description: product.description,
      images: [`${baseUrl}${product.previewImage}?v=2`],
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
    image: product.mockupGallery.map((img) => `${baseUrl}${img}?v=2`),
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
      validFrom: '2026-01-01',
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Evermark Prints',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.categoryLabel,
        item: `${baseUrl}/#collection`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${baseUrl}/create/${product.slug}`,
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-3.5 sm:py-8 md:py-12 space-y-5 sm:space-y-10 max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 border-b border-[#DDD5C7] pb-2.5 sm:pb-4 text-[10px] sm:text-xs text-[#5C554D] font-mono-tech">
        <Link
          href="/"
          className="text-[#171513] hover:text-[#6E4E2E] uppercase tracking-[0.1em] sm:tracking-[0.14em] font-semibold"
        >
          ← Archival Collection Index
        </Link>
        <span className="uppercase tracking-[0.1em] text-[#7A331E]">
          {product.plateNumber} · FREE 3-5 DAY US DELIVERY
        </span>
      </div>

      <LivePrintCustomizer key={product.slug} product={product} />
    </div>
  )
}
