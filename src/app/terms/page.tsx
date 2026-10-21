import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Evermark Prints',
  description:
    'Terms of Service and custom commission conditions for Evermark Prints, a division of Digital Dads LLC.',
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="border-b border-[#DDD5C7] pb-6 space-y-2">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#7A6F63]">
          LEGAL &amp; ARCHIVAL GOVERNANCE · EFFECTIVE OCTOBER 21, 2026
        </p>
        <h1 className="text-4xl sm:text-5xl font-editorial font-semibold text-[#171513]">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-[#5C554D]">
          Governing all custom print commissions and digital downloads on Evermark Prints (Digital Dads LLC).
        </p>
      </div>

      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-7 sm:p-10 space-y-8 text-sm text-[#3D3831] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            1. Overview &amp; Acceptance
          </h2>
          <p>
            This website (<span className="font-mono-tech text-xs">evermarkprints.com</span>) is operated by <strong>Digital Dads LLC</strong> doing business as <strong>Evermark Prints</strong>. By accessing our studio customizer or placing an order through Stripe Checkout, you agree to be bound by these Terms of Service and our{' '}
            <Link href="/refunds" className="underline text-[#171513] font-semibold">
              Refund &amp; Replacement Policy
            </Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            2. Custom Inscription Verification
          </h2>
          <p>
            Every Evermark print is bespoke and manufactured specifically to the text, dates, cities, and coordinates you enter in our Live Commission Bench. Please review your live interactive preview carefully for spelling, capitalization, dates, and coordinates prior to completing checkout.
          </p>
          <p>
            If you notice a typo immediately after placing your order, please email{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>{' '}
            within <strong>2 hours of purchase</strong> so we can update your print file before it is dispatched to our US framing workshop.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            3. US Shipping &amp; Production Windows
          </h2>
          <p>
            Physical framed editions ship exclusively to addresses within the United States via USPS, UPS, or FedEx. Standard archival production and framing takes 1–2 business days, with complimentary tracked US delivery arriving within <strong>3–5 business days</strong> for most domestic destinations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            4. Intellectual Property &amp; Personal Use License
          </h2>
          <p>
            All cartographic engines, typographic layouts, mathematical star-plotting algorithms, and plate designs are the proprietary intellectual property of Digital Dads LLC / Evermark Prints. When you purchase an Instant 300 DPI Archival Print Master or digital backup file, you are granted a non-exclusive, perpetual <strong>personal-use license</strong> to print and display the artwork for yourself or as a personal gift. Commercial resale or redistribution of Evermark digital files is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable United States law, Digital Dads LLC’s maximum aggregate liability for any claim arising out of an order placed on Evermark Prints shall not exceed the total amount paid by you for the specific order giving rise to the claim.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#DDD5C7] pt-6">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            6. Contact &amp; Concierge Support
          </h2>
          <p>
            Questions regarding these Terms of Service may be directed to{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
