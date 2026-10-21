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
    label: 'Warm Parchment & Saddle Espresso',
    shortLabel: 'Warm Parchment',
    bgHex: '#f5ece0',
    cardHex: '#ebe0d0',
    inkHex: '#261a13',
    accentHex: '#9e472a',
    mutedHex: '#6e5a4c',
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
    id: 'heritage_forest',
    label: 'Heritage Forest Green & Antique Gold',
    shortLabel: 'Heritage Forest',
    bgHex: '#1b3027',
    cardHex: '#12211b',
    inkHex: '#f7f4ef',
    accentHex: '#d8ae64',
    mutedHex: '#a3b8ae',
  },
  {
    id: 'terracotta_sienna',
    label: 'Tuscan Terracotta & Warm Ivory',
    shortLabel: 'Terracotta Clay',
    bgHex: '#7a331e',
    cardHex: '#5e2515',
    inkHex: '#fcf8f2',
    accentHex: '#e5c178',
    mutedHex: '#e2bfb3',
  },
  {
    id: 'dusty_rose',
    label: 'Heirloom Blush & Warm Rosewater',
    shortLabel: 'Heirloom Blush',
    bgHex: '#f8efe8',
    cardHex: '#efe2d8',
    inkHex: '#3d2722',
    accentHex: '#b87b6a',
    mutedHex: '#7d625a',
  },
  {
    id: 'bourbon_walnut',
    label: 'Bourbon Espresso & Warm Gold',
    shortLabel: 'Bourbon Espresso',
    bgHex: '#261a13',
    cardHex: '#1a110c',
    inkHex: '#f7f4ef',
    accentHex: '#d8ae64',
    mutedHex: '#b5a395',
  },
  {
    id: 'coastal_navy',
    label: 'Atlantic Deep Slate & Warm Brass',
    shortLabel: 'Atlantic Slate',
    bgHex: '#0d2130',
    cardHex: '#071520',
    inkHex: '#f0f9ff',
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
    label: 'Instant High-Resolution Digital Master',
    dimensions: 'Unwatermarked Master File',
    subtitle: 'Immediate unwatermarked download upon checkout for same-day local framing',
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
    'Download a clean, unwatermarked high-resolution master file immediately after checkout—ideal for sharing with family, phone lockscreens, or printing extra desk copies.',
}

export interface EvermarkProduct {
  slug: string
  sku: string
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
    plateNumber: 'COLLECTION I',
    categoryLabel: 'Celestial Cartography',
    mode: 'starmap',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'midnight_gold',
    defaultFrame: 'walnut',
    title: 'The Exact Night Sky Star Map',
    shortTitle: 'Night Sky Star Map',
    subtitle: 'Astronomical Constellation Chart Plotted to the Exact Date, Hour & Latitude of Your Milestone',
    badge: '#1 Anniversary & Birth Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-star-map.webp',
    description:
      'Whether it was the evening you met, the minute a child entered the world, or the night you stood under the lights and said "I do," the stars overhead formed a geometry that will never repeat. Plot your exact sky projection—or embed a cherished photo inside the celestial disc.',
    paperSpec: '310gsm German Etching Cotton Rag · Solid Hardwood Frame',
    defaultHeadline: 'THE NIGHT OUR STORY BEGAN',
    defaultSubline: 'Underneath these exact stars, everything changed forever.',
    defaultLocation: 'Charleston, South Carolina',
    defaultDateText: 'October 14, 2022 · 9:42 PM',
    defaultCoords: '32.7765° N · 79.9311° W',
    presets: [
      {
        label: 'Anniversary / Wedding',
        headline: 'THE NIGHT OUR STORY BEGAN',
        subline: 'Underneath these exact stars, everything changed forever.',
        location: 'Charleston, South Carolina',
        dateText: 'October 14, 2022 · 9:42 PM',
        coords: '32.7765° N · 79.9311° W',
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
      'Astronomical star positions and constellation vectors calculated for your date and city',
      'Optional custom photo medallion or pure celestial cartography in 8 warm designer palettes',
      'Printed on 310gsm acid-free museum cotton rag with solid Walnut, Oak, or Matte Black framing',
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
    plateNumber: 'COLLECTION II',
    categoryLabel: 'Acoustic Draftsmanship',
    mode: 'soundwave',
    supportsAudioUpload: true,
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Custom Voice & Song Acoustic Waveform',
    shortTitle: 'Voice & Song Waveform',
    subtitle: 'Upload a Voice Memo, Record Your Microphone Live, or Enter Your First Dance Song Lyrics',
    badge: 'Upload Audio or Record Live',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-soundwave-art.webp',
    description:
      'Some voices and melodies deserve a permanent place on your wall. Upload a saved voicemail, record a 5-second voice note directly from your microphone, or enter your wedding song to generate a balanced harmonic bar monograph.',
    paperSpec: '310gsm Warm Cotton Rag · Archival Pigment Ink',
    defaultHeadline: 'ALWAYS IN OUR HEARTS',
    defaultSubline: '“I love you to the moon and back” · Recorded Voice Note',
    defaultLocation: 'Saved Voice Recording',
    defaultDateText: 'Forever Remembered',
    defaultCoords: '00:00 —————————●———— 00:18',
    presets: [
      {
        label: 'Saved Voicemail',
        headline: 'ALWAYS IN OUR HEARTS',
        subline: '“I love you to the moon and back” · Recorded Voice Note',
        location: 'Saved Voice Recording',
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
        label: 'Baby’s First Laugh',
        headline: 'THE SOUND OF YOUR FIRST LAUGH',
        subline: 'Recorded in the kitchen on a Sunday morning.',
        location: 'Portland, Oregon',
        dateText: 'November 3, 2025',
        coords: '00:00 ————●————————— 00:12',
      },
    ],
    highlights: [
      'Upload any .MP3, .M4A, or .WAV file—or record live with your phone/computer microphone',
      'Optional portrait photo medallion above or behind the harmonic waveform',
      'Crafted on heavyweight matte cotton canvas & paper in US partner workshops',
      'Arrives ready to hang with pre-installed gallery hardware in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Claire R.',
        location: 'Charlotte, NC',
        title: 'Uploaded my dad’s saved voicemail right from my iPhone',
        body: 'Ordered the Two-Print Collector Pair—one for my study and one for my sister. Seeing his actual voice waveform framed in Warm Oak made us both cry.',
        formatPurchased: 'Two-Print Collector Pair',
      },
    ],
  },
  {
    slug: 'custom-vinyl-song-portrait',
    sku: 'EVM-VINYL-03',
    plateNumber: 'COLLECTION III',
    categoryLabel: 'Photo & Music Keepsake',
    mode: 'vinyl_lyric',
    supportsPhotoUpload: true,
    supportsAudioUpload: true,
    defaultColorway: 'heritage_forest',
    defaultFrame: 'walnut',
    title: 'Custom Photo & First Dance Vinyl Lyric Print',
    shortTitle: 'Photo & Vinyl Song Print',
    subtitle: 'Your Favorite Photo Framed Inside a Classic Vinyl Record Label Surrounded by Spiral Song Lyrics',
    badge: 'Bestselling Couple’s Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-vinyl-song-portrait.webp',
    description:
      'Celebrate the song that defines your relationship. Upload your favorite wedding or couple’s photo for the center vinyl record label, enter your song title, artist, and favorite lyrics, and watch them spiral around the archival grooves.',
    paperSpec: '310gsm Warm Cotton Rag · Solid Walnut or Oak Frame',
    defaultHeadline: 'OUR FIRST DANCE SONG',
    defaultSubline: '“You are my finest adventure and my quietest harbor.”',
    defaultLocation: 'At Last — Etta James',
    defaultDateText: 'September 21, 2024 · Savannah, GA',
    defaultCoords: 'SIDE A  ·  33 1/3 RPM STEREO MASTER',
    presets: [
      {
        label: 'Wedding First Dance',
        headline: 'OUR FIRST DANCE SONG',
        subline: '“You are my finest adventure and my quietest harbor.”',
        location: 'At Last — Etta James',
        dateText: 'September 21, 2024 · Savannah, GA',
        coords: 'SIDE A  ·  33 1/3 RPM STEREO MASTER',
      },
      {
        label: 'Anniversary Song',
        headline: 'TEN YEARS OF LOVING YOU',
        subline: '“And I’d choose you; in a hundred lifetimes, I’d choose you.”',
        location: ' Tennessee Whiskey — Chris Stapleton',
        dateText: 'October 14, 2016 – 2026',
        coords: 'COLLECTOR PRESSING  ·  12" ARCHIVAL EDITION',
      },
    ],
    highlights: [
      'Upload your couple’s photo directly into the center vinyl record medallion',
      'Fine concentric vinyl micro-grooves with warm metallic gold or espresso accents',
      'Also supports uploading your song clip to add a custom acoustic bar footer',
      'Printed & framed in the USA with complimentary 3–5 day delivery',
    ],
    reviews: [
      {
        author: 'Lauren & Matt B.',
        location: 'Charleston, SC',
        title: 'Uploaded our wedding photo into the center of the record!',
        body: 'In the Heritage Forest & Gold colorway with the Walnut frame, this looks like a custom gold record in our living room. Best first-anniversary gift ever.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'custom-pet-memorial',
    sku: 'EVM-PET-04',
    plateNumber: 'COLLECTION IV',
    categoryLabel: 'Photo Portrait & Tribute',
    mode: 'pet_memorial',
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'white_oak',
    title: 'Custom Pet Portrait & Tribute Monograph',
    shortTitle: 'Pet Photo & Tribute Print',
    subtitle: 'Upload Your Dog or Cat’s Photo for an Archival Medallion Portrait or Fine-Line Crest',
    badge: 'Upload Pet Photo',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-pet-memorial.webp',
    description:
      'Honor a loyal companion with a warm, museum-grade portrait monograph. Upload your favorite photo of your dog or cat—choose between Warm Archival Color, Timeless Black & White Film, or Charcoal Sketch—paired with their name, years, and your favorite memory.',
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
        label: 'Beloved Cat Portrait',
        headline: 'OLIVER',
        subline: 'Keeper of the sunny windowpane and quiet afternoon companion.',
        location: 'Beloved Member of Our House',
        dateText: '2010 – 2026',
        coords: 'Always Remembered',
      },
    ],
    highlights: [
      'Upload any photo of your pet from your phone for instant archival portrait framing',
      'Switch between Warm Portrait Color, Classic B&W Film, or Charcoal Sketch filters live',
      'Also includes our minimalist continuous-line crest if no photo is uploaded',
      'Crafted and shipped from US archival studios in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Mark & Jenna T.',
        location: 'Austin, TX',
        title: 'The Charcoal Sketch filter on our Golden Retriever’s photo is unreal',
        body: 'We uploaded a photo from our phone and selected the Charcoal & Espresso filter on Warm Parchment paper. It looks hand-drawn on museum cotton rag.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'custom-coordinates-print',
    sku: 'EVM-COORD-05',
    plateNumber: 'COLLECTION V',
    categoryLabel: 'Topographic & Meridian Series',
    mode: 'coordinates',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'bourbon_walnut',
    defaultFrame: 'walnut',
    title: 'Architectural Latitude & Homestead Print',
    shortTitle: 'First Home & Coordinates',
    subtitle: 'Topographic Meridian Rings or Custom House Portrait Commemorating a First Home or Cabin',
    badge: 'Housewarming Favorite',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-coordinates-print.webp',
    description:
      'Mark the exact coordinates where your family’s history took root. Pair concentric topographic contours—or upload a photo of your home—with your family name, town, established year, and 1-click GPS coordinates.',
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
      '1-Click GPS Coordinate lookup from any US street address, town, or lake',
      'Option to upload a photo of your house for a custom architectural sketch portrait',
      'Eight rich archival palettes including Bourbon Espresso, Heritage Forest & Warm Parchment',
      'Printed and framed in the USA with complimentary 3–5 day delivery',
    ],
    reviews: [
      {
        author: 'Megan S.',
        location: 'Denver, CO',
        title: 'Hangs right in our front entryway',
        body: 'Every guest who walks through our front door pauses to read the coordinates. The Bourbon Espresso palette in the Walnut frame is so warm and rich.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'newborn-birth-stat-portrait',
    sku: 'EVM-BIRTH-06',
    plateNumber: 'COLLECTION VI',
    categoryLabel: 'Nursery & Birth Keepsake',
    mode: 'birth_stat',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'dusty_rose',
    defaultFrame: 'white_oak',
    title: 'Newborn Birth Stat & Baby Portrait Keepsake',
    shortTitle: 'Newborn Birth Stat & Photo',
    subtitle: 'Celebrate a New Arrival With Baby’s Photo, Exact Birth Time, Weight, Length & Hospital Coordinates',
    badge: 'Top New Parent & Nursery Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/newborn-birth-stat-portrait.webp',
    description:
      'Designed for nurseries and proud grandparents. Upload your newborn’s hospital portrait (or ultrasound photo) into a warm archival arch and record their full name, birth time, weight, length, and birth city.',
    paperSpec: '310gsm Warm Cotton Rag · Natural White Oak Frame',
    defaultHeadline: 'CLARA ELIZABETH MONROE',
    defaultSubline: 'Born May 19, 2025 at 4:18 AM  ·  7 lbs 6 oz  ·  20.5 inches',
    defaultLocation: 'Boston, Massachusetts',
    defaultDateText: 'So Very Loved From Your First Breath',
    defaultCoords: '42.3601° N · 71.0589° W',
    presets: [
      {
        label: 'Baby Girl Nursery',
        headline: 'CLARA ELIZABETH MONROE',
        subline: 'Born May 19, 2025 at 4:18 AM  ·  7 lbs 6 oz  ·  20.5 inches',
        location: 'Boston, Massachusetts',
        dateText: 'So Very Loved From Your First Breath',
        coords: '42.3601° N · 71.0589° W',
      },
      {
        label: 'Baby Boy Nursery',
        headline: 'HENRY ALEXANDER BROOKS',
        subline: 'Born August 12, 2025 at 11:04 PM  ·  8 lbs 2 oz  ·  21.0 inches',
        location: 'Charleston, South Carolina',
        dateText: 'Our Greatest Blessing & Adventure',
        coords: '32.7765° N · 79.9311° W',
      },
    ],
    highlights: [
      'Upload baby’s first photo or ultrasound directly into the nursery medallion',
      'Records birth date, exact minute, weight in pounds/ounces, and length in inches',
      'Heirloom Blush, Warm Parchment, and Heritage Forest palettes to match any nursery',
      'Ships gift-ready in 3–5 business days across the USA',
    ],
    reviews: [
      {
        author: 'Emily & Sam W.',
        location: 'Raleigh, NC',
        title: 'Ordered one for the nursery and two for the grandparents!',
        body: 'The Heirloom Blush colorway inside the Natural Oak frame is so soft and warm. Uploading our daughter’s hospital photo took 5 seconds.',
        formatPurchased: 'Two-Print Collector Pair',
      },
    ],
  },
  {
    slug: 'met-engaged-married-triptych',
    sku: 'EVM-TRIP-07',
    plateNumber: 'COLLECTION VII',
    categoryLabel: 'Three-Milestone Cartography',
    mode: 'three_map_triptych',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: '“Met · Engaged · Married” Three-Map Triptych',
    shortTitle: 'Met · Engaged · Married Print',
    subtitle: 'Three Side-by-Side Cartographic Medallions Celebrating the Three Places That Built Your Marriage',
    badge: 'Wedding & 5th Anniversary Hit',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/met-engaged-married-triptych.webp',
    description:
      'Every love story has three defining landmarks: where your paths first crossed, where the question was asked, and where you promised forever. Our Three-Map Triptych frames all three cities and dates side by side.',
    paperSpec: '310gsm Cotton Rag · American Black Walnut Frame',
    defaultHeadline: 'OUR LOVE IN THREE PLACES',
    defaultSubline: 'Met in Boston  ·  Engaged in Big Sur  ·  Married in Charleston',
    defaultLocation: 'Hannah & Luke Monroe',
    defaultDateText: 'Established October 14, 2022',
    defaultCoords: 'THREE MILESTONES  ·  ONE LIFETIME',
    presets: [
      {
        label: 'Met · Engaged · Married',
        headline: 'OUR LOVE IN THREE PLACES',
        subline: 'Met in Boston  ·  Engaged in Big Sur  ·  Married in Charleston',
        location: 'Hannah & Luke Monroe',
        dateText: 'Established October 14, 2022',
        coords: 'THREE MILESTONES  ·  ONE LIFETIME',
      },
      {
        label: 'Met · First Home · Married',
        headline: 'THE CHAPTERS OF OUR STORY',
        subline: 'Met in Chicago  ·  Married in Napa  ·  First Home in Denver',
        location: 'The Anderson Family',
        dateText: '2018  ·  2021  ·  2025',
        coords: '41.8781° N  ·  38.2975° N  ·  39.7392° N',
      },
    ],
    highlights: [
      'Three side-by-side cartographic medallions with terracotta & antique brass detailing',
      'Personalize all three milestone cities, couple names, and years live',
      'Optional center couple photo override for a hybrid photo-and-map keepsake',
      'Framed in solid American hardwood and delivered in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Rachel P.',
        location: 'Chicago, IL',
        title: 'Gave this to my sister and brother-in-law at their bridal shower',
        body: 'Seeing the three cities where they met in college, got engaged, and got married all on one framed print had the whole room talking.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'family-tree-botanical-print',
    sku: 'EVM-FAM-08',
    plateNumber: 'COLLECTION VIII',
    categoryLabel: 'Botanical Family Monograph',
    mode: 'family_botanical',
    supportsPhotoUpload: true,
    defaultColorway: 'heritage_forest',
    defaultFrame: 'white_oak',
    title: 'Family Garden & Generations Botanical Print',
    shortTitle: 'Family Botanical Print',
    subtitle: 'Illustrated Heritage Botanical Crest Personalized With Children & Grandchildren Names',
    badge: '#1 Gift for Mom & Grandma',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/family-tree-botanical-print.webp',
    description:
      'An heirloom tribute to the matriarch of the family. Featuring fine-line botanical stems in antique brass and warm ivory, customized with the family title and the names or birthdates of children and grandchildren.',
    paperSpec: '310gsm Cotton Rag · Natural White Oak or Walnut Frame',
    defaultHeadline: 'NANA’S FAMILY GARDEN',
    defaultSubline: 'Rooted in love, growing together through every season.',
    defaultLocation: 'Clara  ·  Henry  ·  Eleanor  ·  James  ·  Sophie',
    defaultDateText: 'Established 1978 · Three Generations',
    defaultCoords: 'LOVE GROWS HERE FOREVER',
    presets: [
      {
        label: 'Grandma’s Garden',
        headline: 'NANA’S FAMILY GARDEN',
        subline: 'Rooted in love, growing together through every season.',
        location: 'Clara  ·  Henry  ·  Eleanor  ·  James  ·  Sophie',
        dateText: 'Established 1978 · Three Generations',
        coords: 'LOVE GROWS HERE FOREVER',
      },
      {
        label: 'Mother’s Day / Family',
        headline: 'THE MONROE FAMILY TREE',
        subline: 'Built on warm Sunday dinners and unconditional love.',
        location: 'David  ·  Sarah  ·  Olivia  ·  Liam',
        dateText: 'Charleston, South Carolina',
        coords: 'BLESSED BEYOND MEASURE',
      },
    ],
    highlights: [
      'Fine-line heritage botanical artwork in 8 warm designer color palettes',
      'Inscribe all children and grandchildren names or birthdates with instant preview',
      'Option to include a family portrait photo medallion in the center crest',
      'Ships free across the USA in 3–5 business days',
    ],
    reviews: [
      {
        author: 'stranger_things_mom / Kelly D.',
        location: 'Atlanta, GA',
        title: 'My mom cried the second she unwrapped it',
        body: 'We put all 6 grandkids’ names on the Heritage Forest green background with the Warm Oak frame. It looks like a vintage botanical plate from Kew Gardens.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'coastal-bathymetry-chart',
    sku: 'EVM-COAST-09',
    plateNumber: 'COLLECTION IX',
    categoryLabel: 'Hydrographic Survey Series',
    mode: 'coastal_chart',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'coastal_navy',
    defaultFrame: 'white_oak',
    title: 'Coastal Bathymetry & Harbor Survey Chart',
    shortTitle: 'Coastal Bathymetry Chart',
    subtitle: 'Layered Sounding Contours, 32-Point Compass Rose & Custom Shoreline Coordinates',
    badge: 'Coastal & Lake Home Favorite',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/coastal-bathymetry-chart.webp',
    description:
      'Bring your favorite harbor, lake, island, or Atlantic shoreline into your home. Our hydrographic contour engine draws layered depth soundings, a traditional mariner’s compass rose, and your exact beach or mooring coordinates.',
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
        label: 'Southern Coast / Beach',
        headline: 'CHARLESTON HARBOR & SULLIVAN’S ISLAND',
        subline: 'Tidal Channel Soundings & Coastal Meridian',
        location: 'South Carolina Coastal Survey',
        dateText: 'Mean Low Water · Archival Edition',
        coords: '32.7523° N · 79.8651° W',
      },
    ],
    highlights: [
      'Hydrographic depth rings with cardinal compass rose and custom harbor typography',
      '1-Click GPS Coordinate lookup for any US beach, lake, bay, or island destination',
      'Signature Atlantic Deep Slate or Warm Parchment palettes in solid hardwood frames',
      'Ships free in 3–5 business days from US archival print workshops',
    ],
    reviews: [
      {
        author: 'Lauren P.',
        location: 'Newport, RI',
        title: 'Stunning in our coastal hallway',
        body: 'Customized it with the exact coordinates of the harbor where we got engaged in Rhode Island. The Atlantic Slate & Brass ink inside the Natural Oak frame is perfection.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'patent-architectural-triptych',
    sku: 'EVM-PAT-10',
    plateNumber: 'COLLECTION X',
    categoryLabel: 'Engineering & Horology',
    mode: 'patent_blueprint',
    supportsPhotoUpload: true,
    defaultColorway: 'heritage_forest',
    defaultFrame: 'matte_black',
    title: 'Horological & Engineering Patent Blueprint',
    shortTitle: 'Patent & Blueprint Edition',
    subtitle: 'Isometric Mechanical Draftsmanship Personalized With Your Title, Studio Name & Filing Date',
    badge: 'Executive Study Upgrade',
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
        body: 'Put our company founding date in the title block in the Heritage Forest & Brass colorway. Everyone asks where I had it framed.',
        formatPurchased: '24" × 36" Exhibition Statement Frame',
      },
    ],
  },
  {
    slug: 'marathon-finisher-route-print',
    sku: 'EVM-RUN-11',
    plateNumber: 'COLLECTION XI',
    categoryLabel: 'Athletic Milestone Monograph',
    mode: 'marathon_route',
    supportsPhotoUpload: true,
    supportsGpsLookup: true,
    defaultColorway: 'terracotta_sienna',
    defaultFrame: 'matte_black',
    title: 'Custom Marathon & Race Finisher Course Print',
    shortTitle: 'Marathon & Race Finisher Print',
    subtitle: 'Commemorate 26.2 Miles With Your Official Finish Time, Pace, Bib Number & Course Vector',
    badge: 'Runner & Triathlon Favorite',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/marathon-finisher-route-print.webp',
    description:
      'Months of 5:00 AM training runs deserve more than a medal in a drawer. Personalize your race city, runner name, official chip time, pace per mile, and bib number—or upload your finish-line photo.',
    paperSpec: '310gsm Cotton Rag · Gallery Matte Black or Walnut Frame',
    defaultHeadline: 'NEW YORK CITY MARATHON',
    defaultSubline: '26.2 Miles  ·  Staten Island to Central Park',
    defaultLocation: 'Runner: Ryan Bedisee  ·  Bib #14892',
    defaultDateText: 'November 2, 2025',
    defaultCoords: 'CHIP TIME: 03:42:18  ·  PACE: 8:29 / MI',
    presets: [
      {
        label: 'NYC Marathon',
        headline: 'NEW YORK CITY MARATHON',
        subline: '26.2 Miles  ·  Staten Island to Central Park',
        location: 'Runner: Ryan Bedisee  ·  Bib #14892',
        dateText: 'November 2, 2025',
        coords: 'CHIP TIME: 03:42:18  ·  PACE: 8:29 / MI',
      },
      {
        label: 'Boston Marathon',
        headline: 'BOSTON MARATHON FINISHER',
        subline: '26.2 Miles  ·  Hopkinton to Boylston Street',
        location: 'Official Qualifier & Finisher',
        dateText: 'April 20, 2026',
        coords: 'CHIP TIME: 03:18:44  ·  PACE: 7:35 / MI',
      },
    ],
    highlights: [
      'Dynamic course vector & elevation ring with bold archival timing typography',
      'Record your exact chip time, average pace, bib number, and race date',
      'Optional finish-line photo medallion upload inside the course ring',
      'Framed in solid wood and shipped free in 3–5 business days',
    ],
    reviews: [
      {
        author: 'Chris M.',
        location: 'Boston, MA',
        title: 'Best gift after my wife finished her first marathon',
        body: 'Put her exact chip time, pace, and bib number in the Terracotta & Warm Gold palette. She hung it right next to her medal rack.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
  {
    slug: 'custom-book-stack-print',
    sku: 'EVM-BOOK-12',
    plateNumber: 'COLLECTION XII',
    categoryLabel: 'Literary & Library Series',
    mode: 'book_stack',
    supportsPhotoUpload: true,
    defaultColorway: 'linen_espresso',
    defaultFrame: 'walnut',
    title: 'Custom Literary Book Stack & Family Library Print',
    shortTitle: 'Custom Book Stack Print',
    subtitle: 'Personalize an Illustrated Stack of Vintage Hardcover Spines With Your Family Names or Favorite Titles',
    badge: 'Reader & Teacher Gift',
    startingPriceUsd: 29,
    popularPriceUsd: 79,
    previewImage: '/gallery/custom-book-stack-print.webp',
    description:
      'For book lovers, teachers, and home libraries. Personalize our hand-proportioned stack of vintage clothbound book spines with your family members’ names, favorite novels, or the chapters of your life together.',
    paperSpec: '310gsm Warm Cotton Rag · Solid American Walnut Frame',
    defaultHeadline: 'FROM THE LIBRARY OF THE MONROES',
    defaultSubline: 'Stories We Have Lived, Read & Loved Together',
    defaultLocation: 'Charleston  ·  Boston  ·  Big Sur  ·  Paris',
    defaultDateText: 'Private Family Collection',
    defaultCoords: 'EX LIBRIS  ·  EST. 2022',
    presets: [
      {
        label: 'Family Chapters',
        headline: 'FROM THE LIBRARY OF THE MONROES',
        subline: 'Stories We Have Lived, Read & Loved Together',
        location: 'Charleston  ·  Boston  ·  Big Sur  ·  Paris',
        dateText: 'Private Family Collection',
        coords: 'EX LIBRIS  ·  EST. 2022',
      },
      {
        label: 'Book Lover’s Stack',
        headline: 'A LIFE IN BOOKS & COFFEE',
        subline: 'Quiet mornings, dog-eared pages, and warm lamplight.',
        location: 'The Study Reading Nook',
        dateText: 'Curated Personal Anthology',
        coords: 'EX LIBRIS  ·  FIRST EDITION',
      },
    ],
    highlights: [
      'Illustrated stack of vintage clothbound book spines in warm terracotta, forest & gold',
      'Personalize the library ex-libris header, spine inscriptions, and established year',
      'Looks extraordinary above a reading chair, bookshelf, or teacher’s desk',
      'Printed on 310gsm cotton rag and framed in the USA (3–5 day free shipping)',
    ],
    reviews: [
      {
        author: 'Sarah J.',
        location: 'Madison, WI',
        title: 'Looks so cozy above my reading chair!',
        body: 'Customized it with our family names and favorite travel cities on the Warm Parchment & Terracotta colorway. The Walnut frame makes it feel like an antique bookshop sign.',
        formatPurchased: '16" × 20" Framed Gallery Edition',
      },
    ],
  },
]

export function getEvermarkProductBySlug(slug: string): EvermarkProduct | undefined {
  return EVERMARK_CATALOG.find((p) => p.slug === slug)
}
