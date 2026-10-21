'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COMPANION_ADD_ONS } from '@/lib/catalog'
import AdUnit from '@/components/AdUnit'
import type { TrackedOrderRecord } from '@/app/api/orders/lookup/route'

export default function TrackOrderPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [orders, setOrders] = useState<TrackedOrderRecord[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Editing state for orders inside the 2-hour modification window
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editHeadline, setEditHeadline] = useState('')
  const [editSubline, setEditSubline] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCoords, setEditCoords] = useState('')
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)
  const [addingAddOnId, setAddingAddOnId] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setErrorMsg(null)
    setSaveSuccessMsg(null)

    try {
      const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Could not look up orders.')
      }
      setOrders(data.orders || [])
      setSearched(true)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to look up orders.')
    } finally {
      setLoading(false)
    }
  }

  function startEditing(order: TrackedOrderRecord) {
    setEditingOrderId(order.orderId)
    setEditHeadline(order.headline)
    setEditSubline(order.subline)
    setEditLocation(order.locationText)
    setEditDate(order.dateText)
    setEditCoords(order.coordsText)
    setSaveSuccessMsg(null)
  }

  async function handleSaveEdits(orderId: string) {
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          headline: editHeadline,
          subline: editSubline,
          locationText: editLocation,
          dateText: editDate,
          coordsText: editCoords,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Unable to update inscription.')
      }
      setEditingOrderId(null)
      setSaveSuccessMsg(
        'Your inscription has been updated and synced with our US production studio.'
      )
      const r2 = await fetch(`/api/orders/lookup?q=${encodeURIComponent(query.trim())}`)
      const d2 = await r2.json()
      if (d2.orders) setOrders(d2.orders)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save changes.')
    }
  }

  async function handleAddCompanionToExistingOrder(
    order: TrackedOrderRecord,
    addOn: (typeof COMPANION_ADD_ONS)[number]
  ) {
    setAddingAddOnId(`${order.orderId}-${addOn.id}`)
    try {
      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://www.evermarkprints.com'
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `evermark_addon_${addOn.targetProductSlug}`,
          returnUrl: `${origin}/success?product=${encodeURIComponent(
            addOn.targetProductSlug
          )}&addon=1`,
          collectUsShipping: true,
          lineItems: [
            {
              name: `${addOn.title.replace('+ Add ', '')} (Added to Order ${order.orderId.slice(
                0,
                10
              )})`,
              description: `Matching Inscription: "${order.headline}" (${order.locationText} · ${order.dateText})`,
              amountCents: addOn.priceUsd * 100,
              quantity: 1,
            },
          ],
          metadata: {
            brand: 'Evermark Prints',
            parentOrderSessionId: order.orderId.slice(0, 64),
            isExistingOrderAddOn: 'yes',
            productSlug: addOn.targetProductSlug,
            printifyProductId: addOn.printifyProductId,
            printifyBlueprintId: String(addOn.printifyBlueprintId),
            printifyVariantId: String(addOn.printifyVariantId),
            colorwayId: order.colorwayId || 'midnight_gold',
            frameFinishId: order.frameFinishId || 'walnut',
            headline: order.headline.slice(0, 120),
            subline: order.subline.slice(0, 180),
            locationText: order.locationText.slice(0, 120),
            dateText: order.dateText.slice(0, 120),
            coordsText: order.coordsText.slice(0, 120),
          },
        }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setAddingAddOnId(null)
      }
    } catch {
      setAddingAddOnId(null)
    }
  }

  const STAGES = [
    '1. Commission Verified',
    '2. 2-Hour Proof Window',
    '3. Crafting in US Studio',
    '4. Shipped via USPS/UPS',
  ]

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="border-b border-[#D8C9B6] pb-6 space-y-2">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#9E472A] font-semibold">
          LIVE STUDIO STATUS · 2-HOUR PROOF MODIFICATION · ADD ON TO EXISTING ORDER
        </p>
        <h1 className="text-4xl sm:text-5xl font-editorial font-semibold text-[#261A13]">
          Track Your Commission
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4D42]">
          Enter the email address used at checkout (or your Stripe Order Reference{' '}
          <span className="font-mono-tech">cs_live_...</span>) to check live studio production progress, view USPS/UPS tracking links, adjust a typo within 2 hours of ordering, or bundle additional matching keepsakes onto your order.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-[#FDFBF7] border border-[#CBB89F] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your checkout email address (e.g., name@email.com) or Order ID..."
          className="flex-grow border border-[#CBB89F] bg-[#F8F3EA] px-4 py-3 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-[0.16em] font-semibold transition shrink-0"
        >
          {loading ? 'Searching Studio...' : 'Look Up Order →'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-xs text-rose-900">
          {errorMsg}
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-400 text-xs text-emerald-950 font-medium">
          ✓ {saveSuccessMsg}
        </div>
      )}

      {searched && orders.length === 0 && !loading && (
        <div className="bg-[#FDFBF7] border border-[#D8C9B6] p-8 text-center space-y-3">
          <p className="text-xl font-editorial font-semibold text-[#261A13]">
            No Paid Commissions Found for “{query}”
          </p>
          <p className="text-xs text-[#5C4D42] max-w-md mx-auto">
            Please double-check the email address entered during Stripe Checkout, or reach out to our studio concierge at{' '}
            <a
              href="mailto:ryanb@digital-dads-llc.com"
              className="underline text-[#9E472A] font-semibold"
            >
              ryanb@digital-dads-llc.com
            </a>.
          </p>
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="bg-[#FDFBF7] border border-[#CBB89F] p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5D9C5] pb-4">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
                {order.stageLabel}
              </span>
              <h2 className="text-2xl font-editorial font-semibold text-[#261A13]">
                {order.productTitle}
              </h2>
              <p className="text-xs text-[#5C4D42]">
                {order.formatLabel} · Ordered {new Date(order.createdAtIso).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right font-mono-tech text-xs">
              <span className="text-base font-semibold text-[#261A13] block">
                ${order.amountUsd.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#7A6858]">
                Ref: {order.orderId.slice(0, 18)}...
              </span>
            </div>
          </div>

          {/* 4-Stage Visual Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STAGES.map((label, idx) => {
              const stepNum = idx + 1
              const active = stepNum <= order.stageIndex
              return (
                <div
                  key={label}
                  className={`p-3 border text-xs ${
                    active
                      ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027]'
                      : 'bg-[#F8F3EA] text-[#7A6858] border-[#D8C9B6]'
                  }`}
                >
                  <span className="font-mono-tech text-[11px] block">{label}</span>
                </div>
              )
            })}
          </div>

          {/* Clickable USPS/UPS Tracking Banner if Shipped */}
          {order.trackingNumber && (
            <div className="p-4 bg-[#F3E9DA] border border-[#9E472A] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono-tech uppercase text-[#9E472A] font-semibold block">
                  Carrier Tracking Dispatched ({order.trackingCarrier || 'USPS/UPS'})
                </span>
                <span className="font-mono-tech text-sm font-bold text-[#261A13]">
                  Tracking #: {order.trackingNumber}
                </span>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1B3027] text-[#F7F4ED] font-mono-tech uppercase text-[11px]"
                >
                  Track Package Live ↗
                </a>
              )}
            </div>
          )}

          {/* Inscription Summary + 2-Hour Self-Service Typo Editor */}
          <div className="grid sm:grid-cols-12 gap-6 items-center bg-[#F6EFE4] border border-[#D8C9B6] p-5">
            <div className="sm:col-span-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.masterRenderUrl}
                alt={order.headline}
                className="w-40 h-auto border-4 border-[#3B2416] shadow-md bg-[#FDFBF7]"
              />
            </div>

            <div className="sm:col-span-8 space-y-2.5 text-xs text-[#4A3B31]">
              {editingOrderId === order.orderId ? (
                <div className="space-y-2.5">
                  <p className="font-mono-tech uppercase text-[#9E472A] font-semibold">
                    Editing Inscription (Within 2-Hour Window)
                  </p>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-1.5 text-xs text-[#261A13]"
                    placeholder="Primary Title"
                  />
                  <input
                    type="text"
                    value={editSubline}
                    onChange={(e) => setEditSubline(e.target.value)}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-1.5 text-xs text-[#261A13]"
                    placeholder="Dedication / Subtitle"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-1.5 text-xs text-[#261A13]"
                      placeholder="Location"
                    />
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-1.5 text-xs text-[#261A13]"
                      placeholder="Date"
                    />
                  </div>
                  <input
                    type="text"
                    value={editCoords}
                    onChange={(e) => setEditCoords(e.target.value)}
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3 py-1.5 text-xs font-mono-tech text-[#261A13]"
                    placeholder="Coordinates / Bottom Line"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveEdits(order.orderId)}
                      className="px-4 py-2 bg-[#1B3027] text-[#F7F4ED] font-mono-tech uppercase text-[11px]"
                    >
                      Save Updated Inscription
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingOrderId(null)}
                      className="px-3 py-2 border border-[#CBB89F] text-[#5C4D42] text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>
                    <strong className="text-[#261A13]">Headline:</strong> {order.headline}
                  </p>
                  <p>
                    <strong className="text-[#261A13]">Dedication:</strong> {order.subline}
                  </p>
                  <p>
                    <strong className="text-[#261A13]">Place &amp; Date:</strong>{' '}
                    {order.locationText} · {order.dateText}
                  </p>
                  <p>
                    <strong className="text-[#261A13]">Bottom Line / Coordinates:</strong>{' '}
                    <span className="font-mono-tech">{order.coordsText}</span>
                  </p>

                  <div className="pt-3 flex flex-wrap gap-2.5">
                    {order.canEditInscription && (
                      <button
                        type="button"
                        onClick={() => startEditing(order)}
                        className="px-4 py-2 bg-[#9E472A] hover:bg-[#84381F] text-[#FDFBF7] font-mono-tech uppercase text-[11px] transition"
                      >
                        ✎ Fix a Typo ({Math.max(1, 120 - order.minutesSinceOrder)}m Left in Window)
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Add Companion Keepsakes Onto Existing Order */}
          <div className="p-4 bg-[#F3E9DA] border border-[#CBB89F] space-y-3">
            <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9E472A] font-semibold block">
              + ADD MATCHING KEEPSAKE ONTO THIS EXISTING ORDER (FREE COMBINED US SHIPPING):
            </span>
            <div className="grid sm:grid-cols-2 gap-3">
              {COMPANION_ADD_ONS.map((addOn) => {
                const isBusy = addingAddOnId === `${order.orderId}-${addOn.id}`
                return (
                  <div
                    key={addOn.id}
                    className="p-3 bg-[#FDFBF7] border border-[#D8C9B6] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={addOn.previewImage}
                        alt={addOn.title}
                        className="w-11 h-11 object-cover border border-[#D8C9B6] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[#261A13] block truncate">
                          {addOn.title.replace('+ Add ', '')}
                        </span>
                        <span className="text-[11px] text-[#1B3027] font-semibold">
                          +${addOn.priceUsd} (Reg. ${addOn.compareAtUsd})
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleAddCompanionToExistingOrder(order, addOn)}
                      className="px-3 py-2 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider shrink-0"
                    >
                      {isBusy ? 'Adding...' : '+ Add Onto Order'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4">
        <AdUnit slot="4800798822" fallbackVariant="acrylic" />
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/"
          className="text-xs font-mono-tech uppercase tracking-[0.14em] text-[#1B3027] underline underline-offset-4"
        >
          ← Return to Evermark Prints Studio
        </Link>
      </div>
    </div>
  )
}
