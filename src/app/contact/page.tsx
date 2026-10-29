import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us & Archival Studio Support | Evermark Prints',
  description:
    'Get in touch with the Evermark Prints studio concierge. Reach us by phone at (401) 559-1738, email concierge@evermarkprints.com, or visit our Houston, TX headquarters.',
  alternates: {
    canonical: 'https://www.evermarkprints.com/contact',
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#261A13] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 border-b border-[#D8C9B6] pb-8">
          <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#8C583A] block">
            Customer Care &amp; Studio Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1B3027] font-normal tracking-tight">
            Contact Evermark Prints
          </h1>
          <p className="text-sm sm:text-base text-[#5C4D42] max-w-2xl mx-auto leading-relaxed">
            Have questions about a custom keepsake, your order proof, or shipping? Our dedicated
            US-based concierge team is here to assist you every step of the way.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Phone */}
          <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold block">
              Direct Phone Support
            </span>
            <a
              href="tel:+14015591738"
              className="text-lg font-serif font-medium text-[#1B3027] hover:text-[#8C583A] transition block"
            >
              (401) 559-1738
            </a>
            <p className="text-xs text-[#5C4D42] leading-relaxed">
              Mon – Fri: 9:00 AM – 6:00 PM CST
              <br />
              Toll-free customer assistance &amp; telephone inquiries.
            </p>
          </div>

          {/* Email */}
          <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold block">
              Email Concierge
            </span>
            <a
              href="mailto:concierge@evermarkprints.com"
              className="text-base font-serif font-medium text-[#1B3027] hover:text-[#8C583A] transition block truncate"
            >
              concierge@evermarkprints.com
            </a>
            <p className="text-xs text-[#5C4D42] leading-relaxed">
              Orders &amp; proof revisions:{' '}
              <a
                href="mailto:orders@evermarkprints.com"
                className="underline hover:text-[#1B3027]"
              >
                orders@evermarkprints.com
              </a>
              <br />
              Typical response time: within 24 hours.
            </p>
          </div>

          {/* Studio Headquarters Address */}
          <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-2">
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold block">
              Studio Headquarters
            </span>
            <address className="not-italic text-xs text-[#261A13] font-medium leading-relaxed">
              Evermark Prints
              <br />
              c/o Digital Dads LLC
              <br />
              1321 Upland Dr. PMB 4136
              <br />
              Houston, TX 77043
              <br />
              United States
            </address>
          </div>
        </div>

        {/* Message Form & Business Identity Section */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="md:col-span-7 bg-white border border-[#D8C9B6] p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-xl font-serif text-[#1B3027]">Send Us a Message</h2>
            <form
              action="mailto:concierge@evermarkprints.com"
              method="get"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-mono-tech uppercase tracking-wider text-[#4A3B31] block">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sarah Miller"
                  className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono-tech uppercase tracking-wider text-[#4A3B31] block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sarah@example.com"
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-tech uppercase tracking-wider text-[#4A3B31] block">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="order"
                    placeholder="e.g. EVM-1042"
                    className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech uppercase tracking-wider text-[#4A3B31] block">
                  Subject / Inquiry Type
                </label>
                <select
                  name="subject"
                  className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none font-medium"
                >
                  <option value="Question About a Product">Question About a Product</option>
                  <option value="Order Status & Tracking">Order Status &amp; Tracking</option>
                  <option value="Proof Revision / Custom Request">Proof Revision / Custom Request</option>
                  <option value="Returns & Satisfaction Guarantee">Returns &amp; Satisfaction Guarantee</option>
                  <option value="General Inquiries">General Inquiries</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-tech uppercase tracking-wider text-[#4A3B31] block">
                  Message
                </label>
                <textarea
                  name="body"
                  rows={4}
                  required
                  placeholder="How can our archival studio help you?"
                  className="w-full border border-[#CBB89F] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#261A13] focus:border-[#1B3027] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1B3027] hover:bg-[#254236] text-[#F7F4ED] font-mono-tech text-xs uppercase tracking-[0.16em] font-semibold transition shadow-sm"
              >
                Send Message to Concierge ↗
              </button>
            </form>
          </div>

          {/* Business & Governance Sidebar */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-4">
              <h3 className="text-base font-serif text-[#1B3027] font-medium">
                Business Transparency &amp; Governance
              </h3>
              <p className="text-xs text-[#5C4D42] leading-relaxed">
                Evermark Prints is an independent bespoke archival printing studio owned and
                operated by <strong>Digital Dads LLC</strong>, a legally registered entity in the
                United States.
              </p>
              <div className="space-y-1.5 text-xs text-[#261A13]">
                <p>
                  <strong>Legal Entity:</strong> Digital Dads LLC
                </p>
                <p>
                  <strong>Registered Address:</strong> 1321 Upland Dr. PMB 4136, Houston, TX 77043
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+14015591738" className="underline hover:text-[#8C583A]">
                    (401) 559-1738
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:concierge@evermarkprints.com"
                    className="underline hover:text-[#8C583A]"
                  >
                    concierge@evermarkprints.com
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Policy Links */}
            <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-3">
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold">
                Customer Policies &amp; Resources
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link
                    href="/track"
                    className="text-[#8C583A] hover:text-[#1B3027] hover:underline"
                  >
                    → Live Order Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refunds"
                    className="text-[#8C583A] hover:text-[#1B3027] hover:underline"
                  >
                    → Refund, Replacement &amp; Return Policy (30 Days)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[#8C583A] hover:text-[#1B3027] hover:underline"
                  >
                    → Privacy Policy &amp; CCPA Notice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[#8C583A] hover:text-[#1B3027] hover:underline"
                  >
                    → Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Accepted Payments */}
            <div className="bg-[#FAF6F0] border border-[#D8C9B6] p-6 space-y-3">
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#1B3027] font-semibold">
                Secure Payment Methods
              </h3>
              <p className="text-xs text-[#5C4D42] leading-relaxed">
                All checkout transactions are encrypted with 256-bit SSL security through Stripe.
                We accept:
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono-tech uppercase tracking-wider text-[#261A13]">
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">Visa</span>
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">Mastercard</span>
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">American Express</span>
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">Discover</span>
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">Apple Pay</span>
                <span className="px-2 py-1 bg-white border border-[#D8C9B6]">Google Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
