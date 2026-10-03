// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="footer__brand-name">CAMPAB</div>
            <div className="footer__brand-sub">Cotonou, Bénin</div>
            <p className="footer__brand-desc">
              Cabinet d'Arbitrage et de Médiation Prudencia Abode Badou.
              Expertise OHADA au service des entreprises et particuliers.
            </p>
          </div>

          <div>
            <div className="footer__col-title">Navigation</div>
            <ul className="footer__links">
              <li><Link href="/" className="footer__link">Accueil</Link></li>
              <li><Link href="/services" className="footer__link">Services</Link></li>
              <li><Link href="/expertise" className="footer__link">Expertise</Link></li>
              <li><Link href="/contact" className="footer__link">Contact</Link></li>
              <li><Link href="/rdv" className="footer__link">Prendre RDV</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Services</div>
            <ul className="footer__links">
              <li><Link href="/services" className="footer__link">Consultations juridiques</Link></li>
              <li><Link href="/services" className="footer__link">Rédaction d'actes</Link></li>
              <li><Link href="/expertise" className="footer__link">Médiation</Link></li>
              <li><Link href="/expertise" className="footer__link">Arbitrage OHADA</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Contact</div>
            <ul className="footer__links">
              <li>
                <a href="tel:+2290197762936" className="footer__link footer__contact">
                  <Phone size={14} /> 01 97 76 29 36
                </a>
              </li>
              <li>
                <a href="mailto:p.abodecabinet@gmail.com" className="footer__link footer__contact">
                  <Mail size={14} /> p.abodecabinet@gmail.com
                </a>
              </li>
              <li>
                <span className="footer__link footer__contact">
                  <MapPin size={14} /> Cotonou, Bénin
                </span>
              </li>
              <li>
                <span className="footer__link footer__contact">
                  <Clock size={14} /> Lun–Ven · 8h–13h30 / 15h–20h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} CAMPAB · Tous droits réservés
          </p>
          <div className="footer__legal">
            <Link href="/mentions-legales" className="footer__legal-link">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="footer__legal-link">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}