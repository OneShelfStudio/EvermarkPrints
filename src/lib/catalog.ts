export type PrintArtworkMode =
  | 'starmap'
  | 'soundwave'
  | 'coordinates'
  | 'pet_memorial'
  | 'patent_blueprint'
  | 'coastal_chart'

export type ColorwayId = 'midnight_gold' | 'linen_espresso' | 'obsidian_silver' | 'coastal_navy'

export type FrameFinishId = 'walnut' | 'matte_black' | 'white_oak'

export interface FrameFinishOption {
  id: FrameFinishId
  label: string
  shortLabel: string
  outerHex: string
  innerHex: string
  lipHex: string
}

export const FRAME_FINISHES: FrameFinishOption[] = [
  {
    id: 'walnut',
    label: 'American Black Walnut',
    shortLabel: 'Walnut',
    outerHex: '#3b261a',
    innerHex: '#563927',
    lipHex: '#281910',
  },
  {
    id: 'matte_black',
    label: 'Gallery Matte Black Ash',
    shortLabel: 'Matte Black',
    outerHex: '#1b1a19',
    innerHex: '#2e2c2a',
    lipHex: '#0f0e0d',
  },
  {
    id: 'white_oak',
    label: 'Kiln-Dried Natural Oak',
    shortLabel: 'Natural Oak',
    outerHex: '#b8946c',
    innerHex: '#cfa97e',
    lipHex: '#967550',
  },
]

export interface ColorwayOption {
  id: ColorwayId
  label: string
  shortLabel: string
  bgHex: string
  cardHex: string
  inkHex: string
  accentHex: string
  mutedHex: string
}

export const COLORWAYS: ColorwayOption[] = [
  {
    id: 'linen_espresso',
    label: 'Warm Cotton Rag & Espresso Ink',
    shortLabel: 'Warm Linen',
    bgHex: '#f5f0e6',
    cardHex: '#ebe4d5',
    inkHex: '#1c1917',
    accentHex: '#7c5329',
    mutedHex: '#57534e',
  },
  {
    id: 'midnight_gold',
    label: 'Celestial Midnight & Burnished Brass',
    shortLabel: 'Midnight & Brass',
    bgHex: '#0b111e',
    cardHex: '#070b14',
    inkHex: '#f7f4ef',
    accentHex: '#d8ae64',
    mutedHex: '#94a3b8',
  },
  {
    id: 'obsidian_silver',
    label: 'Archival Charcoal & Fine Silver',
    shortLabel: 'Obsidian',
    bgHex: '#141518',
    cardHex: '#090a0d',
    inkHex: '#f8fafc',
    accentHex: '#cbd5e1',
    mutedHex: '#94a3b8',
  },
  {
    id: 'coastal_navy',
    label: 'Atlantic Deep Slate & Chalk',
    shortLabel: 'Atlantic Slate',
    bgHex: '#0d2130',
    cardHex: '#071520',
    inkHex: '#f0f9ff',
    accentHex: '#93c5fd',
    mutedHex: '#94a3b8',
  },
]

export interface FormatTier {
  id: string
  label: string
  dimensions: string
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
    label: '16" × 20" Framed Gallery Edition',
    dimensions: '16 × 20 in (40.6 × 50.8 cm)',
    subtitle: 'Handcrafted solid hardwood frame · 310gsm cotton rag · Free US shipping (3–5 days)',
    priceUsd: 79,
    compareAtUsd: 105,
    badge: 'Most Selected',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'framed-24x36',
    label: '24" × 36" Exhibition Statement Frame',
    dimensions: '24 × 36 in (61.0 × 91.4 cm)',
    subtitle: 'Full-scale architectural centerpiece · Solid wood frame · Free Priority US delivery',
    priceUsd: 119,
    compareAtUsd: 155,
    badge: 'Exhibition Scale',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'two-print-gift-set',
    label: 'Two-Print Collector Pair (Two 16" × 20" Frames)',
    dimensions: 'Two 16 × 20 in Framed Editions',
    subtitle: 'Keep one, gift one to family — Save $29 with complimentary Priority US shipping',
    priceUsd: 129,
    compareAtUsd: 158,
    badge: 'Save $29 · Gift Pair',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'digital-300dpi',
    label: 'Instant 300 DPI Archival Print Master',
    dimensions: '300 DPI High-Resolution Master File',
    subtitle: 'Immediate download upon checkout for same-day local framing or gifting',
    priceUsd: 29,
    compareAtUsd: 45,
    badge: 'Immediate Delivery',
    isPhysical: false,
  },
]

export const DIGITAL_BACKUP_BUMP = {
  title: 'Include the 300 DPI Archival Digital Master (+$14)',
  priceUsd: 14,
  compareAtUsd: 29,
  description:
    'Download a print-ready 300 DPI master file immediately after checkout—ideal for sharing with family, phone lockscreens, or printing additional desk copies.',
}

export interface EvermarkProduct {
  slug: string
  sku: string
  plateNumber: string
  categoryLabel: string
  mode: PrintArtworkMode
  defaultColorway: ColorwayId
  defaultFrame: FrameFinishId
  title: string
  shortTitle: string
  subtitle: string
  badge: string
  startingPriceUsd: number
  popularPriceUsd: number
  previewImage: string
  description: string
  paperSpec: string
  defaultHeadline: string
  defaultSubline: string
  defaultLocation: string
  defaultDateText: string
  defaultCoords: string
  presets: {
    label: string
    headline: string
    subline: string
    location: string
    dateText: string
    coords: string
  }[]
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
    plateNumber: 'PLATE NO. 01',
    categoryLabel: 'Celestial Cartography',
    mode: 'starmap',
    defaultColorway: 'midnight_gold',
    defaultFrame: 'walnut',
    title: 'The Exact Night Sky Star Map',
    shortTitle: 'Custom Night Sky Star Map',
    subtitle: 'Astronomical Constellation Chart Plotted to the Exact Date, Hour & Latitude of Your Milestone',
    badge: 'Signature Commission',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-star-map.webp',
    description:
      'Whether it was the evening you met, the minute a child entered the world, or the night you stood under the lights and said "I do," the stars overhead formed a geometry that will never repeat. Our astronomical engine plots your exact sky projection in real time.',
    paperSpec: '310gsm German Etching Cotton Rag · Solid Hardwood Frame',
    defaultHeadline: 'THE NIGHT OUR STORY BEGAN',
    defaultSubline: 'Underneath these exact stars, everything changed forever.',
    defaultLocation: 'Charleston, South Carolina',
    defaultDateText: 'October 14, 2022 · 9:42 PM',
    defaultCoords: '32.7765° N, 79.9311° W',
    presets: [
      {
        label: 'Anniversary / Wedding',
        headline: 'THE NIGHT OUR STORY BEGAN',
        subline: 'Underneath these exact stars, everything changed forever.',
        location: 'Charleston, South Carolina',
        dateText: 'October 14, 2022 · 9:42 PM',
        coords: '32.7765° N, 79.9311° W',
      },
      {
        label: 'Birth of a Child',
        headline: 'CLARA ELIZABETH MONROE',
        subline: 'The sky over Boston the moment we first held you.',
        location: 'Boston, Massachusetts',
        dateText: 'May 19, 2025 · 4:18 AM',
        coords: '42.3601° N, 71.0589° W',
      },
      {
        label: 'Engagement Night',
        headline: 'SHE SAID YES UNDER THESE STARS',
        subline: 'On the cliffs overlooking the Pacific at dusk.',
        location: 'Big Sur, California',
        dateText: 'August 28, 2024 · 8:15 PM',
        coords: '36.2704° N, 121.8081° W',
      },
    ],
    highlights: [
      'Astronomical star positions and constellation vectors calculated for your date and city',
      'Framed in solid American Black Walnut, Matte Gallery Black, or Natural White Oak',
      'Printed on 310gsm acid-free museum cotton rag with archival pigment inks',
      'Complimentary tracked US delivery in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Hannah & Luke M.',
        location: 'Nashville, TN',
        title: 'Looks like it came out of an architectural gallery in SoHo',
        body: 'We entered the hospital coordinates and the exact minute our daughter was born. The American Walnut frame and brass star chart look extraordinary in our nursery.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
      {
        author: 'Daniel K.',
        location: 'Boston, MA',
        title: 'Arrived in 4 days — heavyweight paper and real wood',
        body: 'I was worried it might look like a glossy poster, but the matte cotton paper texture and mitered wood frame look like a $300 bespoke piece.',
        formatPurchased: '24" × 36" Exhibition Statement Frame',
      },
    ],
  },
  {
    slug: 'custom-soundwave-art',
    sku: 'EVM-WAVE-02',
    plateNumber: 'PLATE NO. 02',
    categoryLabel: 'Acoustic Draftsmanship',
    mode: 'soundwave',
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Custom Voice & Song Acoustic Waveform',
    shortTitle: 'Voice & Song Waveform Print',
    subtitle: 'Architectural Harmonic Profile of a First Dance Song, Child’s Laughter, or Cherished Voicemail',
    badge: 'Heirloom Edition',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-soundwave-art.webp',
    description:
      'Some voices and melodies deserve a permanent place on your wall. Enter the lyrics of your wedding song, a baby’s first words, or a saved voicemail inscription to generate a balanced harmonic bar monograph set in classic museum typography.',
    paperSpec: '310gsm Warm Cotton Rag · Archival Pigment Ink',
    defaultHeadline: 'ALWAYS IN OUR HEARTS',
    defaultSubline: '“I love you to the moon and back” · Recorded Voice Note',
    defaultLocation: 'Acoustic Harmonic Monograph · 44.1 kHz Master',
    defaultDateText: 'Forever Remembered',
    defaultCoords: '00:00 —————————●———— 00:18',
    presets: [
      {
        label: 'Saved Voicemail',
        headline: 'ALWAYS IN OUR HEARTS',
        subline: '“I love you to the moon and back” · Recorded Voice Note',
        location: 'Acoustic Harmonic Monograph · 44.1 kHz Master',
        dateText: 'Forever Remembered',
        coords: '00:00 —————————●———— 00:18',
      },
      {
        label: 'First Dance Song',
        headline: 'AT LAST — OUR FIRST DANCE',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'Savannah, Georgia · Reception Hall',
        dateText: 'September 21, 2024',
        coords: '01:14 ——————●——————— 03:42',
      },
      {
        label: 'Baby’s Heartbeat / Voice',
        headline: 'THE SOUND OF YOUR FIRST LAUGH',
        subline: 'Recorded in the kitchen on a Sunday morning.',
        location: 'Portland, Oregon',
        dateText: 'November 3, 2025',
        coords: '00:00 ————●————————— 00:12',
      },
    ],
    highlights: [
      'Fine-line acoustic bar geometry inspired by mid-century Swiss typographic posters',
      'Customize every line of inscription, timestamp marker, and frame wood finish live',
      'Crafted on heavyweight matte cotton canvas & paper in US partner workshops',
      'Arrives ready to hang with pre-installed gallery hardware in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Claire R.',
        location: 'Charlotte, NC',
        title: 'Used the inscription from my dad’s saved voicemail',
        body: 'Ordered the Two-Print Collector Pair—one for my study and one for my sister. The Warm Linen & Espresso colorway in the Natural Oak frame is understated and deeply moving.',
        formatPurchased: 'Two-Print Collector Pair',
      },
    ],
  },
  {
    slug: 'custom-coordinates-print',
    sku: 'EVM-COORD-03',
    plateNumber: 'PLATE NO. 03',
    categoryLabel: 'Topographic & Meridian Series',
    mode: 'coordinates',
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Architectural Latitude & Homestead Print',
    shortTitle: 'Latitude & Homestead Print',
    subtitle: 'Topographic Meridian Rings & Compass Rose Commemorating a First Home, Family Cabin, or Hometown',
    badge: 'Housewarming Favorite',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-coordinates-print.webp',
    description:
      'Mark the exact coordinates where your family’s history took root. Pairing concentric topographic contours and a cardinal meridian compass with your family name, street or town, and established year.',
    paperSpec: '310gsm Cotton Rag · Mitered Hardwood Frame',
    defaultHeadline: 'THE BEDISEE FAMILY HOMESTEAD',
    defaultSubline: 'Where loud mornings, warm dinners, and lifelong memories are made.',
    defaultLocation: 'Providence, Rhode Island',
    defaultDateText: 'Established 2019',
    defaultCoords: '41.8240° N · 71.4128° W',
    presets: [
      {
        label: 'First Family Home',
        headline: 'THE BEDISEE FAMILY HOMESTEAD',
        subline: 'Where loud mornings, warm dinners, and lifelong memories are made.',
        location: 'Providence, Rhode Island',
        dateText: 'Established 2019',
        coords: '41.8240° N · 71.4128° W',
      },
      {
        label: 'Lake / Mountain Cabin',
        headline: 'WHISPERING PINES LAKE HOUSE',
        subline: 'Long summers on the dock and woodsmoke in autumn.',
        location: 'Lake Placid, New York',
        dateText: 'Elevation 1,864 ft · Est. 1998',
        coords: '44.2795° N · 73.9799° W',
      },
    ],
    highlights: [
      'Clean architectural meridian geometry designed for foyers, studies, and living rooms',
      'Sought-after closing gift for new homeowners, newlyweds, and milestone moves',
      'Four curated archival ink palettes paired with three solid wood frame finishes',
      'Printed and framed in the USA with complimentary 3–5 day delivery',
    ],
    reviews: [
      {
        author: 'Megan S.',
        location: 'Denver, CO',
        title: 'Hangs right in our front entryway',
        body: 'Every guest who walks through our front door pauses to read the coordinates. The Warm Cotton Rag palette matches our plaster walls effortlessly.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'custom-pet-memorial',
    sku: 'EVM-PET-04',
    plateNumber: 'PLATE NO. 04',
    categoryLabel: 'Monograph Tribute Series',
    mode: 'pet_memorial',
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Heirloom Companion Tribute Monograph',
    shortTitle: 'Companion Tribute Monograph',
    subtitle: 'Minimalist Single-Line Contour Crest & Editorial Dedication Honoring a Loyal Companion',
    badge: 'Sympathy & Keepsake',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-pet-memorial.webp',
    description:
      'Honor a beloved dog or cat with a quiet, gallery-grade monograph that belongs in a fine home. Featuring continuous architectural line-art, your companion’s name, years, and your favorite shared memory.',
    paperSpec: '310gsm Warm Cotton Rag · Solid Oak or Walnut Frame',
    defaultHeadline: 'COOPER',
    defaultSubline: 'The best boy on every trail, every morning walk, and every quiet evening.',
    defaultLocation: 'Loyal Companion & Family Guardian',
    defaultDateText: '2012 – 2026',
    defaultCoords: 'Forever By Our Side',
    presets: [
      {
        label: 'Loyal Dog Tribute',
        headline: 'COOPER',
        subline: 'The best boy on every trail, every morning walk, and every quiet evening.',
        location: 'Loyal Companion & Family Guardian',
        dateText: '2012 – 2026',
        coords: 'Forever By Our Side',
      },
      {
        label: 'Beloved Cat Tribute',
        headline: 'OLIVER',
        subline: 'Keeper of the sunny windowpane and quiet afternoon companion.',
        location: 'Beloved Member of Our House',
        dateText: '2010 – 2026',
        coords: 'Always Remembered',
      },
    ],
    highlights: [
      'Understated continuous contour line-art paired with book-grade serif typography',
      'A thoughtful, lasting sympathy gift for friends or family who have lost a companion',
      'Live studio preview lets you refine every word of the dedication before framing',
      'Crafted and shipped from US archival studios in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Mark & Jenna T.',
        location: 'Austin, TX',
        title: 'Dignified, warm, and deeply comforting',
        body: 'When we lost our 13-year-old Golden, we wanted something timeless for the bookshelf in our study. This piece feels like an art gallery print rather than novelty pet decor.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'patent-architectural-triptych',
    sku: 'EVM-PAT-05',
    plateNumber: 'PLATE NO. 05',
    categoryLabel: 'Engineering & Horology',
    mode: 'patent_blueprint',
    defaultColorway: 'obsidian_silver',
    defaultFrame: 'matte_black',
    title: 'Horological & Engineering Patent Blueprint',
    shortTitle: 'Patent & Blueprint Edition',
    subtitle: 'Isometric Mechanical Draftsmanship Personalized With Your Title, Studio Name & Filing Date',
    badge: 'Study & Office Edition',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/patent-architectural-triptych.webp',
    description:
      'Created for architects, engineers, watch collectors, and founders. Combines precision isometric escapement draftsmanship and calibration grids with your custom patent title, founder name, or company milestone.',
    paperSpec: '310gsm Matte Archival Stock · Gallery Frame',
    defaultHeadline: 'CHRONOGRAPH ESCAPEMENT MECHANISM',
    defaultSubline: 'Precision Mechanical Timekeeping Assembly · Sheet 1 of 1',
    defaultLocation: 'United States Patent & Archival Registry',
    defaultDateText: 'Filed October 21, 2026',
    defaultCoords: 'FIG. 1A — ISOMETRIC CROSS-SECTION',
    presets: [
      {
        label: 'Horological Escapement',
        headline: 'CHRONOGRAPH ESCAPEMENT MECHANISM',
        subline: 'Precision Mechanical Timekeeping Assembly · Sheet 1 of 1',
        location: 'United States Patent & Archival Registry',
        dateText: 'Filed October 21, 2026',
        coords: 'FIG. 1A — ISOMETRIC CROSS-SECTION',
      },
      {
        label: 'Founder / Company Milestone',
        headline: 'ARCHITECTURAL SYSTEMS PATENT NO. 01',
        subline: 'Commissioned for the Founding Studio & Engineering Team',
        location: 'New York, New York',
        dateText: 'Established 2024',
        coords: 'DWG. NO. 402-A · SCALE 1:1',
      },
    ],
    highlights: [
      'Fine calibration grid, isometric gear vectors, and authentic archival title block',
      'Personalize the patent heading, inventor or founder attribution, and date',
      'Designed to anchor a walnut study, executive office, or library wall',
      'Framed in the USA with complimentary 3–5 day tracked shipping',
    ],
    reviews: [
      {
        author: 'Greg V.',
        location: 'Seattle, WA',
        title: 'Anchors my entire home office wall',
        body: 'Put our company founding date in the title block in the Obsidian & Silver colorway. Everyone asks where I had it framed.',
        formatPurchased: '24" × 36" Exhibition Statement Frame',
      },
    ],
  },
  {
    slug: 'coastal-bathymetry-chart',
    sku: 'EVM-COAST-06',
    plateNumber: 'PLATE NO. 06',
    categoryLabel: 'Hydrographic Survey Series',
    mode: 'coastal_chart',
    defaultColorway: 'coastal_navy',
    defaultFrame: 'white_oak',
    title: 'Coastal Bathymetry & Harbor Survey Chart',
    shortTitle: 'Coastal Bathymetry Chart',
    subtitle: 'Layered Sounding Contours, 32-Point Compass Rose & Custom Shoreline Coordinates',
    badge: 'Coastal Survey',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/coastal-bathymetry-chart.webp',
    description:
      'Bring your favorite harbor, island, or Atlantic shoreline into your home. Our hydrographic contour engine draws layered depth soundings, a traditional mariner’s compass rose, and your exact beach or mooring coordinates.',
    paperSpec: '310gsm Cotton Rag · Natural White Oak or Walnut Frame',
    defaultHeadline: 'NANTUCKET SOUND & ATLANTIC SHOALS',
    defaultSubline: 'Bathymetric Depth Contours & Mariner’s Compass Rose',
    defaultLocation: 'New England Hydrographic Survey',
    defaultDateText: 'Soundings in Fathoms · Mean Low Water',
    defaultCoords: '41.2835° N · 70.0995° W',
    presets: [
      {
        label: 'New England Harbor',
        headline: 'NANTUCKET SOUND & ATLANTIC SHOALS',
        subline: 'Bathymetric Depth Contours & Mariner’s Compass Rose',
        location: 'New England Hydrographic Survey',
        dateText: 'Soundings in Fathoms · Mean Low Water',
        coords: '41.2835° N · 70.0995° W',
      },
      {
        label: 'Gulf / Southern Coast',
        headline: 'CHARLESTON HARBOR & SULLIVAN’S ISLAND',
        subline: 'Tidal Channel Soundings & Coastal Meridian',
        location: 'South Carolina Coastal Survey',
        dateText: 'Mean Low Water · Archival Edition',
        coords: '32.7523° N · 79.8651° W',
      },
    ],
    highlights: [
      'Hydrographic depth rings with cardinal compass rose and custom harbor typography',
      'Tailor for any US coastline, sailing harbor, lake, or island honeymoon destination',
      'Signature Atlantic Deep Slate or Warm Linen palettes in solid hardwood frames',
      'Ships free in 3–5 business days from US archival print workshops',
    ],
    reviews: [
      {
        author: 'Lauren P.',
        location: 'Newport, RI',
        title: 'Stunning in our coastal hallway',
        body: 'Customized it with the exact coordinates of the harbor where we got engaged in Rhode Island. The Atlantic Slate ink inside the Natural White Oak frame is perfection.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
]

export function getEvermarkProductBySlug(slug: string): EvermarkProduct | undefined {
  return EVERMARK_CATALOG.find((p) => p.slug === slug)
}
