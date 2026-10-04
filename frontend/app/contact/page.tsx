// app/contact/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'

import SectionTitle from '@/components/ui/SectionTitle'
import ContactForm from '@/components/features/ContactForm'
import JsonLd from '@/components/features/JsonLd'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez le Cabinet CAMPAB à Cotonou. Consultation juridique, médiation et arbitrage OHADA. Réponse sous 24 à 48 heures ouvrées.',
  alternates: { canonical: `${site.url}/contact` },
}

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite obtenir des informations sur les services du cabinet.',
  )}`

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact — Cabinet CAMPAB',
    description:
      'Page de contact du Cabinet CAMPAB, cabinet juridique à Cotonou, Bénin.',
    mainEntity: {
      '@type': 'LegalService',
      name: site.name,
      telephone: site.contact.phone,
      email: site.contact.emailPro,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.address.city,
        addressCountry: 'BJ',
      },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${site.url}/contact` },
    ],
  }

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* En-tête */}
      <section className="page-header" aria-labelledby="contact-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Prenons contact</div>
              <h1 id="contact-title" className="page-header__title">
                Contactez
                <br />
                CAMPAB
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Vous avez un dossier, une question ou souhaitez simplement en
                savoir plus sur nos services ? Décrivez votre situation et nous
                vous répondrons dans les meilleurs délais.
              </p>
              <div style={{ marginTop: 'var(--sp-6)' }}>
                <span className="trust-badge">
                  <span className="trust-badge__dot" aria-hidden="true" />
                  <span className="trust-badge__text">
                    Réponse sous 24 à 48 heures ouvrées
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordonnées + formulaire */}
      <section aria-label="Formulaire de contact et coordonnées">
        <div className="container">
          <div className="contact-layout">
            {/* Colonne gauche */}
            <aside aria-label="Coordonnées du cabinet">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 600,
                  color: 'var(--text-900)',
                  marginBottom: 'var(--sp-8)',
                }}
              >
                Coordonnées
              </h2>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <Phone size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Téléphone</div>
                  <a
                    href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                    className="contact-info-item__value"
                  >
                    {site.contact.phone}
                  </a>
                  {site.contact.phone2 && (
                    <div className="contact-info-item__sub">
                      {site.contact.phone2}
                    </div>
                  )}
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Adresse email</div>
                  <a
                    href={`mailto:${site.contact.emailPro}`}
                    className="contact-info-item__value"
                  >
                    {site.contact.emailPro}
                  </a>
                  <div className="contact-info-item__sub">
                    {site.contact.email}
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <MapPin size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Localisation</div>
                  <div className="contact-info-item__value">
                    {site.address.full}
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <Clock size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Horaires</div>
                  {site.hours.map((entry) => (
                    <div key={entry.day}>
                      <div className="contact-info-item__value">{entry.day}</div>
                      <div className="contact-info-item__sub">{entry.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: 'var(--sp-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-3)',
                }}
              >
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                  className="btn btn--primary btn--md"
                >
                  <Phone size={16} aria-hidden="true" />
                  <span>Appeler maintenant</span>
                </a>
                <a
                  href={`mailto:${site.contact.emailPro}`}
                  className="btn btn--outline btn--md"
                >
                  <Mail size={16} aria-hidden="true" />
                  <span>Envoyer un email</span>
                </a>
                <Link href="/rdv" className="btn btn--olive btn--md">
                  <CalendarDays size={16} aria-hidden="true" />
                  <span>Prendre rendez-vous</span>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--md"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>
            </aside>

            {/* Colonne droite : formulaire */}
            <div className="contact-form-box">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 600,
                  color: 'var(--text-900)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                Envoyer un message
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-500)',
                  marginBottom: 'var(--sp-8)',
                }}
              >
                Décrivez votre situation et nous vous répondrons rapidement.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="section section--alt" aria-label="Localisation">
        <div className="container">
          <SectionTitle
            label="Localisation"
            title="Où nous trouver"
            subtitle="Le cabinet est situé à Cotonou, au cœur de la zone administrative."
          />
          <div className="map-container" style={{ marginTop: 'var(--sp-10)' }}>
            <iframe
              src={site.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localisation du Cabinet CAMPAB à Cotonou"
            />
          </div>
        </div>
      </section>
    </>
  )
}