export type PrintArtworkMode =
  | 'starmap'
  | 'soundwave'
  | 'coordinates'
  | 'pet_memorial'
  | 'patent_blueprint'
  | 'coastal_chart'

export type ColorwayId = 'midnight_gold' | 'linen_espresso' | 'obsidian_silver' | 'coastal_navy'

export interface ColorwayOption {
  id: ColorwayId
  label: string
  bgHex: string
  cardHex: string
  inkHex: string
  accentHex: string
  mutedHex: string
}

export const COLORWAYS: ColorwayOption[] = [
  {
    id: 'midnight_gold',
    label: 'Midnight Navy & Warm Gold',
    bgHex: '#0a101d',
    cardHex: '#070b14',
    inkHex: '#f7f4ef',
    accentHex: '#e5b869',
    mutedHex: '#94a3b8',
  },
  {
    id: 'linen_espresso',
    label: 'Archival Warm Linen & Espresso',
    bgHex: '#f5f0e6',
    cardHex: '#ebe4d5',
    inkHex: '#1c1917',
    accentHex: '#854d0e',
    mutedHex: '#57534e',
  },
  {
    id: 'obsidian_silver',
    label: 'Obsidian Matte & Brushed Silver',
    bgHex: '#111318',
    cardHex: '#090a0d',
    inkHex: '#f8fafc',
    accentHex: '#cbd5e1',
    mutedHex: '#64748b',
  },
  {
    id: 'coastal_navy',
    label: 'Atlantic Deep Slate & Chalk',
    bgHex: '#0c1f2e',
    cardHex: '#071520',
    inkHex: '#f0f9ff',
    accentHex: '#7dd3fc',
    mutedHex: '#94a3b8',
  },
]

export interface FormatTier {
  id: string
  label: string
  subtitle: string
  priceUsd: number
  compareAtUsd?: number
  badge?: string
  isPhysical: boolean
  freeShipping?: boolean
}

export const FORMAT_TIERS: FormatTier[] = [
  {
    id: 'framed-16x20',
    label: '16" × 20" Museum-Framed Gallery Canvas',
    subtitle: 'Solid wood float frame · Ready to hang · Free US Tracked Shipping (3–5 Days)',
    priceUsd: 79,
    compareAtUsd: 105,
    badge: 'Most Popular · Free US Ship',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'framed-24x36',
    label: '24" × 36" Exhibition Statement Framed Canvas',
    subtitle: 'Large-format centerpiece · Solid wood frame · Free Priority US Shipping',
    priceUsd: 119,
    compareAtUsd: 155,
    badge: 'Statement Size',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'two-print-gift-set',
    label: '2-Print Heirloom Gift Set (Two 16" × 20" Framed Canvases)',
    subtitle: 'Keep one, gift one to family — Save $29 + Free Priority US Shipping',
    priceUsd: 129,
    compareAtUsd: 158,
    badge: 'Best Gift Value · Save $29',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'digital-300dpi',
    label: 'Instant 300 DPI Archival Digital Print Master',
    subtitle: 'Immediate high-resolution download · Print locally at any size today',
    priceUsd: 29,
    compareAtUsd: 45,
    badge: 'Instant Download',
    isPhysical: false,
  },
]

export const DIGITAL_BACKUP_BUMP = {
  title: 'Add the Instant 300 DPI Digital Master File (+$14)',
  priceUsd: 14,
  compareAtUsd: 29,
  description:
    'Receive an instant high-resolution digital download of your custom artwork immediately upon checkout—great for phone wallpapers, sharing with family, or printing extra desk copies.',
}

export interface EvermarkProduct {
  slug: string
  sku: string
  mode: PrintArtworkMode
  title: string
  shortTitle: string
  subtitle: string
  badge: string
  startingPriceUsd: number
  popularPriceUsd: number
  description: string
  defaultHeadline: string
  defaultSubline: string
  defaultLocation: string
  defaultDateText: string
  defaultCoords: string
  highlights: string[]
  reviews: {
    author: string
    location: string
    title: string
    body: string
    formatPurchased: string
  }[]
}

export const EVERMARK_CATALOG: EvermarkProduct[] = [
  {
    slug: 'custom-star-map',
    sku: 'EVM-STAR-01',
    mode: 'starmap',
    title: 'The Exact Night Sky Custom Star Map',
    shortTitle: 'Custom Night Sky Star Map',
    subtitle: 'Astronomical Constellation Chart Plotted to the Exact Date, Time & Place Your Story Changed',
    badge: '#1 Best-Selling Anniversary & Birth Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Whether it was the night you met, the minute your child was born, or the evening you said "I do," the stars overhead formed a pattern that will never repeat again. Enter your date and location below to watch our astronomical coordinate engine plot your exact night sky in real time.',
    defaultHeadline: 'THE NIGHT OUR STORY BEGAN',
    defaultSubline: 'Underneath these exact stars, everything changed forever.',
    defaultLocation: 'Charleston, South Carolina',
    defaultDateText: 'October 14, 2022 · 9:42 PM',
    defaultCoords: '32.7765° N, 79.9311° W',
    highlights: [
      'Plotted with real astronomical star & constellation coordinates for your date and city',
      'Live interactive preview—see your exact dedication and colorway before you order',
      'Printed on museum-grade archival canvas in the USA and shipped in 3–5 business days',
      'Available as a ready-to-hang framed canvas or an instant 300 DPI digital download',
    ],
    reviews: [
      {
        author: 'Hannah & Luke M.',
        location: 'Nashville, TN',
        title: 'My husband actually teared up when he read the coordinates',
        body: 'I entered the hospital coordinates and the exact minute our daughter was born. Seeing the constellations in warm gold on the midnight canvas is breathtaking.',
        formatPurchased: '16" × 20" Museum-Framed Canvas',
      },
      {
        author: 'Daniel K.',
        location: 'Boston, MA',
        title: 'Arrived in 4 days and looks like a $300 gallery piece',
        body: 'The live preview made it so easy to test different wording. The Linen & Espresso colorway fits our living room perfectly.',
        formatPurchased: '24" × 36" Exhibition Framed Canvas',
      },
    ],
  },
  {
    slug: 'custom-soundwave-art',
    sku: 'EVM-WAVE-02',
    mode: 'soundwave',
    title: 'The Custom Voice & Song Acoustic Waveform Print',
    shortTitle: 'Custom Voice & Song Waveform Print',
    subtitle: 'Turn a First Dance Song, Child’s Laughter, or Loved One’s Voice Note Into Framed Archival Art',
    badge: 'Most Emotional Keepsake',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Some voices and songs deserve to be seen every day. Type the title of your wedding song, a baby’s first words, or a cherished voicemail—or use our live microphone/audio analyzer to shape a one-of-a-kind acoustic waveform rendered in crisp architectural lines.',
    defaultHeadline: 'ALWAYS IN OUR HEARTS',
    defaultSubline: '“I love you to the moon and back” · Recorded Voice Note',
    defaultLocation: 'Acoustic Harmonic Profile · 44.1 kHz Archival Master',
    defaultDateText: 'Forever Remembered',
    defaultCoords: '00:00 —————————●———— 00:18',
    highlights: [
      'Precision harmonic waveform geometry with clean Swiss archival typography',
      'Customize every line of text, timestamp, and colorway with instant live preview',
      'Crafted on heavyweight matte canvas with solid wood float framing in the USA',
      'Zero sizing guesswork—ships ready to hang in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Claire R.',
        location: 'Charlotte, NC',
        title: 'Used the audio from my dad’s old voicemail',
        body: 'Ordered the 2-Print Gift Set—one for my house and one for my sister. We both cried opening it. Thank you for making something so dignified.',
        formatPurchased: '2-Print Heirloom Gift Set',
      },
    ],
  },
  {
    slug: 'custom-coordinates-print',
    sku: 'EVM-COORD-03',
    mode: 'coordinates',
    title: 'The Architectural Latitude & Hometown Coordinate Print',
    shortTitle: 'Custom Latitude & Coordinate Print',
    subtitle: 'Minimalist Topographic & Compass Meridian Print Celebrating a First Home, Lake House, or Hometown',
    badge: 'Top Housewarming & Realtor Closing Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Celebrate the exact place where your family’s roots were planted. Our Latitude & Coordinate print pairs architectural meridian rings and topographic lines with the exact GPS coordinates, address, and established year of your first home, family cabin, or favorite coastline.',
    defaultHeadline: 'THE BEDISEE FAMILY HOME',
    defaultSubline: 'Where loud mornings, warm dinners, and lifelong memories are made.',
    defaultLocation: 'Providence, Rhode Island',
    defaultDateText: 'Established 2019',
    defaultCoords: '41.8240° N · 71.4128° W',
    highlights: [
      'Clean architectural compass & topographic ring geometry that fits any modern home',
      'Favorite closing gift for homeowners, newlyweds, and milestone anniversaries',
      'Four timeless archival color palettes (Warm Linen, Midnight Gold, Obsidian, Coastal)',
      'Printed & framed in the USA with 3–5 business day tracked delivery',
    ],
    reviews: [
      {
        author: 'Megan S.',
        location: 'Denver, CO',
        title: 'Bought this for our first house!',
        body: 'Hangs right in our entryway. Every guest who walks in comments on the coordinates and the clean linen typography.',
        formatPurchased: '16" × 20" Museum-Framed Canvas',
      },
    ],
  },
  {
    slug: 'custom-pet-memorial',
    sku: 'EVM-PET-04',
    mode: 'pet_memorial',
    title: 'The Heirloom Pet Tribute & Line-Art Keepsake',
    shortTitle: 'Custom Pet Tribute & Keepsake Print',
    subtitle: 'Dignified Architectural Line-Art & Custom Inscription Honoring a Loyal Companion',
    badge: 'Highest-Rated Sympathy & Pet Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Honor a loyal dog or cat with a quiet, museum-quality tribute that never looks like a generic novelty gift. Featuring fine-line architectural contours, your companion’s name, years, and your personal favorite memory.',
    defaultHeadline: 'COOPER',
    defaultSubline: 'The best boy on every trail, every morning walk, and every quiet evening.',
    defaultLocation: 'Loyal Companion & Family Guardian',
    defaultDateText: '2012 – 2026',
    defaultCoords: 'Forever By Our Side',
    highlights: [
      'Understated fine-line artwork paired with classic gallery serif typography',
      'Thoughtful, deeply appreciated sympathy gift for friends or family who lost a pet',
      'Includes instant live preview so you can perfect every word of the tribute',
      'Ships from US archival print labs in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Mark & Jenna T.',
        location: 'Austin, TX',
        title: 'So tasteful and comforting',
        body: 'When we lost our 13-year-old Golden, we wanted something warm and classic for the study. This print is understated and means the world to us.',
        formatPurchased: '16" × 20" Museum-Framed Canvas',
      },
    ],
  },
  {
    slug: 'patent-architectural-triptych',
    sku: 'EVM-PAT-05',
    mode: 'patent_blueprint',
    title: 'Custom Engineer’s Patent & Architectural Blueprint Print',
    shortTitle: 'Custom Patent & Blueprint Print',
    subtitle: 'Precision Mechanical & Horological Draftsmanship Personalized With Your Name, Patent Title & Date',
    badge: 'Top Office & Study Upgrade',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Designed for builders, engineers, musicians, and founders. Combines classic mechanical cross-section draftsmanship with your custom title, studio name, or milestone date in crisp technical lettering.',
    defaultHeadline: 'CHRONOGRAPH ESCAPEMENT MECHANISM',
    defaultSubline: 'Precision Mechanical Timekeeping Assembly · Sheet 1 of 1',
    defaultLocation: 'United States Patent & Archival Registry',
    defaultDateText: 'Filed October 21, 2026',
    defaultCoords: 'FIG. 1A — ISOMETRIC CROSS-SECTION',
    highlights: [
      'Authentic technical blueprint grid, callout vectors, and title block',
      'Personalize the patent title, inventor/founder name, and filing date',
      'Looks incredible above a walnut desk, home library, or studio workstation',
      'Framed in the USA and delivered in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Greg V.',
        location: 'Seattle, WA',
        title: 'Best addition to my home office',
        body: 'Put my company founding date in the title block. Looks sharp behind me on every Zoom call.',
        formatPurchased: '24" × 36" Exhibition Framed Canvas',
      },
    ],
  },
  {
    slug: 'coastal-bathymetry-chart',
    sku: 'EVM-COAST-06',
    mode: 'coastal_chart',
    title: 'Custom Coastal Depth & Nautical Harbor Chart Print',
    shortTitle: 'Custom Coastal & Nautical Chart Print',
    subtitle: 'Bathymetric Depth Contours, Compass Rose & Custom Harbor Coordinates',
    badge: 'Coastal Home Favorite',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    description:
      'Bring your favorite shoreline, bay, or sailing harbor onto your wall. Our bathymetric contour engine renders layered ocean depth rings, a classic 32-point mariner’s compass rose, and your custom beach, island, or harbor coordinates.',
    defaultHeadline: 'NANTUCKET SOUND & ATLANTIC SHOALS',
    defaultSubline: 'Bathymetric Depth Contours & Mariner’s Compass Rose',
    defaultLocation: 'New England Coastal Survey',
    defaultDateText: 'Soundings in Fathoms · Mean Low Water',
    defaultCoords: '41.2835° N · 70.0995° W',
    highlights: [
      'Layered coastal depth contours with mariner’s compass rose and custom harbor title',
      'Customize for any US beach, lake, bay, or island destination',
      'Available in Atlantic Deep Slate, Warm Linen, Midnight Gold, or Obsidian',
      'Ships in 3–5 business days from US domestic print studios',
    ],
    reviews: [
      {
        author: 'Lauren P.',
        location: 'Newport, RI',
        title: 'Looks stunning in our coastal hallway',
        body: 'Customized it with the exact coordinates of the beach where we got engaged in Rhode Island. The Atlantic Slate colorway is gorgeous.',
        formatPurchased: '16" × 20" Museum-Framed Canvas',
      },
    ],
  },
]

export function getEvermarkProductBySlug(slug: string): EvermarkProduct | undefined {
  return EVERMARK_CATALOG.find((p) => p.slug === slug)
}
