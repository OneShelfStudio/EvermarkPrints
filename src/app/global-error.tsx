'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Evermark Root Error]:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#F7F4ED', color: '#1B3027', fontFamily: 'serif' }}>
        <div style={{ maxWidth: '600px', margin: '80px auto', padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9E472A', fontWeight: 'bold' }}>
            EVERMARK PRINTS · SYSTEM NOTICE
          </p>
          <h1 style={{ fontSize: '32px', margin: '16px 0', color: '#1B3027' }}>
            Archival Studio Temporary Interruption
          </h1>
          <p style={{ fontSize: '14px', color: '#5C554D', lineHeight: '1.6', marginBottom: '24px' }}>
            We encountered a temporary rendering exception. Please reload or visit us shortly.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: '#1B3027',
              color: '#F7F4ED',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Reload Studio ↺
          </button>
        </div>
      </body>
    </html>
  )
}
