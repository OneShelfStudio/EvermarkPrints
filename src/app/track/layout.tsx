import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Custom Order & 2-Hour Live Typo Editor',
  description:
    'Look up your Evermark Prints commission status, view live USPS and UPS tracking numbers, edit your custom wording within 2 hours of ordering, or add matching keepsakes onto your order.',
  alternates: {
    canonical: 'https://www.evermarkprints.com/track',
  },
  openGraph: {
    title: 'Track Your Commission | Evermark Prints',
    description:
      'Live US studio production status, 2-hour wording editor, and USPS/UPS tracking lookup for Evermark Prints orders.',
    url: 'https://www.evermarkprints.com/track',
    siteName: 'Evermark Prints',
    locale: 'en_US',
    type: 'website',
  },
}

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
