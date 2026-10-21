import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmation & Studio Production Dossier',
  description:
    'Your custom Evermark Prints keepsake has been commissioned. Review your order details or add matching family keepsakes onto your order.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
