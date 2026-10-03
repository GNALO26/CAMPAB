import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedText from "@/components/features/AnimatedText";
import StatsCounter from "@/components/features/StatsCounter";
import { site, expertises, valeurs } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* SECTION PRINCIPALE */}
      <section className="relative overflow-hidden bg-ivory">
        <div className="deco-circle -top-32 -right-32 w-[500px] h-[500px]" />
        <div className="deco-circle top-1/2 -left-40 w-[400px] h-[400px]" />

        <div className="container-x relative py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive mb-6">
              Cabinet Juridique à Cotonou
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-navy-deep">
              Le droit au service
              <br />
              de vos{" "}
              <AnimatedText
                words={["intérêts.", "ambitions.", "droits.", "projets."]}
                className="text-olive"
              />
            </h1>

            <p className="mt-7 text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              {site.signature} Le Cabinet CAMPAB accompagne les entreprises et
              les particuliers en médiation, en arbitrage OHADA et en conseil
              juridique, avec rigueur, discrétion et proximité.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/contact" size="lg">
                Prendre rendez-vous
              </Button>
              <Button href="/cabinet" variant="outline" size="lg">
                Découvrir le cabinet
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-ink-soft">
              <div>
                <p className="font-serif text-2xl text-navy-deep font-semibold">
                  OHADA
                </p>
                <p className="text-xs uppercase tracking-wider">
                  Arbitrage régional
                </p>
              </div>
              <div className="w-px h-10 bg-line" />
              <div>
                <p className="font-serif text-2xl text-navy-deep font-semibold">
                  Médiation
                </p>
                <p className="text-xs uppercase tracking-wider">
                  Résolution amiable
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="relative aspect-[4/5] rounded-card overflow-hidden shadow-soft border border-line bg-sky">
              <Image
                src="/images/portrait.jpg"
                alt="Sètondji Prudencia ABODE, juriste et médiatrice"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-auto bg-white border border-line rounded-card px-6 py-4 shadow-card">
              <p className="font-serif text-navy-deep font-semibold text-base">
                Sètondji Prudencia ABODE
              </p>
              <p className="text-xs text-ink-soft mt-1">
                Juriste, médiatrice et arbitre OHADA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="bg-navy-deep py-16 lg:py-20">
        <div className="container-x">
          <StatsCounter />
        </div>
      </section>

      {/* PRÉSENTATION DU CABINET */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[5/4] rounded-card overflow-hidden border border-line shadow-card">
            <Image
              src="/images/cabinet.jpg"
              alt="Cabinet CAMPAB à Cotonou"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <SectionTitle
              align="left"
              label="Le Cabinet"
              title="Un accompagnement humain, une rigueur juridique."
            />
            <p className="mt-6 text-ink-soft leading-relaxed">
              Le Cabinet CAMPAB est un cabinet juridique établi à Cotonou. Il est
              dédié au conseil, à la médiation et à l&apos;arbitrage. Nous croyons
              qu&apos;un conflit peut devenir une opportunité lorsqu&apos;il est
              traité avec méthode, écoute et intégrité.
            </p>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Notre approche conjugue la précision du droit OHADA et la proximité
              d&apos;une relation de confiance, afin de transformer durablement
              les litiges en solutions.
            </p>
            <div className="mt-8">
              <Button href="/cabinet" variant="primary">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="bg-sky/40 py-20 lg:py-28">
        <div className="container-x">
          <SectionTitle
            label="Nos Expertises"
            title="Des compétences au service de vos enjeux."
            subtitle="Du conseil préventif au contentieux, nous couvrons l'ensemble des besoins juridiques des entreprises et des particuliers."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertises.map((e) => (
              <Card key={e.title}>
                <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center mb-5">
                  <span className="text-olive font-serif text-xl font-bold">
                    {e.title.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-navy-deep mb-2">
                  {e.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {e.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionTitle
            label="Nos Valeurs"
            title="Ce qui guide chacune de nos décisions."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {valeurs.map((v, i) => (
              <div
                key={v.title}
                className="relative pl-6 border-l-2 border-olive/30"
              >
                <span className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-olive" />
                <p className="text-xs tracking-widest uppercase text-ink-soft mb-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl text-navy-deep mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPEL À L'ACTION */}
      <section className="relative overflow-hidden bg-navy-deep py-20">
        <div className="deco-circle -top-40 right-0 w-[600px] h-[600px] opacity-40" />
        <div className="container-x relative text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Un différend ? Parlons-en.
          </h2>
          <p className="mt-6 text-sky/90 text-lg">
            Que vous soyez une entreprise ou un particulier, nous vous aidons à
            retrouver une issue sereine et durable.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="olive" size="lg">
              Prendre rendez-vous
            </Button>
            <a
              href={`https://wa.me/${site.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full font-medium tracking-wide border border-white text-white px-8 py-4 text-base transition-all duration-300 hover:bg-white hover:text-navy-deep"
            >
              Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}