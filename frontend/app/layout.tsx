// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/features/WhatsAppWidget";
import ClientAnimations from "@/components/features/ClientAnimations";
import JsonLd from "@/components/features/JsonLd";
import { site } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/seo";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | Juriste, Médiatrice et Arbitre OHADA à Cotonou`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "CAMPAB",
    "SPAB",
    "Cabinet Prudencia ABODE",
    "Cabinet ABODE",
    "juriste Cotonou",
    "médiateur Bénin",
    "arbitre OHADA Bénin",
    "avocat Cotonou",
    "cabinet juridique Cotonou",
    "médiation Bénin",
    "arbitrage OHADA",
    "droit des affaires Bénin",
    "consultation juridique Cotonou",
    "Me Prudencia ABODE",
  ],
  authors: [{ name: "Prudencia Sètondji ABODE BADOU", url: site.url }],
  creator: site.shortName,
  publisher: site.shortName,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: site.url,
    siteName: site.shortName,
    title: `${site.shortName} | Juriste, Médiatrice et Arbitre OHADA`,
    description: site.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: site.shortName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.shortName,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "kWeZd2i1hLErG5MoS_zFkIVInJlpZwArDk5r_mNmGF0",
  },
  category: "legal services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
              gtag('config', 'G-T1154HQWG5', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Preconnect pour la performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://campab-serveur.onrender.com" />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <ThemeProvider>
          <JsonLd data={localBusinessJsonLd()} />
          <ClientAnimations />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}