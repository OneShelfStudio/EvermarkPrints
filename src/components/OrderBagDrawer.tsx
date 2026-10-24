'use client'

import { useEffect, useState } from 'react'
import { COMPANION_ADD_ONS } from '@/lib/catalog'

export interface BagItem {
  bagItemId: string
  productSlug: string
  sku: string
  printifyProductId: string
  printifyBlueprintId: number
  printifyProviderId: number
  printifyVariantId: number
  title: string
  shortTitle: string
  physicalMedium: string
  variantLabel: string
  colorwayLabel: string
  frameFinishLabel?: string
  headline: string
  subline: string
  locationText: string
  dateText: string
  coordsText: string
  giftNote?: string
  priceUsd: number
  quantity: number
  previewImage: string
}

export type OrderBagItem = BagItem

export const BAG_STORAGE_KEY = 'evermark_order_bag_v5'
export const BAG_EVENT_NAME = 'evermark-bag-updated'

export function getStoredBag(): BagItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(BAG_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const loadStoredBag = getStoredBag

export function saveStoredBag(items: BagItem[], openDrawer = false) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(
      new CustomEvent(BAG_EVENT_NAME, { detail: { openDrawer } })
    )
  } catch {
    // ignore storage quota errors
  }
}

export default function OrderBagDrawer() {
  const [bagItems, setBagItems] = useState<BagItem[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setBagItems(getStoredBag())

    function handleBagUpdate(ev: Event) {
      setBagItems(getStoredBag())
      const customEv = ev as CustomEvent<{ openDrawer?: boolean }>
      if (customEv.detail?.openDrawer) {
        setIsOpen(true)
      }
    }

    window.addEventListener(BAG_EVENT_NAME, handleBagUpdate)
    return () => window.removeEventListener(BAG_EVENT_NAME, handleBagUpdate)
  }, [])

  function handleRemoveItem(bagItemId: string) {
    const next = bagItems.filter((item) => item.bagItemId !== bagItemId)
    setBagItems(next)
    saveStoredBag(next, false)
  }

  function handleQuickAddCompanion(addonId: string) {
    const addon = COMPANION_ADD_ONS.find((a) => a.id === addonId)
    if (!addon) return
    const primary = bagItems[0]
    const newItem: BagItem = {
      bagItemId: `${addon.id}-${Date.now()}`,
      productSlug:
        addon.id === 'addon-amber-candle'
          ? 'custom-book-stack-print'
          : 'custom-soundwave-art',
      sku: addon.sku,
      printifyProductId: addon.printifyProductId,
      printifyBlueprintId: addon.printifyBlueprintId,
      printifyProviderId: addon.printifyProviderId,
      printifyVariantId: addon.printifyVariantId,
      title: addon.shortTitle,
      shortTitle: addon.shortTitle,
      physicalMedium: addon.shortTitle,
      variantLabel: 'Companion Add-On Edition (Matching Inscription)',
      colorwayLabel: primary?.colorwayLabel || 'Warm Archival Cream',
      headline: primary?.headline || 'OUR FAMILY KEEPSAKE',
      subline: primary?.subline || 'Handcrafted in the USA',
      locationText: primary?.locationText || '',
      dateText: primary?.dateText || '',
      coordsText: primary?.coordsText || '',
      priceUsd: addon.priceUsd,
      quantity: 1,
      previewImage: addon.previewImage,
    }
    const next = [...bagItems, newItem]
    setBagItems(next)
    saveStoredBag(next, true)
  }

  const totalCount = bagItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotalUsd = bagItems.reduce(
    (acc, item) => acc + item.priceUsd * item.quantity,
    0
  )

  async function handleCheckoutBag() {
    if (bagItems.length === 0) return
    setIsCheckingOut(true)
    setErrorMsg(null)

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://www.evermarkprints.com'
      const first = bagItems[0]

      const lineItems = bagItems.map((item) => ({
        name: `${item.shortTitle} · ${item.variantLabel}`,
        description: `${item.colorwayLabel}${
          item.frameFinishLabel ? ` | ${item.frameFinishLabel}` : ''
        } | "${item.headline}" (${item.locationText} · ${item.dateText})`,
        amountCents: item.priceUsd * 100,
        quantity: item.quantity,
      }))

      // Compact JSON summary of all physical items for Printify multi-item fulfillment
      const orderItemsSummary = JSON.stringify(
        bagItems
          .filter((b) => !b.sku.endsWith('-VIP-PROOF'))
          .map((b) => ({
            sku: b.sku,
            pid: b.printifyProductId,
            bp: b.printifyBlueprintId,
            pp: b.printifyProviderId,
            vid: b.printifyVariantId,
            qty: b.quantity,
            h: b.headline.slice(0, 40),
          }))
      ).slice(0, 480)

      const returnUrl = `${origin}/success?product=${encodeURIComponent(
        first.productSlug
      )}&items=${bagItems.length}`

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `evermark_bag_${first.sku}`,
          returnUrl,
          collectUsShipping: true,
          lineItems,
          metadata: {
            brand: 'Evermark Prints',
            productSlug: first.productSlug,
            sku: bagItems.map((b) => b.sku).join(',').slice(0, 120),
            printifyBlueprintId: String(first.printifyBlueprintId),
            printifyProviderId: String(first.printifyProviderId),
            printifyVariantId: String(first.printifyVariantId),
            headline: first.headline.slice(0, 120),
            subline: first.subline.slice(0, 180),
            locationText: first.locationText.slice(0, 120),
            dateText: first.dateText.slice(0, 120),
            coordsText: first.coordsText.slice(0, 120),
            giftNote: first.giftNote ? first.giftNote.slice(0, 220) : '',
            orderItemsJson: orderItemsSummary,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Unable to start checkout right now.')
      }

      window.location.href = data.url
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to start checkout.'
      )
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Header Bag Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-2.5 border border-[#CBB89F] bg-[#FDFBF7] hover:border-[#1B3027] text-[#261A13] text-[11px] font-mono-tech uppercase tracking-wider font-semibold transition flex items-center gap-2"
      >
        <span>Order Bag</span>
        <span className="px-1.5 py-0.5 bg-[#1B3027] text-[#F7F4ED] text-[10px] rounded-none">
          {totalCount}
        </span>
      </button>

      {/* Slide-Over Multi-Item Order Bag Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FDFBF7] border-l border-[#CBB89F] h-full flex flex-col justify-between shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 bg-[#1B3027] text-[#F7F4ED] flex items-center justify-between border-b border-[#D8AE64]/30">
              <div>
                <p className="text-[10px] font-mono-tech uppercase tracking-[0.18em] text-[#E5C178]">
                  COMBINED US STUDIO FULFILLMENT
                </p>
                <h2 className="text-xl font-editorial font-semibold">
                  Your Custom Order Bag ({totalCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 border border-white/25 text-xs font-mono-tech uppercase hover:bg-white/10"
              >
                Close ✕
              </button>
            </div>

            {/* Bag Items + Companion Add-Ons */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {bagItems.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-base font-editorial font-semibold text-[#261A13]">
                    Your Order Bag is Currently Empty
                  </p>
                  <p className="text-xs text-[#5C4D42] leading-relaxed max-w-xs mx-auto">
                    Personalize any framed print, woven blanket, chiseled stone slate, or acrylic stand and click &ldquo;+ Add to Order Bag&rdquo; to bundle multiple items in one order.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {bagItems.map((item) => (
                      <div
                        key={item.bagItemId}
                        className="p-3.5 bg-[#F6EFE4] border border-[#D8C9B6] flex gap-3.5 items-start"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewImage}
                          alt={item.shortTitle}
                          className="w-16 h-16 object-cover border border-[#CBB89F] bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[#261A13] leading-snug">
                              {item.shortTitle}
                            </p>
                            <span className="text-xs font-semibold text-[#1B3027] shrink-0">
                              ${item.priceUsd * item.quantity}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C4D42] leading-tight">
                            {item.variantLabel}
                          </p>
                          <p className="text-[11px] font-mono-tech text-[#7A331E] truncate">
                            &ldquo;{item.headline}&rdquo;
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] font-mono-tech text-[#6E5A4C]">
                              Qty: {item.quantity} · Free US Shipping
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.bagItemId)}
                              className="text-[10px] text-rose-800 underline font-mono-tech"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Companion Add-Ons to Existing Bag */}
                  <div className="pt-3 border-t border-[#D8C9B6] space-y-2.5">
                    <p className="text-[10px] font-mono-tech uppercase tracking-[0.16em] text-[#9E472A] font-semibold">
                      ADD A MATCHING KEEPSAKE TO THIS ORDER (FREE COMBINED SHIPPING):
                    </p>
                    {COMPANION_ADD_ONS.map((addon) => (
                      <div
                        key={addon.id}
                        className="p-3 bg-[#FDFBF7] border border-[#D8C9B6] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={addon.previewImage}
                            alt={addon.shortTitle}
                            className="w-11 h-11 object-cover border border-[#CBB89F] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#261A13] truncate">
                              {addon.shortTitle}
                            </p>
                            <p className="text-[10px] text-[#5C4D42]">
                              +${addon.priceUsd}{' '}
                              <span className="line-through text-[#8C7A6B]">
                                ${addon.compareAtUsd}
                              </span>{' '}
                              · Matching Inscription
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickAddCompanion(addon.id)}
                          className="px-2.5 py-1.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-5 bg-[#F3E9DA] border-t border-[#CBB89F] space-y-3">
              {errorMsg && (
                <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2">
                  {errorMsg}
                </p>
              )}
              <div className="flex items-center justify-between text-sm font-semibold text-[#261A13]">
                <span>Combined Order Subtotal (Free US Shipping):</span>
                <span className="text-lg">${subtotalUsd}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-3 border border-[#1B3027] bg-[#FDFBF7] text-[#1B3027] text-[11px] font-mono-tech uppercase tracking-wider font-semibold"
                >
                  + Add More Items
                </button>
                <button
                  type="button"
                  disabled={bagItems.length === 0 || isCheckingOut}
                  onClick={handleCheckoutBag}
                  className="py-3 px-3 bg-[#1B3027] hover:bg-[#264437] disabled:opacity-50 text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-wider font-semibold"
                >
                  {isCheckingOut ? 'Opening Stripe...' : `Checkout (${totalCount}) →`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
