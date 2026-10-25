import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface StoredMasterEntry {
  buffer: Buffer
  contentType: string
  createdAt: number
}

// Global in-memory store for custom-rendered PNG print masters across requests in the same instance
const globalStore = globalThis as unknown as {
  __evermarkPrintMasters?: Map<string, StoredMasterEntry>
}

if (!globalStore.__evermarkPrintMasters) {
  globalStore.__evermarkPrintMasters = new Map<string, StoredMasterEntry>()
}

const masterMap = globalStore.__evermarkPrintMasters

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { dataUrl, slug, productSlug } = body as {
      dataUrl?: string
      slug?: string
      productSlug?: string
    }
    const cleanSlug = productSlug || slug || 'custom-print'

    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image dataUrl' }, { status: 400 })
    }

    const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'Malformed base64 image' }, { status: 400 })
    }

    const contentType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // 1. If Sanity Write Token is configured, upload as a permanent CDN asset
    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'byz4z1gd'
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

    if (sanityWriteToken) {
      try {
        const sanityRes = await fetch(
          `https://${sanityProjectId}.api.sanity.io/v2024-01-01/assets/images/${sanityDataset}?filename=${encodeURIComponent(
            `${cleanSlug}-${Date.now()}.png`
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
              masterArtworkUrl: cdnUrl,
              storage: 'sanity-cdn',
            })
          }
        }
      } catch {
        // Fall through to self-hosted master store
      }
    }

    // 2. Store in self-hosted print master cache & return direct image URL
    const id = `evm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    masterMap.set(id, {
      buffer,
      contentType,
      createdAt: Date.now(),
    })

    // Prune entries older than 24 hours if map exceeds 60 items
    if (masterMap.size > 60) {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000
      for (const [k, v] of Array.from(masterMap.entries())) {
        if (v.createdAt < cutoff) masterMap.delete(k)
      }
    }

    const origin = new URL(req.url).origin
    const fallbackUrl = `${origin}/api/artwork-upload?id=${encodeURIComponent(id)}`
    return NextResponse.json({
      id,
      url: fallbackUrl,
      masterArtworkUrl: fallbackUrl,
      storage: 'edge-master',
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') || ''
  const entry = masterMap.get(id)

  if (!entry) {
    return NextResponse.redirect(new URL('/api/render-master', req.url))
  }

  return new NextResponse(new Uint8Array(entry.buffer), {
    headers: {
      'Content-Type': entry.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
