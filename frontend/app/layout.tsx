// app/layout.tsx
import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppWidget from '@/components/features/WhatsAppWidget'
import ClientAnimations from '@/components/features/ClientAnimations'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CAMPAB - Cabinet d\'Arbitrage et de Médiation Prudencia Abode Badou',
  description:
    'CAMPAB, cabinet d\'arbitrage et de médiation à Cotonou, Bénin. Expertise OHADA, résolution alternative des conflits. Passez du litige à l\'accord.',
  keywords:
    'CAMPAB, arbitrage Bénin, médiation Cotonou, OHADA, Prudencia Abode Badou, cabinet juridique, résolution conflits, cam-pab',
  authors: [{ name: 'Me Prudencia Sètondji ABODE BADOU' }],
  metadataBase: new URL('https://cam-pab.com'),
  alternates: {
    canonical: 'https://cam-pab.com',
  },
  openGraph: {
    title: 'CAMPAB - Cabinet d\'Arbitrage et de Médiation Prudencia Abode Badou',
    description: 'Passez du litige à l\'accord : la médiation qui scelle la paix.',
    url: 'https://cam-pab.com',
    siteName: 'CAMPAB',
    locale: 'fr_BJ',
    type: 'website',
    images: [
      {
        url: 'https://cam-pab.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CAMPAB - Cabinet d\'Arbitrage et de Médiation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAMPAB - Cabinet d\'Arbitrage et de Médiation',
    description: 'Passez du litige à l\'accord : la médiation qui scelle la paix.',
    images: ['https://cam-pab.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'kWeZd2i1hLErG5MoS_zFkIVInJlpZwArDk5r_mNmGF0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T1154HQWG5"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T1154HQWG5');
            `,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <ThemeProvider>
          <ClientAnimations />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}