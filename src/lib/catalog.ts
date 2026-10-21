export type PrintArtworkMode =
  | 'starmap'
  | 'soundwave'
  | 'vinyl_lyric'
  | 'pet_memorial'
  | 'coordinates'
  | 'birth_stat'
  | 'three_map_triptych'
  | 'family_botanical'
  | 'coastal_chart'
  | 'patent_blueprint'
  | 'marathon_route'
  | 'book_stack'

export type ProductFormFactor =
  | 'framed-print'
  | 'acrylic-stand'
  | 'woven-blanket'
  | 'chiseled-slate'
  | 'triptych-acrylic'
  | 'wood-tapestry'
  | 'amber-candle'
  | 'framed-canvas'
  | 'birch-plaque'

export type ColorwayId =
  | 'linen_espresso'
  | 'midnight_gold'
  | 'heritage_forest'
  | 'terracotta_sienna'
  | 'dusty_rose'
  | 'bourbon_walnut'
  | 'coastal_navy'
  | 'obsidian_silver'

export type FrameFinishId = 'walnut' | 'matte_black' | 'white_oak'

export type PhotoFilterId = 'warm_color' | 'bw_film' | 'charcoal_sketch'

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
    outerHex: '#3b2416',
    innerHex: '#5c3a24',
    lipHex: '#26160d',
  },
  {
    id: 'white_oak',
    label: 'Kiln-Dried Warm Honey Oak',
    shortLabel: 'Warm Oak',
    outerHex: '#b58b5c',
    innerHex: '#cfa576',
    lipHex: '#8f6a41',
  },
  {
    id: 'matte_black',
    label: 'Gallery Matte Black Ash',
    shortLabel: 'Matte Black',
    outerHex: '#1b1a19',
    innerHex: '#2e2c2a',
    lipHex: '#0f0e0d',
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
    label: 'Warm Archival Cream & Saddle Espresso',
    shortLabel: 'Warm Archival Cream',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#261A13',
    accentHex: '#9E472A',
    mutedHex: '#6E5A4C',
  },
  {
    id: 'midnight_gold',
    label: 'Celestial Indigo & Burnished Gold',
    shortLabel: 'Celestial & Gold',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#141E30',
    accentHex: '#B8924A',
    mutedHex: '#5A6578',
  },
  {
    id: 'heritage_forest',
    label: 'Botanical Sage & Antique Gold',
    shortLabel: 'Botanical Sage',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#1B3027',
    accentHex: '#B8924A',
    mutedHex: '#4E6359',
  },
  {
    id: 'terracotta_sienna',
    label: 'Tuscan Terracotta & Warm Sienna',
    shortLabel: 'Terracotta Clay',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#5E2515',
    accentHex: '#B85D3B',
    mutedHex: '#7D5346',
  },
  {
    id: 'dusty_rose',
    label: 'Heirloom Blush & English Rose',
    shortLabel: 'Heirloom Blush',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#3D2722',
    accentHex: '#B87B6A',
    mutedHex: '#7D625A',
  },
  {
    id: 'bourbon_walnut',
    label: 'Bourbon Espresso & Champagne Brass',
    shortLabel: 'Bourbon Espresso',
    bgHex: '#261A13',
    cardHex: '#1A110C',
    inkHex: '#F7F4EF',
    accentHex: '#D8AE64',
    mutedHex: '#B5A395',
  },
  {
    id: 'coastal_navy',
    label: 'Aegean Nautical Teal & Brass',
    shortLabel: 'Aegean Nautical',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#0D2B3E',
    accentHex: '#2B7A78',
    mutedHex: '#4F6D7A',
  },
  {
    id: 'obsidian_silver',
    label: 'Midnight Gallery & Champagne Gold',
    shortLabel: 'Midnight Gallery',
    bgHex: '#11151C',
    cardHex: '#090C10',
    inkHex: '#F7F4EF',
    accentHex: '#D8AE64',
    mutedHex: '#94A3B8',
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
    label: 'Signature Physical Keepsake Edition (Most Popular)',
    dimensions: 'Standard Studio Scale · US Crafted',
    subtitle: 'Handcrafted in our US Printify partner studio · Free tracked US shipping (3–5 days)',
    priceUsd: 79,
    compareAtUsd: 105,
    badge: 'Most Selected',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'framed-24x36',
    label: 'Exhibition Statement Scale / Deluxe Edition',
    dimensions: 'Oversized Architectural Scale',
    subtitle: 'Full-scale statement piece · Priority US studio production & free delivery',
    priceUsd: 119,
    compareAtUsd: 155,
    badge: 'Statement Scale',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'two-print-gift-set',
    label: 'Two-Piece Collector Gift Pair (Keep One, Gift One)',
    dimensions: 'Two Matching Physical Editions',
    subtitle: 'Ideal for couples, parents & grandparents — Save $29 with free Priority US shipping',
    priceUsd: 129,
    compareAtUsd: 158,
    badge: 'Save $29 · Gift Pair',
    isPhysical: true,
    freeShipping: true,
  },
  {
    id: 'digital-300dpi',
    label: 'Instant High-Resolution Digital Master',
    dimensions: 'Unwatermarked Master File',
    subtitle: 'Immediate unwatermarked download upon checkout for same-day local printing',
    priceUsd: 29,
    compareAtUsd: 45,
    badge: 'Immediate Delivery',
    isPhysical: false,
  },
]

export const DIGITAL_BACKUP_BUMP = {
  title: 'Include the Instant Unwatermarked Digital Master (+$14)',
  priceUsd: 14,
  compareAtUsd: 29,
  description:
    'Download a clean, unwatermarked high-resolution master file immediately after checkout—ideal for sharing with family, phone lockscreens, or printing extra copies.',
}

export interface EvermarkProduct {
  slug: string
  sku: string
  printifyProductId: string
  printifyBlueprintId: number
  printifyProviderId: number
  artworkPlate: string
  formFactor: ProductFormFactor
  physicalMedium: string
  plateNumber: string
  categoryLabel: string
  mode: PrintArtworkMode
  supportsPhotoUpload?: boolean
  supportsAudioUpload?: boolean
  supportsGpsLookup?: boolean
  defaultColorway: ColorwayId
  defaultFrame: FrameFinishId
  title: string
  shortTitle: string
  subtitle: string
  badge: string
  startingPriceUsd: number
  popularPriceUsd: number
  previewImage: string
  mockupGallery: string[]
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
    printifyProductId: '6ad8f84503c69a814e0ab4ad',
    printifyBlueprintId: 492,
    printifyProviderId: 36,
    artworkPlate: '/art-plates/celestial-nebula.webp',
    formFactor: 'framed-print',
    physicalMedium: 'Museum Framed 310gsm Fine Art Print',
    plateNumber: 'COLLECTION I · BLUEPRINT 492',
    categoryLabel: 'Museum Framed Celestial Art',
    mode: 'starmap',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'midnight_gold',
    defaultFrame: 'matte_black',
    title: 'Custom Milky Way & Night Sky Star Map (Framed Edition)',
    shortTitle: 'Night Sky Star Map (Framed)',
    subtitle: 'Painterly Indigo & Gold-Dust Milky Way Nebula over Pine Mountain Silhouette in a Solid Wood Frame',
    badge: '#1 Anniversary & Birth Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/mockups/custom-star-map-1.webp',
    mockupGallery: [
      '/mockups/custom-star-map-1.webp',
      '/mockups/custom-star-map-2.webp',
      '/mockups/custom-star-map-3.webp',
      '/mockups/custom-star-map-4.webp',
    ],
    description:
      'Featuring our signature hand-illustrated deep indigo and golden Milky Way nebula framed by a silhouetted pine mountain ridge. Personalize the inscription with your couple names, milestone date, and exact city coordinates.',
    paperSpec: 'Printify Blueprint #492 · 310gsm Museum Cotton Rag · Solid Hardwood Frame',
    defaultHeadline: 'THE NIGHT OUR STORY BEGAN',
    defaultSubline: 'Underneath these exact stars, everything changed forever.',
    defaultLocation: 'Asheville, North Carolina',
    defaultDateText: 'October 14, 2023 · 9:42 PM',
    defaultCoords: '35.5951° N · 82.5515° W',
    presets: [
      {
        label: 'Anniversary / Wedding',
        headline: 'THE NIGHT OUR STORY BEGAN',
        subline: 'Underneath these exact stars, everything changed forever.',
        location: 'Asheville, North Carolina',
        dateText: 'October 14, 2023 · 9:42 PM',
        coords: '35.5951° N · 82.5515° W',
      },
      {
        label: 'Birth of a Child',
        headline: 'CLARA ELIZABETH MONROE',
        subline: 'The sky over Boston the moment we first held you.',
        location: 'Boston, Massachusetts',
        dateText: 'May 19, 2025 · 4:18 AM',
        coords: '42.3601° N · 71.0589° W',
      },
      {
        label: 'Engagement Night',
        headline: 'SHE SAID YES UNDER THESE STARS',
        subline: 'On the cliffs overlooking the Pacific at dusk.',
        location: 'Big Sur, California',
        dateText: 'August 28, 2024 · 8:15 PM',
        coords: '36.2704° N · 121.8081° W',
      },
    ],
    highlights: [
      'Painterly deep-indigo & gold-dust Milky Way nebula over a pine mountain horizon',
      'Optional custom photo medallion or pure celestial illustration on warm cream cotton rag',
      'Fulfilled via Printify US Blueprint #492 in solid Black, White, or Walnut hardwood frames',
      'Complimentary tracked US delivery in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Hannah & Luke M.',
        location: 'Nashville, TN',
        title: 'The Milky Way colors and pine trees look like an oil painting!',
        body: 'So much warmer and richer than flat black-and-white star maps. Having the golden nebula above the pine trees with our wedding date looks breathtaking.',
        formatPurchased: 'Signature Framed Edition',
      },
      {
        author: 'Daniel K.',
        location: 'Boston, MA',
        title: 'Arrived in 4 days — heavyweight paper and real wood',
        body: 'The matte cotton paper texture and mitered wood frame look like a $300 gallery piece.',
        formatPurchased: 'Exhibition Statement Scale',
      },
    ],
  },
  {
    slug: 'custom-soundwave-art',
    sku: 'EVM-ACRYL-02',
    printifyProductId: '6ad8f84762370ee3a30e10ce',
    printifyBlueprintId: 1303,
    printifyProviderId: 220,
    artworkPlate: '/art-plates/gold-vinyl-luxe.webp',
    formFactor: 'acrylic-stand',
    physicalMedium: 'Crystal Acrylic Plaque + Carved Hardwood Stand',
    plateNumber: 'COLLECTION II · BLUEPRINT 1303',
    categoryLabel: 'Crystal Acrylic & Wood Stand',
    mode: 'soundwave',
    supportsAudioUpload: true,
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Voice & First Dance Plaque — Crystal Acrylic + Hardwood Stand',
    shortTitle: 'Acrylic Plaque + Wood Stand',
    subtitle: 'Optical Cast Crystal Acrylic Block Seated in a Solid Hardwood Desk Stand With Metallic Vinyl & Voice Waveform',
    badge: 'Crystal Acrylic + Wood Stand',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/mockups/custom-soundwave-art-2.webp',
    mockupGallery: [
      '/mockups/custom-soundwave-art-2.webp',
      '/mockups/custom-soundwave-art-1.webp',
      '/mockups/custom-soundwave-art-3.webp',
      '/mockups/custom-soundwave-art-4.webp',
    ],
    description:
      'Crafted on thick, diamond-polished optical acrylic seated inside a warm solid hardwood desktop base (Printify Blueprint #1303). Features our luminous champagne-gold vinyl record centerpiece and your custom uploaded voice note or song waveform.',
    paperSpec: 'Printify Blueprint #1303 · Optical Cast Acrylic + Solid Hardwood Base',
    defaultHeadline: 'OUR FIRST DANCE',
    defaultSubline: '“You are my finest adventure and my quietest harbor.”',
    defaultLocation: 'At Last — Etta James',
    defaultDateText: 'October 14, 2023',
    defaultCoords: '00:00 —————————●———— 03:18',
    presets: [
      {
        label: 'First Dance Song',
        headline: 'OUR FIRST DANCE',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'At Last — Etta James',
        dateText: 'October 14, 2023',
        coords: '00:00 —————————●———— 03:18',
      },
      {
        label: 'Saved Voicemail',
        headline: 'ALWAYS IN OUR HEARTS',
        subline: '“I love you to the moon and back” · Recorded Voice Note',
        location: 'Saved Voice Recording',
        dateText: 'Forever Remembered',
        coords: '00:00 —————————●———— 00:18',
      },
      {
        label: 'Baby’s First Laugh',
        headline: 'THE SOUND OF YOUR FIRST LAUGH',
        subline: 'Recorded in the kitchen on a Sunday morning.',
        location: 'Portland, Oregon',
        dateText: 'November 3, 2025',
        coords: '00:00 ————●————————— 00:12',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1303: Crystal-clear cast acrylic sign with solid hardwood stand',
      'Upload any .MP3/.WAV audio file or record 5 seconds live from your microphone',
      'Champagne-gold metallic vinyl centerpiece with optional center couple/family photo',
      'Perfect for nightstands, executive desks, bookshelves, and mantels',
    ],
    reviews: [
      {
        author: 'Claire R.',
        location: 'Charlotte, NC',
        title: 'Looks incredible glowing on my nightstand!',
        body: 'The thick glass-like acrylic sitting in the solid oak base feels so heavy and luxurious. Seeing our wedding song and voice waveform printed on it is magic.',
        formatPurchased: 'Signature Acrylic + Hardwood Stand',
      },
    ],
  },
  {
    slug: 'family-tree-botanical-print',
    sku: 'EVM-BLANKET-08',
    printifyProductId: '6ad8f84962370ee3a30e10cf',
    printifyBlueprintId: 1626,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/botanical-bouquet.webp',
    formFactor: 'woven-blanket',
    physicalMedium: '100% Cotton Jacquard-Woven Fringed Throw Blanket',
    plateNumber: 'COLLECTION III · BLUEPRINT 1626',
    categoryLabel: 'Heirloom Woven Throw Blanket',
    mode: 'family_botanical',
    supportsPhotoUpload: true,
    defaultColorway: 'heritage_forest',
    defaultFrame: 'white_oak',
    title: 'Family Birth Flower Bouquet — Heirloom Woven Fringed Blanket',
    shortTitle: 'Woven Fringed Throw Blanket',
    subtitle: '100% Cotton Jacquard-Woven Throw Blanket With Colorful Twisted Fringe & Redouté Watercolor Botanicals',
    badge: '#1 Gift for Mom & Grandma',
    startingPriceUsd: 29,
    popularPriceUsd: 109,
    previewImage: '/mockups/family-tree-botanical-print-2.webp',
    mockupGallery: [
      '/mockups/family-tree-botanical-print-2.webp',
      '/mockups/family-tree-botanical-print-1.webp',
      '/mockups/family-tree-botanical-print-3.webp',
      '/mockups/family-tree-botanical-print-4.webp',
    ],
    description:
      'Not a fleece print—this is an authentic 100% cotton jacquard-woven heirloom throw blanket with multicolored twisted fringe edges (Printify Blueprint #1626). Woven with our 19th-century Redouté watercolor botanical rose, lavender, and fern bouquet and personalized with your family and grandchildren names.',
    paperSpec: 'Printify Blueprint #1626 · 100% Cotton Jacquard Weave · 52"×37", 60"×50" & 80"×60"',
    defaultHeadline: 'THE MILLER FAMILY GARDEN',
    defaultSubline: 'Rooted in love, blooming together through every season.',
    defaultLocation: 'Emma  ·  Liam  ·  Olivia  ·  Noah  ·   Sophia',
    defaultDateText: 'Established 1984 · Three Generations',
    defaultCoords: 'LOVE GROWS HERE FOREVER',
    presets: [
      {
        label: 'Grandma’s Garden Blanket',
        headline: 'NANA’S FAMILY GARDEN',
        subline: 'Rooted in love, blooming together through every season.',
        location: 'Clara  ·  Henry  ·  Eleanor  ·  James  ·  Sophie',
        dateText: 'Established 1978 · Three Generations',
        coords: 'WOVEN IN LOVE FOREVER',
      },
      {
        label: 'Mother’s Day Heirloom',
        headline: 'THE MONROE FAMILY BOUQUET',
        subline: 'Built on warm Sunday dinners and unconditional love.',
        location: 'David  ·  Sarah  ·  Olivia  ·  Liam',
        dateText: 'Charleston, South Carolina',
        coords: 'BLESSED BEYOND MEASURE',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1626: True 100% cotton jacquard weave with colorful braided fringe',
      'Hand-illustrated Pierre-Joseph Redouté style English roses, lavender & fern bouquet',
      'Personalize with all children & grandchildren names or upload a family photo',
      'Woven & shipped from US textile mills in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Kelly D.',
        location: 'Atlanta, GA',
        title: 'My mom cried when she unfolded the woven blanket!',
        body: 'The botanical roses and grandkids’ names are actually woven into heavy cotton yarn with fringe around the edges. It looks stunning draped over her reading chair.',
        formatPurchased: '60" × 50" Woven Fringed Blanket',
      },
    ],
  },
  {
    slug: 'coastal-bathymetry-chart',
    sku: 'EVM-SLATE-09',
    printifyProductId: '6ad8f84b62370ee3a30e10d0',
    printifyBlueprintId: 5344,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/coastal-harbor-map.webp',
    formFactor: 'chiseled-slate',
    physicalMedium: 'Hand-Chiseled Natural Stone Slate Plaque + Stand',
    plateNumber: 'COLLECTION IV · BLUEPRINT 5344',
    categoryLabel: 'Chiseled Natural Stone Slate',
    mode: 'coastal_chart',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'coastal_navy',
    defaultFrame: 'matte_black',
    title: 'Coastal Harbor & Coordinates — Natural Chiseled Slate Plaque',
    shortTitle: 'Chiseled Stone Slate Plaque',
    subtitle: 'Hand-Fractured Raw Sedimentary Stone Slate Plaque With Display Feet & Watercolor Nautical Chart',
    badge: 'Real Chiseled Stone Slate',
    startingPriceUsd: 29,
    popularPriceUsd: 84,
    previewImage: '/mockups/coastal-bathymetry-chart-1.webp',
    mockupGallery: [
      '/mockups/coastal-bathymetry-chart-1.webp',
      '/mockups/coastal-bathymetry-chart-2.webp',
    ],
    description:
      'Infused directly onto genuine hand-fractured natural stone slate with raw chiseled rock edges and sturdy display feet (Printify Blueprint #5344). Showcases our Aegean teal watercolor coastal bathymetry chart, antique gold compass rose, and your exact harbor or beach coordinates.',
    paperSpec: 'Printify Blueprint #5344 · Raw Chiseled Natural Stone Slate + Display Feet',
    defaultHeadline: 'WHERE OUR FOREVER BEGAN',
    defaultSubline: 'Aegean Bathymetric Contours & Mariner’s Compass Rose',
    defaultLocation: 'Charleston Harbor · South Carolina',
    defaultDateText: 'Established October 14, 2023',
    defaultCoords: '32.7765° N · 79.9311° W',
    presets: [
      {
        label: 'Charleston Harbor',
        headline: 'WHERE OUR FOREVER BEGAN',
        subline: 'Aegean Bathymetric Contours & Mariner’s Compass Rose',
        location: 'Charleston Harbor · South Carolina',
        dateText: 'Established October 14, 2023',
        coords: '32.7765° N · 79.9311° W',
      },
      {
        label: 'New England Coast',
        headline: 'NANTUCKET SOUND & SHOALS',
        subline: 'Summer Mooring & Coastal Sanctuary',
        location: 'Nantucket, Massachusetts',
        dateText: 'Family Beach House · Est. 2019',
        coords: '41.2835° N · 70.0995° W',
      },
    ],
    highlights: [
      'Real Printify Blueprint #5344: Authentic hand-fractured natural stone slate with display feet',
      'Hand-painted Aegean watercolor depth contours, stippled coastline & gilded compass rose',
      '1-Click GPS Coordinate lookup for any beach, lake, island, or engagement spot',
      'Each stone plaque has a one-of-a-kind chiseled rock edge',
    ],
    reviews: [
      {
        author: 'Lauren P.',
        location: 'Newport, RI',
        title: 'Real heavy stone slate — the chiseled edges are incredible',
        body: 'We put the coordinates of the beach where we got engaged on this slate plaque. The watercolor teal ocean against the raw stone edge looks like a museum artifact.',
        formatPurchased: '7" × 11" Chiseled Slate Plaque',
      },
    ],
  },
  {
    slug: 'met-engaged-married-triptych',
    sku: 'EVM-TRIP-07',
    printifyProductId: '6ad8f84c38e3bd079b02d04c',
    printifyBlueprintId: 961,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/mountain-horizon-watercolor.webp',
    formFactor: 'triptych-acrylic',
    physicalMedium: '3-Panel Split 0.25" Optical Acrylic Installation',
    plateNumber: 'COLLECTION V · BLUEPRINT 961',
    categoryLabel: '3-Panel Split Acrylic Triptych',
    mode: 'three_map_triptych',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'terracotta_sienna',
    defaultFrame: 'walnut',
    title: 'Mountain Horizon & Three Milestones — 3-Panel Acrylic Triptych',
    shortTitle: '3-Panel Acrylic Triptych',
    subtitle: 'Three Split 0.25" Optical Acrylic Wall Panels Spanning a Layered Watercolor Mountain Horizon',
    badge: '3-Panel Gallery Statement',
    startingPriceUsd: 29,
    popularPriceUsd: 149,
    previewImage: '/mockups/met-engaged-married-triptych-1.webp',
    mockupGallery: [
      '/mockups/met-engaged-married-triptych-1.webp',
      '/mockups/met-engaged-married-triptych-2.webp',
      '/mockups/met-engaged-married-triptych-3.webp',
      '/mockups/met-engaged-married-triptych-4.webp',
    ],
    description:
      'An architectural 3-panel split optical acrylic wall installation (Printify Blueprint #961). Our Prussian blue, sage, and sunset terracotta watercolor mountain horizon flows seamlessly across all three luminous 0.25"-thick acrylic panels, commemorating your three biggest life milestones.',
    paperSpec: 'Printify Blueprint #961 · Three Split 0.25" Optical Acrylic Panels + Hidden Mounts',
    defaultHeadline: 'THE SUMMIT OF US',
    defaultSubline: 'Met in Boston  ·  Engaged in Big Sur  ·  Married in Asheville',
    defaultLocation: 'Hannah & Luke Monroe',
    defaultDateText: 'Ten Years of Adventure Together',
    defaultCoords: 'THREE MILESTONES  ·  ONE HORIZON',
    presets: [
      {
        label: 'Met · Engaged · Married',
        headline: 'THE SUMMIT OF US',
        subline: 'Met in Boston  ·  Engaged in Big Sur  ·  Married in Asheville',
        location: 'Hannah & Luke Monroe',
        dateText: 'Ten Years of Adventure Together',
        coords: 'THREE MILESTONES  ·  ONE HORIZON',
      },
      {
        label: 'Family Mountain Legacy',
        headline: 'WHERE THE MOUNTAINS CALL US HOME',
        subline: 'Blue Ridge Parkway  ·  Smoky Mountains  ·  Shenandoah',
        location: 'The Anderson Family',
        dateText: 'Established 2016',
        coords: '35.5951° N  ·  82.5515° W',
      },
    ],
    highlights: [
      'Real Printify Blueprint #961: 3-panel split UV-printed 0.25" optical acrylic installation',
      'Layered watercolor mountain ridges in Prussian blue, sage green & sunset terracotta',
      'Includes hidden rear hanging system so all 3 panels float off your wall',
      'Ships free from US architectural print studios in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Rachel P.',
        location: 'Denver, CO',
        title: 'The 3 split acrylic panels anchor our entire living room!',
        body: 'Seeing the watercolor mountains span across three glossy acrylic panels with our three milestone cities underneath looks like a $600 gallery commission.',
        formatPurchased: '3-Panel Split Acrylic Triptych',
      },
    ],
  },
  {
    slug: 'patent-architectural-triptych',
    sku: 'EVM-TAPESTRY-10',
    printifyProductId: '6ad8f84e7f85ecd3f8022c8a',
    printifyBlueprintId: 1489,
    printifyProviderId: 10,
    artworkPlate: '/art-plates/coastal-harbor-map.webp',
    formFactor: 'wood-tapestry',
    physicalMedium: 'Solid Wood Dowel Bar + Woven Wall Tapestry',
    plateNumber: 'COLLECTION VI · BLUEPRINT 1489',
    categoryLabel: 'Wood-Topped Wall Tapestry',
    mode: 'patent_blueprint',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'coastal_navy',
    defaultFrame: 'white_oak',
    title: 'Nautical Harbor & Coordinates — Wood-Topped Wall Tapestry',
    shortTitle: 'Wood-Topped Wall Tapestry',
    subtitle: '26" × 36" Woven Textile Banner Suspended Between Solid Natural Wood Dowel Bars & Cotton Twine',
    badge: 'Solid Wood Hanger Bars',
    startingPriceUsd: 29,
    popularPriceUsd: 98,
    previewImage: '/mockups/patent-architectural-triptych-1.webp',
    mockupGallery: [
      '/mockups/patent-architectural-triptych-1.webp',
      '/mockups/patent-architectural-triptych-2.webp',
    ],
    description:
      'Inspired by vintage maritime & botanical roll charts, our Wood-Topped Wall Tapestry (Printify Blueprint #1489, crafted in the USA by MWW On Demand) hangs effortlessly from a natural solid wood top bar with cotton twine and a weighted bottom wood dowel.',
    paperSpec: 'Printify Blueprint #1489 · 26" × 36" Woven Textile + Solid Hardwood Top & Bottom Bars',
    defaultHeadline: '32.7765° N, 79.9311° W',
    defaultSubline: 'Where Our Forever Began · Coastal Hydrographic Chart',
    defaultLocation: 'Charleston Harbor · South Carolina',
    defaultDateText: 'Established 2024',
    defaultCoords: 'MARINER’S COMPASS ROSE · ARCHIVAL EDITION',
    presets: [
      {
        label: 'Coastal Harbor Chart',
        headline: '32.7765° N, 79.9311° W',
        subline: 'Where Our Forever Began · Coastal Hydrographic Chart',
        location: 'Charleston Harbor · South Carolina',
        dateText: 'Established 2024',
        coords: 'MARINER’S COMPASS ROSE · ARCHIVAL EDITION',
      },
      {
        label: 'Lake House Scroll',
        headline: '44.2795° N, 73.9799° W',
        subline: 'Whispering Pines Sanctuary & Boathouse',
        location: 'Lake Placid, New York',
        dateText: 'Family Summer Retreat',
        coords: 'ELEVATION 1,864 FT · MEAN LOW WATER',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1489: Pre-assembled solid wood top & bottom hanger bars with twine',
      'Generous 26" × 36" architectural wall presence—hangs on a single brass nail in 10 seconds',
      'Hand-painted Aegean nautical watercolor chart with 1-Click GPS coordinate plotting',
      'Crafted in North Carolina by MWW On Demand with 3–5 day US delivery',
    ],
    reviews: [
      {
        author: 'Greg V.',
        location: 'Seattle, WA',
        title: 'Love the vintage scroll look with the real wood bars',
        body: 'Hung this right in our entryway. The top and bottom wood bars give it such an authentic vintage map scroll feel.',
        formatPurchased: '26" × 36" Wood-Topped Wall Tapestry',
      },
    ],
  },
  {
    slug: 'custom-book-stack-print',
    sku: 'EVM-CANDLE-12',
    printifyProductId: '6ad8f84f03c69a814e0ab4b5',
    printifyBlueprintId: 1468,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/botanical-bouquet.webp',
    formFactor: 'amber-candle',
    physicalMedium: 'Apothecary Amber Glass Jar · 100% Soy Candle',
    plateNumber: 'COLLECTION VII · BLUEPRINT 1468',
    categoryLabel: 'Scented Amber Soy Candle',
    mode: 'book_stack',
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Botanical Family Keepsake — Scented Apothecary Amber Soy Candle',
    shortTitle: 'Scented Amber Soy Candle',
    subtitle: 'Hand-Poured 100% Natural Soy Wax Candle in a Warm Amber Glass Jar With Custom Botanical Art & Dedication',
    badge: 'White Sage, Lavender & Warmth',
    startingPriceUsd: 29,
    popularPriceUsd: 48,
    previewImage: '/mockups/custom-book-stack-print-2.webp',
    mockupGallery: [
      '/mockups/custom-book-stack-print-2.webp',
      '/mockups/custom-book-stack-print-1.webp',
      '/mockups/custom-book-stack-print-3.webp',
      '/mockups/custom-book-stack-print-4.webp',
    ],
    description:
      'Hand-poured in the USA using 100% natural soy wax and a cotton wick inside a reusable apothecary amber glass jar with brass lid (Printify Blueprint #1468). Features our Redouté watercolor botanical bouquet on the custom label alongside your personalized family title, quote, or gift dedication.',
    paperSpec: 'Printify Blueprint #1468 · 100% Natural Soy Wax · Amber Glass Jar · 50+ Hr Burn',
    defaultHeadline: 'THE MILLER FAMILY',
    defaultSubline: 'Warmth, Light & Unconditional Love in Every Season',
    defaultLocation: 'White Sage & Lavender  ·  Hand-Poured in USA',
    defaultDateText: 'Established 2022',
    defaultCoords: '100% NATURAL SOY WAX · APOTHECARY EDITION',
    presets: [
      {
        label: 'Housewarming / Family Gift',
        headline: 'THE MILLER FAMILY HOME',
        subline: 'May this home always be filled with warmth and laughter.',
        location: 'White Sage & Lavender  ·  Hand-Poured in USA',
        dateText: 'Established 2026',
        coords: '100% NATURAL SOY WAX · APOTHECARY EDITION',
      },
      {
        label: 'Thank You / Hostess Gift',
        headline: 'WITH GRATITUDE & WARMTH',
        subline: 'Thank you for making every gathering feel like home.',
        location: 'Warm Cinnamon & Cedar  ·  Hand-Poured Soy',
        dateText: 'Bespoke Gift Edition',
        coords: 'APOTHECARY AMBER JAR · 50 HOUR BURN',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1468: Hand-poured 100% soy wax candle in an amber glass apothecary jar',
      'Custom-printed watercolor botanical art label with your personalized dedication',
      'Infused with White Sage & Lavender or Warm Holiday Spice essential fragrance oils',
      'An effortless luxury add-on or standalone housewarming, bridesmaid, or Mother’s Day gift',
    ],
    reviews: [
      {
        author: 'Sarah J.',
        location: 'Madison, WI',
        title: 'Smells heavenly and the custom botanical label is gorgeous!',
        body: 'Ordered three of these with each of my bridesmaids’ names and wedding date on the botanical label. The amber jar looks so cozy when lit.',
        formatPurchased: 'Apothecary Amber Soy Candle',
      },
    ],
  },
  {
    slug: 'custom-vinyl-song-portrait',
    sku: 'EVM-CANVAS-03',
    printifyProductId: '6ad8f85138e3bd079b02d052',
    printifyBlueprintId: 944,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/gold-vinyl-luxe.webp',
    formFactor: 'framed-canvas',
    physicalMedium: '1.25" Floating Framed Gallery Matte Canvas',
    plateNumber: 'COLLECTION VIII · BLUEPRINT 944',
    categoryLabel: 'Floating Framed Matte Canvas',
    mode: 'vinyl_lyric',
    supportsPhotoUpload: true,
    supportsAudioUpload: true,
    defaultColorway: 'bourbon_walnut',
    defaultFrame: 'matte_black',
    title: 'First Dance Metallic Vinyl & Lyrics — Floating Framed Canvas',
    shortTitle: 'Floating Framed Vinyl Canvas',
    subtitle: '1.25" Deep Stretched Artist Canvas Suspended Inside a Hardwood Floating Frame With Gold Vinyl Art',
    badge: 'Floating Gallery Canvas',
    startingPriceUsd: 29,
    popularPriceUsd: 119,
    previewImage: '/mockups/custom-vinyl-song-portrait-2.webp',
    mockupGallery: [
      '/mockups/custom-vinyl-song-portrait-2.webp',
      '/mockups/custom-vinyl-song-portrait-1.webp',
      '/mockups/custom-vinyl-song-portrait-3.webp',
      '/mockups/custom-vinyl-song-portrait-4.webp',
    ],
    description:
      'Stretched over 1.25"-thick solid pine stretcher bars and suspended inside a sleek architectural floating frame (Printify Blueprint #944). Features our photorealistic champagne-gold metallic vinyl record—upload your wedding photo into the center label and inscribe your first dance song below.',
    paperSpec: 'Printify Blueprint #944 · 1.25" Deep Poly-Cotton Matte Canvas + Floating Frame',
    defaultHeadline: 'OUR FIRST DANCE SONG',
    defaultSubline: '“You are my finest adventure and my quietest harbor.”',
    defaultLocation: 'At Last — Etta James',
    defaultDateText: 'September 21, 2024 · Savannah, GA',
    defaultCoords: 'SIDE A  ·  33 1/3 RPM GOLD MASTER EDITION',
    presets: [
      {
        label: 'Wedding First Dance',
        headline: 'OUR FIRST DANCE SONG',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'At Last — Etta James',
        dateText: 'September 21, 2024 · Savannah, GA',
        coords: 'SIDE A  ·  33 1/3 RPM GOLD MASTER EDITION',
      },
      {
        label: 'Anniversary Song',
        headline: 'TEN YEARS OF LOVING YOU',
        subline: '“And I’d choose you; in a hundred lifetimes, I’d choose you.”',
        location: 'Tennessee Whiskey — Chris Stapleton',
        dateText: 'October 14, 2016 – 2026',
        coords: 'COLLECTOR PRESSING  ·  FLOATING CANVAS',
      },
    ],
    highlights: [
      'Real Printify Blueprint #944: Gallery-wrapped matte canvas inside a 1.25" floating frame',
      'Photorealistic champagne-gold vinyl record with crimson/gold filigree center label',
      'Upload your couple photo into the center vinyl medallion or attach your song audio',
      'Arrives ready to hang with pre-installed wire hardware in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Lauren & Matt B.',
        location: 'Charleston, SC',
        title: 'The floating frame canvas depth makes the gold vinyl pop!',
        body: 'Having it printed on textured matte canvas inside the recessed floating frame looks like an authentic gold record award in our living room.',
        formatPurchased: 'Floating Framed Matte Canvas',
      },
    ],
  },
  {
    slug: 'custom-pet-memorial',
    sku: 'EVM-WOOD-04',
    printifyProductId: '6ad8f85347ba3c9e05033638',
    printifyBlueprintId: 1530,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/pet-portrait-watercolor.webp',
    formFactor: 'birch-plaque',
    physicalMedium: '0.75" Solid Birch Hardwood Wall Plaque',
    plateNumber: 'COLLECTION IX · BLUEPRINT 1530',
    categoryLabel: 'Solid Birch Hardwood Plaque',
    mode: 'pet_memorial',
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Watercolor Pet Portrait — Solid Birch Hardwood Wall Plaque',
    shortTitle: 'Solid Birch Wood Pet Plaque',
    subtitle: 'UV-Struck Fine Art Watercolor Pet Portrait on Solid Birch Hardwood With Natural Jute Hanging Cord',
    badge: 'Solid Birch Wood + Photo Upload',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/mockups/custom-pet-memorial-1.webp',
    mockupGallery: [
      '/mockups/custom-pet-memorial-1.webp',
      '/mockups/custom-pet-memorial-2.webp',
      '/mockups/custom-pet-memorial-3.webp',
      '/mockups/custom-pet-memorial-4.webp',
    ],
    description:
      'UV-printed directly onto solid natural birch hardwood with warm organic woodgrain and a braided jute hanging cord (Printify Blueprint #1530). Upload your own dog or cat photo—automatically framed inside our gilded watercolor laurel wreath—or customize our hand-painted Golden Retriever portrait.',
    paperSpec: 'Printify Blueprint #1530 · Solid Natural Birch Hardwood + Jute Hanging Cord',
    defaultHeadline: 'BARNABY',
    defaultSubline: 'The best boy on every trail, every morning walk, and every quiet evening.',
    defaultLocation: 'Forever Our Loyal Companion',
    defaultDateText: '2014 – 2026',
    defaultCoords: 'THE HEART OF OUR HOME',
    presets: [
      {
        label: 'Loyal Dog Tribute',
        headline: 'BARNABY',
        subline: 'The best boy on every trail, every morning walk, and every quiet evening.',
        location: 'Forever Our Loyal Companion',
        dateText: '2014 – 2026',
        coords: 'THE HEART OF OUR HOME',
      },
      {
        label: 'Beloved Cat Portrait',
        headline: 'OLIVER',
        subline: 'Keeper of the sunny windowpane and quiet afternoon companion.',
        location: 'Beloved Member of Our Family',
        dateText: 'Always Loved',
        coords: 'FOREVER BY OUR SIDE',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1530: UV-printed directly onto solid birch hardwood with jute cord',
      'Upload your own dog or cat photo to frame it inside our watercolor laurel wreath backdrop',
      'Includes Warm Color, Classic B&W Film, and Fine Sketch portrait filters',
      'Crafted and shipped from US woodshop studios in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Mark & Jenna T.',
        location: 'Austin, TX',
        title: 'Printed on real solid birch wood — so warm and organic',
        body: 'We uploaded our Golden’s photo and the watercolor laurel wreath on solid wood with the jute rope hanger looks so heartfelt in our hallway.',
        formatPurchased: '10" × 10" Solid Birch Wood Plaque',
      },
    ],
  },
  {
    slug: 'custom-coordinates-print',
    sku: 'EVM-HOMESLATE-05',
    printifyProductId: '6ad8f85538e3bd079b02d057',
    printifyBlueprintId: 5344,
    printifyProviderId: 99,
    artworkPlate: '/art-plates/home-architecture-watercolor.webp',
    formFactor: 'chiseled-slate',
    physicalMedium: 'Raw Hand-Chiseled Natural Stone Slate + Stand',
    plateNumber: 'COLLECTION X · BLUEPRINT 5344',
    categoryLabel: 'Chiseled Slate Home Portrait',
    mode: 'coordinates',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Our First Home Watercolor Portrait — Chiseled Stone Slate Plaque',
    shortTitle: 'First Home Slate Plaque',
    subtitle: 'Architectural Watercolor House Portrait Infused Onto Raw Chiseled Natural Stone Slate With Display Feet',
    badge: '#1 Housewarming & Realtor Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 89,
    previewImage: '/mockups/custom-coordinates-print-1.webp',
    mockupGallery: [
      '/mockups/custom-coordinates-print-1.webp',
      '/mockups/custom-coordinates-print-2.webp',
    ],
    description:
      'Celebrate a first home, family homestead, or closing-day milestone on genuine hand-chiseled natural stone slate (Printify Blueprint #5344). Upload a photo of your own house—framed in our watercolor laurel wash—or personalize our golden-hour craftsman home illustration with your street address and 1-click GPS coordinates.',
    paperSpec: 'Printify Blueprint #5344 · Hand-Fractured Natural Sedimentary Slate + Display Stand',
    defaultHeadline: 'OUR FIRST HOME',
    defaultSubline: 'Where loud mornings, warm dinners, and lifelong memories are made.',
    defaultLocation: '742 Evergreen Terrace · Charleston, SC',
    defaultDateText: 'The Harrington Family · Est. 2024',
    defaultCoords: '32.7765° N · 79.9311° W',
    presets: [
      {
        label: 'First Family Home',
        headline: 'OUR FIRST HOME',
        subline: 'Where loud mornings, warm dinners, and lifelong memories are made.',
        location: '742 Evergreen Terrace · Charleston, SC',
        dateText: 'The Harrington Family · Est. 2024',
        coords: '32.7765° N · 79.9311° W',
      },
      {
        label: 'Lake / Mountain Cabin',
        headline: 'WHISPERING PINES CABIN',
        subline: 'Long summers on the porch and woodsmoke in autumn.',
        location: 'Lake Placid, New York',
        dateText: 'Established 2019',
        coords: '44.2795° N · 73.9799° W',
      },
    ],
    highlights: [
      'Real Printify Blueprint #5344: Hand-chiseled natural stone slate plaque with display feet',
      'Upload a photo of your actual house or customize our blooming hydrangea craftsman home art',
      '1-Click GPS Coordinate lookup from any US street address or town',
      'Sits proudly on an entryway table, mantel, or kitchen counter',
    ],
    reviews: [
      {
        author: 'Megan S.',
        location: 'Denver, CO',
        title: 'Sits right on our entryway console table!',
        body: 'The raw chiseled stone edge makes the watercolor house illustration look so high-end. Every guest who walks through our front door compliments it.',
        formatPurchased: '7" × 11" Chiseled Slate Plaque',
      },
    ],
  },
  {
    slug: 'newborn-birth-stat-portrait',
    sku: 'EVM-BIRTH-06',
    printifyProductId: '6ad8f8567f85ecd3f8022c92',
    printifyBlueprintId: 492,
    printifyProviderId: 36,
    artworkPlate: '/art-plates/nursery-moon-watercolor.webp',
    formFactor: 'framed-print',
    physicalMedium: 'Nursery Hardwood Framed 310gsm Cotton Rag',
    plateNumber: 'COLLECTION XI · BLUEPRINT 492',
    categoryLabel: 'Storybook Nursery Framed Art',
    mode: 'birth_stat',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'dusty_rose',
    defaultFrame: 'white_oak',
    title: 'Storybook Sleeping Moon & Baby Birth Stats (Framed Edition)',
    shortTitle: 'Storybook Moon Nursery Print',
    subtitle: 'Whimsical Watercolor Sleeping Crescent Moon & Bunny Illustration With Baby’s Exact Birth Stats',
    badge: 'Top New Parent & Nursery Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/mockups/newborn-birth-stat-portrait-1.webp',
    mockupGallery: [
      '/mockups/newborn-birth-stat-portrait-1.webp',
      '/mockups/newborn-birth-stat-portrait-2.webp',
      '/mockups/newborn-birth-stat-portrait-3.webp',
      '/mockups/newborn-birth-stat-portrait-4.webp',
    ],
    description:
      'A dreamy, storybook watercolor centerpiece for the nursery (Printify Blueprint #492). Features a peaceful baby bunny sleeping in a golden crescent moon among pastel clouds and hanging stars—or upload your newborn’s hospital photo—inscribed with birth weight, length, minute, and city.',
    paperSpec: 'Printify Blueprint #492 · 310gsm Warm Cotton Rag · Solid Hardwood Nursery Frame',
    defaultHeadline: 'LEO ALEXANDER BROOKS',
    defaultSubline: 'Born August 19, 2025 at 4:18 AM  ·  7 lbs 11 oz  ·  20.5 inches',
    defaultLocation: 'Boston, Massachusetts',
    defaultDateText: 'Loved Beyond Measure From Your First Breath',
    defaultCoords: '42.3601° N · 71.0589° W',
    presets: [
      {
        label: 'Baby Boy Nursery',
        headline: 'LEO ALEXANDER BROOKS',
        subline: 'Born August 19, 2025 at 4:18 AM  ·  7 lbs 11 oz  ·  20.5 inches',
        location: 'Boston, Massachusetts',
        dateText: 'Loved Beyond Measure From Your First Breath',
        coords: '42.3601° N · 71.0589° W',
      },
      {
        label: 'Baby Girl Nursery',
        headline: 'CLARA ELIZABETH MONROE',
        subline: 'Born May 19, 2025 at 11:04 PM  ·  7 lbs 6 oz  ·  20.0 inches',
        location: 'Charleston, South Carolina',
        dateText: 'Our Greatest Blessing & Sweetest Dream',
        coords: '32.7765° N · 79.9311° W',
      },
    ],
    highlights: [
      'Hand-painted storybook sleeping crescent moon, pastel clouds, golden stars & bunny',
      'Or upload your newborn’s hospital portrait into our gilded watercolor nursery wreath',
      'Records full name, birth date, exact minute, weight in lbs/oz, and length in inches',
      'Framed in solid wood and shipped gift-ready in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Emily & Sam W.',
        location: 'Raleigh, NC',
        title: 'The sleeping moon watercolor is the sweetest thing in our nursery!',
        body: 'Ordered one for above the crib and one for grandma. The soft pastel clouds and golden stars on warm cream paper look straight out of a classic children’s book.',
        formatPurchased: 'Two-Piece Collector Gift Pair',
      },
    ],
  },
  {
    slug: 'marathon-finisher-route-print',
    sku: 'EVM-STARACRYL-11',
    printifyProductId: '6ad8f8580481ae630e072c79',
    printifyBlueprintId: 1303,
    printifyProviderId: 220,
    artworkPlate: '/art-plates/celestial-nebula.webp',
    formFactor: 'acrylic-stand',
    physicalMedium: 'Crystal Acrylic Nightstand Plaque + Hardwood Stand',
    plateNumber: 'COLLECTION XII · BLUEPRINT 1303',
    categoryLabel: 'Nightstand Starlight Acrylic',
    mode: 'marathon_route',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'midnight_gold',
    defaultFrame: 'white_oak',
    title: 'Roman Numeral Anniversary & Starlight — Acrylic Plaque & Wood Stand',
    shortTitle: 'Starlight Acrylic + Wood Stand',
    subtitle: 'Diamond-Polished Crystal Acrylic Nightstand Block in a Solid Hardwood Base With Milky Way Nebula Art',
    badge: 'Romantic Nightstand Keepsake',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/mockups/marathon-finisher-route-print-2.webp',
    mockupGallery: [
      '/mockups/marathon-finisher-route-print-2.webp',
      '/mockups/marathon-finisher-route-print-1.webp',
      '/mockups/marathon-finisher-route-print-3.webp',
      '/mockups/marathon-finisher-route-print-4.webp',
    ],
    description:
      'Designed specifically for bedroom nightstands, desks, and bookshelves (Printify Blueprint #1303). Our deep-indigo and gold-dust Milky Way nebula is reverse-printed onto thick optical crystal acrylic seated in a warm solid hardwood stand, inscribed with your Roman numeral wedding date or milestone.',
    paperSpec: 'Printify Blueprint #1303 · 5.1"×7.9" or 7.9"×11.8" Crystal Acrylic + Hardwood Stand',
    defaultHeadline: 'X · XIV · MMXXIII',
    defaultSubline: 'Sarah & Michael  ·  The Night Our Stars Aligned',
    defaultLocation: 'Asheville, North Carolina',
    defaultDateText: 'October 14, 2023',
    defaultCoords: '35.5951° N · 82.5515° W',
    presets: [
      {
        label: 'Roman Numeral Anniversary',
        headline: 'X · XIV · MMXXIII',
        subline: 'Sarah & Michael  ·  The Night Our Stars Aligned',
        location: 'Asheville, North Carolina',
        dateText: 'October 14, 2023',
        coords: '35.5951° N · 82.5515° W',
      },
      {
        label: 'Engagement Keepsake',
        headline: 'VIII · XXVIII · MMXXIV',
        subline: 'Forever Begins Under This Sky',
        location: 'Big Sur, California',
        dateText: 'August 28, 2024',
        coords: '36.2704° N · 121.8081° W',
      },
    ],
    highlights: [
      'Real Printify Blueprint #1303: Thick optical acrylic plaque + solid carved hardwood stand',
      'Luminous indigo & golden Milky Way nebula catches ambient room light through the acrylic edges',
      'Upload a favorite couple photo or display the pure celestial nebula & pine horizon',
      'Ships gift-ready in 3–5 business days from US studios',
    ],
    reviews: [
      {
        author: 'Chris M.',
        location: 'Boston, MA',
        title: 'Best anniversary gift — sits right on her nightstand',
        body: 'Didn’t even need to find wall space or a hammer! The crystal acrylic block slots right into the wood base and the Milky Way art looks 3D inside the glass.',
        formatPurchased: 'Crystal Acrylic + Hardwood Stand',
      },
    ],
  },
]

export function getEvermarkProductBySlug(slug: string): EvermarkProduct | undefined {
  return EVERMARK_CATALOG.find((p) => p.slug === slug)
}
