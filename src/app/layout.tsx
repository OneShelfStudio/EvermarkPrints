import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
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
  title: 'Evermark Prints | Archival Custom Star Maps, Acoustic Monographs & Coordinate Art',
  description:
    'Bespoke astronomical night sky charts, voice & song waveform monographs, topographic home coordinates, and heirloom keepsake prints. Printed on 310gsm cotton rag and framed in solid American hardwood.',
  openGraph: {
    title: 'Evermark Prints | Bespoke Archival Custom Prints — USA',
    description:
      'Commission custom astronomical night sky maps, acoustic waveform monographs, and architectural coordinate prints with real-time gallery framing preview.',
    url: 'https://evermarkprints.com',
    siteName: 'Evermark Prints',
    locale: 'en_US',
    type: 'website',
  },
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
        <meta name="google-adsense-account" content="ca-pub-7651037308656903" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7651037308656903"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#F7F4ED] text-[#171513] font-sans-clean min-h-screen flex flex-col selection:bg-[#171513] selection:text-[#F7F4ED]">
        {/* Editorial Top Archival Bar */}
        <div className="bg-[#171513] text-[#F4EFE6] text-[11px] tracking-[0.16em] uppercase py-2.5 px-4 text-center font-medium border-b border-[#2C2824]">
          Complimentary Tracked US Delivery (3–5 Business Days) on All Framed Editions &nbsp;·&nbsp; Save $29 on Two-Print Collector Pairs
        </div>

        {/* Fine Print House Header */}
        <header className="sticky top-0 z-50 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#DDD5C7]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-6">
            <Link href="/" className="flex flex-col group">
              <span className="text-2xl sm:text-3xl font-editorial font-semibold tracking-tight text-[#171513]">
                EVERMARK PRINTS
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#7A6F63] font-mono-tech">
                Bespoke Archival Press · United States
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.14em] font-medium text-[#4A443C]">
              <Link
                href="/create/custom-star-map"
                className="hover:text-[#171513] transition py-1 border-b border-transparent hover:border-[#171513]"
              >
                Night Sky Chart
              </Link>
              <Link
                href="/create/custom-soundwave-art"
                className="hover:text-[#171513] transition py-1 border-b border-transparent hover:border-[#171513]"
              >
                Acoustic Monograph
              </Link>
              <Link
                href="/create/custom-coordinates-print"
                className="hover:text-[#171513] transition py-1 border-b border-transparent hover:border-[#171513]"
              >
                Meridian Coordinates
              </Link>
              <Link
                href="/create/custom-pet-memorial"
                className="hover:text-[#171513] transition py-1 border-b border-transparent hover:border-[#171513]"
              >
                Companion Tribute
              </Link>
              <Link
                href="/create/coastal-bathymetry-chart"
                className="hover:text-[#171513] transition py-1 border-b border-transparent hover:border-[#171513]"
              >
                Coastal Survey
              </Link>
            </nav>

            <Link
              href="/create/custom-star-map"
              className="px-5 py-2.5 bg-[#171513] hover:bg-[#2E2925] text-[#F7F4ED] text-[11px] uppercase tracking-[0.16em] font-semibold transition shrink-0"
            >
              Commission a Print
            </Link>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        {/* Architectural Editorial Footer */}
        <footer className="border-t border-[#DDD5C7] bg-[#EFEAE0] text-[#4A443C] py-16 mt-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-12 gap-10 text-xs">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-2xl font-editorial font-semibold tracking-tight text-[#171513]">
                EVERMARK PRINTS
              </p>
              <p className="leading-relaxed max-w-sm text-[#5C554D] text-sm">
                Custom astronomical star charts, acoustic waveform monographs, meridian home coordinates, and heirloom tributes. Printed on 310gsm cotton rag and framed in kiln-dried American hardwood.
              </p>
              <p className="text-xs text-[#5C554D] pt-1 font-mono-tech">
                CONCIERGE &amp; BESPOKE COMMISSIONS:{' '}
                <a
                  href="mailto:ryanb@digital-dads-llc.com"
                  className="text-[#171513] underline underline-offset-4 font-medium"
                >
                  ryanb@digital-dads-llc.com
                </a>
              </p>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#171513] font-semibold">
                Archival Plate Index
              </p>
              <ul className="space-y-2.5 text-[#5C554D]">
                <li>
                  <Link href="/create/custom-star-map" className="hover:text-[#171513] transition">
                    Plate 01 — The Exact Night Sky Star Map
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-soundwave-art" className="hover:text-[#171513] transition">
                    Plate 02 — Voice &amp; Song Acoustic Waveform
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-coordinates-print" className="hover:text-[#171513] transition">
                    Plate 03 — Latitude &amp; Homestead Meridian
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-pet-memorial" className="hover:text-[#171513] transition">
                    Plate 04 — Heirloom Companion Monograph
                  </Link>
                </li>
                <li>
                  <Link href="/create/patent-architectural-triptych" className="hover:text-[#171513] transition">
                    Plate 05 — Horological &amp; Engineering Blueprint
                  </Link>
                </li>
                <li>
                  <Link href="/create/coastal-bathymetry-chart" className="hover:text-[#171513] transition">
                    Plate 06 — Coastal Bathymetry &amp; Harbor Chart
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-4 lg:text-right">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#171513] font-semibold">
                Materials &amp; Provenance
              </p>
              <p className="text-[#5C554D] leading-relaxed">
                310gsm acid-free cotton rag, 8-ply museum mat framing, and archival pigment inks rated for 100+ years of lightfast permanence. Shipped complimentary across all 50 US states.
              </p>
              <div className="flex flex-wrap lg:justify-end gap-4 pt-2 text-[11px] font-mono-tech uppercase tracking-[0.12em] text-[#171513]">
                <Link href="/refunds" className="hover:underline underline-offset-4">
                  Refund &amp; Replacement Policy
                </Link>
                <Link href="/privacy" className="hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:underline underline-offset-4">
                  Terms of Service
                </Link>
              </div>
              <p className="text-[11px] text-[#7A6F63] pt-4 border-t border-[#DDD5C7]">
                © {new Date().getFullYear()} Evermark Prints. Part of{' '}
                <a
                  href="https://digital-dads-llc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#171513] underline underline-offset-4"
                >
                  Digital Dads LLC
                </a>
                .
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
