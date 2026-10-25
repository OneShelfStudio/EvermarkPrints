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

export type FrameFinishId = 'walnut' | 'matte_black' | 'white_oak' | 'gallery_white'

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
    id: 'matte_black',
    label: 'Gallery Matte Black Hardwood',
    shortLabel: 'Matte Black',
    outerHex: '#1b1a19',
    innerHex: '#2e2c2a',
    lipHex: '#0f0e0d',
  },
  {
    id: 'gallery_white',
    label: 'Museum Gallery White Hardwood',
    shortLabel: 'Gallery White',
    outerHex: '#f1ece3',
    innerHex: '#ffffff',
    lipHex: '#cfc4b4',
  },
  {
    id: 'walnut',
    label: 'American Espresso Walnut',
    shortLabel: 'Walnut',
    outerHex: '#3b2416',
    innerHex: '#5c3a24',
    lipHex: '#26160d',
  },
  {
    id: 'white_oak',
    label: 'Kiln-Dried Natural Warm Oak',
    shortLabel: 'Natural Oak',
    outerHex: '#b58b5c',
    innerHex: '#cfa576',
    lipHex: '#8f6a41',
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
    mutedHex: '#526075',
  },
  {
    id: 'heritage_forest',
    label: 'British Racing Green & Warm Brass',
    shortLabel: 'Heritage Forest',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#182C23',
    accentHex: '#A67C38',
    mutedHex: '#4E6358',
  },
  {
    id: 'terracotta_sienna',
    label: 'Tuscany Terracotta & Warm Ochre',
    shortLabel: 'Terracotta & Ochre',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#3B1E14',
    accentHex: '#B85435',
    mutedHex: '#7D5A4B',
  },
  {
    id: 'dusty_rose',
    label: 'Blush Botanical & Champagne Gold',
    shortLabel: 'Blush & Champagne',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#382227',
    accentHex: '#B57B82',
    mutedHex: '#7A5C61',
  },
  {
    id: 'bourbon_walnut',
    label: 'Dark Espresso Study & Warm Gold Leaf',
    shortLabel: 'Espresso Study',
    bgHex: '#1D1511',
    cardHex: '#140E0B',
    inkHex: '#F7F1E5',
    accentHex: '#D8AE64',
    mutedHex: '#B5A38F',
  },
  {
    id: 'coastal_navy',
    label: 'Aegean Harbor & Seafoam Watercolor',
    shortLabel: 'Aegean Harbor',
    bgHex: '#FAF6F0',
    cardHex: '#EFE6D8',
    inkHex: '#13293D',
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

export interface ProductVariantOption {
  id: string
  printifyVariantId: number
  variantIdByFrame?: Partial<Record<FrameFinishId, number>>
  label: string
  dimensions: string
  subtitle: string
  priceUsd: number
  compareAtUsd: number
  badge?: string
}

export function resolvePrintifyVariantId(
  variant: ProductVariantOption,
  frameFinishId?: string
): number {
  if (frameFinishId && variant.variantIdByFrame) {
    const mapped = variant.variantIdByFrame[frameFinishId as FrameFinishId]
    if (mapped) return mapped
  }
  return variant.printifyVariantId
}

export interface CompanionAddOnOption {
  id: string
  sku: string
  targetProductSlug: string
  title: string
  shortTitle: string
  description: string
  priceUsd: number
  compareAtUsd: number
  badge: string
  printifyProductId: string
  printifyBlueprintId: number
  printifyProviderId: number
  printifyVariantId: number
  previewImage: string
}

export const COMPANION_ADD_ONS: CompanionAddOnOption[] = [
  {
    id: 'addon-amber-candle',
    sku: 'EVM-CANDLE-ADDON',
    targetProductSlug: 'custom-book-stack-print',
    title: 'Add Matching Custom Apothecary Amber Soy Candle (+$24)',
    shortTitle: 'Matching Scented Amber Soy Candle (4oz)',
    description:
      'Hand-poured 100% natural White Sage & Lavender soy candle in an apothecary amber glass jar, custom-printed with your exact family names & milestone date.',
    priceUsd: 24,
    compareAtUsd: 48,
    badge: 'Save 50% · Uses Your Same Custom Text',
    printifyProductId: '6ad8f84f03c69a814e0ab4b5',
    printifyBlueprintId: 1468,
    printifyProviderId: 99,
    printifyVariantId: 105844,
    previewImage: '/mockups/custom-book-stack-print-1.webp',
  },
  {
    id: 'addon-stone-slate',
    sku: 'EVM-SLATE-ADDON',
    targetProductSlug: 'custom-coordinates-print',
    title: 'Add Matching Chiseled Natural Stone Desk Slate (+$39)',
    shortTitle: 'Matching 8" x 8" Chiseled Stone Slate + Stand',
    description:
      'Raw hand-chiseled natural rock slate plaque with twin display feet, custom-inscribed with your exact names, date & coordinates.',
    priceUsd: 39,
    compareAtUsd: 74,
    badge: 'Save $35 · Shelf & Mantel Companion',
    printifyProductId: '6ad8f85538e3bd079b02d057',
    printifyBlueprintId: 5344,
    printifyProviderId: 99,
    printifyVariantId: 243924,
    previewImage: '/mockups/custom-coordinates-print-1.webp',
  },
  {
    id: 'addon-acrylic-stand',
    sku: 'EVM-ACRYL-ADDON',
    targetProductSlug: 'custom-soundwave-art',
    title: 'Add Matching Desktop Crystal Acrylic Plaque & Wood Stand (+$44)',
    shortTitle: 'Matching 5.1" x 7.9" Crystal Acrylic + Hardwood Stand',
    description:
      'A matching optical crystal acrylic block with solid hardwood stand for an office desk or nightstand, featuring your exact custom design.',
    priceUsd: 44,
    compareAtUsd: 69,
    badge: 'Save $25 · Desk & Nightstand Companion',
    printifyProductId: '6ad8f84762370ee3a30e10ce',
    printifyBlueprintId: 1303,
    printifyProviderId: 220,
    printifyVariantId: 98609,
    previewImage: '/mockups/custom-soundwave-art-1.webp',
  },
]

export interface EvermarkProduct {
  slug: string
  sku: string
  printifyProductId: string
  printifyBlueprintId: number
  printifyProviderId: number
  googleProductCategory: string
  productType: string
  artworkPlate: string
  formFactor: ProductFormFactor
  physicalMedium: string
  plateNumber: string
  categoryLabel: string
  mode: PrintArtworkMode
  supportsPhotoUpload?: boolean
  photoUploadLabel?: string
  photoUploadHint?: string
  supportsAudioUpload?: boolean
  supportsGpsLookup?: boolean
  supportsFrameFinish?: boolean
  allowedFrames?: FrameFinishId[]
  frameFinishHeading?: string
  variantStepHeading: string
  variants: ProductVariantOption[]
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
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Artwork > Framed Fine Art Prints',
    artworkPlate: '/art-plates/celestial-nebula.webp',
    formFactor: 'framed-print',
    physicalMedium: 'Museum Framed 310gsm Fine Art Print',
    plateNumber: 'ARCHIVE EDITION NO. 01',
    categoryLabel: 'Museum Framed Celestial Art',
    mode: 'starmap',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: true,
    allowedFrames: ['matte_black', 'gallery_white'],
    frameFinishHeading: '02. Select Solid Hardwood Frame Finish',
    variantStepHeading: '04. Select Framed Print Size',
    variants: [
      {
        id: 'framed-11x14',
        printifyVariantId: 65400,
        variantIdByFrame: {
          matte_black: 65400,
          gallery_white: 65401,
        },
        label: '11" x 14" Solid Hardwood Framed Print',
        dimensions: '11 x 14 in (27.9 x 35.6 cm)',
        subtitle: '310gsm museum cotton rag · Hand-joined hardwood frame · Free US delivery',
        priceUsd: 69,
        compareAtUsd: 95,
      },
      {
        id: 'framed-12x18',
        printifyVariantId: 65402,
        variantIdByFrame: {
          matte_black: 65402,
          gallery_white: 65403,
        },
        label: '12" x 18" Gallery Hardwood Framed Edition',
        dimensions: '12 x 18 in (30.5 x 45.7 cm)',
        subtitle: 'Our signature gallery proportion · Ready to hang · Free 3 to 5 day US shipping',
        priceUsd: 79,
        compareAtUsd: 110,
        badge: 'Most Popular',
      },
      {
        id: 'framed-18x24',
        printifyVariantId: 65406,
        variantIdByFrame: {
          matte_black: 65406,
          gallery_white: 65407,
        },
        label: '18" x 24" Exhibition Statement Framed Edition',
        dimensions: '18 x 24 in (45.7 x 61.0 cm)',
        subtitle: 'Full-scale architectural centerpiece · Solid wood frame · Free Priority US delivery',
        priceUsd: 119,
        compareAtUsd: 155,
        badge: 'Statement Scale',
      },
    ],
    defaultColorway: 'midnight_gold',
    defaultFrame: 'matte_black',
    title: 'Custom Milky Way & Night Sky Star Map (Framed Edition)',
    shortTitle: 'Night Sky Star Map (Framed)',
    subtitle: 'Painterly Indigo & Gold-Dust Milky Way Nebula over Pine Mountain Silhouette in a Solid Wood Frame',
    badge: '#1 Anniversary & Birth Gift',
    startingPriceUsd: 69,
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
    paperSpec: '310gsm Acid-Free Museum Cotton Rag · Solid American Hardwood Frame',
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
      'Painterly deep-indigo and gold-dust Milky Way nebula over a pine mountain horizon',
      '1-Click GPS Coordinate lookup for any city, wedding venue, or birth hospital',
      'Hand-framed in solid Walnut, Warm Honey Oak, or Gallery Matte Black hardwood',
      'Complimentary tracked US delivery in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Hannah & Luke M.',
        location: 'Nashville, TN',
        title: 'The Milky Way colors and pine trees look like an oil painting!',
        body: 'So much warmer and richer than flat black-and-white star maps. Having the golden nebula above the pine trees with our wedding date looks breathtaking.',
        formatPurchased: '12" x 18" Gallery Hardwood Framed Edition',
      },
      {
        author: 'Daniel K.',
        location: 'Boston, MA',
        title: 'Arrived in 4 days with heavyweight paper and real wood',
        body: 'The matte cotton paper texture and mitered wood frame look like a $300 gallery piece.',
        formatPurchased: '18" x 24" Exhibition Statement Framed Edition',
      },
    ],
  },
  {
    slug: 'custom-soundwave-art',
    sku: 'EVM-ACRYL-02',
    printifyProductId: '6ad8f84762370ee3a30e10ce',
    printifyBlueprintId: 1303,
    printifyProviderId: 220,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Plaques & Signs > Crystal Acrylic Desk Plaques',
    artworkPlate: '/art-plates/gold-vinyl-luxe.webp',
    formFactor: 'acrylic-stand',
    physicalMedium: 'Crystal Acrylic Plaque + Carved Hardwood Stand',
    plateNumber: 'ARCHIVE EDITION NO. 02',
    categoryLabel: 'Crystal Acrylic & Wood Stand',
    mode: 'soundwave',
    supportsAudioUpload: true,
    supportsPhotoUpload: false,
    supportsGpsLookup: false,
    supportsFrameFinish: false,
    frameFinishHeading: '02. Natural Carved Hardwood Stand',
    variantStepHeading: '05. Select Crystal Acrylic Plaque Size',
    variants: [
      {
        id: 'acrylic-5x8',
        printifyVariantId: 98609,
        label: '5.1" x 7.9" Desktop Crystal Acrylic + Hardwood Stand',
        dimensions: '5.1 x 7.9 in (13 x 20 cm)',
        subtitle: 'Optical cast crystal acrylic block + solid wood stand · Ideal for nightstands & desks',
        priceUsd: 69,
        compareAtUsd: 95,
        badge: 'Most Popular',
      },
      {
        id: 'acrylic-8x12',
        printifyVariantId: 98610,
        label: '7.9" x 11.8" Statement Crystal Acrylic + Hardwood Stand',
        dimensions: '7.9 x 11.8 in (20 x 30 cm)',
        subtitle: 'Large architectural acrylic centerpiece + solid hardwood stand · Free US shipping',
        priceUsd: 89,
        compareAtUsd: 120,
        badge: 'Statement Size',
      },
    ],
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Voice & First Dance Plaque: Crystal Acrylic + Hardwood Stand',
    shortTitle: 'Acrylic Plaque + Wood Stand',
    subtitle: 'Optical Cast Crystal Acrylic Block Seated in a Solid Hardwood Desk Stand With Metallic Vinyl & Voice Waveform',
    badge: 'Crystal Acrylic + Wood Stand',
    startingPriceUsd: 69,
    popularPriceUsd: 69,
    previewImage: '/mockups/custom-soundwave-art-2.webp',
    mockupGallery: [
      '/mockups/custom-soundwave-art-2.webp',
      '/mockups/custom-soundwave-art-1.webp',
      '/mockups/custom-soundwave-art-3.webp',
      '/mockups/custom-soundwave-art-4.webp',
    ],
    description:
      'Crafted on thick, diamond-polished optical acrylic seated inside a warm solid hardwood desktop base. Features our luminous champagne-gold vinyl record centerpiece and your custom uploaded voice note or song waveform.',
    paperSpec: 'Diamond-Polished Optical Cast Acrylic · Solid Carved Hardwood Stand',
    defaultHeadline: 'OUR FIRST DANCE',
    defaultSubline: '“You are my finest adventure and my quietest harbor.”',
    defaultLocation: 'At Last · Etta James',
    defaultDateText: 'October 14, 2023',
    defaultCoords: '00:00  • • • • • ● • • •  03:18',
    presets: [
      {
        label: 'First Dance Song',
        headline: 'OUR FIRST DANCE',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'At Last · Etta James',
        dateText: 'October 14, 2023',
        coords: '00:00  • • • • • ● • • •  03:18',
      },
      {
        label: 'Saved Voicemail',
        headline: 'ALWAYS IN OUR HEARTS',
        subline: '“I love you to the moon and back” · Recorded Voice Note',
        location: 'Saved Voice Recording',
        dateText: 'Forever Remembered',
        coords: '00:00  • • • • • ● • • •  00:18',
      },
      {
        label: 'Baby’s First Laugh',
        headline: 'THE SOUND OF YOUR FIRST LAUGH',
        subline: 'Recorded in the kitchen on a Sunday morning.',
        location: 'Portland, Oregon',
        dateText: 'November 3, 2025',
        coords: '00:00  • • • ● • • • • •  00:12',
      },
    ],
    highlights: [
      'Crystal-clear optical cast acrylic plaque paired with a solid carved hardwood stand',
      'Upload any .MP3 or .WAV audio file, or record 5 seconds live from your microphone',
      'Champagne-gold metallic vinyl centerpiece with live harmonic waveform plotting',
      'Sized for bedroom nightstands, executive desks, bookshelves, and mantels',
    ],
    reviews: [
      {
        author: 'Claire R.',
        location: 'Charlotte, NC',
        title: 'Looks incredible glowing on my nightstand!',
        body: 'The thick glass-like acrylic sitting in the solid oak base feels so heavy and luxurious. Seeing our wedding song and voice waveform printed on it is magic.',
        formatPurchased: '5.1" x 7.9" Desktop Crystal Acrylic + Hardwood Stand',
      },
    ],
  },
  {
    slug: 'family-tree-botanical-print',
    sku: 'EVM-BLANKET-08',
    printifyProductId: '6ad8f84962370ee3a30e10cf',
    printifyBlueprintId: 1626,
    printifyProviderId: 99,
    googleProductCategory: '1985',
    productType: 'Home & Garden > Linens & Bedding > Bedding > Throw Blankets',
    artworkPlate: '/art-plates/botanical-bouquet.webp',
    formFactor: 'woven-blanket',
    physicalMedium: '100% Cotton Jacquard-Woven Fringed Throw Blanket',
    plateNumber: 'ARCHIVE EDITION NO. 03',
    categoryLabel: 'Heirloom Woven Throw Blanket',
    mode: 'family_botanical',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: false,
    supportsFrameFinish: false,
    variantStepHeading: '03. Select Woven Blanket Size',
    variants: [
      {
        id: 'blanket-52x37',
        printifyVariantId: 112794,
        label: '52" x 37" Heirloom Woven Reading & Lap Throw',
        dimensions: '52 x 37 in (132 x 94 cm)',
        subtitle: '100% cotton jacquard weave · Colorful twisted fringe · Ideal for armchairs & nurseries',
        priceUsd: 89,
        compareAtUsd: 120,
      },
      {
        id: 'blanket-60x50',
        printifyVariantId: 112795,
        label: '60" x 50" Queen Sofa & Bed Woven Fringed Blanket',
        dimensions: '60 x 50 in (152 x 127 cm)',
        subtitle: 'Our bestselling full-size family throw · Heavyweight 100% cotton weave · Free US shipping',
        priceUsd: 109,
        compareAtUsd: 145,
        badge: 'Most Popular',
      },
      {
        id: 'blanket-80x60',
        printifyVariantId: 112796,
        label: '80" x 60" Oversized Tapestry & Bedspread Woven Blanket',
        dimensions: '80 x 60 in (203 x 152 cm)',
        subtitle: 'Grand heirloom scale for beds & large sectionals · Free Priority US delivery',
        priceUsd: 139,
        compareAtUsd: 185,
        badge: 'Heirloom Scale',
      },
    ],
    defaultColorway: 'heritage_forest',
    defaultFrame: 'white_oak',
    title: 'Family Birth Flower Bouquet: Heirloom Woven Fringed Blanket',
    shortTitle: 'Woven Fringed Throw Blanket',
    subtitle: '100% Cotton Jacquard-Woven Throw Blanket With Colorful Twisted Fringe & Redoute Watercolor Botanicals',
    badge: '#1 Gift for Mom & Grandma',
    startingPriceUsd: 89,
    popularPriceUsd: 109,
    previewImage: '/mockups/family-tree-botanical-print-2.webp',
    mockupGallery: [
      '/mockups/family-tree-botanical-print-2.webp',
      '/mockups/family-tree-botanical-print-1.webp',
      '/mockups/family-tree-botanical-print-3.webp',
      '/mockups/family-tree-botanical-print-4.webp',
    ],
    description:
      'An authentic 100% cotton jacquard-woven heirloom throw blanket finished with multicolored twisted fringe edges. Woven on American looms with our 19th-century botanical rose, lavender, and fern bouquet and personalized with your family and grandchildren names.',
    paperSpec: '100% Cotton Jacquard Loom Weave · Multicolored Twisted Fringe · 3 Sizes',
    defaultHeadline: 'THE MILLER FAMILY GARDEN',
    defaultSubline: 'Rooted in love, blooming together through every season.',
    defaultLocation: 'Emma (Jul · Water Lily)  •  Liam (Oct · Marigold)  •  Olivia (Apr · Daisy)',
    defaultDateText: 'Established 1984 · Three Generations',
    defaultCoords: 'LOVE GROWS HERE FOREVER',
    presets: [
      {
        label: 'Grandma’s Garden Blanket',
        headline: 'NANA’S FAMILY GARDEN',
        subline: 'Rooted in love, blooming together through every season.',
        location: 'Clara (May · Lily)  •  Henry (Aug · Poppy)  •  Eleanor (Nov · Chrysanthemum)',
        dateText: 'Established 1978 · Three Generations',
        coords: 'WOVEN IN LOVE FOREVER',
      },
      {
        label: 'Mother’s Day Heirloom',
        headline: 'THE MONROE FAMILY BOUQUET',
        subline: 'Built on warm Sunday dinners and unconditional love.',
        location: 'Sarah (Jun · Rose)  •  David (Oct · Marigold)  •  Liam (Apr · Daisy)',
        dateText: 'Charleston, South Carolina',
        coords: 'BLESSED BEYOND MEASURE',
      },
    ],
    highlights: [
      'True 100% cotton jacquard loom weave with colorful braided fringe edges',
      'Hand-illustrated English roses, wild lavender, eucalyptus, and fern bouquet',
      'Personalize with all children and grandchildren names plus your family established year',
      'Woven and shipped from US textile mills in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Kelly D.',
        location: 'Atlanta, GA',
        title: 'My mom cried when she unfolded the woven blanket!',
        body: 'The botanical roses and grandkids’ names are actually woven into heavy cotton yarn with fringe around the edges. It looks stunning draped over her reading chair.',
        formatPurchased: '60" x 50" Queen Sofa & Bed Woven Fringed Blanket',
      },
    ],
  },
  {
    slug: 'coastal-bathymetry-chart',
    sku: 'EVM-SLATE-09',
    printifyProductId: '6ad8f84b62370ee3a30e10d0',
    printifyBlueprintId: 5344,
    printifyProviderId: 99,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Plaques & Signs > Natural Stone Slate Plaques',
    artworkPlate: '/art-plates/coastal-harbor-map.webp',
    formFactor: 'chiseled-slate',
    physicalMedium: 'Hand-Chiseled Natural Stone Slate Plaque + Stand',
    plateNumber: 'ARCHIVE EDITION NO. 04',
    categoryLabel: 'Chiseled Natural Stone Slate',
    mode: 'coastal_chart',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: false,
    variantStepHeading: '03. Select Natural Stone Slate Size',
    variants: [
      {
        id: 'slate-8x8',
        printifyVariantId: 243924,
        label: '8" x 8" Square Hand-Chiseled Stone Slate + Display Feet',
        dimensions: '8 x 8 in (20.3 x 20.3 cm)',
        subtitle: 'Genuine fractured sedimentary rock slate · Includes two matte display feet',
        priceUsd: 69,
        compareAtUsd: 95,
      },
      {
        id: 'slate-7x11',
        printifyVariantId: 243923,
        label: '7" x 11" Architectural Stone Slate Plaque + Display Feet',
        dimensions: '7 x 11 in (17.8 x 27.9 cm)',
        subtitle: 'Our signature mantel & bookshelf stone edition · Free 3 to 5 day US shipping',
        priceUsd: 84,
        compareAtUsd: 115,
        badge: 'Most Popular',
      },
    ],
    defaultColorway: 'coastal_navy',
    defaultFrame: 'matte_black',
    title: 'Coastal Harbor & Coordinates: Natural Chiseled Slate Plaque',
    shortTitle: 'Chiseled Stone Slate Plaque',
    subtitle: 'Hand-Fractured Raw Sedimentary Stone Slate Plaque With Display Feet & Watercolor Nautical Chart',
    badge: 'Real Chiseled Stone Slate',
    startingPriceUsd: 69,
    popularPriceUsd: 84,
    previewImage: '/mockups/coastal-bathymetry-chart-1.webp',
    mockupGallery: [
      '/mockups/coastal-bathymetry-chart-1.webp',
      '/mockups/coastal-bathymetry-chart-2.webp',
    ],
    description:
      'Infused directly onto genuine hand-fractured natural stone slate with raw chiseled rock edges and sturdy display feet. Showcases our Aegean teal watercolor coastal bathymetry chart, antique gold compass rose, and your exact harbor or beach coordinates.',
    paperSpec: 'Hand-Fractured Natural Sedimentary Stone Slate · Matte Display Feet Included',
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
      'Authentic hand-fractured natural stone slate with custom display feet',
      'Hand-painted Aegean watercolor depth contours, stippled coastline, and gilded compass rose',
      '1-Click GPS Coordinate lookup for any beach, lake, island, or engagement spot',
      'Every stone plaque features a one-of-a-kind chiseled rock edge',
    ],
    reviews: [
      {
        author: 'Lauren P.',
        location: 'Newport, RI',
        title: 'Real heavy stone slate and the chiseled edges are incredible',
        body: 'We put the coordinates of the beach where we got engaged on this slate plaque. The watercolor teal ocean against the raw stone edge looks like a museum artifact.',
        formatPurchased: '7" x 11" Architectural Stone Slate Plaque + Display Feet',
      },
    ],
  },
  {
    slug: 'met-engaged-married-triptych',
    sku: 'EVM-TRIP-07',
    printifyProductId: '6ad8f84c38e3bd079b02d04c',
    printifyBlueprintId: 961,
    printifyProviderId: 99,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Artwork > Acrylic Wall Art Triptychs',
    artworkPlate: '/art-plates/mountain-horizon-watercolor.webp',
    formFactor: 'triptych-acrylic',
    physicalMedium: '3-Panel Split 0.25" Optical Acrylic Installation',
    plateNumber: 'ARCHIVE EDITION NO. 05',
    categoryLabel: '3-Panel Split Acrylic Triptych',
    mode: 'three_map_triptych',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: false,
    variantStepHeading: '03. Select 3-Panel Acrylic Triptych Orientation',
    variants: [
      {
        id: 'triptych-vertical',
        printifyVariantId: 78406,
        label: 'Three Vertical Split Panels (36" x 12" Total Span · 0.25" Acrylic)',
        dimensions: 'Three Split Panels · 0.25" Thick Optical Acrylic',
        subtitle: 'Includes hidden rear French-cleat wall mounts · Free Priority US delivery',
        priceUsd: 149,
        compareAtUsd: 195,
        badge: 'Most Popular',
      },
      {
        id: 'triptych-horizontal',
        printifyVariantId: 78407,
        label: 'Panoramic Horizontal 3-Panel Split Acrylic Installation',
        dimensions: 'Wide Panoramic 3-Panel Wall Span · 0.25" Acrylic',
        subtitle: 'Designed to anchor a sofa, bed, or dining room wall · Free US shipping',
        priceUsd: 169,
        compareAtUsd: 225,
        badge: 'Gallery Statement',
      },
    ],
    defaultColorway: 'terracotta_sienna',
    defaultFrame: 'walnut',
    title: 'Mountain Horizon & Three Milestones: 3-Panel Acrylic Triptych',
    shortTitle: '3-Panel Acrylic Triptych',
    subtitle: 'Three Split 0.25" Optical Acrylic Wall Panels Spanning a Layered Watercolor Mountain Horizon',
    badge: '3-Panel Gallery Statement',
    startingPriceUsd: 149,
    popularPriceUsd: 149,
    previewImage: '/mockups/met-engaged-married-triptych-1.webp',
    mockupGallery: [
      '/mockups/met-engaged-married-triptych-1.webp',
      '/mockups/met-engaged-married-triptych-2.webp',
      '/mockups/met-engaged-married-triptych-3.webp',
      '/mockups/met-engaged-married-triptych-4.webp',
    ],
    description:
      'An architectural 3-panel split optical acrylic wall installation. Our Prussian blue, sage, and sunset terracotta watercolor mountain horizon flows seamlessly across all three luminous 0.25"-thick acrylic panels, commemorating your three biggest life milestones.',
    paperSpec: 'Three Split 0.25" Optical Cast Acrylic Panels · Hidden Rear Wall Mounts',
    defaultHeadline: 'SARAH & MICHAEL',
    defaultSubline: 'Every mountain path brought us to this moment.',
    defaultLocation: 'Boston, MA · June 2019',
    defaultDateText: 'Big Sur, CA · Oct 2021',
    defaultCoords: 'Asheville, NC · Sept 2023',
    presets: [
      {
        label: 'Met · Engaged · Married',
        headline: 'SARAH & MICHAEL',
        subline: 'Every mountain path brought us to this moment.',
        location: 'Boston, MA · June 2019',
        dateText: 'Big Sur, CA · Oct 2021',
        coords: 'Asheville, NC · Sept 2023',
      },
      {
        label: 'Family Mountain Legacy',
        headline: 'THE ANDERSON FAMILY',
        subline: 'Where the mountains call us home through every season.',
        location: 'Blue Ridge · Est. 2016',
        dateText: 'Smoky Mountains · 2019',
        coords: 'Shenandoah · Forever',
      },
    ],
    highlights: [
      'Three-panel split UV-printed 0.25" optical acrylic wall installation',
      'Layered watercolor mountain ridges in Prussian blue, sage green, and sunset terracotta',
      'Includes hidden rear hanging system so all three panels float cleanly off your wall',
      'Ships complimentary from our US architectural print studios in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Rachel P.',
        location: 'Denver, CO',
        title: 'The 3 split acrylic panels anchor our entire living room!',
        body: 'Seeing the watercolor mountains span across three glossy acrylic panels with our three milestone cities underneath looks like a $600 gallery commission.',
        formatPurchased: 'Three Vertical Split Panels (0.25" Optical Acrylic)',
      },
    ],
  },
  {
    slug: 'patent-architectural-triptych',
    sku: 'EVM-TAPESTRY-10',
    printifyProductId: '6ad8f84e7f85ecd3f8022c8a',
    printifyBlueprintId: 1489,
    printifyProviderId: 10,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Tapestries > Wood-Topped Wall Tapestries',
    artworkPlate: '/art-plates/coastal-harbor-map.webp',
    formFactor: 'wood-tapestry',
    physicalMedium: 'Solid Wood Dowel Bar + Woven Wall Tapestry',
    plateNumber: 'ARCHIVE EDITION NO. 06',
    categoryLabel: 'Wood-Topped Wall Tapestry',
    mode: 'patent_blueprint',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: false,
    frameFinishHeading: '02. Natural Solid Hardwood Dowel Bars',
    variantStepHeading: '04. Select Wall Tapestry Orientation',
    variants: [
      {
        id: 'tapestry-26x36',
        printifyVariantId: 107623,
        label: '26" x 36" Vertical Scroll Wall Tapestry + Solid Wood Bars',
        dimensions: '26 x 36 in (66 x 91.4 cm)',
        subtitle: 'Woven banner + pre-assembled top & bottom hardwood dowel bars + cotton twine',
        priceUsd: 98,
        compareAtUsd: 135,
        badge: 'Most Popular',
      },
      {
        id: 'tapestry-36x26',
        printifyVariantId: 107624,
        label: '36" x 26" Horizontal Chart Tapestry + Solid Wood Bars',
        dimensions: '36 x 26 in (91.4 x 66 cm)',
        subtitle: 'Wide nautical chart format · Crafted in North Carolina · Free US delivery',
        priceUsd: 98,
        compareAtUsd: 135,
      },
    ],
    defaultColorway: 'coastal_navy',
    defaultFrame: 'white_oak',
    title: 'Nautical Harbor & Coordinates: Wood-Topped Wall Tapestry',
    shortTitle: 'Wood-Topped Wall Tapestry',
    subtitle: '26" x 36" Woven Textile Banner Suspended Between Solid Natural Wood Dowel Bars & Cotton Twine',
    badge: 'Solid Wood Hanger Bars',
    startingPriceUsd: 98,
    popularPriceUsd: 98,
    previewImage: '/mockups/patent-architectural-triptych-1.webp',
    mockupGallery: [
      '/mockups/patent-architectural-triptych-1.webp',
      '/mockups/patent-architectural-triptych-2.webp',
    ],
    description:
      'Inspired by vintage maritime and botanical roll charts, our Wood-Topped Wall Tapestry is crafted in North Carolina and hangs effortlessly from a natural solid wood top bar with cotton twine and a weighted bottom wood dowel.',
    paperSpec: '26" x 36" Woven Textile Banner · Solid Hardwood Top & Bottom Dowel Bars',
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
      'Pre-assembled solid wood top and bottom hanger bars with natural cotton twine',
      'Generous 26" x 36" architectural wall presence that hangs on a single brass nail in seconds',
      'Hand-painted Aegean nautical watercolor chart with 1-Click GPS coordinate plotting',
      'Crafted in North Carolina with complimentary 3 to 5 day US delivery',
    ],
    reviews: [
      {
        author: 'Greg V.',
        location: 'Seattle, WA',
        title: 'Love the vintage scroll look with the real wood bars',
        body: 'Hung this right in our entryway. The top and bottom wood bars give it such an authentic vintage map scroll feel.',
        formatPurchased: '26" x 36" Vertical Scroll Wall Tapestry + Solid Wood Bars',
      },
    ],
  },
  {
    slug: 'custom-book-stack-print',
    sku: 'EVM-CANDLE-12',
    printifyProductId: '6ad8f84f03c69a814e0ab4b5',
    printifyBlueprintId: 1468,
    printifyProviderId: 99,
    googleProductCategory: '588',
    productType: 'Home & Garden > Decor > Home Fragrance > Scented Soy Candles',
    artworkPlate: '/art-plates/botanical-bouquet.webp',
    formFactor: 'amber-candle',
    physicalMedium: 'Apothecary Amber Glass Jar · 100% Soy Candle',
    plateNumber: 'ARCHIVE EDITION NO. 07',
    categoryLabel: 'Scented Amber Soy Candle',
    mode: 'book_stack',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: false,
    supportsFrameFinish: false,
    variantStepHeading: '03. Select Natural Fragrance Profile & Jar Size',
    variants: [
      {
        id: 'candle-sage-lavender',
        printifyVariantId: 105844,
        label: 'White Sage & Lavender: Apothecary Amber Jar Soy Candle',
        dimensions: '100% Natural Soy Wax · Cotton Wick · Amber Glass Jar',
        subtitle: 'Calming herbal sage, French lavender & warm botanical notes · Hand-poured in USA',
        priceUsd: 48,
        compareAtUsd: 64,
        badge: 'Most Popular Scent',
      },
      {
        id: 'candle-christmas-warmth',
        printifyVariantId: 105837,
        label: 'Warm Spiced Cedar & Clove: Apothecary Amber Jar Soy Candle',
        dimensions: '100% Natural Soy Wax · Cotton Wick · Amber Glass Jar',
        subtitle: 'Cozy hearthside cinnamon, cedarwood, and sweet vanilla bean · Free US shipping',
        priceUsd: 48,
        compareAtUsd: 64,
      },
      {
        id: 'candle-passionfruit',
        printifyVariantId: 105841,
        label: 'Peppered Passionfruit & Citrus: Apothecary Amber Jar Soy Candle',
        dimensions: '100% Natural Soy Wax · Cotton Wick · Amber Glass Jar',
        subtitle: 'Bright sun-ripened passionfruit balanced with warm spice · Hand-poured in USA',
        priceUsd: 48,
        compareAtUsd: 64,
      },
      {
        id: 'candle-unscented',
        printifyVariantId: 105843,
        label: 'Pure Unscented Natural Soy: Apothecary Amber Jar Candle',
        dimensions: '100% Fragrance-Free Natural Soy Wax · Amber Glass Jar',
        subtitle: 'Clean, hypoallergenic golden candlelight ideal for dining tables & nurseries',
        priceUsd: 46,
        compareAtUsd: 60,
      },
    ],
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Botanical Family Keepsake: Scented Apothecary Amber Soy Candle',
    shortTitle: 'Scented Amber Soy Candle',
    subtitle: 'Hand-Poured 100% Natural Soy Wax Candle in a Warm Amber Glass Jar With Custom Botanical Art & Dedication',
    badge: 'White Sage, Lavender & Warmth',
    startingPriceUsd: 46,
    popularPriceUsd: 48,
    previewImage: '/mockups/custom-book-stack-print-2.webp',
    mockupGallery: [
      '/mockups/custom-book-stack-print-2.webp',
      '/mockups/custom-book-stack-print-1.webp',
      '/mockups/custom-book-stack-print-3.webp',
      '/mockups/custom-book-stack-print-4.webp',
    ],
    description:
      'Hand-poured in the USA using 100% natural soy wax and a pure cotton wick inside a reusable apothecary amber glass jar with a brass lid. Features our watercolor botanical bouquet on the custom label alongside your personalized family title, quote, or gift dedication.',
    paperSpec: '100% Natural American Soy Wax · Reusable Amber Glass Jar · 50+ Hour Burn',
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
      'Hand-poured 100% natural soy wax candle in an amber glass apothecary jar with brass lid',
      'Custom-printed watercolor botanical art label with your personalized dedication',
      'Available in White Sage & Lavender, Warm Spiced Cedar, Peppered Passionfruit, or Unscented',
      'A thoughtful gift for housewarmings, bridesmaids, teachers, and Mother’s Day',
    ],
    reviews: [
      {
        author: 'Sarah J.',
        location: 'Madison, WI',
        title: 'Smells heavenly and the custom botanical label is gorgeous!',
        body: 'Ordered three of these with each of my bridesmaids’ names and wedding date on the botanical label. The amber jar looks so cozy when lit.',
        formatPurchased: 'White Sage & Lavender: Apothecary Amber Jar Soy Candle',
      },
    ],
  },
  {
    slug: 'custom-vinyl-song-portrait',
    sku: 'EVM-CANVAS-03',
    printifyProductId: '6ad8f85138e3bd079b02d052',
    printifyBlueprintId: 944,
    printifyProviderId: 99,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Artwork > Floating Framed Canvas Prints',
    artworkPlate: '/art-plates/gold-vinyl-luxe.webp',
    formFactor: 'framed-canvas',
    physicalMedium: '1.25" Floating Framed Gallery Matte Canvas',
    plateNumber: 'ARCHIVE EDITION NO. 08',
    categoryLabel: 'Floating Framed Matte Canvas',
    mode: 'vinyl_lyric',
    supportsPhotoUpload: true,
    photoUploadLabel: 'Center Vinyl Record Label Photo (Optional)',
    photoUploadHint: 'Embed your favorite wedding or couple photo inside the center record label.',
    supportsAudioUpload: true,
    supportsGpsLookup: false,
    supportsFrameFinish: true,
    allowedFrames: ['matte_black', 'walnut', 'white_oak', 'gallery_white'],
    frameFinishHeading: '02. Select Floating Frame Finish',
    variantStepHeading: '05. Select Floating Framed Canvas Scale',
    variants: [
      {
        id: 'canvas-9x12',
        printifyVariantId: 88290,
        variantIdByFrame: {
          matte_black: 88290,
          walnut: 107248,
          white_oak: 244026,
          gallery_white: 107249,
        },
        label: '9" x 12" Study Floating Framed 1.25" Matte Canvas',
        dimensions: '9 x 12 in (Vertical) · 1.25" Deep Canvas + Floating Frame',
        subtitle: 'Gallery-wrapped poly-cotton artist canvas inside a recessed floating frame',
        priceUsd: 89,
        compareAtUsd: 120,
      },
      {
        id: 'canvas-12x16',
        printifyVariantId: 88292,
        variantIdByFrame: {
          matte_black: 88292,
          walnut: 107252,
          white_oak: 244029,
          gallery_white: 107253,
        },
        label: '12" x 16" Gallery Floating Framed 1.25" Matte Canvas',
        dimensions: '12 x 16 in (Vertical) · 1.25" Deep Canvas + Floating Frame',
        subtitle: 'Our bestselling couple & anniversary scale · Pre-installed hanging wire · Free US delivery',
        priceUsd: 119,
        compareAtUsd: 155,
        badge: 'Most Popular',
      },
      {
        id: 'canvas-16x20',
        printifyVariantId: 88293,
        variantIdByFrame: {
          matte_black: 88293,
          walnut: 107254,
          white_oak: 244032,
          gallery_white: 107255,
        },
        label: '16" x 20" Exhibition Floating Framed 1.25" Matte Canvas',
        dimensions: '16 x 20 in (Vertical) · 1.25" Deep Canvas + Floating Frame',
        subtitle: 'Full living-room statement scale · Free Priority US delivery in 3 to 5 days',
        priceUsd: 144,
        compareAtUsd: 190,
        badge: 'Statement Scale',
      },
    ],
    defaultColorway: 'linen_espresso',
    defaultFrame: 'matte_black',
    title: 'First Dance Metallic Vinyl & Lyrics: Floating Framed Canvas',
    shortTitle: 'Floating Framed Vinyl Canvas',
    subtitle: '1.25" Deep Stretched Artist Canvas Suspended Inside a Hardwood Floating Frame With Gold Vinyl Art',
    badge: 'Floating Gallery Canvas',
    startingPriceUsd: 89,
    popularPriceUsd: 119,
    previewImage: '/mockups/custom-vinyl-song-portrait-2.webp',
    mockupGallery: [
      '/mockups/custom-vinyl-song-portrait-2.webp',
      '/mockups/custom-vinyl-song-portrait-1.webp',
      '/mockups/custom-vinyl-song-portrait-3.webp',
      '/mockups/custom-vinyl-song-portrait-4.webp',
    ],
    description:
      'Stretched over 1.25"-thick solid pine stretcher bars and suspended inside a sleek architectural floating frame. Features our photorealistic champagne-gold metallic vinyl record. Upload your wedding photo into the center label and inscribe your first dance song below.',
    paperSpec: '1.25" Deep Poly-Cotton Artist Canvas · Recessed Solid Floating Frame',
    defaultHeadline: 'OUR FIRST DANCE SONG',
    defaultSubline: '“You are my finest adventure and my quietest harbor.”',
    defaultLocation: 'At Last · Etta James',
    defaultDateText: 'September 21, 2024 · Savannah, GA',
    defaultCoords: 'SIDE A  ·  33 1/3 RPM GOLD MASTER EDITION',
    presets: [
      {
        label: 'Wedding First Dance',
        headline: 'OUR FIRST DANCE SONG',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'At Last · Etta James',
        dateText: 'September 21, 2024 · Savannah, GA',
        coords: 'SIDE A  ·  33 1/3 RPM GOLD MASTER EDITION',
      },
      {
        label: 'Anniversary Song',
        headline: 'TEN YEARS OF LOVING YOU',
        subline: '“And I’d choose you; in a hundred lifetimes, I’d choose you.”',
        location: 'Tennessee Whiskey · Chris Stapleton',
        dateText: 'October 14, 2016 to 2026',
        coords: 'COLLECTOR PRESSING  ·  FLOATING CANVAS',
      },
    ],
    highlights: [
      'Gallery-wrapped matte artist canvas suspended inside a 1.25" recessed floating frame',
      'Photorealistic champagne-gold vinyl record with crimson and gold filigree center label',
      'Upload your couple photo into the center vinyl medallion or attach your song audio',
      'Arrives ready to hang with pre-installed wire hardware in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Lauren & Matt B.',
        location: 'Charleston, SC',
        title: 'The floating frame canvas depth makes the gold vinyl pop!',
        body: 'Having it printed on textured matte canvas inside the recessed floating frame looks like an authentic gold record award in our living room.',
        formatPurchased: '16" x 12" Gallery Floating Framed 1.25" Matte Canvas',
      },
    ],
  },
  {
    slug: 'custom-pet-memorial',
    sku: 'EVM-WOOD-04',
    printifyProductId: '6ad8f85347ba3c9e05033638',
    printifyBlueprintId: 1530,
    printifyProviderId: 99,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Plaques & Signs > Solid Wood Pet Plaques',
    artworkPlate: '/art-plates/pet-portrait-watercolor.webp',
    formFactor: 'birch-plaque',
    physicalMedium: '0.75" Solid Birch Hardwood Wall Plaque',
    plateNumber: 'ARCHIVE EDITION NO. 09',
    categoryLabel: 'Solid Birch Hardwood Plaque',
    mode: 'pet_memorial',
    supportsPhotoUpload: true,
    photoUploadLabel: 'Upload Your Dog or Cat’s Photo',
    photoUploadHint: 'Frames your pet’s photo inside our gilded watercolor laurel wreath with Warm, B&W, or Sketch filters.',
    supportsAudioUpload: false,
    supportsGpsLookup: false,
    supportsFrameFinish: false,
    variantStepHeading: '04. Select Solid Birch Wood Plaque Size',
    variants: [
      {
        id: 'birch-8x8',
        printifyVariantId: 109695,
        label: '8" x 8" Solid Birch Hardwood Plaque + Jute Hanging Cord',
        dimensions: '8 x 8 in (20.3 x 20.3 cm) · Solid Birch Wood',
        subtitle: 'UV-struck directly onto natural birch hardwood with organic woodgrain',
        priceUsd: 69,
        compareAtUsd: 92,
      },
      {
        id: 'birch-10x10',
        printifyVariantId: 109696,
        label: '10" x 10" Gallery Solid Birch Hardwood Plaque + Jute Cord',
        dimensions: '10 x 10 in (25.4 x 25.4 cm) · Solid Birch Wood',
        subtitle: 'Our most popular pet portrait size · Includes natural jute rope hanger · Free US delivery',
        priceUsd: 79,
        compareAtUsd: 105,
        badge: 'Most Popular',
      },
      {
        id: 'birch-12x12',
        printifyVariantId: 109697,
        label: '12" x 12" Statement Solid Birch Hardwood Wall Plaque',
        dimensions: '12 x 12 in (30.5 x 30.5 cm) · Solid Birch Wood',
        subtitle: 'Large hallway or fireplace mantel tribute · Free 3 to 5 day US shipping',
        priceUsd: 94,
        compareAtUsd: 125,
      },
    ],
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Watercolor Pet Portrait: Solid Birch Hardwood Wall Plaque',
    shortTitle: 'Solid Birch Wood Pet Plaque',
    subtitle: 'UV-Struck Fine Art Watercolor Pet Portrait on Solid Birch Hardwood With Natural Jute Hanging Cord',
    badge: 'Solid Birch Wood + Photo Upload',
    startingPriceUsd: 69,
    popularPriceUsd: 79,
    previewImage: '/mockups/custom-pet-memorial-1.webp',
    mockupGallery: [
      '/mockups/custom-pet-memorial-1.webp',
      '/mockups/custom-pet-memorial-2.webp',
      '/mockups/custom-pet-memorial-3.webp',
      '/mockups/custom-pet-memorial-4.webp',
    ],
    description:
      'UV-printed directly onto solid natural birch hardwood with warm organic woodgrain and a braided jute hanging cord. Upload your own dog or cat photo, which is framed automatically inside our gilded watercolor laurel wreath, or customize our hand-painted Golden Retriever portrait.',
    paperSpec: '0.75" Solid Natural Birch Hardwood · Braided Jute Hanging Cord',
    defaultHeadline: 'BARNABY',
    defaultSubline: 'The best boy on every trail, every morning walk, and every quiet evening.',
    defaultLocation: 'Forever Our Loyal Companion',
    defaultDateText: '2014 to 2026',
    defaultCoords: 'THE HEART OF OUR HOME',
    presets: [
      {
        label: 'Loyal Dog Tribute',
        headline: 'BARNABY',
        subline: 'The best boy on every trail, every morning walk, and every quiet evening.',
        location: 'Forever Our Loyal Companion',
        dateText: '2014 to 2026',
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
      'UV-printed directly onto solid natural birch hardwood with a braided jute hanging cord',
      'Upload your own dog or cat photo to frame it inside our watercolor laurel wreath backdrop',
      'Includes Warm Color, Classic B&W Film, and Fine Sketch portrait filters',
      'Crafted and shipped from our US woodshop studios in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Mark & Jenna T.',
        location: 'Austin, TX',
        title: 'Printed on real solid birch wood, so warm and organic',
        body: 'We uploaded our Golden’s photo and the watercolor laurel wreath on solid wood with the jute rope hanger looks so heartfelt in our hallway.',
        formatPurchased: '10" x 10" Gallery Solid Birch Hardwood Plaque + Jute Cord',
      },
    ],
  },
  {
    slug: 'custom-coordinates-print',
    sku: 'EVM-HOMESLATE-05',
    printifyProductId: '6ad8f85538e3bd079b02d057',
    printifyBlueprintId: 5344,
    printifyProviderId: 99,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Plaques & Signs > Chiseled Slate House Plaques',
    artworkPlate: '/art-plates/home-architecture-watercolor.webp',
    formFactor: 'chiseled-slate',
    physicalMedium: 'Raw Hand-Chiseled Natural Stone Slate + Stand',
    plateNumber: 'ARCHIVE EDITION NO. 10',
    categoryLabel: 'Chiseled Slate Home Portrait',
    mode: 'coordinates',
    supportsPhotoUpload: true,
    photoUploadLabel: 'Upload Photo of Your Home (Optional)',
    photoUploadHint: 'Upload a photo of your actual house or keep our blooming hydrangea craftsman home illustration.',
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: false,
    variantStepHeading: '04. Select Chiseled Stone Slate Size',
    variants: [
      {
        id: 'homeslate-8x8',
        printifyVariantId: 243924,
        label: '8" x 8" Square Hand-Chiseled Stone Slate + Display Feet',
        dimensions: '8 x 8 in (20.3 x 20.3 cm)',
        subtitle: 'Raw hand-fractured natural stone slate with display feet · Ideal for kitchen counters & shelves',
        priceUsd: 74,
        compareAtUsd: 98,
      },
      {
        id: 'homeslate-7x11',
        printifyVariantId: 243923,
        label: '7" x 11" Architectural Stone Slate Plaque + Display Feet',
        dimensions: '7 x 11 in (17.8 x 27.9 cm)',
        subtitle: 'Bestselling housewarming & realtor closing edition · Free 3 to 5 day US shipping',
        priceUsd: 89,
        compareAtUsd: 118,
        badge: 'Most Popular',
      },
    ],
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Our First Home Watercolor Portrait: Chiseled Stone Slate Plaque',
    shortTitle: 'First Home Slate Plaque',
    subtitle: 'Architectural Watercolor House Portrait Infused Onto Raw Chiseled Natural Stone Slate With Display Feet',
    badge: '#1 Housewarming & Realtor Gift',
    startingPriceUsd: 74,
    popularPriceUsd: 89,
    previewImage: '/mockups/custom-coordinates-print-1.webp',
    mockupGallery: [
      '/mockups/custom-coordinates-print-1.webp',
      '/mockups/custom-coordinates-print-2.webp',
    ],
    description:
      'Celebrate a first home, family homestead, or closing-day milestone on genuine hand-chiseled natural stone slate. Upload a photo of your own house framed in our watercolor laurel wash, or personalize our golden-hour craftsman home illustration with your street address and 1-click GPS coordinates.',
    paperSpec: 'Hand-Fractured Natural Sedimentary Stone Slate · Display Stand Included',
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
      'Hand-chiseled natural stone slate plaque with custom display feet',
      'Upload a photo of your actual house or customize our blooming hydrangea craftsman home art',
      '1-Click GPS Coordinate lookup from any US street address or town',
      'Sits proudly on an entryway table, fireplace mantel, or kitchen counter',
    ],
    reviews: [
      {
        author: 'Megan S.',
        location: 'Denver, CO',
        title: 'Sits right on our entryway console table!',
        body: 'The raw chiseled stone edge makes the watercolor house illustration look so high-end. Every guest who walks through our front door compliments it.',
        formatPurchased: '7" x 11" Architectural Stone Slate Plaque + Display Feet',
      },
    ],
  },
  {
    slug: 'newborn-birth-stat-portrait',
    sku: 'EVM-BIRTH-06',
    printifyProductId: '6ad8f8567f85ecd3f8022c92',
    printifyBlueprintId: 492,
    printifyProviderId: 36,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Artwork > Framed Nursery Prints',
    artworkPlate: '/art-plates/nursery-moon-watercolor.webp',
    formFactor: 'framed-print',
    physicalMedium: 'Nursery Hardwood Framed 310gsm Cotton Rag',
    plateNumber: 'ARCHIVE EDITION NO. 11',
    categoryLabel: 'Storybook Nursery Framed Art',
    mode: 'birth_stat',
    supportsPhotoUpload: true,
    photoUploadLabel: 'Upload Baby’s Hospital Portrait (Optional)',
    photoUploadHint: 'Upload a newborn photo to frame inside our gilded watercolor wreath, or keep the sleeping moon illustration.',
    supportsAudioUpload: false,
    supportsGpsLookup: false,
    supportsFrameFinish: true,
    allowedFrames: ['gallery_white', 'matte_black'],
    frameFinishHeading: '02. Select Nursery Hardwood Frame Finish',
    variantStepHeading: '05. Select Nursery Framed Print Size',
    variants: [
      {
        id: 'nursery-11x14',
        printifyVariantId: 65401,
        variantIdByFrame: {
          gallery_white: 65401,
          matte_black: 65400,
        },
        label: '11" x 14" Solid Hardwood Nursery Framed Print',
        dimensions: '11 x 14 in (27.9 x 35.6 cm)',
        subtitle: '310gsm warm cotton rag · Solid wood frame · Free 3 to 5 day US shipping',
        priceUsd: 69,
        compareAtUsd: 95,
      },
      {
        id: 'nursery-12x18',
        printifyVariantId: 65403,
        variantIdByFrame: {
          gallery_white: 65403,
          matte_black: 65402,
        },
        label: '12" x 18" Gallery Nursery Hardwood Framed Edition',
        dimensions: '12 x 18 in (30.5 x 45.7 cm)',
        subtitle: 'Ideal above a crib or changing table · Ready to hang · Free US delivery',
        priceUsd: 79,
        compareAtUsd: 110,
        badge: 'Most Popular',
      },
      {
        id: 'nursery-18x24',
        printifyVariantId: 65407,
        variantIdByFrame: {
          gallery_white: 65407,
          matte_black: 65406,
        },
        label: '18" x 24" Statement Nursery Hardwood Framed Print',
        dimensions: '18 x 24 in (45.7 x 61.0 cm)',
        subtitle: 'Full nursery centerpiece scale · Free Priority US delivery',
        priceUsd: 119,
        compareAtUsd: 155,
      },
    ],
    defaultColorway: 'dusty_rose',
    defaultFrame: 'gallery_white',
    title: 'Storybook Sleeping Moon & Baby Birth Stats (Framed Edition)',
    shortTitle: 'Storybook Moon Nursery Print',
    subtitle: 'Whimsical Watercolor Sleeping Crescent Moon & Bunny Illustration With Baby’s Exact Birth Stats',
    badge: 'Top New Parent & Nursery Gift',
    startingPriceUsd: 69,
    popularPriceUsd: 79,
    previewImage: '/mockups/newborn-birth-stat-portrait-1.webp',
    mockupGallery: [
      '/mockups/newborn-birth-stat-portrait-1.webp',
      '/mockups/newborn-birth-stat-portrait-2.webp',
      '/mockups/newborn-birth-stat-portrait-3.webp',
      '/mockups/newborn-birth-stat-portrait-4.webp',
    ],
    description:
      'A dreamy, storybook watercolor centerpiece for the nursery. Features a peaceful baby bunny sleeping in a golden crescent moon among pastel clouds and hanging stars, or upload your newborn’s hospital photo, inscribed with birth weight, length, minute, and city.',
    paperSpec: '310gsm Warm Archival Cotton Rag · Solid Hardwood Nursery Frame',
    defaultHeadline: 'LEO ALEXANDER BROOKS',
    defaultSubline: 'Loved Beyond Measure From Your Very First Breath',
    defaultLocation: 'Boston, Massachusetts',
    defaultDateText: 'August 19, 2025 at 4:18 AM',
    defaultCoords: '7 LBS 11 OZ  •  20.5 INCHES',
    presets: [
      {
        label: 'Baby Boy Nursery',
        headline: 'LEO ALEXANDER BROOKS',
        subline: 'Loved Beyond Measure From Your Very First Breath',
        location: 'Boston, Massachusetts',
        dateText: 'August 19, 2025 at 4:18 AM',
        coords: '7 LBS 11 OZ  •  20.5 INCHES',
      },
      {
        label: 'Baby Girl Nursery',
        headline: 'CLARA ELIZABETH MONROE',
        subline: 'Our Greatest Blessing & Sweetest Dream',
        location: 'Charleston, South Carolina',
        dateText: 'May 19, 2025 at 11:04 PM',
        coords: '7 LBS 6 OZ  •  20.0 INCHES',
      },
    ],
    highlights: [
      'Hand-painted storybook sleeping crescent moon, pastel clouds, golden stars, and bunny',
      'Optional newborn hospital portrait upload inside our gilded watercolor nursery wreath',
      'Records full name, birth date, exact minute, weight in lbs/oz, and length in inches',
      'Framed in solid wood and shipped gift-ready in 3 to 5 business days',
    ],
    reviews: [
      {
        author: 'Emily & Sam W.',
        location: 'Raleigh, NC',
        title: 'The sleeping moon watercolor is the sweetest thing in our nursery!',
        body: 'Ordered one for above the crib and one for grandma. The soft pastel clouds and golden stars on warm cream paper look straight out of a classic children’s book.',
        formatPurchased: '12" x 18" Gallery Nursery Hardwood Framed Edition',
      },
    ],
  },
  {
    slug: 'marathon-finisher-route-print',
    sku: 'EVM-STARACRYL-11',
    printifyProductId: '6ad8f8580481ae630e072c79',
    printifyBlueprintId: 1303,
    printifyProviderId: 220,
    googleProductCategory: '500044',
    productType: 'Home & Garden > Decor > Plaques & Signs > Crystal Acrylic Nightstand Plaques',
    artworkPlate: '/art-plates/celestial-nebula.webp',
    formFactor: 'acrylic-stand',
    physicalMedium: 'Crystal Acrylic Nightstand Plaque + Hardwood Stand',
    plateNumber: 'ARCHIVE EDITION NO. 12',
    categoryLabel: 'Nightstand Starlight Acrylic',
    mode: 'marathon_route',
    supportsPhotoUpload: false,
    supportsAudioUpload: false,
    supportsGpsLookup: true,
    supportsFrameFinish: false,
    frameFinishHeading: '02. Natural Carved Hardwood Stand',
    variantStepHeading: '04. Select Crystal Acrylic Plaque Size',
    variants: [
      {
        id: 'starlight-5x8',
        printifyVariantId: 98609,
        label: '5.1" x 7.9" Nightstand Crystal Acrylic + Hardwood Stand',
        dimensions: '5.1 x 7.9 in (13 x 20 cm)',
        subtitle: 'Diamond-polished optical acrylic block + carved hardwood base · Free US shipping',
        priceUsd: 69,
        compareAtUsd: 95,
        badge: 'Most Popular',
      },
      {
        id: 'starlight-8x12',
        printifyVariantId: 98610,
        label: '7.9" x 11.8" Statement Crystal Acrylic + Hardwood Stand',
        dimensions: '7.9 x 11.8 in (20 x 30 cm)',
        subtitle: 'Large dresser & mantel scale · Free 3 to 5 day US delivery',
        priceUsd: 89,
        compareAtUsd: 120,
      },
    ],
    defaultColorway: 'midnight_gold',
    defaultFrame: 'white_oak',
    title: 'Roman Numeral Anniversary & Starlight: Acrylic Plaque & Wood Stand',
    shortTitle: 'Starlight Acrylic + Wood Stand',
    subtitle: 'Diamond-Polished Crystal Acrylic Nightstand Block in a Solid Hardwood Base With Milky Way Nebula Art',
    badge: 'Romantic Nightstand Keepsake',
    startingPriceUsd: 69,
    popularPriceUsd: 69,
    previewImage: '/mockups/marathon-finisher-route-print-2.webp',
    mockupGallery: [
      '/mockups/marathon-finisher-route-print-2.webp',
      '/mockups/marathon-finisher-route-print-1.webp',
      '/mockups/marathon-finisher-route-print-3.webp',
      '/mockups/marathon-finisher-route-print-4.webp',
    ],
    description:
      'Designed specifically for bedroom nightstands, desks, and bookshelves. Our deep-indigo and gold-dust Milky Way nebula is reverse-printed onto thick optical crystal acrylic seated in a warm solid hardwood stand, inscribed with your Roman numeral wedding date or milestone.',
    paperSpec: '5.1" x 7.9" or 7.9" x 11.8" Optical Cast Crystal Acrylic · Solid Hardwood Stand',
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
      'Thick optical cast acrylic plaque paired with a solid carved hardwood stand',
      'Luminous indigo and golden Milky Way nebula catches ambient room light through the acrylic edges',
      '1-Click GPS Coordinate lookup for any city, wedding venue, or engagement spot',
      'Ships gift-ready in 3 to 5 business days from our US studios',
    ],
    reviews: [
      {
        author: 'Chris M.',
        location: 'Boston, MA',
        title: 'Best anniversary gift, sits right on her nightstand',
        body: 'Didn’t even need to find wall space or a hammer! The crystal acrylic block slots right into the wood base and the Milky Way art looks 3D inside the glass.',
        formatPurchased: '5.1" x 7.9" Nightstand Crystal Acrylic + Hardwood Stand',
      },
    ],
  },
]

export function getEvermarkProductBySlug(slug: string): EvermarkProduct | undefined {
  return EVERMARK_CATALOG.find((p) => p.slug === slug)
}
