'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import EvermarkCrest from '@/components/EvermarkCrest'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Evermark Client Error Boundary]:', error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-[#F3EFE6] border border-[#DDD5C7] flex items-center justify-center p-3">
          <EvermarkCrest size={40} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#9E472A] font-semibold">
          STUDIO NOTICE · UNEXPECTED GLITCH
        </p>
        <h1 className="text-4xl sm:text-5xl font-editorial font-semibold text-[#1B3027]">
          An Unexpected Studio Pause Occurred
        </h1>
        <p className="text-sm sm:text-base text-[#5C554D] max-w-lg mx-auto leading-relaxed">
          Our studio canvas encountered a temporary rendering interruption. Your saved customization data and selections are preserved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3.5 bg-[#1B3027] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-[0.14em] font-semibold hover:bg-[#254135] transition-colors"
        >
          Reload Studio Canvas ↺
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3.5 bg-[#F3EFE6] text-[#1B3027] border border-[#DDD5C7] text-xs font-mono-tech uppercase tracking-[0.14em] font-semibold hover:bg-[#EAE4D7] transition-colors"
        >
          Return to Studio Home →
        </Link>
      </div>

      <div className="pt-10 border-t border-[#DDD5C7] text-xs text-[#7A6F63]">
        If this message persists, reach our studio concierge immediately at{' '}
        <a href="mailto:concierge@evermarkprints.com" className="underline text-[#9E472A] font-semibold">
          concierge@evermarkprints.com
        </a>
      </div>
    </div>
  )
}
