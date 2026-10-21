import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund, Replacement & Cancellation Policy | Evermark Prints',
  description:
    'Archival Quality Guarantee, damaged-in-transit replacement policy, and custom order refund terms for Evermark Prints.',
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
          Clear, fair protection for your bespoke framed prints and digital master commissions.
        </p>
      </div>

      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-7 sm:p-10 space-y-8 text-sm text-[#3D3831] leading-relaxed">
        <section className="p-5 bg-[#F3EFE6] border border-[#DDD5C7] space-y-2">
          <p className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#6E4E2E] font-semibold">
            OUR 100% DAMAGED-OR-DEFECTIVE PROMISE
          </p>
          <p className="text-base font-editorial font-semibold text-[#171513]">
            If your framed print arrives damaged in transit, misprinted, or with any framing defect, we will rush a free replacement or issue a 100% full refund via Stripe—no return shipping required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            1. Damaged in Transit or Manufacturing Defects (100% Covered)
          </h2>
          <p>
            We stand behind the craftsmanship of every solid hardwood frame and 310gsm cotton-rag print leaving our US partner studios. If your package arrives damaged by the carrier (cracked frame corner, scratched glazing, torn packaging, or print blemish):
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Email{' '}
              <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
                ryanb@digital-dads-llc.com
              </a>{' '}
              within <strong>14 days of delivery</strong> with your order email and a quick photo of the damage.
            </li>
            <li>
              You do <strong>not</strong> need to ship the damaged frame back. We will immediately dispatch a priority replacement at zero cost to you, or issue a <strong>100% refund to your original payment method via Stripe</strong> (processed within 3–5 business days).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            2. 2-Hour Order Modification &amp; Cancellation Window
          </h2>
          <p>
            Because our archival print queue begins rendering and transmitting orders to our US workshops shortly after checkout, you may request a <strong>free text modification or full cancellation refund within 2 hours of placing your order</strong> by emailing{' '}
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
            Every Evermark print is custom-manufactured to order with your personal headline, names, dates, and coordinates. In accordance with standard US e-commerce regulations for custom-made goods:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Once a personalized physical print has entered production (after the 2-hour cancellation window), it cannot be returned or refunded for change-of-mind, size selection error, or customer-entered typos that matched the live checkout preview.
            </li>
            <li>
              <strong>Typo Courtesy Discount:</strong> If you accidentally entered a misspelled date or name and noticed after your print already shipped, email us—we offer a <strong>50% courtesy reprint credit</strong> so you can replace your piece at studio cost.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            4. Instant 300 DPI Digital Print Masters
          </h2>
          <p>
            Because Instant 300 DPI Archival Digital Print Masters (`$29` standalone or `+$14` order bump) are delivered immediately as downloadable high-resolution master files upon checkout, digital file purchases are final once rendered. If you experience any technical difficulty downloading your master file, email{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>{' '}
            and we will personally generate and email your 300 DPI file within 24 hours.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#DDD5C7] pt-6">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            5. How Stripe Refunds Are Processed
          </h2>
          <p>
            Approved refunds are issued directly through <strong>Stripe</strong> back to the exact card, Apple Pay, or Google Pay account used at checkout. You will receive an automated Stripe refund receipt by email the moment the refund is initiated, and funds typically post to your bank statement within 3–5 business days.
          </p>
          <div className="pt-2">
            <Link
              href="/create/custom-star-map"
              className="inline-block px-5 py-2.5 bg-[#171513] text-[#F7F4ED] text-xs font-mono-tech uppercase tracking-[0.14em]"
            >
              Return to Commission Bench →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
