// src/lib/seo.ts
import type { Metadata } from "next";
import { site } from "./site";

/* ============================================================
   Helpers internes
   ============================================================ */

/**
 * Retourne une URL absolue à partir d'un chemin relatif ou d'une URL
 * déjà absolue (Cloudinary, CDN, etc.).
 */
export function absoluteUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return `${site.url}/og-image.jpg`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${site.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/* ============================================================
   Types
   ============================================================ */
interface PageSEO {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  ogType?: "website" | "article" | "profile";
}

/* ============================================================
   buildMetadata
   Retourne un Metadata complet pour une page.
   IMPORTANT : le titre renvoyé est BRUT, sans suffixe.
   Le template défini dans layout.tsx ajoute "| CAMPAB".
   ============================================================ */
export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = "/og-image.jpg",
  noindex = false,
  ogType = "website",
}: PageSEO): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.shortName,
      locale: "fr_BJ",
      type: ogType,
      images: [
        {
          url: absoluteUrl(ogImage),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage)],
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
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
  };
}

/* ============================================================
   JSON-LD LocalBusiness / LegalService
   À injecter une seule fois dans le layout racine.
   ============================================================ */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.sigle,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone.replace(/\s/g, ""),
    email: site.contact.emailPro,
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/logo.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressCountry: "BJ",
    },
    areaServed: [
      { "@type": "Country", name: "Bénin" },
      { "@type": "Country", name: "Togo" },
      { "@type": "Country", name: "Côte d'Ivoire" },
      { "@type": "Country", name: "Sénégal" },
      { "@type": "Country", name: "Burkina Faso" },
    ],
    founder: {
      "@type": "Person",
      name: "Prudencia Sètondji ABODE BADOU",
      jobTitle: "Juriste, Médiatrice, Arbitre OHADA",
    },
    sameAs: [site.social.linkedin, site.social.facebook].filter(Boolean),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "15:00",
        closes: "20:00",
      },
    ],
  };
}

/* ============================================================
   JSON-LD BreadcrumbList
   ============================================================ */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

/* ============================================================
   JSON-LD BlogPosting
   ============================================================ */
export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${site.url}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: absoluteUrl(post.coverImage),
    author: {
      "@type": "Person",
      name: "Prudencia Sètondji ABODE BADOU",
      url: `${site.url}/equipe`,
    },
    publisher: {
      "@type": "Organization",
      name: site.shortName,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
  };
}

/* ============================================================
   JSON-LD Person (page équipe)
   ============================================================ */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/equipe#person`,
    name: "Prudencia Sètondji ABODE BADOU",
    jobTitle: "Juriste, Médiatrice et Arbitre OHADA",
    url: `${site.url}/equipe`,
    image: `${site.url}/og-image.jpg`,
    worksFor: {
      "@type": "LegalService",
      name: site.name,
      url: site.url,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressCountry: "BJ",
    },
    knowsAbout: [
      "Droit des affaires OHADA",
      "Arbitrage",
      "Médiation",
      "Droit des sociétés",
      "Droit social",
    ],
  };
}

/* ============================================================
   JSON-LD FAQPage
   ============================================================ */
export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}