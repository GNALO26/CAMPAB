// src/components/features/JsonLd.tsx
import { site } from '@/lib/site'

type JsonLdData = Record<string, unknown>

interface Props {
  /**
   * Données structurées à injecter.
   * Si absent, un schéma LegalService par défaut est utilisé.
   */
  data?: JsonLdData
  /** Identifiant DOM unique (utile pour les pages qui injectent plusieurs schémas). */
  id?: string
}

function buildDefaultSchema(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'LocalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/logo.png`,
    image: `${site.url}/og-image.jpg`,
    description: site.description,
    slogan: site.slogan,
    telephone: site.contact.phone,
    email: site.contact.emailPro,
    priceRange: 'Sur devis',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: 'BJ',
    },
    areaServed: [
      { '@type': 'Country', name: 'Bénin' },
      { '@type': 'Place', name: 'Espace OHADA' },
    ],
    knowsAbout: [
      'Droit OHADA',
      'Médiation',
      'Arbitrage',
      'Droit des affaires',
      'Droit des sociétés',
      'Droit social',
      'Droit civil',
      'Droit immobilier',
      'Droit administratif',
    ],
    founder: {
      '@type': 'Person',
      name: 'Sètondji Prudencia ABODE',
      jobTitle: 'Juriste, médiatrice et arbitre OHADA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.contact.phone,
        contactType: 'Prise de rendez-vous',
        areaServed: 'BJ',
        availableLanguage: ['fr', 'en'],
      },
    ],
    sameAs: [site.social.linkedin, site.social.facebook],
  }
}

export default function JsonLd({ data, id }: Props) {
  const payload = data ?? buildDefaultSchema()
  return (
    <script
      id={id}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}