import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, CalendarDays } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import { API_URL } from "@/lib/api";
import { site } from "@/lib/site";
import type { Paginated, ArticleListItem, ArticleCategory } from "@/types";

export const metadata: Metadata = {
  title: "Actualités juridiques",
  description:
    "Blog juridique du Cabinet CAMPAB : vulgarisation du droit OHADA, conseils pratiques, éthique et actualités juridiques au Bénin.",
  alternates: { canonical: `${site.url}/blog` },
};

const CATEGORIES: { value: ArticleCategory | ""; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "vulgarisation", label: "Vulgarisation" },
  { value: "conseils", label: "Conseils" },
  { value: "ethique", label: "Éthique" },
  { value: "actualite", label: "Actualités" },
];

const categoryLabels: Record<ArticleCategory, string> = {
  vulgarisation: "Vulgarisation",
  conseils: "Conseils",
  ethique: "Éthique",
  actualite: "Actualité",
};

async function getArticles(category?: string, page = 1): Promise<Paginated<ArticleListItem>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "9");
  if (category) params.set("category", category);

  const url = `${API_URL}/articles?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch {
    return {
      items: [],
      pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
    };
  }
}

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = sp.category as ArticleCategory | undefined;
  const page = Number(sp.page) || 1;

  const { items, pagination } = await getArticles(category, page);

  return (
    <>
      <section className="bg-navy-deep py-20">
        <div className="container-x">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-light mb-4">
            Blog
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight">
            Actualités & réflexions juridiques.
          </h1>
          <p className="mt-6 text-sky/90 text-lg max-w-2xl leading-relaxed">
            Comprendre le droit, anticiper les risques, saisir les opportunités.
            Nos analyses à destination des entreprises et des particuliers.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((c) => {
              const active = (c.value || "") === (category || "");
              const href = c.value ? `/blog?category=${c.value}` : "/blog";
              return (
                <Link
                  key={c.value || "all"}
                  href={href}
                  className={`px-4 py-2 text-sm rounded-full border transition ${
                    active
                      ? "bg-navy-deep text-white border-navy-deep"
                      : "bg-white border-line text-ink hover:border-olive hover:text-olive"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-navy-deep">
                Aucun article pour le moment
              </p>
              <p className="text-ink-soft mt-2 text-sm">
                De nouvelles publications arrivent très bientôt.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="group">
                  <Card hover className="overflow-hidden p-0 h-full flex flex-col">
                    <div className="relative aspect-video bg-sky/40 overflow-hidden">
                      {a.coverImage ? (
                        <Image
                          src={a.coverImage}
                          alt={a.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-olive/40">
                          <span className="font-serif text-5xl font-semibold">
                            {a.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-navy-deep font-semibold rounded-full">
                        {categoryLabels[a.category]}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-ink-soft flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {a.publishedAt
                          ? format(new Date(a.publishedAt), "dd MMMM yyyy", {
                              locale: fr,
                            })
                          : "—"}
                      </p>
                      <h3 className="font-serif text-xl text-navy-deep mt-3 leading-snug line-clamp-2 group-hover:text-olive transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-ink-soft mt-3 leading-relaxed line-clamp-3">
                        {a.excerpt}
                      </p>
                      <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm text-olive font-medium">
                        Lire l&apos;article{" "}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-14">
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const p = i + 1;
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                params.set("page", String(p));
                const active = p === pagination.page;
                return (
                  <Link
                    key={p}
                    href={`/blog?${params.toString()}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border transition ${
                      active
                        ? "bg-navy-deep text-white border-navy-deep"
                        : "bg-white border-line hover:border-olive hover:text-olive"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}