// src/components/layout/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { MessageCircle } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { toggleTheme } = useTheme()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const whatsappUrl = `https://wa.me/2290197762936?text=${encodeURIComponent(
    'Bonjour CAMPAB, je souhaite prendre rendez-vous.'
  )}`

  return (
    <header>
      <nav className="nav" role="navigation" aria-label="Navigation principale">
        <div className="container">
          <div className="nav__inner">
            <Link href="/" className="nav__logo">
              <div className="nav__logo-img">
                <Image
                  src="/logo.png"
                  alt="CAMPAB - Cabinet d'Arbitrage et de Médiation"
                  width={48}
                  height={48}
                  className="nav__logo-circle"
                  priority
                  quality={100}
                />
              </div>
              <div className="nav__logo-text">
                <span className="nav__logo-name">CAMPAB</span>
                <span className="nav__logo-sub">Cotonou, Bénin</span>
              </div>
            </Link>

            <ul className="nav__links" role="list">
              <li><Link href="/" className={`nav__link ${pathname === '/' ? 'is-active' : ''}`}>Accueil</Link></li>
              <li><Link href="/services" className={`nav__link ${pathname === '/services' ? 'is-active' : ''}`}>Services</Link></li>
              <li><Link href="/expertise" className={`nav__link ${pathname === '/expertise' ? 'is-active' : ''}`}>Expertise</Link></li>
              <li><Link href="/contact" className={`nav__link ${pathname === '/contact' ? 'is-active' : ''}`}>Contact</Link></li>
            </ul>

            <div className="nav__actions">
              <button
                className="theme-btn"
                onClick={toggleTheme}
                aria-label="Basculer le thème"
              >
                <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary btn--md hide-mobile"
                aria-label="Prendre rendez-vous sur WhatsApp"
              >
                <MessageCircle size={16} /> Prendre RDV
              </a>
              <button
                className={`hamburger ${isOpen ? 'is-open' : ''}`}
                aria-label="Ouvrir le menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true">
        <div className="container">
          <nav className="mobile-menu__nav">
            <Link href="/" className="mobile-menu__link" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link href="/services" className="mobile-menu__link" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/expertise" className="mobile-menu__link" onClick={() => setIsOpen(false)}>Expertise</Link>
            <Link href="/contact" className="mobile-menu__link" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
          <div className="mobile-menu__footer">
            <div className="mobile-menu__contact">
              <a href="tel:+2290197762936" className="mobile-menu__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                01 97 76 29 36
              </a>
              <a href="mailto:p.abodecabinet@gmail.com" className="mobile-menu__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                p.abodecabinet@gmail.com
              </a>
              <span className="mobile-menu__contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Cotonou, Bénin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}