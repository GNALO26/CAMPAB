// app/page.tsx
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedText from '@/components/features/AnimatedText'
import StatsCounter from '@/components/features/StatsCounter'
import JsonLd from '@/components/features/JsonLd'
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { site, expertises, valeurs } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Cabinet juridique à Cotonou, arbitrage OHADA et médiation',
  description:
    'Cabinet CAMPAB à Cotonou : conseil juridique, médiation et arbitrage OHADA pour les entreprises et les particuliers. Un accompagnement humain, rigoureux et confidentiel.',
  path: '/',
  keywords: [
    'cabinet juridique Cotonou',
    'arbitrage OHADA Bénin',
    'médiation Bénin',
    'avocat Cotonou',
    'conseil juridique Cotonou',
  ],
})

export default function HomePage() {
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    'Bonjour, je souhaite obtenir des informations sur les services du cabinet.',
  )}`

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: 'Accueil', path: '/' }])}
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__geo page-hero__geo--1" />
          <div className="page-hero__geo page-hero__geo--2" />
          <div className="page-hero__geo page-hero__geo--3" />
          <div className="page-hero__grid" />
        </div>

        <div className="page-hero__content">
          <div className="page-hero__eyebrow">
            <span className="page-hero__eyebrow-line" aria-hidden="true" />
            <span className="page-hero__eyebrow-text">
              Cabinet juridique à Cotonou
            </span>
          </div>

          <h1 className="page-hero__title">
            Le droit au service
            <em>
              de vos{' '}
              <AnimatedText
                words={['intérêts.', 'ambitions.', 'droits.', 'projets.']}
                ariaLabel="Le droit au service de vos intérêts, ambitions, droits et projets."
              />
            </em>
          </h1>

          <p className="page-hero__desc">
            {site.signature} Le Cabinet CAMPAB accompagne les entreprises et les
            particuliers en médiation, en arbitrage OHADA et en conseil
            juridique, avec rigueur, discrétion et proximité.
          </p>

          <div className="page-hero__cta">
            <Button href="/rdv" size="lg">
              Prendre rendez-vous
            </Button>
            <Button href="/cabinet" variant="outline-white" size="lg">
              Découvrir le cabinet
            </Button>
          </div>

          <div className="page-hero__trust">
            <div className="page-hero__trust-item">Arbitrage OHADA</div>
            <div className="page-hero__trust-item">Médiation conventionnelle</div>
            <div className="page-hero__trust-item">Conseil aux entreprises</div>
          </div>
        </div>

        <div className="page-hero__visual">
          <div className="photo-frame">
            <span
              className="photo-frame__corner photo-frame__corner--tl"
              aria-hidden="true"
            />
            <span
              className="photo-frame__corner photo-frame__corner--br"
              aria-hidden="true"
            />
            <Image
              src="/images/portrait.jpg"
              alt="Sètondji Prudencia ABODE, juriste, médiatrice et arbitre OHADA"
              width={420}
              height={580}
              className="photo-frame__img"
              priority
            />
            <div className="photo-card photo-card--exp">
              <p className="photo-card__num">14+</p>
              <p className="photo-card__label">Années d’expérience</p>
            </div>
            <div className="photo-card photo-card--status">
              <span className="photo-card__status-dot" aria-hidden="true" />
              <div>
                <p className="photo-card__label" style={{ margin: 0 }}>
                  Disponible
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-900)',
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  Sètondji Prudencia ABODE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="section--navy" style={{ paddingBlock: 'var(--sp-16)' }}>
        <div className="container">
          <StatsCounter />
        </div>
      </section>

      {/* PRÉSENTATION DU CABINET */}
      <section className="section">
        <div className="container">
          <div
            className="lg:grid-cols-2"
            style={{
              display: 'grid',
              gap: 'var(--sp-14)',
              alignItems: 'center',
            }}
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
                label="Le Cabinet"
                title="Un accompagnement humain, une rigueur juridique."
              />
              <p style={{ marginTop: 'var(--sp-6)' }}>
                Le Cabinet CAMPAB est un cabinet juridique établi à Cotonou,
                dédié au conseil, à la médiation et à l’arbitrage. Nous croyons
                qu’un conflit peut devenir une opportunité lorsqu’il est traité
                avec méthode, écoute et intégrité.
              </p>
              <p style={{ marginTop: 'var(--sp-4)' }}>
                Notre approche conjugue la précision du droit OHADA et la
                proximité d’une relation de confiance, afin de transformer
                durablement les litiges en solutions.
              </p>
              <div style={{ marginTop: 'var(--sp-8)' }}>
                <Button href="/cabinet" variant="primary">
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="section section--alt">
        <div className="container">
          <SectionTitle
            label="Nos expertises"
            title="Des compétences au service de vos enjeux."
            subtitle="Du conseil préventif au contentieux, nous couvrons l’ensemble des besoins juridiques des entreprises et des particuliers."
          />

          <div
            style={{
              marginTop: 'var(--sp-14)',
              display: 'grid',
              gap: 'var(--sp-6)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {expertises.map((e) => (
              <Card key={e.title} hover padding="md">
                <div
                  className="service-card__icon"
                  style={{ marginBottom: 'var(--sp-5)' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {e.title.charAt(0)}
                  </span>
                </div>
                <h3
                  className="service-card__title"
                  style={{ fontSize: 'var(--text-lg)' }}
                >
                  {e.title}
                </h3>
                <p className="service-card__desc">{e.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="section">
        <div className="container">
          <SectionTitle
            label="Nos valeurs"
            title="Ce qui guide chacune de nos décisions."
          />

          <div
            style={{
              marginTop: 'var(--sp-14)',
              display: 'grid',
              gap: 'var(--sp-12)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {valeurs.map((v, i) => (
              <div
                key={v.title}
                style={{
                  position: 'relative',
                  paddingLeft: 'var(--sp-6)',
                  borderLeft: '2px solid var(--border-md)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: -7,
                    top: 0,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                  }}
                />
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-300)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    color: 'var(--text-900)',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-500)',
                    lineHeight: 1.75,
                  }}
                >
                  {v.desc}
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
              <h2
                style={{
                  color: '#fff',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: 1.15,
                }}
              >
                Un différend ? Parlons-en.
              </h2>
              <p
                style={{
                  marginTop: 'var(--sp-6)',
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '46ch',
                  marginInline: 'auto',
                }}
              >
                Choisissez le canal qui vous convient : le formulaire pour un
                premier échange structuré, ou WhatsApp pour une réponse
                immédiate.
              </p>
              <div
                style={{
                  marginTop: 'var(--sp-9)',
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
              <p
                style={{
                  marginTop: 'var(--sp-6)',
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Réponse sous 24 à 48 heures ouvrées
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}