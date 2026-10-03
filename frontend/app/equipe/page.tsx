import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Scale, Handshake, Globe2, ArrowRight, Award, BookOpen } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notre Équipe",
  description:
    "Sètondji Prudencia ABODE, juriste, médiatrice et arbitre OHADA. Découvrez son parcours, ses formations et sa vision du droit au service des entreprises et des particuliers.",
  alternates: { canonical: `${site.url}/equipe` },
};

const formations = [
  {
    annee: "2024-2025",
    titre: "Certificat en Arbitrage OHADA",
    etablissement: "ERSUMA (École Régionale Supérieure de la Magistrature)",
  },
  {
    annee: "2005 à nos jours",
    titre: "Certificat en Médiation",
    etablissement: "Consensualis Multi-Doors",
  },
  {
    annee: "2009-2010",
    titre: "Maîtrise en Sciences Juridiques",
    etablissement: "Option Droit des Affaires et Carrières Judiciaires",
  },
  {
    annee: "2017-2018",
    titre: "Licence en Psychologie des organisations",
    etablissement: "Université d'Abomey-Calavi (en cours)",
  },
  {
    annee: "2005-2006",
    titre: "Baccalauréat série D",
    etablissement: "CEG Suru-Léré - Akpakpa",
  },
];

const competences = [
  {
    icon: Scale,
    title: "Arbitrage OHADA",
    desc: "Maîtrise des Actes uniformes et des procédures d'arbitrage régionales. Rédaction de clauses compromissoires et conduite de procédures arbitrales.",
  },
  {
    icon: Handshake,
    title: "Médiation",
    desc: "Accompagnement des parties vers une solution négociée durable, dans le respect de l'Acte uniforme OHADA relatif à la médiation.",
  },
  {
    icon: Globe2,
    title: "Droit des affaires",
    desc: "Sécurisation juridique des opérations commerciales, rédaction de contrats, constitution et transformation de sociétés.",
  },
  {
    icon: GraduationCap,
    title: "Rédaction d'actes",
    desc: "Conventions, contrats, statuts de sociétés, conclusions, exploits d'huissier et documents juridiques complexes.",
  },
];

const langues = [
  { langue: "Français", niveau: "Très bien lu, écrit et parlé" },
  { langue: "Anglais", niveau: "Assez bien lu et écrit, moyennement parlé" },
  { langue: "Fon", niveau: "Très bien parlé" },
];

export default function EquipePage() {
  return (
    <>
      <section className="bg-navy-deep py-20 relative overflow-hidden">
        <div className="deco-circle -top-40 right-0 w-[500px] h-[500px] opacity-30" />
        <div className="container-x relative">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Notre Équipe
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            La rigueur du droit, la proximité humaine.
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-card overflow-hidden border border-line shadow-soft">
              <Image
                src="/images/portrait.jpg"
                alt="Sètondji Prudencia ABODE"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionTitle
              align="left"
              label="Fondatrice"
              title="Sètondji Prudencia ABODE"
            />
            <p className="mt-4 text-olive font-medium">
              Juriste · Médiatrice · Arbitre OHADA
            </p>

            <div className="mt-8 space-y-4 text-ink-soft leading-relaxed">
              <p>
                Née le 12 novembre 1986 à Ekpè, Sètondji Prudencia ABODE est
                titulaire d&apos;une Maîtrise en Sciences Juridiques, option Droit
                des Affaires et Carrières Judiciaires. Elle a complété sa formation
                par un Certificat en Médiation à Consensualis Multi-Doors et un
                Certificat en Arbitrage OHADA à l&apos;ERSUMA.
              </p>
              <p>
                Depuis 2011, elle exerce comme Assistante et Collaboratrice-Juriste
                au Cabinet d&apos;Avocats Maître Issiaka MOUSTAFA à Cotonou, où
                elle a acquis une solide expérience en consultations, rédaction
                d&apos;actes et accompagnement des clients.
              </p>
              <p>
                Sa pratique conjugue la rigueur technique du droit OHADA et une
                approche profondément humaine de la relation client. Elle
                intervient en conseil, en médiation et en arbitrage auprès des
                entreprises, des institutions et des particuliers.
              </p>
            </div>

            <blockquote className="mt-10 border-l-4 border-olive pl-6 italic font-serif text-xl text-navy-deep">
              « {site.slogan} »
            </blockquote>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact">Prendre rendez-vous</Button>
              <Button href="/portfolio" variant="outline">
                Voir le portfolio <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky/40 py-16 lg:py-24">
        <div className="container-x">
          <SectionTitle
            label="Compétences"
            title="Des expertises au croisement du droit et du dialogue."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {competences.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title}>
                  <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center mb-5">
                    <Icon size={20} className="text-navy-deep" />
                  </div>
                  <h3 className="font-serif text-lg text-navy-deep mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {c.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid lg:grid-cols-2 gap-14">
          <div>
            <SectionTitle
              align="left"
              label="Formation"
              title="Un parcours académique solide."
            />
            <div className="mt-10 space-y-6">
              {formations.map((f, i) => (
                <div key={i} className="flex items-start gap-5">
                  <span className="w-14 h-14 rounded-full bg-navy-deep flex items-center justify-center shrink-0">
                    <Award size={18} className="text-olive-light" />
                  </span>
                  <div>
                    <p className="text-xs font-mono text-olive tracking-widest">
                      {f.annee}
                    </p>
                    <h3 className="font-serif text-lg text-navy-deep mt-1">
                      {f.titre}
                    </h3>
                    <p className="text-sm text-ink-soft mt-1">{f.etablissement}</p>
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
            <div className="mt-10 space-y-5">
              {langues.map((l, i) => (
                <div
                  key={i}
                  className="bg-white border border-line rounded-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg text-navy-deep">
                      {l.langue}
                    </p>
                    <span className="text-xs px-3 py-1 rounded-full bg-sky text-navy-deep">
                      {l.niveau}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Card className="mt-8">
              <h3 className="font-serif text-lg text-navy-deep mb-3">
                Centres d&apos;intérêt
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Télévision, information, voyages. Qualités essentielles :
                dynamique, persévérante.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-navy-deep">
            Envie d&apos;échanger ?
          </h2>
          <p className="text-ink-soft mt-4 leading-relaxed">
            Un premier entretien confidentiel permet de clarifier votre situation
            et d&apos;envisager la meilleure voie.
          </p>
          <div className="mt-8">
            <Button href="/contact" size="lg">
              Prendre rendez-vous
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}