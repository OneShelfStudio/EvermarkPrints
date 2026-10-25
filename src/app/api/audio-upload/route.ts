import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface StoredAudioEntry {
  buffer: Buffer
  contentType: string
  createdAt: number
}

const globalAudioStore = globalThis as unknown as {
  __evermarkAudioMasters?: Map<string, StoredAudioEntry>
}

if (!globalAudioStore.__evermarkAudioMasters) {
  globalAudioStore.__evermarkAudioMasters = new Map<string, StoredAudioEntry>()
}

const audioMap = globalAudioStore.__evermarkAudioMasters

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { dataUrl, slug = 'voice-memory' } = body as {
      dataUrl?: string
      slug?: string
    }

    if (!dataUrl || !dataUrl.startsWith('data:audio/')) {
      return NextResponse.json({ error: 'Invalid audio dataUrl' }, { status: 400 })
    }

    const matches = dataUrl.match(/^data:(audio\/[a-zA-Z0-9.+=-]+(?:;codecs=[a-zA-Z0-9.+=-]+)?);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'Malformed base64 audio' }, { status: 400 })
    }

    const contentType = matches[1].split(';')[0] || 'audio/mpeg'
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // Limit to 8MB to keep uploads fast and reliable
    if (buffer.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio clip exceeds 8MB limit' }, { status: 413 })
    }

    const ext = contentType.includes('wav')
      ? 'wav'
      : contentType.includes('webm')
      ? 'webm'
      : contentType.includes('mp4') || contentType.includes('m4a')
      ? 'm4a'
      : 'mp3'

    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'byz4z1gd'
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

    if (sanityWriteToken) {
      try {
        const sanityRes = await fetch(
          `https://${sanityProjectId}.api.sanity.io/v2024-01-01/assets/files/${sanityDataset}?filename=${encodeURIComponent(
            `${slug}-${Date.now()}.${ext}`
          )}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sanityWriteToken}`,
              'Content-Type': contentType,
            },
            body: buffer,
          }
        )
        if (sanityRes.ok) {
          const sanityData = await sanityRes.json()
          const cdnUrl = sanityData?.document?.url
          if (cdnUrl) {
            return NextResponse.json({
              url: cdnUrl,
              audioUrl: cdnUrl,
              storage: 'sanity-cdn',
            })
          }
        }
      } catch {
        // Fall through to self-hosted store
      }
    }

    const id = `aud_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    audioMap.set(id, {
      buffer,
      contentType,
      createdAt: Date.now(),
    })

    if (audioMap.size > 40) {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000
      for (const [k, v] of Array.from(audioMap.entries())) {
        if (v.createdAt < cutoff) audioMap.delete(k)
      }
    }

    const origin = new URL(req.url).origin
    const fallbackUrl = `${origin}/api/audio-upload?id=${encodeURIComponent(id)}`
    return NextResponse.json({
      id,
      url: fallbackUrl,
      audioUrl: fallbackUrl,
      storage: 'edge-audio',
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Audio upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''
  const entry = audioMap.get(id)

  if (!entry) {
    return new NextResponse('Audio clip not found', { status: 404 })
  }

  return new NextResponse(new Uint8Array(entry.buffer), {
    headers: {
      'Content-Type': entry.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
