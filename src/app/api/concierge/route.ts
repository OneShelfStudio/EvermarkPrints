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
          'Welcome to the Evermark Studio Concierge. I can check your live order & US production status (just type your checkout email or Order ID), help you add additional items onto an existing order, or answer questions about our 12 physical keepsakes.',
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
              meta.headline || 'Custom Keepsake'
            }") was verified ${mins} minutes ago and is currently in our 2-Hour Proof Window. You can edit any typo OR add matching keepsakes onto your order with free combined shipping at https://www.evermarkprints.com/track using "${lookupKey}".`
          : `Your commission ("${
              meta.headline || 'Custom Keepsake'
            }") is currently in our US Printify Studio. Tracked USPS/UPS delivery arrives in 3–5 business days. You can view your live proof or add companion items at https://www.evermarkprints.com/track.`

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
          'Photo Upload is available on our Portrait Keepsakes (Pet Portrait Birch Plaque, First Home Stone Slate, Newborn Nursery Print, and First Dance Vinyl Canvas). Voice & Song Audio Upload (+ live 5s mic recording!) is available on our Voice Soundwave Acrylic Block and First Dance Vinyl Song Canvas!',
      })
    }

    // 3. Adding to Existing Order / Multi-Item Bundle Questions
    if (
      lower.includes('add') ||
      lower.includes('bundle') ||
      lower.includes('existing') ||
      lower.includes('another') ||
      lower.includes('bag') ||
      lower.includes('cart')
    ) {
      return NextResponse.json({
        reply:
          'You can bundle multiple items in two ways: (1) Click "+ Add to Order Bag & Customize Another Item" while designing to combine multiple products into a single checkout, or (2) Visit /track after ordering to add a 2nd copy (25% off), Matching Scented Soy Candle (+$34), or Acrylic Desk Stand (+$49) directly onto your existing order with free combined shipping!',
        actionUrl: '/track',
        actionLabel: 'Add to Existing Order →',
      })
    }

    // 4. Watermark Questions
    if (lower.includes('watermark') || lower.includes('proof')) {
      return NextResponse.json({
        reply:
          'The Guilloché security watermark mesh is shown only on the live browser preview before checkout to protect our studio artwork plates. Your physical keepsake is crafted 100% clean and unwatermarked!',
      })
    }

    // 5. Shipping / Delivery Speed / Gift Questions
    if (
      lower.includes('ship') ||
      lower.includes('long') ||
      lower.includes('deliver') ||
      lower.includes('arrive') ||
      lower.includes('gift')
    ) {
      return NextResponse.json({
        reply:
          'All 12 physical keepsake editions ship FREE from our US studios and arrive in 3–5 business days via tracked USPS/UPS. Every package ships gift-ready with zero retail prices on the packing slip!',
      })
    }

    // 6. Refund / Damaged / Typo Questions
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
          'Every order includes our 100% Damaged-or-Defective Replacement Guarantee (free expedited replacement or full Stripe refund if damaged in transit). Plus, if you spot a typo within 2 hours of ordering, you can fix it yourself instantly on our /track page!',
        actionUrl: '/track',
        actionLabel: 'Go to Order Tracker / Typo Editor →',
      })
    }

    // 7. Discount / Promo Code Questions
    if (
      lower.includes('discount') ||
      lower.includes('promo') ||
      lower.includes('coupon') ||
      lower.includes('code') ||
      lower.includes('sale')
    ) {
      return NextResponse.json({
        reply:
          'You can enter promo code WELCOME15 at Stripe Checkout for 15% off your order—or add a 2nd duplicate copy for grandparents/family at 25% off right inside the customizer!',
      })
    }

    return NextResponse.json({
      reply:
        'I can help you customize any of our 12 physical keepsakes (framed prints, woven blankets, stone slates, acrylic blocks, 3-panel triptychs, and soy candles), bundle items into your Order Bag, or check a live order status (just reply with your checkout email!).',
    })
  } catch {
    return NextResponse.json({
      reply:
        'Our studio concierge is here to help! Enter your email address to track an order, or email ryanb@digital-dads-llc.com for personal assistance.',
    })
  }
}
