// app/rdv/page.tsx
import type { Metadata } from 'next'
import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'

import AppointmentForm from '@/components/features/AppointmentForm'
import JsonLd from '@/components/features/JsonLd'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Prendre rendez-vous',
  description:
    'Prenez rendez-vous avec le Cabinet CAMPAB à Cotonou. Consultation juridique, médiation ou arbitrage OHADA. Formulaire en trois étapes, réponse sous 24 à 48 heures ouvrées.',
  alternates: { canonical: `${site.url}/rdv` },
}

export default function RendezVousPage() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite prendre rendez-vous avec le cabinet.',
  )}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Prendre rendez-vous',
    description:
      'Formulaire de prise de rendez-vous du Cabinet CAMPAB, cabinet juridique à Cotonou.',
    url: `${site.url}/rdv`,
    mainEntity: {
      '@type': 'LegalService',
      name: site.name,
      telephone: site.contact.phone,
      email: site.contact.emailPro,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Prendre rendez-vous', item: `${site.url}/rdv` },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* En-tête */}
      <section className="page-header" aria-labelledby="rdv-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Prise de rendez-vous</div>
              <h1 id="rdv-title" className="page-header__title">
                Réservez un
                <br />
                entretien.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Choisissez la nature de votre demande, indiquez vos coordonnées
                et validez. Le cabinet vous recontacte sous 24 à 48 heures
                ouvrées pour confirmer le créneau.
              </p>
              <div style={{ marginTop: 'var(--sp-6)' }}>
                <span className="trust-badge">
                  <span className="trust-badge__dot" aria-hidden="true" />
                  <span className="trust-badge__text">
                    Confidentialité assurée
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section aria-label="Formulaire de prise de rendez-vous">
        <div className="container">
          <div className="contact-layout">
            {/* Colonne gauche : alternatives */}
            <aside aria-label="Autres moyens de contact">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 600,
                  color: 'var(--text-900)',
                  marginBottom: 'var(--sp-8)',
                }}
              >
                Vous préférez un autre canal ?
              </h2>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <MessageCircle size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">WhatsApp</div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-item__value"
                  >
                    Discuter maintenant
                  </a>
                  <div className="contact-info-item__sub">
                    Réponse rapide pendant les heures d’ouverture.
                  </div>
                </div>
              </div>

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
                    <div className="contact-info-item__sub">{site.contact.phone2}</div>
                  )}
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Email</div>
                  <a
                    href={`mailto:${site.contact.emailPro}`}
                    className="contact-info-item__value"
                  >
                    {site.contact.emailPro}
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-item__icon">
                  <MapPin size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-item__label">Localisation</div>
                  <div className="contact-info-item__value">{site.address.full}</div>
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

              <div className="form-notice" style={{ marginTop: 'var(--sp-6)' }}>
                <CalendarDays size={16} aria-hidden="true" />
                <p>
                  Le formulaire prend moins de trois minutes. Vous recevrez une
                  confirmation par email avec un récapitulatif PDF.
                </p>
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
                Formulaire de rendez-vous
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-500)',
                  marginBottom: 'var(--sp-8)',
                }}
              >
                Trois étapes : nature de la demande, coordonnées, confirmation.
              </p>

              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}