import { NextResponse } from 'next/server'
import { resolveSanityProjectId } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

const TELEMETRY_DOC_ID = 'evermark-ads-telemetry-latest'
const EXPECTED_SYNC_KEY = process.env.ADS_TELEMETRY_KEY || 'evm_ads_sync_2026'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const headerKey = req.headers.get('x-evermark-telemetry-key')
    const providedKey = headerKey || body?.telemetryKey

    if (providedKey !== EXPECTED_SYNC_KEY) {
      return NextResponse.json({ error: 'Unauthorized telemetry sync key' }, { status: 401 })
    }

    const sanityProjectId = resolveSanityProjectId()
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityToken = process.env.SANITY_API_TOKEN

    if (!sanityProjectId || !sanityToken) {
      return NextResponse.json(
        { error: 'Sanity credentials not configured on server' },
        { status: 500 }
      )
    }

    const syncedAt = new Date().toISOString()
    const payload = {
      _id: TELEMETRY_DOC_ID,
      _type: 'evermarkAdsTelemetry',
      syncedAt,
      accountId: body.accountId || '694-019-7692',
      accountName: body.accountName || 'Digital Dads, LLC',
      summary: body.summary || {},
      campaigns: body.campaigns || [],
      productGroups: body.productGroups || [],
      products: body.products || [],
      diagnostics: body.diagnostics || {},
    }

    const sanityRes = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2024-01-01/data/mutate/${sanityDataset}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sanityToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mutations: [
            {
              createOrReplace: payload,
            },
          ],
        }),
      }
    )

    if (!sanityRes.ok) {
      const errText = await sanityRes.text()
      return NextResponse.json(
        { error: 'Failed to store telemetry in Sanity', details: errText },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      syncedAt,
      documentId: TELEMETRY_DOC_ID,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to process Google Ads telemetry payload',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const sanityProjectId = resolveSanityProjectId()
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityToken = process.env.SANITY_API_TOKEN

    const query = encodeURIComponent(`*[_id == "${TELEMETRY_DOC_ID}"][0]`)
    const headers: Record<string, string> = {}
    if (sanityToken) {
      headers.Authorization = `Bearer ${sanityToken}`
    }

    const res = await fetch(
      `https://${sanityProjectId}.api.sanity.io/v2024-01-01/data/query/${sanityDataset}?query=${query}`,
      {
        headers,
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to query Sanity telemetry' },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json({
      ok: true,
      telemetry: data?.result || null,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to read Google Ads telemetry',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
