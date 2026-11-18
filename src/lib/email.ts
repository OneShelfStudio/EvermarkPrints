/**
 * Evermark Prints Order Notification Engine
 * Sends automated studio alert emails to ryanb@digital-dads-llc.com
 * and order confirmation emails to customers via Resend REST API.
 */

interface OrderNotificationData {
  orderId: string
  customerName: string
  customerEmail: string
  productTitle: string
  formatLabel: string
  amountUsd: number
  headline: string
  subline: string
  locationText: string
  dateText: string
  coordsText: string
  giftNote?: string
  shippingAddress?: {
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postal_code?: string | null
    country?: string | null
  } | null
  printifyOrderId?: string | null
  masterRenderUrl: string
  customizeLater?: boolean
}

export async function sendOrderAlertEmail(data: OrderNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.STUDIO_ALERT_EMAIL || 'ryanb@digital-dads-llc.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Evermark Studio <orders@evermarkprints.com>'

  const addrStr = data.shippingAddress
    ? `${data.shippingAddress.line1 || ''} ${data.shippingAddress.line2 || ''}, ${
        data.shippingAddress.city || ''
      }, ${data.shippingAddress.state || ''} ${data.shippingAddress.postal_code || ''}, ${
        data.shippingAddress.country || 'US'
      }`.trim()
    : 'Standard US Delivery'

  const ownerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FCFBF8; border: 1px solid #DDD5C7; padding: 32px; color: #261A13;">
      <div style="border-bottom: 2px solid #1B3027; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E472A; font-weight: 600;">NEW BESPOKE ORDER CONFIRMED</span>
        <h1 style="font-size: 26px; margin: 6px 0 0; color: #1B3027;">Evermark Prints Order Alert</h1>
      </div>

      <div style="background: #F3EFE6; border: 1px solid #DDD5C7; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Order ID:</strong> ${data.orderId}</p>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Total Paid:</strong> $${data.amountUsd.toFixed(2)} USD</p>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Edition:</strong> ${data.productTitle} - ${data.formatLabel}</p>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Ship To:</strong> ${addrStr}</p>
        <p style="margin: 0; font-size: 14px; color: ${data.customizeLater ? '#9E472A' : '#1B3027'};"><strong>Mode:</strong> ${data.customizeLater ? 'HOLD FOR CUSTOMER PERSONALIZATION (Customize Later Selected)' : 'Immediate Studio Production'}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1B3027; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #DDD5C7; padding-bottom: 8px;">Custom Inscription Details</h2>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Headline:</strong> ${data.headline || '(None)'}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Subline:</strong> ${data.subline || '(None)'}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Location:</strong> ${data.locationText || '(None)'}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Date:</strong> ${data.dateText || '(None)'}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Coordinates:</strong> ${data.coordsText || '(None)'}</p>
        ${data.giftNote ? `<p style="margin: 8px 0; font-size: 14px;"><strong>Gift Note:</strong> ${data.giftNote}</p>` : ''}
      </div>

      <div style="background: #1B3027; color: #F7F4ED; padding: 16px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0 0 10px; font-size: 13px;">Printify Order ID: ${data.printifyOrderId || 'Auto-Queued'}</p>
        <a href="${data.masterRenderUrl}" style="display: inline-block; background: #D8AE64; color: #1B3027; text-decoration: none; padding: 10px 18px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">View Master Vector Artwork →</a>
      </div>

      <div style="font-size: 11px; color: #7A6F63; text-align: center;">
        Evermark Prints · A Division of Digital Dads LLC · <a href="https://www.evermarkprints.com" style="color: #9E472A;">evermarkprints.com</a>
      </div>
    </div>
  `

  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FCFBF8; border: 1px solid #DDD5C7; padding: 32px; color: #261A13;">
      <div style="border-bottom: 2px solid #1B3027; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E472A; font-weight: 600;">COMMISSION VERIFIED · US ARCHIVAL PRESS</span>
        <h1 style="font-size: 26px; margin: 6px 0 0; color: #1B3027;">Thank You for Your Order</h1>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">Hello ${data.customerName || 'Collector'},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #4A3B31;">
        Your custom keepsake order has been received and locked into our US studio queue. Our craftsmen will strike your bespoke piece on museum materials and prepare your shipment.
      </p>

      <div style="background: #F3EFE6; border: 1px solid #DDD5C7; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E472A; font-weight: bold;">Order Reference</p>
        <p style="margin: 0 0 12px; font-size: 16px; font-weight: bold; color: #1B3027;">${data.productTitle} (${data.formatLabel})</p>
        <p style="margin: 0 0 6px; font-size: 13px;"><strong>Headline:</strong> "${data.headline}"</p>
        <p style="margin: 0 0 6px; font-size: 13px;"><strong>Location & Date:</strong> ${data.locationText} · ${data.dateText}</p>
        <p style="margin: 0; font-size: 13px;"><strong>Delivery Destination:</strong> ${addrStr}</p>
      </div>

      <div style="background: #FAF6F0; border-left: 4px solid #1B3027; padding: 14px 18px; margin-bottom: 24px;">
        <p style="margin: 0 0 6px; font-size: 13px; font-weight: bold; color: #1B3027;">${data.customizeLater ? 'Your 1-Click Personalization Link & Proof' : 'Spot a typo? 2-Hour Proof Window Active'}</p>
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #5C4D42;">
          ${data.customizeLater
            ? 'Whenever you have your exact names, dates, or quotes ready, click the button below to personalize your keepsake and preview your live proof before we strike your order.'
            : 'You can edit your custom wording directly on our live tracking page within 2 hours of checkout before your piece goes to press.'}
        </p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://www.evermarkprints.com/track?q=${encodeURIComponent(data.orderId)}&edit=1" style="display: inline-block; background: #1B3027; color: #F7F4ED; text-decoration: none; padding: 12px 24px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em;">${data.customizeLater ? 'Personalize Your Wording & View Live Proof →' : 'Track Order & Edit Wording (2-Hour Proof Window) →'}</a>
      </div>

      <div style="border-top: 1px solid #DDD5C7; padding-top: 16px; font-size: 12px; color: #7A6F63; text-align: center;">
        Complimentary Tracked US Delivery (3 to 5 business days).<br />
        Questions? Reply to this email or contact us at <a href="mailto:concierge@evermarkprints.com" style="color: #9E472A;">concierge@evermarkprints.com</a>.
      </div>
    </div>
  `

  if (!apiKey) {
    console.log(
      `[Evermark Email Notice] RESEND_API_KEY not configured. Order notification logged: Order ${data.orderId} for ${data.customerEmail} ($${data.amountUsd})`
    )
    return { sent: false, reason: 'RESEND_API_KEY not set' }
  }

  try {
    // 1. Send studio alert email to owner
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [ownerEmail],
        subject: `[New Evermark Order] $${data.amountUsd.toFixed(2)} - ${data.productTitle} (${data.customerName || 'Customer'})`,
        html: ownerHtml,
      }),
    })

    // 2. Send customer confirmation email
    if (data.customerEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [data.customerEmail],
          subject: `Your Evermark Prints Commission is Confirmed (${data.orderId.slice(0, 16)})`,
          html: customerHtml,
        }),
      })
    }

    return { sent: true }
  } catch (err) {
    console.error('[Evermark Email Send Error]:', err)
    return { sent: false, error: err }
  }
}

export interface ShipmentNotificationData {
  orderId: string
  customerEmail: string
  customerName?: string
  productTitle?: string
  formatLabel?: string
  trackingCarrier: string
  trackingNumber: string
  trackingUrl: string
}

export async function sendShipmentNotificationEmail(data: ShipmentNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.STUDIO_ALERT_EMAIL || 'ryanb@digital-dads-llc.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Evermark Studio <orders@evermarkprints.com>'

  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FCFBF8; border: 1px solid #DDD5C7; padding: 32px; color: #261A13;">
      <div style="border-bottom: 2px solid #1B3027; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #9E472A; font-weight: 600;">US ARCHIVAL DISPATCH · TRACKING ASSIGNED</span>
        <h1 style="font-size: 26px; margin: 6px 0 0; color: #1B3027;">Your Custom Keepsake Has Shipped</h1>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">Hello ${data.customerName || 'Collector'},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #4A3B31;">
        Great news—your custom handcrafted keepsake has completed press and quality inspection at our US studio and has been handed over to ${data.trackingCarrier} for delivery.
      </p>

      <div style="background: #F3EFE6; border: 1px solid #DDD5C7; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E472A; font-weight: bold;">Shipment Details</p>
        <p style="margin: 0 0 10px; font-size: 15px; font-weight: bold; color: #1B3027;">Carrier: ${data.trackingCarrier}</p>
        <p style="margin: 0 0 10px; font-size: 14px; font-family: monospace; color: #261A13;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
        <p style="margin: 0; font-size: 13px; color: #6E6256;">Edition: ${data.productTitle || 'Custom Keepsake'} ${data.formatLabel ? `(${data.formatLabel})` : ''}</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${data.trackingUrl || `https://www.evermarkprints.com/track?q=${encodeURIComponent(data.orderId)}`}" style="display: inline-block; background: #1B3027; color: #F7F4ED; text-decoration: none; padding: 12px 26px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; border-radius: 4px;">Track Delivery Online →</a>
      </div>

      <div style="background: #FAF6F0; border-left: 4px solid #1B3027; padding: 14px 18px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #5C4D42;">
          You can also check your live order and delivery status anytime on our website at <a href="https://www.evermarkprints.com/track" style="color: #9E472A; font-weight: bold;">evermarkprints.com/track</a>.
        </p>
      </div>

      <div style="border-top: 1px solid #DDD5C7; padding-top: 16px; font-size: 12px; color: #7A6F63; text-align: center;">
        Handcrafted with pride in the United States.<br />
        Questions or special instructions? Reply directly to this email or reach us at <a href="mailto:concierge@evermarkprints.com" style="color: #9E472A;">concierge@evermarkprints.com</a>.
      </div>
    </div>
  `

  const ownerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; background: #FAF6F0; color: #261A13;">
      <h2 style="color: #1B3027; margin-top: 0;">Evermark Order Dispatched</h2>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Customer:</strong> ${data.customerName || 'Customer'} (${data.customerEmail})</p>
      <p><strong>Carrier:</strong> ${data.trackingCarrier}</p>
      <p><strong>Tracking Number:</strong> <a href="${data.trackingUrl}">${data.trackingNumber}</a></p>
      <p><strong>Live Tracking Portal:</strong> <a href="https://www.evermarkprints.com/track?q=${encodeURIComponent(data.orderId)}">View On Evermark</a></p>
    </div>
  `

  if (!apiKey) {
    console.log(
      `[Evermark Shipment Notice] RESEND_API_KEY not configured. Dispatched: Order ${data.orderId} via ${data.trackingCarrier} (${data.trackingNumber}) to ${data.customerEmail}`
    )
    return { sent: false, reason: 'RESEND_API_KEY not set' }
  }

  try {
    // 1. Send customer dispatch email
    if (data.customerEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [data.customerEmail],
          subject: `Your Evermark Prints Keepsake Has Shipped! (${data.trackingCarrier} Tracking Inside)`,
          html: customerHtml,
        }),
      })
    }

    // 2. Alert store owner
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [ownerEmail],
        subject: `[Order Dispatched] ${data.trackingCarrier} ${data.trackingNumber} - ${data.customerName || data.orderId}`,
        html: ownerHtml,
      }),
    })

    return { sent: true }
  } catch (err) {
    console.error('[Evermark Shipment Email Error]:', err)
    return { sent: false, error: err }
  }
}
