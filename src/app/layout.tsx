import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evermark Prints | Custom Night Sky Star Maps, Soundwave Art & Archival Keepsakes',
  description:
    'Design custom astronomical night sky star maps, voice & song acoustic waveform prints, hometown coordinate charts, and pet tribute keepsakes with live real-time preview. Framed & shipped in the USA in 3–5 business days.',
  openGraph: {
    title: 'Evermark Prints | Custom Night Sky Star Maps & Archival Keepsakes',
    description:
      'Enter your date, place, or voice note and watch your museum-framed keepsake print come to life in real time. Framed & shipped in the USA.',
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
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7651037308656903" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7651037308656903"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#070a12] text-[#f7f4ef] font-sans min-h-screen flex flex-col selection:bg-amber-400 selection:text-slate-950">
        {/* Top Announcement Ribbon */}
        <div className="bg-amber-400 text-slate-950 text-xs font-bold py-2 px-4 text-center">
          🇺🇸 Free Tracked US Shipping (3–5 Business Days) on All Framed Canvas Prints · Save $29 on 2-Print Gift Sets
        </div>

        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-[#070a12]/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex flex-col group">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#f7f4ef] group-hover:text-amber-300 transition">
                Evermark Prints
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300/90">
                Archival Custom Studio · USA
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-200">
              <Link href="/create/custom-star-map" className="hover:text-amber-300 transition">
                Night Sky Star Map
              </Link>
              <Link href="/create/custom-soundwave-art" className="hover:text-amber-300 transition">
                Voice &amp; Song Waveform
              </Link>
              <Link href="/create/custom-coordinates-print" className="hover:text-amber-300 transition">
                Home Coordinates
              </Link>
              <Link href="/create/custom-pet-memorial" className="hover:text-amber-300 transition">
                Pet Tribute
              </Link>
            </nav>

            <Link
              href="/create/custom-star-map"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-md shrink-0"
            >
              Design Your Print →
            </Link>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        {/* Studio Footer */}
        <footer className="border-t border-white/10 bg-[#05080f] py-12 mt-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-12 gap-8 text-xs text-slate-300">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-lg font-serif font-bold text-[#f7f4ef]">Evermark Prints</p>
              <p className="leading-relaxed max-w-sm text-slate-400">
                Museum-grade custom star maps, acoustic waveform prints, architectural coordinate charts, and heirloom keepsakes crafted to order and shipped across the United States in 3–5 business days.
              </p>
              <p className="text-slate-400 pt-1">
                Support &amp; Custom Orders:{' '}
                <a
                  href="mailto:ryanb@digital-dads-llc.com"
                  className="text-amber-300 hover:underline font-semibold"
                >
                  ryanb@digital-dads-llc.com
                </a>
              </p>
            </div>

            <div className="lg:col-span-4 space-y-2">
              <p className="font-bold uppercase tracking-wider text-amber-300">
                Custom Archival Editions
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/create/custom-star-map" className="hover:text-amber-300">
                    The Exact Night Sky Star Map
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-soundwave-art" className="hover:text-amber-300">
                    Custom Voice &amp; Song Waveform Print
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-coordinates-print" className="hover:text-amber-300">
                    Architectural Latitude &amp; Home Coordinate Print
                  </Link>
                </li>
                <li>
                  <Link href="/create/custom-pet-memorial" className="hover:text-amber-300">
                    Heirloom Pet Tribute Keepsake
                  </Link>
                </li>
                <li>
                  <Link href="/create/patent-architectural-triptych" className="hover:text-amber-300">
                    Custom Patent &amp; Engineering Blueprint
                  </Link>
                </li>
                <li>
                  <Link href="/create/coastal-bathymetry-chart" className="hover:text-amber-300">
                    Custom Coastal Depth &amp; Nautical Chart
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3 lg:text-right">
              <p className="font-bold uppercase tracking-wider text-emerald-300">
                US Archival Guarantee
              </p>
              <p className="text-slate-400 leading-relaxed">
                Every framed print is crafted on heavyweight archival canvas with solid wood float framing and ships free in the US.
              </p>
              <p className="text-[11px] text-slate-500 pt-3 border-t border-white/10">
                © {new Date().getFullYear()} Evermark Prints. Part of{' '}
                <a
                  href="https://digital-dads-llc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline"
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
