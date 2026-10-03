import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { expertises, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nos Expertises",
  description:
    "Droit des affaires, sociétés, social, civil, immobilier, administratif, OHADA, médiation et arbitrage. Découvrez les domaines d'intervention du Cabinet CAMPAB.",
  alternates: { canonical: `${site.url}/expertises` },
};

export default function ExpertisesPage() {
  return (
    <>
      <section className="bg-navy-deep py-20">
        <div className="container-x">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Expertises
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Des compétences au service de vos enjeux.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            Du conseil préventif au contentieux, nous couvrons l&apos;ensemble des
            besoins juridiques des entreprises et des particuliers.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-ink-soft leading-relaxed">{e.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-6">
            <Card variant="navy">
              <h3 className="font-serif text-2xl mb-3 text-white">Médiation</h3>
              <p className="text-sky/90 text-sm leading-relaxed mb-6">
                Un tiers neutre accompagne les parties vers une solution
                négociée et durable. Idéal pour préserver les relations.
              </p>
              <Link
                href="/mediation"
                className="inline-flex items-center gap-2 text-olive-light text-sm font-medium hover:text-white transition"
              >
                En savoir plus <ArrowRight size={14} />
              </Link>
            </Card>

            <Card variant="olive">
              <h3 className="font-serif text-2xl mb-3 text-white">Arbitrage OHADA</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                Une justice privée, rapide et confidentielle, encadrée par les
                Actes uniformes OHADA.
              </p>
              <Link
                href="/arbitrage"
                className="inline-flex items-center gap-2 text-white text-sm font-medium hover:underline"
              >
                En savoir plus <ArrowRight size={14} />
              </Link>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Button href="/contact" size="lg">
              Discuter de votre besoin
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}