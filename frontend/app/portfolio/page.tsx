import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileText, Award, Briefcase, BookOpen, Download } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { API_URL } from "@/lib/api";
import { site } from "@/lib/site";
import type { PortfolioItem, PortfolioCategory } from "@/types";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Thèse, projets, publications et distinctions de Maître Sètondji Prudencia ABODE, juriste, médiatrice et arbitre OHADA à Cotonou.",
  alternates: { canonical: `${site.url}/portfolio` },
};

async function getPortfolio(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch(`${API_URL}/portfolio`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

const categoryMeta: Record<
  PortfolioCategory,
  { label: string; icon: typeof FileText }
> = {
  these: { label: "Thèse", icon: BookOpen },
  projet: { label: "Projet", icon: Briefcase },
  publication: { label: "Publication", icon: FileText },
  distinction: { label: "Distinction", icon: Award },
};

export default async function PortfolioPage() {
  const items = await getPortfolio();
  const grouped = items.reduce<Record<string, PortfolioItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <>
      <section className="bg-navy-deep py-20">
        <div className="container-x">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Portfolio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Parcours, travaux & publications.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            Découvrez les travaux académiques et professionnels qui nourrissent
            la pratique du cabinet.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-x">
          {/* Thèse */}
          <div className="mb-20">
            <SectionTitle
              align="left"
              label="Thèse"
              title="Travaux de recherche"
              subtitle="La thèse de la juriste est disponible en téléchargement."
            />
            <Card className="mt-10 max-w-3xl">
              <div className="flex items-start gap-6">
                <span className="w-16 h-16 rounded-full bg-navy-deep flex items-center justify-center shrink-0">
                  <BookOpen size={24} className="text-olive-light" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-navy-deep mb-3">
                    Thèse de Sètondji Prudencia ABODE
                  </h3>
                  <p className="text-ink-soft leading-relaxed mb-6">
                    Travaux de recherche portant sur le droit OHADA, la médiation
                    et l&apos;arbitrage dans l&apos;espace communautaire. Ce
                    document constitue une contribution à la réflexion sur les
                    modes alternatifs de règlement des différends au Bénin.
                  </p>
                  <a
                    href="/docs/these.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-navy-deep text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-olive transition"
                  >
                    <Download size={16} /> Télécharger la thèse (PDF)
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Autres éléments */}
          {items.length === 0 && (
            <div className="text-center py-20 border-t border-line">
              <p className="font-serif text-2xl text-navy-deep">
                Portfolio en préparation
              </p>
              <p className="text-ink-soft mt-2 text-sm">
                Cette section sera enrichie prochainement.
              </p>
            </div>
          )}

          {Object.entries(grouped).map(([cat, list]) => {
            const meta = categoryMeta[cat as PortfolioCategory];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <div key={cat} className="mb-16">
                <SectionTitle
                  align="left"
                  label={meta.label}
                  title={`${list.length} élément${list.length > 1 ? "s" : ""}`}
                />
                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((item) => (
                    <Card key={item.id} className="p-0 overflow-hidden h-full flex flex-col">
                      {item.imageUrl ? (
                        <div className="relative aspect-video">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-sky/40 flex items-center justify-center">
                          <Icon size={40} className="text-olive/60" />
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-olive font-semibold">
                          <Icon size={12} /> {meta.label}
                        </div>
                        <h3 className="font-serif text-xl text-navy-deep mt-3 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-sm text-ink-soft mt-3 leading-relaxed line-clamp-4">
                          {item.description}
                        </p>
                        {item.link && (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto pt-5 inline-flex items-center gap-2 text-sm text-olive font-medium hover:text-olive-dark transition"
                          >
                            Consulter <ExternalLink size={13} />
                          </Link>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-16">
            <Button href="/contact" size="lg">
              Discuter de votre projet
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}