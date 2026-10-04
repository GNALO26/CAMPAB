// app/portfolio/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Award,
  BookOpen,
  Briefcase,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react'

import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { API_URL } from '@/lib/api'
import { site } from '@/lib/site'
import { portfolioCategoryLabels, portfolioCategoryVariants } from '@/lib/utils'
import type { PortfolioCategory, PortfolioItem } from '@/types'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Thèse, projets, publications et distinctions de Sètondji Prudencia ABODE, juriste, médiatrice et arbitre OHADA à Cotonou.',
  alternates: { canonical: `${site.url}/portfolio` },
}

async function getPortfolio(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch(`${API_URL}/portfolio`, { next: { revalidate: 120 } })
    if (!res.ok) return []
    return (await res.json()) as PortfolioItem[]
  } catch {
    return []
  }
}

const ICONS: Record<PortfolioCategory, typeof FileText> = {
  these: BookOpen,
  projet: Briefcase,
  publication: FileText,
  distinction: Award,
}

export default async function PortfolioPage() {
  const items = await getPortfolio()
  const grouped = items.reduce<Record<string, PortfolioItem[]>>((acc, item) => {
    ;(acc[item.category] ||= []).push(item)
    return acc
  }, {})

  return (
    <>
      {/* En-tête */}
      <section className="page-header" aria-labelledby="portfolio-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Portfolio</div>
              <h1 id="portfolio-title" className="page-header__title">
                Parcours, travaux et publications.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Découvrez les travaux académiques et professionnels qui
                nourrissent la pratique du cabinet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container">
          {/* Thèse */}
          <div style={{ marginBottom: 'var(--sp-20)' }}>
            <SectionTitle
              align="left"
              label="Thèse"
              title="Travaux de recherche"
              subtitle="La thèse de la juriste est disponible en téléchargement."
            />
            <Card padding="lg" style={{ marginTop: 'var(--sp-10)', maxWidth: '48rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-6)',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={24} aria-hidden="true" />
                </span>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-2xl)',
                      color: 'var(--text-900)',
                      marginBottom: 'var(--sp-3)',
                    }}
                  >
                    Thèse de Sètondji Prudencia ABODE
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)', lineHeight: 1.75, marginBottom: 'var(--sp-6)' }}>
                    Travaux de recherche portant sur le droit OHADA, la médiation
                    et l’arbitrage dans l’espace communautaire. Ce document
                    constitue une contribution à la réflexion sur les modes
                    alternatifs de règlement des différends au Bénin.
                  </p>
                  <a
                    href="/docs/these.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--md"
                    download
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>Télécharger la thèse</span>
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Autres éléments */}
          {items.length === 0 ? (
            <div
              className="empty-state"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <p className="empty-state__title">Portfolio en préparation</p>
              <p className="empty-state__desc">
                Cette section sera enrichie prochainement.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([cat, list]) => {
              const category = cat as PortfolioCategory
              const Icon = ICONS[category] ?? FileText
              const label = portfolioCategoryLabels[category] ?? category
              const badgeVariant =
                portfolioCategoryVariants[category] ?? 'category-badge--navy'

              return (
                <div
                  key={cat}
                  style={{ marginBottom: 'var(--sp-16)' }}
                >
                  <SectionTitle
                    align="left"
                    label={label}
                    title={`${list.length} élément${list.length > 1 ? 's' : ''}`}
                  />
                  <div
                    style={{
                      marginTop: 'var(--sp-10)',
                      display: 'grid',
                      gap: 'var(--sp-6)',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    }}
                  >
                    {list.map((item) => (
                      <Card key={item.id} hover className="post-card">
                        {item.imageUrl ? (
                          <div className="post-card__media">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <div className="post-card__media">
                            <span
                              className="post-card__placeholder"
                              aria-hidden="true"
                            >
                              <Icon size={40} />
                            </span>
                          </div>
                        )}

                        <div className="post-card__body">
                          <span
                            className={`category-badge ${badgeVariant}`}
                            style={{ alignSelf: 'flex-start' }}
                          >
                            <Icon size={12} aria-hidden="true" />
                            {label}
                          </span>
                          <h3 className="post-card__title">{item.title}</h3>
                          <p className="post-card__excerpt">{item.description}</p>
                          {item.link && (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="post-card__cta"
                            >
                              Consulter
                              <ExternalLink size={13} aria-hidden="true" />
                            </Link>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-16)' }}>
            <Button href="/contact" size="lg">
              Discuter de votre projet
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}