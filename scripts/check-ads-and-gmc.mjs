#!/usr/bin/env node
/**
 * Evermark Prints — Terminal CLI for Google Ads Telemetry & Google Merchant API (Content API v2.1)
 * Usage: node scripts/check-ads-and-gmc.mjs
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const MERCHANT_ID = process.env.GOOGLE_MERCHANT_ID || '5878315210'
const TELEMETRY_URL = 'https://www.evermarkprints.com/api/ads-telemetry'

// Load .env.local if present
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const k = trimmed.slice(0, eqIdx).trim()
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[k]) process.env[k] = v
    }
  }
}

async function getGoogleAccessToken(serviceAccountObj, scope) {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const claim = Buffer.from(
    JSON.stringify({
      iss: serviceAccountObj.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url')

  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${header}.${claim}`)
  const signature = sign.sign(serviceAccountObj.private_key, 'base64url')
  const assertion = `${header}.${claim}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!res.ok) {
    throw new Error(`OAuth token error: ${await res.text()}`)
  }
  const data = await res.json()
  return data.access_token
}

async function checkMerchantCenterApi() {
  const keyPath =
    process.env.GMC_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.PLAY_SERVICE_ACCOUNT_KEY

  if (!keyPath || !fs.existsSync(keyPath)) {
    console.log(
      '\n[GMC Direct API] No local Service Account JSON path set in GMC_SERVICE_ACCOUNT_KEY / PLAY_SERVICE_ACCOUNT_KEY.'
    )
    return
  }

  try {
    const sa = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
    console.log(`\n=== Google Merchant Center API (Account ${MERCHANT_ID}) ===`)
    console.log(`Authenticating via Service Account: ${sa.client_email}`)
    const token = await getGoogleAccessToken(sa, 'https://www.googleapis.com/auth/content')
    const res = await fetch(
      `https://shoppingcontent.googleapis.com/content/v2.1/${MERCHANT_ID}/productstatuses?maxResults=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!res.ok) {
      console.log(`GMC API response (${res.status}): ${await res.text()}`)
      return
    }

    const data = await res.json()
    const resources = data.resources || []
    console.log(`Total Products in GMC: ${resources.length}`)

    const statusCounts = { approved: 0, pending: 0, disapproved: 0 }
    for (const item of resources) {
      const shoppingDest = (item.destinationStatuses || []).find(
        (d) => d.destination === 'Shopping' || d.destination === 'SurfacesAcrossGoogle'
      )
      const st = shoppingDest?.status || 'pending'
      if (st === 'approved') statusCounts.approved++
      else if (st === 'disapproved') statusCounts.disapproved++
      else statusCounts.pending++
    }
    console.log('GMC Status Summary:', statusCounts)
  } catch (err) {
    console.log('GMC API check error:', err.message)
  }
}

async function checkAdsTelemetry() {
  console.log('\n=== Google Ads Live Telemetry Snapshot (/api/ads-telemetry) ===')
  try {
    const res = await fetch(TELEMETRY_URL, { cache: 'no-store' })
    if (!res.ok) {
      console.log(`Telemetry endpoint HTTP ${res.status}: ${await res.text()}`)
      return
    }
    const data = await res.json()
    if (!data.telemetry) {
      console.log('No telemetry snapshot stored yet. Waiting for first Google Ads Script run.')
      return
    }
    const t = data.telemetry
    console.log(`Account:     ${t.accountName} (${t.accountId})`)
    console.log(`Last Synced: ${t.syncedAt}`)
    if (t.summary) {
      console.log('Summary:', JSON.stringify(t.summary, null, 2))
    }
    if (Array.isArray(t.campaigns) && t.campaigns.length > 0) {
      console.log('\nCampaigns:')
      console.table(t.campaigns)
    }
    if (Array.isArray(t.productGroups) && t.productGroups.length > 0) {
      console.log('\nProduct Groups:')
      console.table(t.productGroups)
    }
  } catch (err) {
    console.log('Telemetry fetch error:', err.message)
  }
}

await checkAdsTelemetry()
await checkMerchantCenterApi()
