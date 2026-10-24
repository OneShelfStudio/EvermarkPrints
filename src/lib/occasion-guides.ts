import { EVERMARK_CATALOG, EvermarkProduct } from '@/lib/catalog'

export interface OccasionGuide {
  slug: string
  kicker: string
  title: string
  metaTitle: string
  metaDescription: string
  intro: string
  highlightTip: string
  productSlugs: string[]
  faqs: { question: string; answer: string }[]
}

export const OCCASION_GUIDES: OccasionGuide[] = [
  {
    slug: 'anniversary-couples',
    kicker: 'ANNIVERSARY · WEDDING · FIRST DANCE KEEPSAKES',
    title: 'Personalized Anniversary & Wedding Gifts Crafted in US Studios',
    metaTitle:
      'Custom Anniversary & Wedding Gifts | Night Sky Star Maps, Soundwave Art & Triptychs',
    metaDescription:
      'Shop handcrafted custom anniversary and wedding keepsakes: exact night sky star maps, scannable voice & first dance soundwave acrylic blocks, vinyl record prints, and 3-panel triptychs. Free 3 to 5 day US shipping.',
    intro:
      'Celebrate a 1st paper anniversary, 5th wood anniversary, wedding day, or the night your story began. Every Evermark Prints keepsake is custom-plotted from your exact date, location, GPS coordinates, or first-dance song and shipped complimentary in 3 to 5 business days across all 50 US states.',
    highlightTip:
      'Most Popular Anniversary Pairing: Combine the Custom Night Sky Star Map (framed in solid American Walnut) with a matching Scannable First-Dance Soundwave Acrylic Block.',
    productSlugs: [
      'custom-star-map',
      'custom-soundwave-art',
      'custom-vinyl-song-portrait',
      'met-engaged-married-triptych',
      'coastal-bathymetry-chart',
      'marathon-finisher-route-print',
    ],
    faqs: [
      {
        question: 'Which custom keepsake is best for a 1st (Paper) or 5th (Wood) Anniversary?',
        answer:
          'Our 310gsm Archival Cotton Rag Framed Star Map and Photo Vinyl Song Portrait honor both the traditional 1st Paper Anniversary and 5th Wood Anniversary (framed in kiln-dried American Black Walnut, Warm Honey Oak, or Gallery Matte Black Ash).',
      },
      {
        question: 'Can we scan the Soundwave or Vinyl print with a smartphone to hear our wedding song?',
        answer:
          'Yes. Both our Voice & Song Waveform Acrylic Block and Vinyl Record Portrait include a scannable acoustic QR code that opens our interactive memory player with instant Spotify, YouTube, and harmonic playback.',
      },
    ],
  },
  {
    slug: 'mom-and-grandma',
    kicker: 'MOTHER’S DAY · GRANDPARENTS · FAMILY HERITAGE',
    title: 'Custom Gifts for Mom, Nana & Grandma',
    metaTitle:
      'Personalized Gifts for Mom & Grandma | Custom Family Birth Flower Woven Blankets',
    metaDescription:
      'Design a custom family birth flower bouquet jacquard-woven cotton throw blanket, scented soy candle, or family home portrait for Mom, Nana, or Grandma. Free 3 to 5 day US delivery.',
    intro:
      'Create an heirloom that celebrates every child and grandchild in the family garden. Select each family member’s birth month flower (from January Carnation to December Narcissus) and see their individual stems and botanical name tags bloom live on our 100% cotton jacquard-woven throw blanket.',
    highlightTip:
      'Collector Tip: Add a 2nd identical blanket or framed print at 25% off during customization so both Mom and Grandma receive a matching family heirloom.',
    productSlugs: [
      'family-tree-botanical-print',
      'custom-book-stack-print',
      'custom-coordinates-print',
      'custom-star-map',
    ],
    faqs: [
      {
        question: 'How many family members and birth flowers can I add to the Family Bouquet Blanket?',
        answer:
          'Our live customizer supports up to 6 individual family member stems and birth month flowers with custom name tags directly on the bouquet, plus your family title and established heritage note.',
      },
      {
        question: 'Is the Family Birth Flower Blanket printed or truly woven?',
        answer:
          'It is loom-woven in the USA from 100% cotton dyed yarns (50" x 60" or 60" x 80") with colorful fringed edges, so the botanical artwork never fades, peels, or stiffens in the wash.',
      },
    ],
  },
  {
    slug: 'housewarming-first-home',
    kicker: 'FIRST HOME · NEW ADDRESS · CLOSING DAY GIFTS',
    title: 'Custom First Home & Housewarming Keepsake Gifts',
    metaTitle:
      'Custom Housewarming & First Home Gifts | Watercolor House Portraits & Coordinate Slates',
    metaDescription:
      'Commemorate a first home or closing day with a custom watercolor home portrait on chiseled natural stone slate, custom GPS coordinates print, coastal nautical chart, or apothecary soy candle.',
    intro:
      'Turn a cherished street address, closing date, and house photo into a permanent architectural heirloom. Upload a photo of the home to see it framed inside a warm watercolor vignette on raw chiseled natural stone slate, or auto-plot exact GPS coordinates with one click.',
    highlightTip:
      'Realtor & Closing Gift Favorite: Pair the Chiseled Stone Slate Home Portrait with our Custom Label 9oz Scented Amber Glass Soy Candle.',
    productSlugs: [
      'custom-coordinates-print',
      'custom-book-stack-print',
      'coastal-bathymetry-chart',
      'patent-architectural-triptych',
    ],
    faqs: [
      {
        question: 'Does the First Home Stone Slate come with display feet?',
        answer:
          'Yes. Every raw hand-chiseled natural stone slate plaque includes two sturdy display feet for mantels, bookshelves, and entryway consoles.',
      },
      {
        question: 'Can I look up the exact GPS coordinates from a street address automatically?',
        answer:
          'Yes. Type any US city or street address into the customizer and click "Auto-Find GPS" to plot the exact latitude and longitude coordinates onto your artwork.',
      },
    ],
  },
  {
    slug: 'pet-memorial-gifts',
    kicker: 'PET TRIBUTE · RAINBOW BRIDGE · DOG & CAT PORTRAITS',
    title: 'Custom Watercolor Pet Portrait & Pet Memorial Keepsakes',
    metaTitle:
      'Custom Pet Memorial & Dog/Cat Portrait Gifts | Watercolor Birch Wood Plaques',
    metaDescription:
      'Honor a beloved dog or cat with a custom watercolor pet portrait printed on a solid natural birch hardwood hanging plaque with braided jute cord. Free 3 to 5 day US delivery.',
    intro:
      'Honor a loyal companion with a warm, gallery-grade tribute. Upload your favorite photo of your dog or cat to preview it inside a soft watercolor vignette on a solid natural birch wood plaque with braided jute hanging cord, complete with their name, life dates, and tribute message.',
    highlightTip:
      'Ships gift-ready with zero price tags on the packing slip and a complimentary gift message card.',
    productSlugs: ['custom-pet-memorial', 'custom-book-stack-print'],
    faqs: [
      {
        question: 'What kind of photo works best for the Custom Pet Portrait Birch Wood Plaque?',
        answer:
          'Any clear smartphone or camera photo (.JPG or .PNG) works beautifully. Our live canvas automatically applies soft watercolor edge-feathering and lets you switch between Warm Color, Black & White Film, and Charcoal Sketch finishes.',
      },
      {
        question: 'Can I include a sympathy gift note when shipping directly to a friend?',
        answer:
          'Yes. Check "This Commission is a Gift" before checkout to include your complimentary sympathy message; all orders ship with zero prices on the packing slip.',
      },
    ],
  },
  {
    slug: 'newborn-nursery',
    kicker: 'NEW BABY · NURSERY DECOR · FIRST BIRTHDAY',
    title: 'Personalized Newborn Birth Stat & Nursery Wall Art',
    metaTitle:
      'Custom Newborn Birth Stat Prints & Nursery Decor | Framed Cotton Canvas & Star Maps',
    metaDescription:
      'Welcome a new baby with a custom storybook sleeping moon newborn birth stat framed canvas, exact night-of-birth star map, or family birth flower woven blanket. Free US delivery.',
    intro:
      'Record every precious detail of the day they arrived: baby’s full name, birth date and time, weight in pounds and ounces, length in inches, and hospital or hometown. Printed on museum-grade cotton canvas in a floating hardwood frame or archival rag.',
    highlightTip:
      'Grandparent Favorite: Use the "+ Add 2nd Identical Copy (25% Off)" checkbox to strike a matching nursery keepsake for proud grandparents.',
    productSlugs: [
      'newborn-birth-stat-portrait',
      'custom-star-map',
      'family-tree-botanical-print',
    ],
    faqs: [
      {
        question: 'Can I upload a newborn baby photo onto the Birth Stat Canvas?',
        answer:
          'Yes. You can either keep the hand-illustrated Storybook Sleeping Moon & Clouds watercolor illustration or upload your baby’s photo directly into the central watercolor medallion.',
      },
      {
        question: 'How fast does nursery wall art ship?',
        answer:
          'All newborn and nursery editions are crafted in our US studios and arrive in 3 to 5 business days with complimentary tracked shipping.',
      },
    ],
  },
]

export function getOccasionGuideBySlug(slug: string): OccasionGuide | undefined {
  return OCCASION_GUIDES.find((g) => g.slug === slug)
}

export function getProductsForOccasionGuide(guide: OccasionGuide): EvermarkProduct[] {
  return guide.productSlugs
    .map((slug) => EVERMARK_CATALOG.find((p) => p.slug === slug))
    .filter((p): p is EvermarkProduct => Boolean(p))
}
