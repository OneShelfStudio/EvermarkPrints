import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commission Confirmed & Printable Gift Certificate | Evermark Prints',
  description:
    'Your custom Evermark Prints keepsake commission is confirmed. Download your Instant Printable Gift Presentation Certificate or track your order.',
  alternates: {
    canonical: 'https://www.evermarkprints.com/success',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
