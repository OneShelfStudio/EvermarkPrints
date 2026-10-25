import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import StudioConciergeBot from '@/components/StudioConciergeBot'
import OrderBagDrawer from '@/components/OrderBagDrawer'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.evermarkprints.com'),
  title: {
    default:
      'Evermark Prints | Custom Night Sky Star Maps, Woven Blankets, Stone Slates & Framed Keepsakes',
    template: '%s | Evermark Prints',
  },
  description:
    'Commission bespoke custom night sky star maps, jacquard woven throw blankets, chiseled stone slate plaques, crystal acrylic blocks, voice waveform art, pet portraits, and scented soy candles. Handcrafted in US studios with free 3 to 5 day delivery.',
  keywords: [
    'custom star map framed',
    'custom night sky print',
    'custom soundwave art',
    'personalized woven throw blanket',
    'custom stone slate photo plaque',
    'first home portrait gift',
    'custom pet memorial wood plaque',
    'newborn birth stat framed print',
    'first dance lyrics vinyl print',
    'custom anniversary triptych',
    'personalized soy candle gift',
    'Evermark Prints',
  ],
  authors: [{ name: 'Evermark Prints (Digital Dads LLC)', url: 'https://www.evermarkprints.com' }],
  creator: 'Evermark Prints',
  publisher: 'Digital Dads LLC',
  alternates: {
    canonical: 'https://www.evermarkprints.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Evermark Prints | Bespoke Archival Custom Prints & Heirloom Keepsakes',
    description:
      'Commission custom night sky maps, jacquard woven blankets, chiseled stone slates, crystal acrylic blocks, voice waveforms, and pet portraits with live studio preview and free US shipping.',
    url: 'https://www.evermarkprints.com',
    siteName: 'Evermark Prints',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/mockups/custom-star-map-1.webp',
        width: 1200,
        height: 1200,
        alt: 'Evermark Prints Custom Night Sky Star Map Framed in Solid American Hardwood',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evermark Prints | Custom Star Maps, Woven Blankets & Heirloom Gifts',
    description:
      'Design custom star maps, voice waveforms, woven blankets, stone slates, and pet portraits with live interactive preview and free 3 to 5 day US delivery.',
    images: ['/mockups/custom-star-map-1.webp'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': 'https://www.evermarkprints.com/#organization',
      name: 'Evermark Prints',
      legalName: 'Digital Dads LLC',
      url: 'https://www.evermarkprints.com',
      logo: 'https://www.evermarkprints.com/mockups/custom-star-map-1.webp',
      image: 'https://www.evermarkprints.com/mockups/custom-star-map-1.webp',
      description:
        'Bespoke American archival studio crafting custom night sky star maps, jacquard woven throw blankets, chiseled stone slate plaques, crystal acrylic blocks, voice waveforms, and pet portraits.',
      email: 'concierge@evermarkprints.com',
      priceRange: '$$',
      sameAs: ['https://www.pinterest.com/evermarkprints/'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1321 Upland Dr. PMB 4136',
        addressLocality: 'Houston',
        addressRegion: 'TX',
        postalCode: '77043',
        addressCountry: 'US',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.evermarkprints.com/#website',
      url: 'https://www.evermarkprints.com',
      name: 'Evermark Prints',
      publisher: {
        '@id': 'https://www.evermarkprints.com/#organization',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="_kgVkVkPHeRyon91CNtaiCyIvI1KTdfgLhBWR5nABXE"
        />
        <meta
          name="google-site-verification"
          content="jd6LCvddjCEMnPibZKgsfe7ulY69PFU3jowaM9TWVsI"
        />
        <meta name="p:domain_verify" content="4c6b15a2e1eec9b033ad26afccafe72a" />
        <meta name="google-adsense-account" content="ca-pub-7651037308656903" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7651037308656903"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="text-[#261A13] font-sans-clean min-h-screen flex flex-col selection:bg-[#1B3027] selection:text-[#F7F4ED]">
        {/* Warm Heritage Forest & Burnished Brass Announcement Ribbon */}
        <div className="bg-[#1B3027] text-[#F7F4ED] text-[11px] tracking-[0.15em] uppercase py-2.5 px-4 text-center font-medium border-b border-[#D8AE64]/30">
          Complimentary Tracked US Delivery (3 to 5 Days) on All Custom Keepsakes &nbsp;·&nbsp;{' '}
          <span className="text-[#E5C178] font-semibold">
            Use Code WELCOME15 for 15% Off or Save 25% When Adding a Second Family Copy
          </span>
        </div>

        {/* Fine Print House Header */}
        <header className="sticky top-0 z-40 bg-[#F6EFE4]/95 backdrop-blur-md border-b border-[#D8C9B6]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex flex-col group">
              <span className="text-2xl sm:text-3xl font-editorial font-semibold tracking-tight text-[#261A13] group-hover:text-[#1B3027] transition">
                EVERMARK PRINTS
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#9E472A] font-mono-tech font-semibold">
                Bespoke Archival Press · United States
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-6 text-xs uppercase tracking-[0.13em] font-medium text-[#4A3B31]">
              <Link
                href="/create/custom-star-map"
                className="hover:text-[#9E472A] transition py-1"
              >
                Night Sky Map
              </Link>
              <Link
                href="/create/custom-vinyl-song-portrait"
                className="hover:text-[#9E472A] transition py-1"
              >
                Photo &amp; Vinyl Song
              </Link>
              <Link
                href="/create/custom-soundwave-art"
                className="hover:text-[#9E472A] transition py-1"
              >
                Voice Waveform
              </Link>
              <Link
                href="/create/custom-pet-memorial"
                className="hover:text-[#9E472A] transition py-1"
              >
                Pet Portrait
              </Link>
              <Link
                href="/create/newborn-birth-stat-portrait"
                className="hover:text-[#9E472A] transition py-1"
              >
                Newborn Keepsake
              </Link>
              <Link
                href="/track"
                className="text-[#1B3027] font-semibold hover:text-[#9E472A] transition py-1 border-b border-[#1B3027]/40"
              >
                Track Order
              </Link>
            </nav>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/track"
                className="xl:hidden px-3 py-2 border border-[#CBB89F] bg-[#FDFBF7] text-[#261A13] text-[10px] font-mono-tech uppercase tracking-wider font-semibold"
              >
                Track Order
              </Link>
              <OrderBagDrawer />
              <Link
                href="/#live-studio"
                className="hidden sm:inline-block px-4 sm:px-5 py-2.5 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] text-[11px] uppercase tracking-[0.15em] font-semibold transition shadow-sm"
              >
                Design Your Print
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        {/* Warm Heritage Footer */}
        <footer className="border-t border-[#CBB89F] bg-[#1B3027] text-[#E6DDD0] py-16 mt-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-12 gap-10 text-xs">
            <div className="lg:col-span-4 space-y-4">
              <p className="text-2xl font-editorial font-semibold tracking-tight text-[#F7F4ED]">
                EVERMARK PRINTS
              </p>
              <p className="leading-relaxed text-[#D0C5B4] text-sm">
                Custom astronomical star charts, photo &amp; vinyl song records, voice waveform monographs, pet portraits, and family keepsakes. Printed on 310gsm cotton rag and framed in solid American hardwood.
              </p>
              <div className="pt-2 space-y-1.5 font-mono-tech text-[11px]">
                <p className="text-[#E5C178]">
                  LIVE ORDER TRACKER &amp; 2-HOUR TYPO EDITOR:{' '}
                  <Link href="/track" className="underline text-white">
                    evermarkprints.com/track
                  </Link>
                </p>
                <p className="text-[#D0C5B4]">
                  STUDIO CONCIERGE:{' '}
                  <a
                    href="mailto:concierge@evermarkprints.com"
                    className="text-white underline underline-offset-4"
                  >
                    concierge@evermarkprints.com
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#E5C178] font-semibold">
                  Signature Keepsakes
                </p>
                <ul className="space-y-2 text-[#D8CFC0]">
                  <li>
                    <Link href="/create/custom-star-map" className="hover:text-white transition">
                      The Exact Night Sky Star Map
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/custom-vinyl-song-portrait" className="hover:text-white transition">
                      Photo &amp; First Dance Vinyl Print
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/custom-soundwave-art" className="hover:text-white transition">
                      Voice &amp; Song Waveform Print
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/custom-pet-memorial" className="hover:text-white transition">
                      Custom Pet Portrait Monograph
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/newborn-birth-stat-portrait" className="hover:text-white transition">
                      Newborn Birth Stat &amp; Portrait
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/met-engaged-married-triptych" className="hover:text-white transition">
                      Met · Engaged · Married Triptych
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#E5C178] font-semibold">
                  Home, Family &amp; Study
                </p>
                <ul className="space-y-2 text-[#D8CFC0]">
                  <li>
                    <Link href="/create/family-tree-botanical-print" className="hover:text-white transition">
                      Woven Botanical Throw Blanket
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/custom-coordinates-print" className="hover:text-white transition">
                      First Home Watercolor Stone Slate
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/coastal-bathymetry-chart" className="hover:text-white transition">
                      Harbor Map Chiseled Stone Slate
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/patent-architectural-triptych" className="hover:text-white transition">
                      Mountain Wood-Topped Wall Tapestry
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/marathon-finisher-route-print" className="hover:text-white transition">
                      Starlight Constellation Acrylic Block
                    </Link>
                  </li>
                  <li>
                    <Link href="/create/custom-book-stack-print" className="hover:text-white transition">
                      Bespoke Scented Soy Candle
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4 lg:text-right">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#E5C178] font-semibold">
                Guarantee &amp; Governance
              </p>
              <p className="text-[#D0C5B4] leading-relaxed">
                310gsm acid-free cotton rag, 8-ply museum mat framing, and archival pigment inks rated for 100+ years of permanence. Shipped complimentary across all 50 US states.
              </p>
              <div className="flex flex-wrap lg:justify-end gap-4 pt-2 text-[11px] font-mono-tech uppercase tracking-[0.12em] text-[#E5C178]">
                <Link href="/track" className="hover:underline underline-offset-4">
                  Track Order
                </Link>
                <Link href="/refunds" className="hover:underline underline-offset-4">
                  Refund Policy
                </Link>
                <Link href="/privacy" className="hover:underline underline-offset-4">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:underline underline-offset-4">
                  Terms
                </Link>
                <a
                  href="https://www.pinterest.com/evermarkprints/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  Pinterest @evermarkprints
                </a>
              </div>
              <div className="pt-4 border-t border-white/15 space-y-2.5">
                <a
                  href="https://digital-dads-llc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#264437] hover:bg-[#315747] border border-[#E5C178]/40 text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] transition shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5C178]"></span>
                  <span>Built by Digital Dads LLC ↗</span>
                </a>
                <p className="text-[11px] text-[#A99E8E]">
                  © {new Date().getFullYear()} Evermark Prints ·{' '}
                  <a
                    href="https://digital-dads-llc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#E5C178] underline underline-offset-4 transition"
                  >
                    Digital Dads LLC
                  </a>{' '}
                  · 1321 Upland Dr. PMB 4136, Houston, TX 77043
                </p>
              </div>
            </div>
          </div>
        </footer>

        <StudioConciergeBot />
        <Analytics />
      </body>
    </html>
  )
}
