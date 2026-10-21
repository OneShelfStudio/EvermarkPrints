'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdUnitProps {
  slot?: string
  label?: string
}

export default function AdUnit({
  slot = '4800798822',
  label = 'Sponsored Partner',
}: AdUnitProps) {
  const pushedRef = useRef(false)
  const insRef = useRef<HTMLModElement | null>(null)
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading')

  useEffect(() => {
    const el = insRef.current
    if (!el) return

    const checkStatus = () => {
      const status = el.getAttribute('data-ad-status')
      if (status === 'filled') setAdStatus('filled')
      else if (status === 'unfilled') setAdStatus('unfilled')
    }

    const observer = new MutationObserver(checkStatus)
    observer.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] })

    const timer = window.setTimeout(() => {
      if (!pushedRef.current) {
        try {
          if (typeof window !== 'undefined' && el.offsetWidth > 0) {
            window.adsbygoogle = window.adsbygoogle || []
            window.adsbygoogle.push({})
            pushedRef.current = true
          }
        } catch {
          setAdStatus('unfilled')
        }
      }
      checkStatus()
    }, 150)

    const fallbackTimer = window.setTimeout(() => {
      const status = el.getAttribute('data-ad-status')
      const hasIframe = Boolean(el.querySelector('iframe'))
      if (!status && !hasIframe) setAdStatus('unfilled')
    }, 3500)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(fallbackTimer)
      observer.disconnect()
    }
  }, [])

  return (
    <aside
      aria-label="Sponsored Content"
      className="w-full my-6 rounded-2xl border border-white/15 bg-[#0b101d]/90 overflow-hidden shadow-lg"
    >
      <div className="px-4 py-1.5 border-b border-white/10 bg-black/30 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-amber-300/90">
          {label}
        </span>
        <span>Evermark Archival Gift Guide</span>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center p-2.5 min-h-[96px]">
        <ins
          ref={insRef}
          className="adsbygoogle relative z-20 w-full block text-center"
          style={{
            display: adStatus === 'unfilled' ? 'none' : 'block',
            width: '100%',
            minHeight: '90px',
          }}
          data-ad-client="ca-pub-7651037308656903"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {adStatus !== 'filled' && (
          <div className="w-full px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-serif font-bold text-[#f7f4ef]">
                🎁 Ordering a Gift? Save $29 With Our 2-Print Heirloom Bundle
              </p>
              <p className="text-xs text-slate-300">
                Includes two 16&quot; × 20&quot; solid-wood framed canvases + free priority US shipping in 3–5 business days.
              </p>
            </div>
            <Link
              href="/create/custom-star-map"
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition"
            >
              Design Your Print →
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
