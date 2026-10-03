import type { Metadata } from "next";
import { HeartHandshake, Users, Handshake, ShieldCheck, Clock, Smile, ExternalLink } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Médiation",
  description:
    "Médiation à Cotonou : un processus volontaire et confidentiel pour renouer le dialogue et trouver une solution durable. Découvrez la démarche du Cabinet CAMPAB.",
  alternates: { canonical: `${site.url}/mediation` },
};

const domaines = [
  "Conflits commerciaux",
  "Litiges entre associés",
  "Conflits du travail",
  "Successions familiales",
  "Baux et voisinage",
  "Contrats et prestations",
  "Conflits de voisinage",
  "Litiges de consommation",
];

const etapes = [
  {
    num: "01",
    icon: Users,
    title: "Entretien préalable",
    desc: "Écoute séparée de chaque partie pour cerner les enjeux réels, les attentes et les marges de négociation.",
  },
  {
    num: "02",
    icon: HeartHandshake,
    title: "Séances conjointes",
    desc: "Rétablissement du dialogue dans un cadre sécurisé et confidentiel, sous la conduite du médiateur.",
  },
  {
    num: "03",
    icon: Handshake,
    title: "Recherche de solutions",
    desc: "Exploration d'options mutuellement acceptables, créatives et équilibrées, en tenant compte des intérêts de chacun.",
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Accord",
    desc: "Formalisation écrite, confidentielle et exécutoire, dans le respect de l'Acte uniforme OHADA relatif à la médiation.",
  },
];

const avantages = [
  {
    icon: Clock,
    title: "Rapidité",
    desc: "Quelques semaines suffisent souvent là où un procès dure des années. La médiation permet de trouver une solution sans attendre.",
  },
  {
    icon: Smile,
    title: "Préservation du lien",
    desc: "Les relations personnelles et commerciales peuvent être maintenues. La médiation privilégie la coopération plutôt que l'affrontement.",
  },
  {
    icon: ShieldCheck,
    title: "Confidentialité",
    desc: "Aucune publicité, aucun précédent public. Tout ce qui est dit en médiation reste confidentiel et ne peut être utilisé en justice.",
  },
];

export default function MediationPage() {
  return (
    <>
      <section className="bg-navy-deep py-20 relative overflow-hidden">
        <div className="deco-circle -top-40 right-0 w-[600px] h-[600px] opacity-30" />
        <div className="container-x relative">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Médiation
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Rétablir le dialogue, trouver la paix.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            Le médiateur n&apos;impose rien : il aide les parties à construire
            elles-mêmes leur solution, dans le respect de l&apos;Acte uniforme
            OHADA relatif à la médiation.
          </p>
          <p className="mt-6 text-olive-light italic font-serif text-xl">
            « {site.slogan} »
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionTitle
              align="left"
              label="Le processus"
              title="Quatre étapes vers un accord durable."
            />
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {etapes.map((e) => {
                const Icon = e.icon;
                return (
                  <Card key={e.num}>
                    <p className="text-xs font-mono text-olive tracking-widest">{e.num}</p>
                    <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center my-4">
                      <Icon size={20} className="text-navy-deep" />
                    </div>
                    <h3 className="font-serif text-lg text-navy-deep mb-2">{e.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{e.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <Card variant="navy">
              <h3 className="font-serif text-xl mb-4 text-white">Taux de réussite</h3>
              <p className="font-serif text-5xl text-olive-light font-semibold">70&nbsp;%</p>
              <p className="text-sky/80 text-sm mt-3">
                des médiations aboutissent à un accord en moins de 3 séances.
              </p>
            </Card>

            <Card>
              <h3 className="font-serif text-lg text-navy-deep mb-4">
                Domaines d&apos;application
              </h3>
              <ul className="space-y-3 text-sm text-ink-soft">
                {domaines.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-olive mt-2 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <section className="bg-sky/40 py-20">
        <div className="container-x">
          <SectionTitle
            label="Avantages"
            title="Pourquoi privilégier la médiation ?"
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
        <div className="container-x max-w-4xl mx-auto">
          <SectionTitle
            label="Cadre juridique"
            title="Une médiation encadrée par l'OHADA."
          />
          <p className="mt-8 text-ink-soft leading-relaxed text-center">
            Depuis le 15 mars 2018, l&apos;Acte uniforme relatif à la médiation
            (AUM) adopté le 23 novembre 2017 à Conakry constitue le dixième texte
            de droit uniforme de l&apos;OHADA. Il offre un cadre juridique clair
            et sécurisé à la médiation dans les 17 États membres.
          </p>
          <p className="mt-4 text-ink-soft leading-relaxed text-center">
            L&apos;AUM consacre des principes directeurs essentiels : respect de
            la volonté des parties, intégrité morale, indépendance et
            impartialité du médiateur, confidentialité et efficacité du processus.
            L&apos;accord issu de la médiation peut être rendu exécutoire par le
            juge, lui conférant la même force qu&apos;un jugement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg">
              Démarrer une médiation
            </Button>
            <a
              href="https://www.ohada.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm border border-line rounded-full px-6 py-3 hover:bg-sky transition"
            >
              Consulter l&apos;Acte uniforme <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}