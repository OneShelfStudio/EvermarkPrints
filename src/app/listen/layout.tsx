import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archival Acoustic Memory Player | Evermark Prints',
  description:
    'Listen to your custom Evermark Prints voice waveform keepsake or first dance vinyl record memory.',
  alternates: {
    canonical: 'https://www.evermarkprints.com/listen',
  },
}

export default function ListenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
