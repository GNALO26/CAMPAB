// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppWidget from '@/components/features/WhatsAppWidget'
import BackToTop from '@/components/features/BackToTop'
import JsonLd from '@/components/features/JsonLd'

import { site } from '@/lib/site'

import './globals.css'

/* ============================================================
   TYPOGRAPHIES (next/font, auto-hébergées, zéro CLS)
   ============================================================ */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
})

/* ============================================================
   MÉTADONNÉES SEO
   ============================================================ */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Cabinet juridique à Cotonou`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  generator: 'Next.js',
  keywords: [
    'cabinet juridique Cotonou',
    'avocat Bénin',
    'médiation Bénin',
    'arbitrage OHADA',
    'droit des affaires Bénin',
    'droit OHADA',
    'consultation juridique Cotonou',
    'Cabinet CAMPAB',
    'Sètondji Prudencia ABODE',
  ],
  category: 'Services juridiques',
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: site.url,
    siteName: site.shortName,
    title: `${site.name} — Cabinet juridique à Cotonou`,
    description: site.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Cabinet juridique à Cotonou`,
    description: site.description,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAF9' },
    { media: '(prefers-color-scheme: dark)', color: '#18191A' },
  ],
  colorScheme: 'light dark',
}

/* ============================================================
   SCRIPT ANTI-FLASH — à exécuter avant le premier paint
   ============================================================ */
const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('campab-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`

/* ============================================================
   LAYOUT RACINE
   ============================================================ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        {/* Script synchrone : applique le thème avant le premier paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        {/* Préconnexions utiles */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch pour WhatsApp et Maps */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://www.google.com" />

        {/* Données structurées JSON-LD */}
        <JsonLd />
      </head>

      <body>
        <ThemeProvider>
          {/* Lien d'évitement pour l'accessibilité */}
          <a href="#main-content" className="skip-link">
            Aller au contenu principal
          </a>

          <Header />

          <main id="main-content" role="main">
            {children}
          </main>

          <Footer />

          <WhatsAppWidget />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}