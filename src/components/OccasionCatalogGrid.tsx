'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EVERMARK_CATALOG, EvermarkProduct } from '@/lib/catalog'

type OccasionFilter =
  | 'all'
  | 'anniversary'
  | 'mom_grandma'
  | 'housewarming'
  | 'pet_memorial'
  | 'newborn'

const OCCASION_TABS: {
  id: OccasionFilter
  label: string
  countLabel: string
  matches: (item: EvermarkProduct) => boolean
}[] = [
  {
    id: 'all',
    label: 'All 12 Keepsakes',
    countLabel: '12',
    matches: () => true,
  },
  {
    id: 'anniversary',
    label: 'Anniversary & Couples',
    countLabel: '6',
    matches: (item) =>
      [
        'custom-star-map',
        'custom-soundwave-art',
        'custom-vinyl-record-lyrics',
        'met-engaged-married-triptych',
        'custom-coastal-nautical-chart',
        'custom-marathon-route-map',
      ].includes(item.slug),
  },
  {
    id: 'mom_grandma',
    label: 'Gifts for Mom & Grandma',
    countLabel: '4',
    matches: (item) =>
      [
        'family-tree-botanical-print',
        'custom-book-stack-print',
        'custom-coordinates-print',
        'custom-star-map',
      ].includes(item.slug),
  },
  {
    id: 'housewarming',
    label: 'Housewarming & First Home',
    countLabel: '4',
    matches: (item) =>
      [
        'custom-coordinates-print',
        'custom-book-stack-print',
        'custom-coastal-nautical-chart',
        'vintage-patent-blueprint-art',
      ].includes(item.slug),
  },
  {
    id: 'pet_memorial',
    label: 'Pet Loss & Dog/Cat Tribute',
    countLabel: '2',
    matches: (item) =>
      ['custom-pet-memorial', 'custom-book-stack-print'].includes(item.slug),
  },
  {
    id: 'newborn',
    label: 'Newborn & Nursery',
    countLabel: '3',
    matches: (item) =>
      [
        'newborn-birth-stat-portrait',
        'custom-star-map',
        'family-tree-botanical-print',
      ].includes(item.slug),
  },
]

const COLLECTOR_ROOM_NOTES = [
  {
    id: 'room-1',
    collector: 'Hannah & Lucas M.',
    location: 'Charleston, SC',
    occasion: '5th Wood Anniversary Gift',
    productTitle: 'Custom Night Sky Star Map (24×36" Walnut Frame)',
    productSlug: 'custom-star-map',
    mockupImage: '/mockups/custom-star-map-2.webp',
    quote:
      'We hung the 24x36 Walnut Star Map above our fireplace for our 5th anniversary. The constellation lines for the night we met in Charleston look like an authentic observatory plate.',
  },
  {
    id: 'room-2',
    collector: 'Caroline V.',
    location: 'Austin, TX',
    occasion: 'Mother’s Day Gift for Nana',
    productTitle: 'Family Birth Flower Bouquet Woven Throw Blanket',
    productSlug: 'family-tree-botanical-print',
    mockupImage: '/mockups/family-tree-botanical-print-1.webp',
    quote:
      'My mom cried the second she unfolded the woven cotton blanket and saw all five grandkids’ names with their exact birth month flowers. The jacquard weave and fringe are heirloom quality.',
  },
  {
    id: 'room-3',
    collector: 'Marcus & Elena R.',
    location: 'Denver, CO',
    occasion: 'First Wedding Dance Keepsake',
    productTitle: 'Voice & Song Waveform Crystal Acrylic Block',
    productSlug: 'custom-soundwave-art',
    mockupImage: '/mockups/custom-soundwave-art-1.webp',
    quote:
      'Scanning the QR code on the acrylic block with my phone and immediately hearing our wedding vows and first dance song made our whole family tear up. Truly unforgettable.',
  },
  {
    id: 'room-4',
    collector: 'David K.',
    location: 'Seattle, WA',
    occasion: 'Beloved Golden Retriever Tribute',
    productTitle: 'Watercolor Pet Portrait Natural Birch Wood Plaque',
    productSlug: 'custom-pet-memorial',
    mockupImage: '/mockups/custom-pet-memorial-1.webp',
    quote:
      'Uploading Cooper’s photo into the birch wood ornament plaque was effortless. The warm watercolor edge feathering around his portrait looks hand-painted.',
  },
]

export default function OccasionCatalogGrid() {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionFilter>('all')

  const activeTab =
    OCCASION_TABS.find((t) => t.id === selectedOccasion) || OCCASION_TABS[0]
  const filteredCatalog = EVERMARK_CATALOG.filter(activeTab.matches)

  return (
    <div className="space-y-20">
      {/* Curated Gallery Catalog with Interactive Occasion Filter */}
      <section id="collection" className="space-y-8 border-t border-[#CBB89F] pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#9E472A] font-semibold">
              SHOP BY OCCASION OR RECIPIENT · 12 BESPOKE PHYSICAL EDITIONS
            </p>
            <h2 className="text-3xl sm:text-5xl font-editorial font-semibold text-[#261A13]">
              Explore Our Twelve Custom Keepsakes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D42] max-w-md">
            Filter by milestone below or browse all 12 American-crafted editions. Every piece includes live canvas previewing and complimentary 3 to 5 day US delivery.
          </p>
        </div>

        {/* Occasion Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {OCCASION_TABS.map((tab) => {
            const isActive = tab.id === selectedOccasion
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedOccasion(tab.id)}
                className={`px-4 py-2.5 text-xs font-mono-tech uppercase tracking-[0.12em] border transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1B3027] text-[#F7F4ED] border-[#1B3027] shadow-sm'
                    : 'bg-[#FDFBF7] text-[#261A13] border-[#CBB89F] hover:border-[#9E472A]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? 'bg-[#9E472A] text-[#FDFBF7]'
                      : 'bg-[#EFE6D8] text-[#5C4D42]'
                  }`}
                >
                  {tab.countLabel}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalog.map((item) => (
            <article
              key={item.slug}
              className="bg-[#FDFBF7] border border-[#CBB89F] hover:border-[#1B3027] shadow-sm hover:shadow-xl flex flex-col justify-between transition group"
            >
              <div>
                <Link
                  href={`/create/${item.slug}`}
                  className="block aspect-square w-full overflow-hidden bg-[#F5EFE6] border-b border-[#D8C9B6] relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1B3027] text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-[0.14em] shadow">
                    {item.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#261A13]/90 text-[#E5C178] text-[10px] font-mono-tech uppercase tracking-wider">
                    {item.physicalMedium}
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#9E472A] font-semibold">
                    <span>{item.categoryLabel}</span>
                    <span className="text-[#1B3027]">★★★★★ 4.9</span>
                  </div>

                  <Link href={`/create/${item.slug}`}>
                    <h3 className="text-2xl font-editorial font-semibold text-[#261A13] group-hover:text-[#9E472A] transition">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#5C4D42] leading-relaxed">
                    {item.description}
                  </p>

                  <p className="text-[11px] font-mono-tech text-[#7A6858] pt-1">
                    {item.paperSpec}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#F3E9DA] border-t border-[#D8C9B6] flex items-center justify-between gap-4">
                <div>
                  <span className="text-base font-semibold text-[#261A13] block">
                    From ${item.startingPriceUsd} Physical Edition
                  </span>
                  <span className="text-[11px] text-[#6E5A4C] block">
                    Most Popular Size: ${item.popularPriceUsd} · Free US Shipping
                  </span>
                </div>

                <Link
                  href={`/create/${item.slug}`}
                  className="px-4 py-2.5 bg-[#1B3027] hover:bg-[#264437] text-[#F7F4ED] text-[11px] font-mono-tech uppercase tracking-[0.14em] font-medium transition shrink-0"
                >
                  Customize →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Verified Collector Homes & Unboxings Gallery */}
      <section className="space-y-8 border-t border-[#CBB89F] pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#1B3027] font-semibold">
              VERIFIED US COLLECTOR HOMES · 4.9 / 5.0 STUDIO RATING
            </p>
            <h2 className="text-3xl sm:text-4xl font-editorial font-semibold text-[#261A13]">
              In Living Rooms, Nurseries &amp; Studies Across America
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D42] max-w-md">
            See how families across the United States display their custom framed star maps, woven birth flower blankets, scannable voice acrylic blocks, and pet memorial plaques.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTOR_ROOM_NOTES.map((note) => (
            <div
              key={note.id}
              className="bg-[#FDFBF7] border border-[#CBB89F] flex flex-col justify-between overflow-hidden shadow-sm"
            >
              <div>
                <Link
                  href={`/create/${note.productSlug}`}
                  className="block aspect-square overflow-hidden bg-[#F5EFE6] border-b border-[#D8C9B6] relative group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={note.mockupImage}
                    alt={note.productTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#1B3027]/95 text-[#F7F4ED] text-[10px] font-mono-tech uppercase tracking-wider">
                    {note.occasion}
                  </span>
                </Link>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#9E472A]">
                    <span>★★★★★ VERIFIED BUYER</span>
                    <span>{note.location}</span>
                  </div>
                  <p className="text-xs text-[#261A13] leading-relaxed italic">
                    &ldquo;{note.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#F3E9DA] border-t border-[#D8C9B6] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#261A13] truncate pr-2">
                  {note.collector}
                </span>
                <Link
                  href={`/create/${note.productSlug}`}
                  className="font-mono-tech uppercase tracking-wider text-[#1B3027] hover:text-[#9E472A] underline shrink-0"
                >
                  Design Yours →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
