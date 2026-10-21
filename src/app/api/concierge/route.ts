import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = String(body.message || '').trim()
    const lower = message.toLowerCase()

    if (!message) {
      return NextResponse.json({
        reply:
          'Welcome to the Evermark Studio Concierge. I can check your live order & framing status (just type your checkout email or Order ID), help with a 2-hour typo edit, or answer questions about our hardwood frames, photo/audio uploads, and 3–5 day US shipping.',
      })
    }

    // 1. Check if the user entered an email address or Stripe Order ID (cs_...)
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const csMatch = message.match(/cs_(live|test)_[a-zA-Z0-9]+/)

    if (emailMatch || csMatch) {
      const lookupKey = csMatch ? csMatch[0] : emailMatch![0].toLowerCase()
      const matched = []

      if (csMatch) {
        try {
          const s = await stripe.checkout.sessions.retrieve(lookupKey)
          if (s && s.payment_status === 'paid') matched.push(s)
        } catch {
          // ignore
        }
      } else {
        const list = await stripe.checkout.sessions.list({ limit: 35 })
        for (const s of list.data) {
          if (
            s.payment_status === 'paid' &&
            s.customer_details?.email?.toLowerCase() === lookupKey
          ) {
            matched.push(s)
          }
        }
      }

      if (matched.length === 0) {
        return NextResponse.json({
          reply: `I searched our live studio ledger for "${lookupKey}" and didn't find a completed order under that exact email/ID yet. If you used a different email at checkout, type it here—or visit our /track page!`,
        })
      }

      const latest = matched[0]
      const meta = latest.metadata || {}
      const mins = Math.floor((Date.now() - latest.created * 1000) / 60000)
      const statusText =
        mins <= 120
          ? `Your commission ("${
              meta.headline || 'Custom Print'
            }") was verified ${mins} minutes ago and is currently in our 2-Hour Proof Window. You can still edit any typo directly at https://www.evermarkprints.com/track using "${lookupKey}".`
          : `Your commission ("${
              meta.headline || 'Custom Print'
            }") is currently in our US Archival Framing Studio. Tracked USPS/UPS delivery arrives in 3–5 business days. You can view your live proof & download links anytime at https://www.evermarkprints.com/track.`

      return NextResponse.json({
        reply: statusText,
        actionUrl: `/track`,
        actionLabel: 'Open Live Order Tracker →',
      })
    }

    // 2. Photo or Audio Upload Questions
    if (
      lower.includes('photo') ||
      lower.includes('picture') ||
      lower.includes('image') ||
      lower.includes('audio') ||
      lower.includes('voice') ||
      lower.includes('song') ||
      lower.includes('record')
    ) {
      return NextResponse.json({
        reply:
          'You can attach both a custom Photo (.JPG/.PNG) and a Voice/Song recording (.MP3/.M4A/.WAV — or record 5 seconds live from your microphone!) right inside Step 03 of the customizer on any print. For photos, you can also toggle between Warm Archival Color, Black & White Film, and Charcoal Sketch filters live!',
      })
    }

    // 3. Watermark / Download Questions
    if (lower.includes('watermark') || lower.includes('dpi') || lower.includes('download')) {
      return NextResponse.json({
        reply:
          'The security watermark mesh is shown only on the live preview before checkout to protect our artists’ custom plates. Your physical framed print and your purchased Digital Master file are 100% clean and unwatermarked!',
      })
    }

    // 4. Shipping / Delivery Speed / Gift Questions
    if (
      lower.includes('ship') ||
      lower.includes('long') ||
      lower.includes('deliver') ||
      lower.includes('arrive') ||
      lower.includes('gift')
    ) {
      return NextResponse.json({
        reply:
          'All physical framed editions ship FREE from our US archival workshops and arrive in 3–5 business days via tracked USPS/UPS. Every package ships gift-ready with zero retail prices on the packing slip, and you can check "This Commission is a Gift" above checkout to include a complimentary gift note!',
      })
    }

    // 5. Refund / Damaged / Typo Questions
    if (
      lower.includes('refund') ||
      lower.includes('return') ||
      lower.includes('damage') ||
      lower.includes('typo') ||
      lower.includes('mistake') ||
      lower.includes('cancel')
    ) {
      return NextResponse.json({
        reply:
          'Every order includes our 100% Damaged-or-Defective Replacement Guarantee (free expedited reprint or full Stripe refund if damaged in transit). Plus, if you spot a typo within 2 hours of ordering, you can fix it yourself instantly on our /track page!',
        actionUrl: '/track',
        actionLabel: 'Go to Order Tracker / Typo Editor →',
      })
    }

    // 6. Discount / Promo Code Questions
    if (
      lower.includes('discount') ||
      lower.includes('promo') ||
      lower.includes('coupon') ||
      lower.includes('code') ||
      lower.includes('sale')
    ) {
      return NextResponse.json({
        reply:
          'You can enter promo code WELCOME15 at Stripe Checkout for 15% off your first custom print—or select our Two-Print Collector Pair to save $29 automatically with free Priority US delivery!',
      })
    }

    // Default helpful response
    return NextResponse.json({
      reply:
        'I can help you customize any of our 12 archival prints, check a live order status (just reply with your checkout email address!), or answer questions about our solid Walnut, Warm Oak, and Matte Black frames. You can also use code WELCOME15 at checkout for 15% off today!',
    })
  } catch {
    return NextResponse.json({
      reply:
        'Our studio concierge is here to help! Enter your email address to track an order, or email ryanb@digital-dads-llc.com for personal assistance.',
    })
  }
}
