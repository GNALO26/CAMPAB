// src/components/layout/Footer.tsx
import Link from 'next/link'
import {
  Clock,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'

import { site } from '@/lib/site'

const navigationLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Le Cabinet', href: '/cabinet' },
  { label: 'Nos Expertises', href: '/expertises' },
  { label: 'Notre Équipe', href: '/equipe' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Actualités', href: '/blog' },
]

const resourceLinks = [
  { label: 'Médiation et arbitrage', href: '/expertises' },
  { label: 'Droit OHADA', href: '/expertises' },
  { label: 'Prendre rendez-vous', href: '/contact' },
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Conditions d’utilisation', href: '/cgu' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const rawNumber = (site.contact.whatsapp || '').replace(/\D/g, '')
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${rawNumber}&text=${encodeURIComponent(
    'Bonjour, je souhaite prendre rendez-vous avec le cabinet CAMPAB.',
  )}`

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="footer__brand-name">{site.sigle}</div>
            <div className="footer__brand-sub">
              {site.address.city}, {site.address.country}
            </div>
            <p className="footer__brand-desc">{site.description}</p>

            <div className="footer__social">
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Profil LinkedIn du cabinet"
                className="footer__social-link"
              >
                <Linkedin size={16} aria-hidden="true" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Page Facebook du cabinet"
                className="footer__social-link"
              >
                <Facebook size={16} aria-hidden="true" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter le cabinet sur WhatsApp"
                className="footer__social-link"
              >
                <MessageCircle size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <div className="footer__col-title">Navigation</div>
            <ul className="footer__links" role="list">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Ressources</div>
            <ul className="footer__links" role="list">
              {resourceLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Contact</div>
            <ul className="footer__links" role="list">
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                  className="footer__link footer__contact"
                >
                  <Phone size={16} aria-hidden="true" />
                  <span>{site.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.emailPro}`}
                  className="footer__link footer__contact"
                >
                  <Mail size={16} aria-hidden="true" />
                  <span>{site.contact.emailPro}</span>
                </a>
              </li>
              <li>
                <span className="footer__link footer__contact">
                  <MapPin size={16} aria-hidden="true" />
                  <span>{site.address.full}</span>
                </span>
              </li>
              {site.hours.map((entry) => (
                <li key={entry.day}>
                  <span className="footer__link footer__contact">
                    <Clock size={16} aria-hidden="true" />
                    <span>
                      {entry.day} : {entry.time}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} {site.name}. Tous droits réservés.
          </p>
          <div className="footer__legal">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="footer__legal-link"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}