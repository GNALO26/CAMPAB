// src/components/layout/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  Mail,
  MapPin,
  Moon,
  Phone,
  Sun,
} from 'lucide-react'

import { useTheme } from './ThemeProvider'
import { navigation, site } from '@/lib/site'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { toggleTheme } = useTheme()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite obtenir des informations sur les services du cabinet.',
  )}`

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header>
      <nav
        className={`nav ${isScrolled ? 'nav--scrolled' : ''}`}
        aria-label="Navigation principale"
      >
        <div className="container">
          <div className="nav__inner">
            <Link href="/" className="nav__logo" aria-label={`${site.shortName}, accueil`}>
              <div className="nav__logo-img">
                <Image
                  src="/logo.png"
                  alt={`${site.shortName}, ${site.name}`}
                  width={48}
                  height={48}
                  className="nav__logo-circle"
                  priority
                  quality={90}
                />
              </div>
              <div className="nav__logo-text">
                <span className="nav__logo-name">{site.sigle}</span>
                <span className="nav__logo-sub">
                  {site.address.city}, {site.address.country}
                </span>
              </div>
            </Link>

            <ul className="nav__links" role="list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav__link ${isActive(item.href) ? 'is-active' : ''}`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav__actions">
              <button
                type="button"
                className="theme-btn"
                onClick={toggleTheme}
                aria-label="Basculer entre le mode clair et le mode sombre"
              >
                <Moon className="icon-moon" size={18} aria-hidden="true" />
                <Sun className="icon-sun" size={18} aria-hidden="true" />
              </button>

              <Link
                href="/rdv"
                className="btn btn--primary btn--md hidden lg:inline-flex"
                aria-label="Prendre rendez-vous via le formulaire"
              >
                <CalendarDays size={16} aria-hidden="true" />
                <span>Prendre rendez-vous</span>
              </Link>

              <button
                type="button"
                className={`hamburger ${isOpen ? 'is-open' : ''}`}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen((v) => !v)}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`mobile-menu ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        aria-hidden={!isOpen}
      >
        <div className="container">
          <nav aria-label="Navigation mobile">
            <ul className="mobile-menu__nav" role="list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`mobile-menu__link ${isActive(item.href) ? 'is-active' : ''}`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-menu__footer">
            <div className="mobile-menu__contact">
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, '')}`}
                className="mobile-menu__contact-item"
              >
                <Phone size={16} aria-hidden="true" />
                <span>{site.contact.phone}</span>
              </a>
              <a
                href={`mailto:${site.contact.emailPro}`}
                className="mobile-menu__contact-item"
              >
                <Mail size={16} aria-hidden="true" />
                <span>{site.contact.emailPro}</span>
              </a>
              <span className="mobile-menu__contact-item">
                <MapPin size={16} aria-hidden="true" />
                <span>{site.address.full}</span>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-6)',
              }}
            >
              <Link
                href="/rdv"
                className="btn btn--primary btn--md"
                onClick={() => setIsOpen(false)}
              >
                <CalendarDays size={16} aria-hidden="true" />
                <span>Prendre rendez-vous</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline btn--md"
                onClick={() => setIsOpen(false)}
              >
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}