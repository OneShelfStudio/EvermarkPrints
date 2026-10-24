import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      productSlug,
      productTitle,
      variantLabel,
      colorwayLabel,
      headline,
      subline,
      locationText,
      dateText,
      coordsText,
      shareUrl,
    } = body

    const cleanEmail = String(email || '').trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const safeShareUrl =
      typeof shareUrl === 'string' && shareUrl.startsWith('http')
        ? shareUrl
        : `https://www.evermarkprints.com/create/${encodeURIComponent(
            productSlug || 'custom-star-map'
          )}`

    // 1. Persist saved design lead to Sanity if configured
    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityToken = process.env.SANITY_API_TOKEN

    if (sanityProjectId && sanityToken) {
      try {
        await fetch(
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
                  create: {
                    _type: 'evermarkSavedDesign',
                    createdAt: new Date().toISOString(),
                    email: cleanEmail,
                    productSlug: productSlug || 'custom-star-map',
                    productTitle: productTitle || 'Custom Keepsake',
                    variantLabel: variantLabel || '',
                    colorwayLabel: colorwayLabel || '',
                    headline: headline || '',
                    subline: subline || '',
                    locationText: locationText || '',
                    dateText: dateText || '',
                    coordsText: coordsText || '',
                    shareUrl: safeShareUrl,
                  },
                },
              ],
            }),
          }
        )
      } catch {
        // Non-blocking
      }
    }

    // 2. Email the saved custom proof link + WELCOME15 privilege code via Resend
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Evermark Studio <orders@evermarkprints.com>'
    const ownerEmail =
      process.env.STUDIO_ALERT_EMAIL || 'concierge@evermarkprints.com'

    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FCFBF8; border: 1px solid #CBB89F; padding: 32px; color: #261A13;">
        <div style="border-bottom: 2px solid #1B3027; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E472A; font-weight: 600;">ARCHIVAL PROOF SAVED · 15% OFF RESERVED</span>
          <h1 style="font-size: 25px; margin: 6px 0 0; color: #1B3027;">Your Custom Keepsake Proof Is Saved</h1>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #4A3B31;">
          We saved your exact custom inscription and studio configuration so you can resume anytime on any device or share it with family.
        </p>

        <div style="background: #F3E9DA; border: 1px solid #CBB89F; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #9E472A; font-weight: bold;">Saved Studio Configuration</p>
          <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold; color: #1B3027;">${productTitle || 'Custom Keepsake'} (${variantLabel || 'Standard Edition'})</p>
          <p style="margin: 0 0 6px; font-size: 13px;"><strong>Palette:</strong> ${colorwayLabel || 'Archival Palette'}</p>
          <p style="margin: 0 0 6px; font-size: 13px;"><strong>Headline:</strong> "${headline || ''}"</p>
          ${subline ? `<p style="margin: 0 0 6px; font-size: 13px;"><strong>Dedication:</strong> "${subline}"</p>` : ''}
          <p style="margin: 0; font-size: 13px;"><strong>Details:</strong> ${locationText || ''} · ${dateText || ''}</p>
        </div>

        <div style="background: #1B3027; color: #F7F4ED; padding: 18px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #E5C178;">COLLECTOR PRIVILEGE RESERVED</p>
          <p style="margin: 0 0 14px; font-size: 14px;">Enter code <strong style="color: #E5C178; font-size: 16px;">WELCOME15</strong> at checkout for <strong>15% Off</strong> + Free 3 to 5 Day US Shipping.</p>
          <a href="${safeShareUrl}" style="display: inline-block; background: #E5C178; color: #261A13; text-decoration: none; padding: 12px 24px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.14em;">Resume Your Custom Design →</a>
        </div>

        <p style="font-size: 12px; color: #5C4D42; line-height: 1.5;">
          <strong>Gifting soon?</strong> Every completed order includes an <em>Instant Printable Gift Presentation Card &amp; Preview Certificate</em> immediately after checkout while your physical heirloom ships.
        </p>

        <div style="border-top: 1px solid #D8C9B6; padding-top: 16px; margin-top: 20px; font-size: 11px; color: #7A6858; text-align: center;">
          Evermark Prints · Bespoke Archival Press · 1321 Upland Dr. PMB 4136, Houston, TX 77043<br />
          Questions? Reply anytime to <a href="mailto:concierge@evermarkprints.com" style="color: #9E472A;">concierge@evermarkprints.com</a>
        </div>
      </div>
    `

    if (apiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [cleanEmail],
          bcc: [ownerEmail],
          reply_to: 'concierge@evermarkprints.com',
          subject: `Your Saved Custom Proof: ${productTitle || 'Evermark Keepsake'} (+ 15% Off Code WELCOME15)`,
          html: customerHtml,
        }),
      })
    }

    return NextResponse.json({
      saved: true,
      promoCode: 'WELCOME15',
      shareUrl: safeShareUrl,
    })
  } catch (err) {
    console.error('[Evermark Save Design Error]:', err)
    return NextResponse.json(
      { error: 'Unable to save proof right now. Please try again.' },
      { status: 500 }
    )
  }
}
