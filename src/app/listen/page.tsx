'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ListenPlayerContent() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'OUR FIRST DANCE'
  const song = searchParams.get('song') || 'At Last · Etta James'
  const dateText = searchParams.get('date') || 'Forever Remembered'
  const subline =
    searchParams.get('subline') || '“You are my finest adventure and my quietest harbor.”'
  const peaksParam = searchParams.get('peaks') || ''

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)

  const parsedPeaks: number[] = peaksParam
    ? peaksParam
        .split(',')
        .map((n) => Math.min(1, Math.max(0.1, Number(n) / 100)))
        .filter((n) => !Number.isNaN(n))
    : Array.from({ length: 64 }, (_, i) => {
        const env = Math.sin((i / 64) * Math.PI)
        return Math.max(0.14, env * (0.45 + 0.45 * Math.abs(Math.sin(i * 0.35))))
      })

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  function handleTogglePlay() {
    if (isPlaying) {
      setIsPlaying(false)
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
      return
    }

    setIsPlaying(true)
    setProgress(0)

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      // Play a warm, velvety acoustic piano/chime chord progression modulated by the waveform peaks
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 349.23], // Fmaj7
        [196.0, 246.94, 293.66, 392.0], // G6
      ]
      const now = ctx.currentTime
      chords.forEach((chord, cIdx) => {
        chord.forEach((freq, nIdx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = 1200

          osc.type = nIdx % 2 === 0 ? 'sine' : 'triangle'
          osc.frequency.value = freq
          const start = now + cIdx * 2.0 + nIdx * 0.08
          gain.gain.setValueAtTime(0.0001, start)
          gain.gain.exponentialRampToValueAtTime(0.045, start + 0.25)
          gain.gain.exponentialRampToValueAtTime(0.0008, start + 2.2)

          osc.connect(filter)
          filter.connect(gain)
          gain.connect(ctx.destination)
          osc.start(start)
          osc.stop(start + 2.3)
        })
      })
    } catch {
      // Ignore WebAudio restriction
    }

    const startTime = Date.now()
    const durationMs = 8000
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / durationMs) * 100)
      setProgress(pct)
      if (pct >= 100) {
        if (timerRef.current) window.clearInterval(timerRef.current)
        setIsPlaying(false)
      }
    }, 60)
  }

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    song
  )}`
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(song)}`

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 md:py-20">
      <div className="bg-[#1B3027] text-[#F7F4ED] border-2 border-[#D8AE64] p-7 sm:p-10 shadow-2xl space-y-7 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9E472A] text-[#FDFBF7] text-[10px] font-mono-tech uppercase tracking-[0.2em]">
          <span>♫ EVERMARK ARCHIVAL ACOUSTIC MEMORY PLAYER</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#F7F4ED]">
            {title}
          </h1>
          <p className="text-sm italic text-[#E5C178] font-editorial">{subline}</p>
          <p className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D0C5B4] pt-1">
            {song} · {dateText}
          </p>
        </div>

        {/* Interactive Waveform Visualizer */}
        <div className="bg-[#12211B] border border-[#D8AE64]/35 p-6 space-y-5">
          <div className="h-28 flex items-center justify-center gap-[3px]">
            {parsedPeaks.slice(0, 56).map((pk, idx) => {
              const barPct = (idx / 56) * 100
              const active = isPlaying && barPct <= progress
              return (
                <div
                  key={idx}
                  style={{ height: `${Math.round(pk * 96)}px` }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    active ? 'bg-[#E5C178] scale-y-105' : 'bg-[#F7F4ED]/35'
                  }`}
                />
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-full sm:w-auto px-7 py-3 bg-[#E5C178] hover:bg-[#F0CF88] text-[#171513] text-xs font-mono-tech uppercase tracking-[0.16em] font-semibold transition"
            >
              {isPlaying ? '■ Stop Acoustic Playback' : '▶ Play Acoustic Memory Preview'}
            </button>
            <a
              href={spotifySearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 border border-[#E5C178]/60 hover:border-[#E5C178] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-[0.14em] transition"
            >
              Open Song in Spotify ↗
            </a>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 border border-white/25 hover:border-white text-[#D0C5B4] text-xs font-mono-tech uppercase tracking-[0.14em] transition"
            >
              Listen on YouTube ↗
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-tech text-[#D0C5B4]">
          <span>VERIFIED EVERMARK SOUNDWAVE KEEPSAKE</span>
          <Link href="/create/custom-soundwave-art" className="text-[#E5C178] underline">
            Create Your Own Soundwave Plaque →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ListenPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto p-12 text-center text-xs font-mono-tech">
          Loading Evermark Acoustic Memory Player...
        </div>
      }
    >
      <ListenPlayerContent />
    </Suspense>
  )
}
