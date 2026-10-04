// app/cabinet/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  HeartHandshake,
  Scale,
  Target,
  Users,
} from 'lucide-react'

import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Le Cabinet',
  description:
    'Découvrez le Cabinet CAMPAB à Cotonou : un cabinet juridique dédié à la médiation, à l’arbitrage OHADA et au conseil des entreprises et des particuliers. Un accompagnement humain, rigoureux et confidentiel.',
  alternates: { canonical: `${site.url}/cabinet` },
}

const engagements = [
  {
    icon: Target,
    title: 'Vision',
    desc: 'Transformer les conflits en solutions durables et équilibrées, en privilégiant toujours le dialogue et la préservation des relations.',
  },
  {
    icon: Scale,
    title: 'Rigueur',
    desc: 'Une analyse juridique précise, méthodique et documentée, fondée sur la maîtrise des Actes uniformes OHADA et du droit béninois.',
  },
  {
    icon: Users,
    title: 'Proximité',
    desc: 'Une relation fondée sur la confiance, l’écoute active et une disponibilité constante pour chaque client.',
  },
  {
    icon: HeartHandshake,
    title: 'Engagement',
    desc: 'Une implication personnelle dans chaque dossier, du premier entretien jusqu’à l’exécution de la solution.',
  },
]

const parcours = [
  {
    periode: '2011 à nos jours',
    poste: 'Assistante et Collaboratrice-Juriste',
    lieu: 'Cabinet d’Avocats Maître Issiaka MOUSTAFA, Cotonou',
    description:
      'Consultations et avis juridiques. Rédaction d’actes et documents juridiques (conventions, contrats, statuts de sociétés, conclusions, exploits d’huissier). Conseil et assistance des clients. Gestion des dossiers et archivage.',
  },
  {
    periode: '2024-2025',
    poste: 'Certificat en Arbitrage OHADA',
    lieu: 'ERSUMA (École Régionale Supérieure de la Magistrature)',
    description:
      'Formation spécialisée en arbitrage dans l’espace OHADA, couvrant les procédures, la rédaction des sentences et l’exécution des décisions arbitrales.',
  },
  {
    periode: '2005 à nos jours',
    poste: 'Certificat en Médiation',
    lieu: 'Consensualis Multi-Doors',
    description:
      'Formation continue en médiation professionnelle, incluant les techniques de négociation, la gestion des conflits et l’accompagnement des parties.',
  },
  {
    periode: '2017-2018',
    poste: 'Licence en Psychologie des organisations',
    lieu: 'Université d’Abomey-Calavi',
    description:
      'Formation en cours, complétant l’expertise juridique par une meilleure compréhension des dynamiques humaines et organisationnelles.',
  },
]

export default function CabinetPage() {
  return (
    <>
      {/* En-tête de page */}
      <section className="page-header" aria-labelledby="cabinet-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Le cabinet</div>
              <h1 id="cabinet-title" className="page-header__title">
                Un cabinet juridique de conviction.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                {site.signature} Un cabinet dédié à la médiation, à l’arbitrage
                OHADA et au conseil, au service des entreprises, des
                institutions et des particuliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gap: 'var(--sp-12)',
              alignItems: 'center',
            }}
            className="lg:grid-cols-2"
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '5 / 4',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Image
                src="/images/cabinet.jpg"
                alt="Locaux du Cabinet CAMPAB à Cotonou"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div>
              <SectionTitle
                align="left"
                label="Notre histoire"
                title="Le droit au service des personnes."
              />
              <p style={{ marginTop: 'var(--sp-6)' }}>
                Fondé à Cotonou par Sètondji Prudencia ABODE, le Cabinet CAMPAB
                réunit une pratique exigeante du droit et une attention constante
                portée à l’humain. Nous accompagnons entreprises, institutions
                et particuliers dans la prévention, la négociation et la
                résolution de leurs différends.
              </p>
              <p style={{ marginTop: 'var(--sp-4)' }}>
                Notre approche conjugue la précision technique des Actes
                uniformes OHADA et la souplesse des mécanismes alternatifs de
                règlement : médiation, conciliation et arbitrage. Cette double
                compétence nous permet de proposer la solution la plus adaptée à
                chaque situation.
              </p>
              <p style={{ marginTop: 'var(--sp-4)' }}>
                Basé à Cotonou, le cabinet intervient dans tout l’espace OHADA et
                accompagne ses clients dans leurs démarches juridiques et
                judiciaires, au Bénin comme dans les États membres de
                l’organisation.
              </p>
              <div style={{ marginTop: 'var(--sp-8)' }}>
                <Button href="/contact" variant="primary">
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="section section--soft">
        <div className="container">
          <SectionTitle
            label="Nos engagements"
            title="Quatre principes qui guident chacune de nos décisions."
          />
          <div
            style={{
              marginTop: 'var(--sp-14)',
              display: 'grid',
              gap: 'var(--sp-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {engagements.map((engagement) => {
              const Icon = engagement.icon
              return (
                <Card key={engagement.title} hover>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--sp-5)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="service-card__title" style={{ fontSize: 'var(--text-lg)' }}>
                    {engagement.title}
                  </h3>
                  <p className="service-card__desc">{engagement.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className="section">
        <div className="container">
          <SectionTitle
            label="Parcours"
            title="L’expérience au service de vos dossiers."
            subtitle="Un parcours de plus de dix ans au service des entreprises et des particuliers."
          />

          <div
            style={{
              marginTop: 'var(--sp-14)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-8)',
              maxWidth: '56rem',
              marginInline: 'auto',
            }}
          >
            {parcours.map((item) => (
              <div key={`${item.periode}-${item.poste}`} className="timeline-item" style={{ gridTemplateColumns: '1fr', paddingLeft: 'var(--sp-8)', paddingBottom: 0 }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: -4,
                    top: 6,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-green)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  {item.periode}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xl)',
                    color: 'var(--text-900)',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  {item.poste}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  {item.lieu}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)', lineHeight: 1.75 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-block">
            <div className="cta-block__geo cta-block__geo--1" aria-hidden="true" />
            <div className="cta-block__geo cta-block__geo--2" aria-hidden="true" />
            <div className="cta-block__inner">
              <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                Besoin d’un accompagnement juridique ?
              </h2>
              <p style={{ marginTop: 'var(--sp-5)', color: 'rgba(255,255,255,0.8)', maxWidth: '44ch', marginInline: 'auto' }}>
                Que vous soyez une entreprise, une institution ou un particulier,
                nous vous aidons à trouver la solution la plus adaptée à votre
                situation.
              </p>
              <div style={{ marginTop: 'var(--sp-8)' }}>
                <Button href="/contact" variant="olive" size="lg">
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}