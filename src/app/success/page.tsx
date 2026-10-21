'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SavedCustomPrint {
  productSlug: string
  productTitle: string
  headline: string
  subline: string
  locationText: string
  dateText: string
  coordsText: string
  colorwayId: string
  formatLabel: string
  previewDataUrl?: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const formatId = searchParams.get('format') || 'framed-16x20'
  const bump = searchParams.get('bump') === '1'
  const sessionId = searchParams.get('session_id') || ''

  const [savedDesign, setSavedDesign] = useState<SavedCustomPrint | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('evermark_last_custom_print')
      if (raw) {
        setSavedDesign(JSON.parse(raw))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const canDownloadDigitalMaster = formatId === 'digital-300dpi' || bump

  function handleDownloadMaster() {
    if (!savedDesign?.previewDataUrl) return
    const a = document.createElement('a')
    a.href = savedDesign.previewDataUrl
    a.download = `Evermark-Archival-Master-${savedDesign.productSlug || 'Print'}.png`
    a.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 md:py-20 space-y-10">
      <div className="rounded-2xl bg-[#0d121f] border border-emerald-400/35 p-7 sm:p-12 shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-xs font-bold">
          <span>✓</span>
          <span>Order Confirmed &amp; Queued in Archival Studio</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#f7f4ef]">
          Thank You for Your Order!
        </h1>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          Your custom print order has been verified via Stripe. If you selected a framed canvas edition, our US archival print studio is preparing your piece and will email your USPS/UPS tracking link within 3–5 business days.
        </p>

        {sessionId && (
          <p className="text-xs text-slate-400 font-mono">
            Order Reference: {sessionId.slice(0, 28)}...
          </p>
        )}

        {savedDesign && (
          <div className="p-6 rounded-xl bg-[#070a12] border border-white/15 grid sm:grid-cols-12 gap-6 items-center">
            {savedDesign.previewDataUrl && (
              <div className="sm:col-span-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={savedDesign.previewDataUrl}
                  alt={savedDesign.headline}
                  className="w-40 h-auto rounded border border-white/20 shadow-lg"
                />
              </div>
            )}

            <div className="sm:col-span-8 space-y-2 text-xs text-slate-300">
              <span className="text-amber-300 font-bold uppercase tracking-wider block">
                Your Custom Inscription Summary
              </span>
              <p className="text-base font-serif font-bold text-white">
                {savedDesign.productTitle}
              </p>
              <p>
                <strong>Format:</strong> {savedDesign.formatLabel}
              </p>
              <p>
                <strong>Headline:</strong> {savedDesign.headline}
              </p>
              <p>
                <strong>Dedication:</strong> {savedDesign.subline}
              </p>
              <p>
                <strong>Location &amp; Date:</strong> {savedDesign.locationText} · {savedDesign.dateText}
              </p>

              {canDownloadDigitalMaster && savedDesign.previewDataUrl && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleDownloadMaster}
                    className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-md"
                  >
                    ⬇ Download Your High-Res Archival Print File Now →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-slate-300">
            Questions or need a custom adjustment? Email{' '}
            <a
              href="mailto:ryanb@digital-dads-llc.com"
              className="text-amber-300 underline font-semibold"
            >
              ryanb@digital-dads-llc.com
            </a>
          </span>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[#f7f4ef] font-semibold transition"
          >
            ← Design Another Print
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-slate-300">
          Loading your custom print order...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
