'use client'

import React, { useState } from 'react'
import EvermarkCrest from './EvermarkCrest'

interface ExitIntentProofModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  headline?: string
  onSaveProof: (email: string) => Promise<boolean>
  isSaving: boolean
  successMsg: string | null
}

export default function ExitIntentProofModal({
  isOpen,
  onClose,
  productTitle,
  headline,
  onSaveProof,
  isSaving,
  successMsg,
}: ExitIntentProofModalProps) {
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    const clean = email.trim()
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setLocalError('Please enter a valid email address.')
      return
    }

    const ok = await onSaveProof(clean)
    if (!ok && !successMsg) {
      setLocalError('Unable to save at this moment. You can continue customizing anytime.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FDFBF7] border-2 border-[#1B3027] shadow-2xl p-6 sm:p-8 text-[#261A13] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative archival gold corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#CBB89F] pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#CBB89F] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#CBB89F] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#CBB89F] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-[#705642] hover:text-[#261A13] text-lg font-mono-tech p-1 transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <EvermarkCrest size={44} />
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.25em] text-[#8B261D] font-semibold">
            Archival Workshop Guarantee
          </span>
          <h3 className="font-serif-cormorant text-2xl sm:text-3xl text-[#1B3027] font-semibold leading-tight">
            Don&apos;t Lose Your Custom Design
          </h3>
          <p className="text-xs sm:text-sm text-[#5B4636] max-w-md">
            You put time into crafting{' '}
            <strong className="text-[#261A13]">{productTitle}</strong>
            {headline ? ` ("${headline}")` : ''}. Save your draft now and lock in{' '}
            <strong className="text-[#1B3027]">15% off</strong> with code{' '}
            <span className="font-mono-tech px-1.5 py-0.5 bg-[#EFE8DC] border border-[#CBB89F] text-[#1B3027] font-bold">
              WELCOME15
            </span>
            .
          </p>
        </div>

        {/* Form or Success State */}
        {successMsg ? (
          <div className="p-4 bg-[#EAF2ED] border border-[#1B3027] text-center space-y-3">
            <p className="font-serif-cormorant text-lg text-[#1B3027] font-semibold">
              ✓ Your Design &amp; 15% Off Code Are Saved!
            </p>
            <p className="text-xs text-[#261A13] font-mono-tech">
              A private recovery link has been dispatched to your inbox. Code{' '}
              <strong>WELCOME15</strong> is now automatically attached to your session.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2.5 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-wider font-semibold transition"
            >
              Continue Customizing →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="exit-intent-email"
                className="block text-[11px] font-mono-tech uppercase tracking-wider text-[#705642]"
              >
                Send Bespoke Recovery Link To
              </label>
              <input
                id="exit-intent-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full border border-[#CBB89F] bg-white px-3.5 py-2.5 text-sm text-[#261A13] placeholder-[#A59582] focus:border-[#1B3027] focus:outline-none transition shadow-inner"
              />
            </div>

            {localError && (
              <p className="text-xs text-[#8B261D] font-mono-tech font-semibold">
                ⚠ {localError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-wider font-semibold shadow-md transition disabled:opacity-50"
            >
              {isSaving ? 'Securing Proof & Discount...' : 'Email My Custom Proof & 15% Off →'}
            </button>

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#705642] pt-1">
              <span>🔒 Zero spam guarantee · Unsubscribe anytime</span>
              <button
                type="button"
                onClick={onClose}
                className="hover:underline text-[#8B261D]"
              >
                No thanks, keep editing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
