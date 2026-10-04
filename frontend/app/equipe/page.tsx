// app/equipe/page.tsx
import type { Metadata } from 'next'
import {
  ArrowRight,
  Award,
  Globe2,
  GraduationCap,
  Handshake,
  Scale,
} from 'lucide-react'

import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageCarousel, {
  type CarouselSlide,
} from '@/components/features/ImageCarousel'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Notre équipe',
  description:
    'Sètondji Prudencia ABODE, juriste, médiatrice et arbitre OHADA. Découvrez son parcours, ses formations et sa vision du droit au service des entreprises et des particuliers.',
  alternates: { canonical: `${site.url}/equipe` },
}

const portraits: CarouselSlide[] = [
  {
    src: '/images/prudencia.jpg',
    alt: 'Portrait de Sètondji Prudencia ABODE, juriste et médiatrice',
  },
  {
    src: '/images/prudencia-2.jpg',
    alt: 'Sètondji Prudencia ABODE en situation professionnelle',
  },
  {
    src: '/images/portrait.jpg',
    alt: 'Sètondji Prudencia ABODE, arbitre OHADA',
  },
]

const formations = [
  {
    annee: '2024-2025',
    titre: 'Certificat en Arbitrage OHADA',
    etablissement: 'ERSUMA (École Régionale Supérieure de la Magistrature)',
  },
  {
    annee: '2005 à nos jours',
    titre: 'Certificat en Médiation',
    etablissement: 'Consensualis Multi-Doors',
  },
  {
    annee: '2009-2010',
    titre: 'Maîtrise en Sciences Juridiques',
    etablissement: 'Option Droit des Affaires et Carrières Judiciaires',
  },
  {
    annee: '2017-2018',
    titre: 'Licence en Psychologie des organisations',
    etablissement: 'Université d’Abomey-Calavi (en cours)',
  },
  {
    annee: '2005-2006',
    titre: 'Baccalauréat série D',
    etablissement: 'CEG Suru-Léré, Akpakpa',
  },
]

const competences = [
  {
    icon: Scale,
    title: 'Arbitrage OHADA',
    desc: 'Maîtrise des Actes uniformes et des procédures d’arbitrage régionales. Rédaction de clauses compromissoires et conduite de procédures arbitrales.',
  },
  {
    icon: Handshake,
    title: 'Médiation',
    desc: 'Accompagnement des parties vers une solution négociée durable, dans le respect de l’Acte uniforme OHADA relatif à la médiation.',
  },
  {
    icon: Globe2,
    title: 'Droit des affaires',
    desc: 'Sécurisation juridique des opérations commerciales, rédaction de contrats, constitution et transformation de sociétés.',
  },
  {
    icon: GraduationCap,
    title: 'Rédaction d’actes',
    desc: 'Conventions, contrats, statuts de sociétés, conclusions, exploits d’huissier et documents juridiques complexes.',
  },
]

const langues = [
  { langue: 'Français', niveau: 'Très bien lu, écrit et parlé' },
  { langue: 'Anglais', niveau: 'Assez bien lu et écrit, moyennement parlé' },
  { langue: 'Fon', niveau: 'Très bien parlé' },
]

export default function EquipePage() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite prendre rendez-vous avec le cabinet.',
  )}`

  return (
    <>
      {/* En-tête */}
      <section className="page-header" aria-labelledby="equipe-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Notre équipe</div>
              <h1 id="equipe-title" className="page-header__title">
                La rigueur du droit, la proximité humaine.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Rencontrez Sètondji Prudencia ABODE, juriste, médiatrice et
                arbitre OHADA, fondatrice du cabinet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portrait + biographie */}
      <section className="section">
        <div className="container">
          <div
            className="lg:grid-cols-12"
            style={{
              display: 'grid',
              gap: 'var(--sp-12)',
              alignItems: 'flex-start',
            }}
          >
            <div className="lg:col-span-5">
              <ImageCarousel slides={portraits} />
            </div>

            <div className="lg:col-span-7">
              <SectionTitle
                align="left"
                label="Fondatrice"
                title="Sètondji Prudencia ABODE"
              />
              <p
                style={{
                  marginTop: 'var(--sp-3)',
                  color: 'var(--accent)',
                  fontWeight: 500,
                }}
              >
                Juriste · Médiatrice · Arbitre OHADA
              </p>

              <div
                style={{
                  marginTop: 'var(--sp-8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-4)',
                }}
              >
                <p>
                  Née le 12 novembre 1986 à Ekpè, Sètondji Prudencia ABODE est
                  titulaire d’une Maîtrise en Sciences Juridiques, option Droit
                  des Affaires et Carrières Judiciaires. Elle a complété sa
                  formation par un Certificat en Médiation à Consensualis
                  Multi-Doors et un Certificat en Arbitrage OHADA à l’ERSUMA.
                </p>
                <p>
                  Depuis 2011, elle exerce comme Assistante et
                  Collaboratrice-Juriste au Cabinet d’Avocats Maître Issiaka
                  MOUSTAFA à Cotonou, où elle a acquis une solide expérience en
                  consultations, rédaction d’actes et accompagnement des clients.
                </p>
                <p>
                  Sa pratique conjugue la rigueur technique du droit OHADA et une
                  approche profondément humaine de la relation client. Elle
                  intervient en conseil, en médiation et en arbitrage auprès des
                  entreprises, des institutions et des particuliers.
                </p>
              </div>

              <blockquote
                style={{
                  marginTop: 'var(--sp-10)',
                  paddingLeft: 'var(--sp-6)',
                  borderLeft: '4px solid var(--accent-green)',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text-900)',
                  lineHeight: 1.4,
                }}
              >
                « {site.slogan} »
              </blockquote>

              <div
                style={{
                  marginTop: 'var(--sp-10)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-3)',
                }}
              >
                <Button href="/rdv">Prendre rendez-vous</Button>
                <Button
                  href="/portfolio"
                  variant="outline"
                  iconRight={<ArrowRight size={14} aria-hidden="true" />}
                >
                  Voir le portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="section section--soft">
        <div className="container">
          <SectionTitle
            label="Compétences"
            title="Des expertises au croisement du droit et du dialogue."
          />
          <div
            style={{
              marginTop: 'var(--sp-14)',
              display: 'grid',
              gap: 'var(--sp-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {competences.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} hover>
                  <div
                    className="service-card__icon"
                    style={{ marginBottom: 'var(--sp-5)' }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3
                    className="service-card__title"
                    style={{ fontSize: 'var(--text-lg)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="service-card__desc">{item.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Formation + Langues */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gap: 'var(--sp-14)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            <div>
              <SectionTitle
                align="left"
                label="Formation"
                title="Un parcours académique solide."
              />
              <div
                style={{
                  marginTop: 'var(--sp-10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-6)',
                }}
              >
                {formations.map((item) => (
                  <div
                    key={`${item.annee}-${item.titre}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--sp-5)',
                    }}
                  >
                    <span
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'var(--navy)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Award size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--accent-green)',
                        }}
                      >
                        {item.annee}
                      </p>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--text-lg)',
                          color: 'var(--text-900)',
                          marginTop: 'var(--sp-1)',
                        }}
                      >
                        {item.titre}
                      </h3>
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-500)',
                          marginTop: 'var(--sp-1)',
                        }}
                      >
                        {item.etablissement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle
                align="left"
                label="Langues"
                title="Une communication multilingue."
              />
              <div
                style={{
                  marginTop: 'var(--sp-10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-5)',
                }}
              >
                {langues.map((item) => (
                  <Card key={item.langue} hover={false}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 'var(--sp-4)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--text-lg)',
                          color: 'var(--text-900)',
                        }}
                      >
                        {item.langue}
                      </p>
                      <span className="category-badge category-badge--sky">
                        {item.niveau}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <Card padding="lg" className="lg:mt-8">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--text-900)',
                    marginBottom: 'var(--sp-3)',
                  }}
                >
                  Centres d’intérêt
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-500)',
                    lineHeight: 1.75,
                  }}
                >
                  Télévision, information, voyages. Qualités essentielles :
                  dynamique, persévérante.
                </p>
              </Card>
            </div>
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
                Envie d’échanger ?
              </h2>
              <p
                style={{
                  marginTop: 'var(--sp-5)',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '44ch',
                  marginInline: 'auto',
                }}
              >
                Un premier entretien confidentiel permet de clarifier votre
                situation et d’envisager la meilleure voie.
              </p>
              <div
                style={{
                  marginTop: 'var(--sp-8)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-4)',
                  justifyContent: 'center',
                }}
              >
                <Button href="/rdv" variant="olive" size="lg">
                  Prendre rendez-vous
                </Button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline-white btn--lg"
                >
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}