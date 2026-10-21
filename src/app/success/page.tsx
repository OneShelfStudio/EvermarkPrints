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
  frameFinishId?: string
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
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-8 sm:p-12 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171513] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.16em]">
          <span>COMMISSION CONFIRMED · ARCHIVAL PRESS QUEUED</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-editorial font-semibold text-[#171513]">
          Thank You for Your Commission.
        </h1>

        <p className="text-sm sm:text-base text-[#4A443C] leading-relaxed">
          Your bespoke print order has been verified via Stripe. If you commissioned a framed edition, our US archival print workshop is preparing your piece on 310gsm cotton rag and will email your tracked USPS/UPS dispatch notice within 3–5 business days.
        </p>

        {sessionId && (
          <p className="text-xs text-[#7A6F63] font-mono-tech">
            ARCHIVE REFERENCE: {sessionId.slice(0, 28)}...
          </p>
        )}

        {savedDesign && (
          <div className="p-6 bg-[#F3EFE6] border border-[#DDD5C7] grid sm:grid-cols-12 gap-6 items-center">
            {savedDesign.previewDataUrl && (
              <div className="sm:col-span-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={savedDesign.previewDataUrl}
                  alt={savedDesign.headline}
                  className="w-40 h-auto border-4 border-[#3B261A] shadow-md"
                />
              </div>
            )}

            <div className="sm:col-span-8 space-y-2 text-xs text-[#4A443C]">
              <span className="text-[#6E4E2E] font-mono-tech uppercase tracking-[0.16em] font-semibold block">
                Recorded Inscription Dossier
              </span>
              <p className="text-xl font-editorial font-semibold text-[#171513]">
                {savedDesign.productTitle}
              </p>
              <p>
                <strong className="text-[#171513]">Edition Format:</strong>{' '}
                {savedDesign.formatLabel}
              </p>
              <p>
                <strong className="text-[#171513]">Primary Title:</strong>{' '}
                {savedDesign.headline}
              </p>
              <p>
                <strong className="text-[#171513]">Dedication:</strong>{' '}
                {savedDesign.subline}
              </p>
              <p>
                <strong className="text-[#171513]">Place &amp; Date:</strong>{' '}
                {savedDesign.locationText} · {savedDesign.dateText}
              </p>

              {canDownloadDigitalMaster && savedDesign.previewDataUrl && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleDownloadMaster}
                    className="px-5 py-3 bg-[#171513] hover:bg-[#2E2925] text-[#F7F4ED] font-mono-tech uppercase tracking-[0.14em] text-xs transition"
                  >
                    Download High-Resolution 300 DPI Master File →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-5 border-t border-[#DDD5C7] flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="text-[#5C554D]">
            Concierge support or inscription adjustments:{' '}
            <a
              href="mailto:ryanb@digital-dads-llc.com"
              className="text-[#171513] underline underline-offset-4 font-semibold"
            >
              ryanb@digital-dads-llc.com
            </a>
          </span>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#EFEAE0] hover:bg-[#E4DDD0] border border-[#D5CCBC] text-[#171513] font-mono-tech uppercase tracking-[0.14em] text-[11px] transition"
          >
            ← Commission Another Print
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
        <div className="py-20 text-center text-sm text-[#5C554D]">
          Retrieving your archival commission dossier...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
