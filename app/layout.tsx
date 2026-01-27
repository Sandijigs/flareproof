import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FlareProof - ISO 20022 Payment Proofs on Flare',
  description:
    'Convert Flare blockchain transactions into ISO 20022-compliant, audit-grade payment records with shareable verification links.',
  keywords: [
    'Flare',
    'blockchain',
    'payment proof',
    'ISO 20022',
    'audit',
    'crypto',
    'Web3',
  ],
  authors: [{ name: 'FlareProof Team' }],
  openGraph: {
    title: 'FlareProof - ISO 20022 Payment Proofs on Flare',
    description:
      'Convert Flare blockchain transactions into ISO 20022-compliant, audit-grade payment records',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
