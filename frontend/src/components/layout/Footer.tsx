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
              Cabinet d&apos;Arbitrage et de Médiation Prudencia Abode Badou.
              Expertise OHADA au service des entreprises et des particuliers.
            </p>
          </div>

          <div>
            <div className="footer__col-title">Navigation</div>
            <ul className="footer__links">
              <li><Link href="/" className="footer__link">Accueil</Link></li>
              <li><Link href="/cabinet" className="footer__link">Le Cabinet</Link></li>
              <li><Link href="/expertises" className="footer__link">Expertises</Link></li>
              <li><Link href="/equipe" className="footer__link">Équipe</Link></li>
              <li><Link href="/portfolio" className="footer__link">Portfolio</Link></li>
              <li><Link href="/blog" className="footer__link">Blog</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__col-title">Ressources</div>
            <ul className="footer__links">
              <li><Link href="/arbitrage" className="footer__link">Arbitrage OHADA</Link></li>
              <li><Link href="/mediation" className="footer__link">Médiation</Link></li>
              <li><Link href="/contact" className="footer__link">Contact</Link></li>
              <li><Link href="/mentions-legales" className="footer__link">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="footer__link">Confidentialité</Link></li>
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
                  <Clock size={14} /> Lundi au vendredi, 8h à 20h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} CAMPAB. Tous droits réservés.
          </p>
          <div className="footer__legal">
            <Link href="/mentions-legales" className="footer__legal-link">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="footer__legal-link">
              Confidentialité
            </Link>
            <Link href="/cgu" className="footer__legal-link">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}