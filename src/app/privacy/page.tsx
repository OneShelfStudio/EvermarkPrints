import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Evermark Prints',
  description:
    'Privacy Policy and US data protection practices for Evermark Prints, a division of Digital Dads LLC.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-20 space-y-10">
      <div className="border-b border-[#DDD5C7] pb-6 space-y-2">
        <p className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#7A6F63]">
          LEGAL &amp; ARCHIVAL GOVERNANCE · EFFECTIVE OCTOBER 21, 2026
        </p>
        <h1 className="text-4xl sm:text-5xl font-editorial font-semibold text-[#171513]">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5C554D]">
          Operated by Digital Dads LLC d/b/a Evermark Prints (“Evermark Prints,” “we,” “us,” or “our”).
        </p>
      </div>

      <div className="bg-[#FCFBF8] border border-[#D5CCBC] p-7 sm:p-10 space-y-8 text-sm text-[#3D3831] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            1. Information We Collect
          </h2>
          <p>
            When you design and commission a custom print on{' '}
            <span className="font-mono-tech text-xs">evermarkprints.com</span>, we collect only the information required to render, fulfill, and deliver your custom artwork:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Custom Artwork Inscriptions:</strong> The headline, dedication line, date, city/location, coordinates, or waveform text you enter into our live studio customizer.
            </li>
            <li>
              <strong>Order &amp; US Shipping Information:</strong> Your name, email address, US shipping address, and phone number (for USPS/UPS delivery notifications) collected securely during Stripe Checkout.
            </li>
            <li>
              <strong>Payment Credentials:</strong> All credit card, Apple Pay, Google Pay, and Link transactions are processed directly by <strong>Stripe, Inc.</strong> (PCI-DSS Level 1 certified). Evermark Prints never stores raw credit card numbers on our servers.
            </li>
            <li>
              <strong>Device &amp; Analytics Data:</strong> Standard browser telemetry, IP address, and cookie identifiers via Vercel Analytics and Google AdSense/Analytics to measure storefront performance and advertising attribution.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            2. How We Use &amp; Share Your Information
          </h2>
          <p>
            We never sell your personal information or custom artwork inscriptions to third-party data brokers. Your information is shared strictly with essential service providers required to fulfill your order:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>US Archival Print Fulfillment (Printify, Inc.):</strong> For physical framed canvas and fine-art orders, your shipping name, US delivery address, and rendered 300 DPI print file are transmitted via encrypted API to our US print-on-demand fulfillment partner (Printify, Inc. and its domestic US print studios) solely to manufacture and ship your order via USPS, UPS, or FedEx.
            </li>
            <li>
              <strong>Payment Processing &amp; Fraud Prevention (Stripe, Inc.):</strong> To process payments, issue refunds when applicable, and prevent fraudulent transactions.
            </li>
            <li>
              <strong>Analytics &amp; Advertising Partners:</strong> Third-party vendors, including Google and Meta/TikTok (where enabled), may use cookies or pixels to serve relevant ads and measure marketing conversion performance. Users may opt out of personalized advertising through Google Ad Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline text-[#171513]">adssettings.google.com</a>).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            3. Local Browser Storage for Custom Previews
          </h2>
          <p>
            When you use our Live Commission Bench, your browser temporarily caches your inscription and preview image in <span className="font-mono-tech text-xs">localStorage</span> so that your custom design persists during Stripe Checkout and is immediately downloadable on your order confirmation page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            4. US State Privacy Rights (CCPA / CPRA)
          </h2>
          <p>
            Residents of California and other US states with applicable consumer privacy laws have the right to request access to, correction of, or deletion of personal information we hold about them (subject to legal record-keeping exceptions for completed tax and accounting transactions). To submit a privacy request, email us at{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#DDD5C7] pt-6">
          <h2 className="text-2xl font-editorial font-semibold text-[#171513]">
            5. Contact Information
          </h2>
          <p>
            <strong>Evermark Prints (A Division of Digital Dads LLC)</strong>
            <br />
            Email:{' '}
            <a href="mailto:ryanb@digital-dads-llc.com" className="underline text-[#171513] font-semibold">
              ryanb@digital-dads-llc.com
            </a>
            <br />
            Website:{' '}
            <Link href="/" className="underline text-[#171513]">
              https://www.evermarkprints.com
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
