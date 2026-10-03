import type { Metadata } from "next";
import Image from "next/image";
import { Target, Scale, Users, HeartHandshake, Briefcase, GraduationCap, Award } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le Cabinet",
  description:
    "Découvrez le Cabinet CAMPAB à Cotonou : un cabinet juridique dédié à la médiation, à l'arbitrage OHADA et au conseil des entreprises et des particuliers. Un accompagnement humain, rigoureux et confidentiel.",
  alternates: { canonical: `${site.url}/cabinet` },
};

const engagements = [
  {
    icon: Target,
    title: "Vision",
    desc: "Transformer les conflits en solutions durables et équilibrées, en privilégiant toujours le dialogue et la préservation des relations.",
  },
  {
    icon: Scale,
    title: "Rigueur",
    desc: "Une analyse juridique précise, méthodique et documentée, fondée sur la maîtrise des Actes uniformes OHADA et du droit béninois.",
  },
  {
    icon: Users,
    title: "Proximité",
    desc: "Une relation fondée sur la confiance, l'écoute active et une disponibilité constante pour chaque client.",
  },
  {
    icon: HeartHandshake,
    title: "Engagement",
    desc: "Une implication personnelle dans chaque dossier, du premier entretien jusqu'à l'exécution de la solution.",
  },
];

const parcours = [
  {
    periode: "2011 à nos jours",
    poste: "Assistante et Collaboratrice-Juriste",
    lieu: "Cabinet d'Avocats Maître Issiaka MOUSTAFA, Cotonou",
    description: "Consultations et avis juridiques. Rédaction d'actes et documents juridiques (conventions, contrats, statuts de sociétés, conclusions, exploits d'huissier). Conseil et assistance des clients. Gestion des dossiers et archivage.",
  },
  {
    periode: "2024-2025",
    poste: "Certificat en Arbitrage OHADA",
    lieu: "ERSUMA (École Régionale Supérieure de la Magistrature)",
    description: "Formation spécialisée en arbitrage dans l'espace OHADA, couvrant les procédures, la rédaction des sentences et l'exécution des décisions arbitrales.",
  },
  {
    periode: "2005 à nos jours",
    poste: "Certificat en Médiation",
    lieu: "Consensualis Multi-Doors",
    description: "Formation continue en médiation professionnelle, incluant les techniques de négociation, la gestion des conflits et l'accompagnement des parties.",
  },
  {
    periode: "2017-2018",
    poste: "Licence en Psychologie des organisations",
    lieu: "Université d'Abomey-Calavi",
    description: "Formation en cours, complétant l'expertise juridique par une meilleure compréhension des dynamiques humaines et organisationnelles.",
  },
];

export default function CabinetPage() {
  return (
    <>
      <section className="bg-navy-deep py-20 relative overflow-hidden">
        <div className="deco-circle -top-40 right-0 w-[600px] h-[600px] opacity-30" />
        <div className="container-x relative">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Le Cabinet
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Un cabinet juridique de conviction.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            {site.signature}
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-24">
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
              label="Notre histoire"
              title="Le droit au service des personnes."
            />
            <p className="mt-6 text-ink-soft leading-relaxed">
              Fondé à Cotonou par Sètondji Prudencia ABODE, le Cabinet CAMPAB
              réunit une pratique exigeante du droit et une attention constante
              portée à l&apos;humain. Nous accompagnons entreprises, institutions
              et particuliers dans la prévention, la négociation et la résolution
              de leurs différends.
            </p>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Notre approche conjugue la précision technique des Actes uniformes
              OHADA et la souplesse des mécanismes alternatifs de règlement :
              médiation, conciliation et arbitrage. Cette double compétence nous
              permet de proposer la solution la plus adaptée à chaque situation.
            </p>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Basé à Cotonou, le cabinet intervient dans tout l&apos;espace OHADA
              et accompagne ses clients dans leurs démarches juridiques et
              judiciaires, au Bénin comme dans les États membres de
              l&apos;organisation.
            </p>
            <div className="mt-8">
              <Button href="/contact">Prendre rendez-vous</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky/40 py-20">
        <div className="container-x">
          <SectionTitle
            label="Nos engagements"
            title="Quatre principes qui guident chacune de nos décisions."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagements.map((e) => {
              const Icon = e.icon;
              return (
                <Card key={e.title}>
                  <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center mb-5">
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

      <section className="py-20">
        <div className="container-x">
          <SectionTitle
            label="Parcours"
            title="L'expérience au service de vos dossiers."
            subtitle="Un parcours de plus de dix ans au service des entreprises et des particuliers."
          />
          <div className="mt-14 space-y-8 max-w-4xl mx-auto">
            {parcours.map((p, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-olive/30">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-olive" />
                <p className="text-xs font-mono text-olive tracking-widest mb-2">
                  {p.periode}
                </p>
                <h3 className="font-serif text-xl text-navy-deep mb-1">{p.poste}</h3>
                <p className="text-sm font-medium text-olive mb-2">{p.lieu}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-20">
        <div className="container-x text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-white">
            Besoin d&apos;un accompagnement juridique ?
          </h2>
          <p className="text-sky/80 mt-4 leading-relaxed">
            Que vous soyez une entreprise, une institution ou un particulier,
            nous vous aidons à trouver la solution la plus adaptée à votre situation.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="olive" size="lg">
              Prendre rendez-vous
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}