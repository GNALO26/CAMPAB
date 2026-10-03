import type { Metadata } from "next";
import { FileText, Scale, Gavel, ShieldCheck, Clock, Lock, Download, ExternalLink } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Arbitrage OHADA",
  description:
    "Arbitrage OHADA à Cotonou : une justice privée, rapide et confidentielle encadrée par les Actes uniformes. Découvrez la procédure, la clause type et les documents officiels.",
  alternates: { canonical: `${site.url}/arbitrage` },
};

const etapes = [
  {
    num: "01",
    icon: FileText,
    title: "Saisine",
    desc: "Requête d'arbitrage adressée au centre ou au tribunal arbitral, conformément à la clause compromissoire ou au compromis d'arbitrage.",
  },
  {
    num: "02",
    icon: Scale,
    title: "Constitution du tribunal",
    desc: "Désignation du ou des arbitres, acceptation de la mission et provision pour frais de procédure.",
  },
  {
    num: "03",
    icon: Gavel,
    title: "Instruction",
    desc: "Échanges d'écritures, audiences, expertises éventuelles et mesures provisoires si nécessaire.",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Sentence",
    desc: "Prononcé d'une sentence motivée, susceptible d'exequatur et d'exécution dans tout l'espace OHADA.",
  },
];

const avantages = [
  {
    icon: Clock,
    title: "Rapidité",
    desc: "Délais maîtrisés grâce à une procédure allégée et un tribunal arbitral dédié, contrairement aux juridictions étatiques souvent engorgées.",
  },
  {
    icon: Lock,
    title: "Confidentialité",
    desc: "Audiences et débats strictement privés. Aucune publicité, aucun précédent public, protection de vos secrets d'affaires.",
  },
  {
    icon: Scale,
    title: "Expertise",
    desc: "Arbitres spécialisés dans la matière concernée, choisis par les parties pour leur compétence technique et sectorielle.",
  },
];

const clauseType = `Tout litige relatif à la validité, l'interprétation, l'exécution ou la résiliation du présent contrat sera tranché par voie d'arbitrage conformément au Règlement d'arbitrage de la Cour Commune de Justice et d'Arbitrage (CCJA) de l'OHADA. Le tribunal arbitral sera composé d'un (1) arbitre. Le siège de l'arbitrage sera fixé à Cotonou (Bénin). La langue de la procédure sera le français.`;

export default function ArbitragePage() {
  return (
    <>
      <section className="bg-navy-deep py-20 relative overflow-hidden">
        <div className="deco-circle -top-40 right-0 w-[600px] h-[600px] opacity-30" />
        <div className="container-x relative">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Arbitrage OHADA
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Une justice privée, rapide et confidentielle.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            L&apos;arbitrage remplace le tribunal étatique par un tribunal arbitral
            choisi par les parties. Une voie moderne, adaptée aux enjeux
            économiques et aux exigences de confidentialité des affaires.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <SectionTitle
            label="Procédure"
            title="Les grandes étapes de l'arbitrage."
            subtitle="Chaque étape est encadrée par le Règlement d'arbitrage applicable, garantissant équité, prévisibilité et sécurité juridique."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapes.map((e) => {
              const Icon = e.icon;
              return (
                <Card key={e.num}>
                  <p className="text-xs font-mono text-olive tracking-widest">{e.num}</p>
                  <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center my-5">
                    <Icon size={20} className="text-navy-deep" />
                  </div>
                  <h3 className="font-serif text-lg text-navy-deep mb-2">{e.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{e.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sky/40 py-20">
        <div className="container-x">
          <SectionTitle
            label="Avantages"
            title="Pourquoi choisir l'arbitrage ?"
          />
          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {avantages.map((a) => {
              const Icon = a.icon;
              return (
                <Card key={a.title} variant="navy">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-5">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-serif text-lg mb-2 text-white">{a.title}</h3>
                  <p className="text-sky/90 text-sm leading-relaxed">{a.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionTitle
              align="left"
              label="Clause type"
              title="Modèle de clause arbitrale"
              subtitle="Copiez cette clause dans vos contrats pour anticiper tout différend futur et sécuriser vos relations d'affaires."
            />
            <div className="mt-8 bg-navy-deep rounded-card p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olive/10 rounded-full blur-3xl" />
              <p className="text-sky/90 text-sm leading-relaxed whitespace-pre-line relative">
                {clauseType}
              </p>
            </div>
            <p className="text-xs text-ink-soft mt-4">
              Cette clause est fournie à titre indicatif. Adaptez-la à votre
              situation avec l&apos;aide d&apos;un professionnel du droit.
            </p>
            <div className="mt-6">
              <a
                href="/docs/formulaire-saisine.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm border border-line rounded-full px-5 py-2.5 hover:bg-sky transition"
              >
                <Download size={14} /> Télécharger le formulaire de saisine (PDF)
              </a>
            </div>
          </div>

          <div className="lg:pt-16">
            <Card variant="sky">
              <h3 className="font-serif text-2xl text-navy-deep mb-4">
                Besoin d&apos;un accompagnement ?
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed mb-6">
                Le Cabinet CAMPAB vous assiste dans la rédaction de vos clauses
                compromissoires, la conduite de la procédure arbitrale et
                l&apos;exécution des sentences dans tout l&apos;espace OHADA.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/contact">Prendre rendez-vous</Button>
                <a
                  href="https://www.ohada.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-olive hover:text-olive-dark transition"
                >
                  En savoir plus sur l&apos;OHADA <ExternalLink size={13} />
                </a>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="font-serif text-lg text-navy-deep mb-3">
                Textes de référence
              </h3>
              <ul className="space-y-3 text-sm text-ink-soft">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 shrink-0" />
                  Acte uniforme relatif au droit de l&apos;arbitrage (1999, révisé en 2017)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 shrink-0" />
                  Règlement d&apos;arbitrage de la CCJA
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 shrink-0" />
                  Règlement d&apos;arbitrage du CAMeC-Bénin
                </li>
              </ul>
              <a
                href="/docs/reglement-arbitrage.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm text-olive hover:text-olive-dark transition"
              >
                <Download size={14} /> Télécharger le règlement intérieur (PDF)
              </a>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}