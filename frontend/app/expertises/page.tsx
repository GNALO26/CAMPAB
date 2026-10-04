// app/expertises/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { expertises, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Nos expertises',
  description:
    'Droit des affaires, sociétés, social, civil, immobilier, administratif, OHADA, médiation et arbitrage. Découvrez les domaines d’intervention du Cabinet CAMPAB.',
  alternates: { canonical: `${site.url}/expertises` },
}

export default function ExpertisesPage() {
  return (
    <>
      {/* En-tête */}
      <section className="page-header" aria-labelledby="expertises-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Expertises</div>
              <h1 id="expertises-title" className="page-header__title">
                Des compétences au service de vos enjeux.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Du conseil préventif au contentieux, nous couvrons l’ensemble des
                besoins juridiques des entreprises et des particuliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des expertises */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gap: 'var(--sp-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {expertises.map((item) => (
              <Card key={item.title} hover>
                <div className="service-card__icon" style={{ marginBottom: 'var(--sp-5)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {item.title.charAt(0)}
                  </span>
                </div>
                <h3 className="service-card__title" style={{ fontSize: 'var(--text-lg)' }}>
                  {item.title}
                </h3>
                <p className="service-card__desc">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* Blocs spécialisés */}
          <div
            style={{
              marginTop: 'var(--sp-16)',
              display: 'grid',
              gap: 'var(--sp-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            <Card variant="navy" padding="lg">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  marginBottom: 'var(--sp-3)',
                  color: 'inherit',
                }}
              >
                Médiation
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--sp-6)',
                }}
              >
                Un tiers neutre accompagne les parties vers une solution négociée
                et durable. Idéal pour préserver les relations.
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  color: 'var(--olive-light)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                }}
              >
                En savoir plus <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Card>

            <Card variant="olive" padding="lg">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  marginBottom: 'var(--sp-3)',
                  color: '#fff',
                }}
              >
                Arbitrage OHADA
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--sp-6)',
                }}
              >
                Une justice privée, rapide et confidentielle, encadrée par les
                Actes uniformes OHADA.
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  color: '#fff',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                }}
              >
                En savoir plus <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </Card>
          </div>

          <div style={{ marginTop: 'var(--sp-16)', textAlign: 'center' }}>
            <Button href="/contact" size="lg">
              Discuter de votre besoin
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}