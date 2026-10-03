import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation du site du Cabinet CAMPAB.",
  alternates: { canonical: `${site.url}/cgu` },
};

export default function CGUPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-x max-w-3xl">
        <SectionTitle align="left" label="Cadre juridique" title="Conditions générales d'utilisation" />
        <div className="mt-10 space-y-8 text-ink-soft leading-relaxed">
          <div>
            <h2 className="font-serif text-xl text-navy-deep mb-3">Objet</h2>
            <p>Les présentes conditions régissent l&apos;utilisation du site du Cabinet CAMPAB.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-navy-deep mb-3">Accès au site</h2>
            <p>Le site est accessible gratuitement, 24h/24, sauf interruption pour maintenance.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-navy-deep mb-3">Responsabilité</h2>
            <p>Les informations publiées sont fournies à titre indicatif et ne constituent pas un conseil juridique personnalisé. Seule une consultation permet d&apos;obtenir un avis adapté à votre situation.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-navy-deep mb-3">Droit applicable</h2>
            <p>Les présentes conditions sont soumises au droit béninois. Tout litige relève de la compétence des tribunaux de Cotonou.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
