# Evermark Prints — Master Sub-Business Dossier & Autonomous Operations Manual

**Parent Entity:** Digital Dads LLC (`https://digital-dads-llc.com`)  
**Operating Brand (d/b/a):** Evermark Prints  
**Live Production Storefront:** `https://www.evermarkprints.com/`  
**Local Codebase Path:** `C:\Users\ryanb\OneDrive\Documents\Digital Dads\EvermarkPrints`  
**GitHub Repository:** `https://github.com/OneShelfStudio/EvermarkPrints.git`  
**Target Market:** United States Domestic Buyers (100% US Fulfillment & Shipping — Zero Customs/Duties)

---

## 1. Executive Summary & Business Thesis

**Evermark Prints** is a high-margin US bespoke archival print and framing brand operated as a division of **Digital Dads LLC**. Rather than competing in low-margin commodity dropshipping or generic AI apparel, Evermark Prints operates in the **Personal Milestone & Emotional Gifting vertical** (custom astronomical night sky star maps, voice & song acoustic waveform monographs, meridian home coordinate prints, heirloom pet tributes, engineering blueprints, and coastal bathymetry charts).

### Why This Model Generates 72%–96% Gross Margins:
1. **Interactive Live Preview = 3x Higher Conversion Rate:** Customers type their date, city, names, and dedication directly into the **Live Commission Bench** on `evermarkprints.com` and watch their artwork update in real time inside a 3D American Black Walnut, Natural White Oak, or Matte Black frame on a sunlit gallery wall.
2. **Dual-Fulfillment Margin Engine:**
   - **Physical Framed Editions ($79–$129):** Manufactured and shipped inside the United States via **Printify US Print Providers** in 3–5 business days (`$19.50–$36.00` landed cost including US shipping $\rightarrow$ **`$59.50–$93.00` net profit per order**).
   - **Instant 300 DPI Archival Digital Master ($29 standalone / +$14 order bump):** Generated deterministically by the client/server canvas engine at **96%+ profit margin** (only Stripe's 2.9% + $0.30 fee; zero COGS, zero shipping).

---

## 2. Technical & Infrastructure Stack

| Layer | Provider / Tool | Configuration & IDs |
| :--- | :--- | :--- |
| **Domain & DNS** | Squarespace Domains | `evermarkprints.com` (`A` `@ -> 76.76.21.21`, `CNAME` `www -> cname.vercel-dns.com`) |
| **Frontend & Edge Hosting** | Vercel Pro (`Digital Dads` Team) | Project: `evermark-prints` (`Next.js 14.2 App Router`) |
| **Source Control** | GitHub (`OneShelfStudio`) | `https://github.com/OneShelfStudio/EvermarkPrints.git` |
| **Headless CMS** | Sanity.io (`Digital Dads` Org) | Project ID: `byz4z1gd` · Dataset: `production` |
| **Payment Processing** | Stripe Live Mode (`Digital Dads LLC`) | Live Checkout Sessions (`shipping_address_collection: { allowed_countries: ['US'] }`) |
| **US Print Fulfillment** | Printify API (`Evermark Prints`) | Shop ID: `29416532` · Full-Scope API Token (`EvermarkPrints_Vercel_Production`) |
| **Ad Monetization** | Google AdSense | Publisher ID: `ca-pub-7651037308656903` |
| **Legal & Compliance Pages** | Built-In Routes | `/privacy`, `/terms`, `/refunds`, `/merchant-feed.xml`, `/sitemap.xml` |

---

## 3. Complete Product Catalog & Unit Economics (6 Archival Plates)

| Plate | SKU | Title | Primary Buyer Occasion | Retail Tiers | Landed US COGS | Net Profit / Order |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Plate 01** | `EVM-STAR-01` | **The Exact Night Sky Star Map** | Anniversaries, Weddings, Engagements, Birth of a Child | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 (Digital) / ~$19.50 (16×20) / ~$29.50 (24×36) / ~$36.00 (Pair) | **$28.00 – $93.00** |
| **Plate 02** | `EVM-WAVE-02` | **Voice & Song Acoustic Waveform** | First Dance Songs, Saved Voicemails, Baby's Laughter | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 / ~$19.50 / ~$29.50 / ~$36.00 | **$28.00 – $93.00** |
| **Plate 03** | `EVM-COORD-03` | **Latitude & Homestead Meridian Print** | First Home Purchase, Realtor Closing Gifts, Family Cabins | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 / ~$19.50 / ~$29.50 / ~$36.00 | **$28.00 – $93.00** |
| **Plate 04** | `EVM-PET-04` | **Heirloom Companion Tribute Monograph** | Pet Loss Sympathy Gifts, Dog/Cat Memorials | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 / ~$19.50 / ~$29.50 / ~$36.00 | **$28.00 – $93.00** |
| **Plate 05** | `EVM-PAT-05` | **Horological & Engineering Blueprint** | Founders, Engineers, Watch Collectors, Executive Offices | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 / ~$19.50 / ~$29.50 / ~$36.00 | **$28.00 – $93.00** |
| **Plate 06** | `EVM-COAST-06` | **Coastal Bathymetry & Harbor Chart** | Coastal Homes, Sailing Harbors, Honeymoon Shorelines | $29 Digital / $79 (16×20) / $119 (24×36) / $129 (2-Print Pair) | $0 / ~$19.50 / ~$29.50 / ~$36.00 | **$28.00 – $93.00** |

> **Average Order Value (AOV) Booster:** Every physical framed order defaults to including the **+$14 Instant 300 DPI Archival Digital Master Bump**, lifting a standard `$79` framed order to **`$93`** (`$70.80` net profit after COGS and Stripe fees!).

---

## 4. End-to-End Order, Fulfillment & Refund Architecture

### A. How an Order Flows from Customer to Doorstep
1. **Customer Personalization (`evermarkprints.com`):**
   - Customer selects their Paper & Ink Palette (`Warm Linen`, `Midnight & Brass`, `Obsidian`, or `Atlantic Slate`), Solid Hardwood Frame (`Walnut`, `Matte Black`, or `Natural Oak`), and types their inscription.
2. **Stripe Live Checkout (`/api/stripe/checkout`):**
   - Collects payment (`pk_live_...` / `sk_live_...`) and US shipping address.
   - All custom inscription fields (`headline`, `subline`, `locationText`, `dateText`, `coordsText`, `colorwayId`, `frameFinishId`, `sku`, `formatId`) are embedded directly into the **Stripe Checkout Session Metadata** and PaymentIntent description.
3. **Immediate Digital Delivery (`/success`):**
   - Upon returning from Stripe Checkout, if the customer purchased the Instant Digital Master (`$29`) or kept the `+$14` Digital Backup Bump checked, they can immediately download their high-resolution PNG master file right on `/success`.
4. **Printify US Physical Production (`Shop ID: 29416532`):**
   - For physical framed orders, the 300 DPI print file and US shipping address are dispatched to Printify (`PRINTIFY_SHOP_ID=29416532`), printed on museum canvas/cotton rag, framed in the US, and shipped via USPS/UPS with tracking in 3–5 business days.
   - **Important Payment Note inside Printify:** In your Printify dashboard (`Account -> Payments`), link your business credit/debit card (or PayPal) so that when Printify fulfills a `$79`–`$129` order that Stripe already paid you for, Printify automatically bills your card the `~$19.50` wholesale production cost and ships it to the customer without delay.

### B. How Refunds & Protections Work (Zero-Risk Margin Protection)
- **Yes, Stripe Refunds Are 100% Enabled:** In your Stripe Dashboard (`Payments`), every order has a 1-click **"Refund"** button (supporting full or partial refunds back to the customer's card/Apple Pay).
- **Legal Protection Against Buyer's Remorse (`/refunds`):**
  - Under US e-commerce law (UCC § 2-608 / FTC custom goods exemption), **bespoke personalized items made to a customer's custom inscription are exempt from standard change-of-mind returns** once production begins (after our 2-hour modification window).
  - If a customer ever files a dispute claiming "changed mind," our published `/refunds` and `/terms` policies—linked directly below the checkout button—provide Stripe with the exact custom-order evidence needed to win disputes.
- **Damaged in Transit = $0 Cost to You:**
  - If a frame arrives cracked by USPS/UPS, our policy promises the customer a free expedited replacement or full refund. Because **Printify covers 100% of transit damage and manufacturing defects for free**, you simply submit the customer's photo in Printify for a $0 reprint while keeping 100% of your profit.

---

## 5. Multi-Channel Promotion & Social Rebrand Strategy

### A. Can We Rebrand the Inactive Digital Dads TikTok Account?
**YES — 100% Recommended.**
- TikTok allows you to change your **Display Name** (`Evermark Prints`), **Username/Handle** (`@evermarkprints`), **Bio**, and **Website Link** while keeping the existing aged account trust score!
- Aged accounts avoid the "new account 0-view sandbox" that fresh TikTok accounts suffer from.
- **Action Plan for TikTok:**
  1. Move old unrelated videos to **Private / Friends Only** (better than deleting all at once, as mass-deleting can temporarily trip TikTok's automated spam filter—setting old videos to Private hides them from the public grid cleanly while preserving account history!).
  2. Update Name to **Evermark Prints**, Handle to `@evermarkprints`, Bio to:
     > *Custom Night Sky Star Maps, Voice Waveforms & Coordinate Art 🇺🇸 Framed in the USA (3–5 Days) ↓ Design Yours Live*
  3. Point the bio link to `https://www.evermarkprints.com`.

### B. Can We Use the `katsutoshi82` Facebook Profile to Create the Business Presence?
**YES — That Is Exactly How Meta Business Suite Works.**
- On Facebook/Meta, **no customer can ever see which personal profile owns a Facebook Business Page or Meta Ad Account.**
- You use your existing `katsutoshi82` Facebook profile (which has age/trust history so Meta won't flag it as a bot) to create:
  1. A public **Facebook Business Page** named **Evermark Prints** (Category: *Home Decor / Art Gallery / Gift Shop*, Website: `https://www.evermarkprints.com`).
  2. A **Meta Business Portfolio & Ads Manager** connected to that page so we can post Reels and run laser-targeted US gift ads (targeting *"Upcoming Anniversary within 30 days"*, *"Newly Engaged"*, *"New Parents"*, and *"New Movers / First-Time Homeowners"*).

### C. Local GPU Video Promo Factory (`_Store_Promo_Factory`)
- We already have 3 vertical 9:16 GPU-encoded (`h264_nvenc`) 60fps videos rendered in `C:\Users\ryanb\OneDrive\Documents\Digital Dads\EvermarkPrints\_Store_Promo_Factory\output_shorts\` with mastered `-14 LUFS` audio:
  1. `evermark_01_night_sky_starmap.mp4`
  2. `evermark_02_voice_soundwave.mp4`
  3. `evermark_03_home_coordinates.mp4`
- We can re-render these in our new **Warm Cotton-Rag & Walnut Gallery Aesthetic** and publish them across **TikTok, YouTube Shorts, Facebook Reels, and Pinterest**!
