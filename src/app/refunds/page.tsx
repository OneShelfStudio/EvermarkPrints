import type { Metadata } from 'next'
import Link from 'next/link'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: 'Refund, Replacement & Cancellation Policy',
  description:
    'Archival Quality Guarantee, damaged-in-transit replacement policy, and custom order refund terms for Evermark Prints.',
  alternates: {
    canonical: 'https://www.evermarkprints.com/refunds',
  },
  openGraph: {
    title: 'Refund, Replacement & Cancellation Policy | Evermark Prints',
    description:
      'Archival Quality Guarantee, damaged-in-transit replacement policy, and custom order refund terms for Evermark Prints.',
    url: 'https://www.evermarkprints.com/refunds',
    siteName: 'Evermark Prints',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="border-b border-[#DDD5C7] pb-6 space-y-2">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#7A6F63]">
          ARCHIVAL QUALITY GUARANTEE · EFFECTIVE OCTOBER 21, 2026
        </p>
        <h1 className="text-4xl sm:text-5xl font-editorial font-semibold text-[#171513]">
          Refund, Replacement &amp; Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5C554D]">
          Clear, fair protection for every bespoke framed print, woven blanket, stone slate, acrylic plaque, and candle commission.
        </p>
      </div>

      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-7 sm:p-10 space-y-8 text-sm text-[#3D3831] leading-relaxed">
        <section className="p-5 bg-[#F3EFE6] border border-[#DDD5C7] space-y-2">
          <p className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#6E4E2E] font-semibold">
            OUR 100% DAMAGED-OR-DEFECTIVE PROMISE
          </p>
          <p className="text-base font-editorial font-semibold text-[#171513]">
            If your custom keepsake arrives damaged in transit, misprinted, or with any craftsmanship defect, we will rush a free replacement or issue a 100% full refund via Stripe with no return shipping required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            1. Damaged in Transit or Manufacturing Defects (100% Covered)
          </h2>
          <p>
            We stand behind the craftsmanship of every solid hardwood frame, 310gsm cotton-rag print, jacquard woven blanket, chiseled stone slate, crystal acrylic block, and soy candle leaving our US studios. If your package arrives damaged by the carrier:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Email{' '}
              <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
                ryanb@digital-dads-llc.com
              </a>{' '}
              within <strong>30 days of delivery</strong> with your order email and a quick photo of the damage.
            </li>
            <li>
              You do <strong>not</strong> need to ship the damaged item back. We will immediately dispatch a priority replacement at zero cost to you, or issue a <strong>100% refund to your original payment method via Stripe</strong> (processed within 3 to 5 business days).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            2. 2-Hour Order Modification &amp; Cancellation Window
          </h2>
          <p>
            Because our production queue begins rendering and transmitting orders to our US workshops shortly after checkout, you may perform a <strong>free text modification on our <Link href="/track" className="underline text-[#171513] font-semibold">Order Tracker (/track)</Link> or request a full cancellation refund within 2 hours of placing your order</strong> by emailing{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            3. Custom-Made &amp; Personalized Goods Policy
          </h2>
          <p>
            Every Evermark piece is custom-manufactured to order with your personal headline, names, dates, and coordinates:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              For non-personalized or unused gift items in original condition, we accept returns and exchanges within <strong>30 days of delivery</strong> with a complimentary return label.
            </li>
            <li>
              <strong>Typo Courtesy Replacement:</strong> If you accidentally entered a misspelled date or name and noticed after your keepsake already shipped, email us and we will provide a <strong>50% courtesy replacement credit</strong> so you can reorder your corrected piece at studio cost.
            </li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-[#DDD5C7] pt-6">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            4. How Stripe Refunds Are Processed
          </h2>
          <p>
            Approved refunds are issued directly through <strong>Stripe</strong> back to the exact card, Apple Pay, or Google Pay account used at checkout. You will receive an automated Stripe refund receipt by email the moment the refund is initiated, and funds typically post to your bank statement within 3 to 5 business days.
          </p>
          <div className="pt-2">
            <Link
              href="/create/custom-star-map"
              className="inline-block px-5 py-2.5 bg-[#171513] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-[0.14em]"
            >
              Return to Studio Customizer →
            </Link>
          </div>
        </section>
      </div>

      <AdUnit slot="4800798822" fallbackVariant="acrylic" />
    </div>
  )
}
