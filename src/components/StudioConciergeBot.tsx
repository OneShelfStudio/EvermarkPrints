'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ChatMessage {
  role: 'assistant' | 'user'
  text: string
  actionUrl?: string
  actionLabel?: string
}

export default function StudioConciergeBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Welcome to Evermark Prints. Ask me about attaching a photo or voice note, frame woods, 3 to 5 day US delivery, or type your checkout email to track a live order.',
    },
  ])

  async function sendQuestion(questionText: string) {
    const trimmed = questionText.trim()
    if (!trimmed || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.reply ||
            'Please visit /track to check your order status or email concierge@evermarkprints.com.',
          actionUrl: data.actionUrl,
          actionLabel: data.actionLabel,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'You can track orders or edit inscriptions at /track, or email concierge@evermarkprints.com.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] border border-[#D8AE64]/50 shadow-2xl flex items-center gap-2.5 text-xs font-mono-tech uppercase tracking-[0.14em] transition"
        >
          <span className="h-2 w-2 rounded-full bg-[#E5C178] animate-pulse" />
          <span>Studio Concierge &amp; Order Status</span>
        </button>
      ) : (
        <div className="w-[340px] sm:w-[380px] bg-[#FDFBF7] border-2 border-[#1B3027] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#1B3027] text-[#F7F4ED] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-editorial font-semibold tracking-wide text-[#F7F4ED]">
                Evermark Studio Concierge
              </p>
              <p className="text-[10px] font-mono-tech uppercase tracking-wider text-[#E5C178]">
                24/7 Order Lookup · Framing &amp; Gift Help
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-mono-tech text-[#E5C178] hover:text-white px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompt Buttons */}
          <div className="bg-[#F3E9DA] px-3 py-2 border-b border-[#D8C9B6] flex flex-wrap gap-1.5">
            {[
              'Track my order',
              'How to attach photo/audio?',
              'Fix a typo on my order',
              'Any promo code?',
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendQuestion(q)}
                className="px-2 py-1 bg-[#FDFBF7] hover:bg-[#1B3027] hover:text-[#F7F4ED] border border-[#CBB89F] text-[10px] text-[#261A13] font-medium transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="p-3.5 space-y-3 max-h-[290px] overflow-y-auto text-xs bg-[#FDFBF7]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1B3027] text-[#F7F4ED] ml-6'
                    : 'bg-[#F6EFE4] text-[#261A13] border border-[#D8C9B6] mr-4'
                }`}
              >
                <p>{m.text}</p>
                {m.actionUrl && (
                  <Link
                    href={m.actionUrl}
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-2 px-3 py-1.5 bg-[#9E472A] text-[#FDFBF7] font-mono-tech uppercase text-[10px]"
                  >
                    {m.actionLabel || 'View Now →'}
                  </Link>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-[11px] font-mono-tech text-[#7A6858] px-2">
                Checking studio records...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendQuestion(input)
            }}
            className="border-t border-[#D8C9B6] p-2.5 bg-[#F8F3EA] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your email to track order, or ask a question..."
              className="flex-grow border border-[#CBB89F] bg-[#FDFBF7] px-3 py-2 text-xs text-[#261A13] focus:border-[#1B3027] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-2 bg-[#1B3027] text-[#F7F4ED] text-xs font-mono-tech uppercase"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
