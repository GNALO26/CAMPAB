import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, CalendarDays, Eye, Share2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { site } from "@/lib/site";
import type { Article } from "@/types";

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article introuvable" };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${site.url}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `${site.url}/blog/${slug}`,
      images: article.coverImage ? [article.coverImage] : undefined,
      publishedTime: article.publishedAt || undefined,
    },
  };
}

const categoryLabels: Record<string, string> = {
  vulgarisation: "Vulgarisation",
  conseils: "Conseils",
  ethique: "Éthique",
  actualite: "Actualité",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || !article.published) notFound();

  // Rendu paragraphe par paragraphe (double saut de ligne)
  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || `${site.url}/images/og-image.jpg`,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: "Sètondji Prudencia ABODE",
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/images/logo.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-12 pb-20">
        <div className="container-x max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-olive transition mb-8"
          >
            <ArrowLeft size={14} /> Retour aux articles
          </Link>

          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-olive mb-4">
            {categoryLabels[article.category]}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-ink-soft">
            {article.publishedAt && (
              <span className="flex items-center gap-2">
                <CalendarDays size={14} />
                {format(new Date(article.publishedAt), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Eye size={14} /> {article.views} vues
            </span>
          </div>

          {article.coverImage && (
            <div className="relative aspect-video rounded-card overflow-hidden my-10 border border-line">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          )}

          <p className="text-lg text-ink leading-relaxed font-medium border-l-4 border-olive pl-5 my-8 italic">
            {article.excerpt}
          </p>

          <div className="prose-like space-y-5 text-ink leading-relaxed text-[17px]">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-line">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full bg-sky/60 text-navy-deep"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-ink-soft">
              Publié par <strong className="text-navy-deep">Cabinet CAMPAB</strong>
            </p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${article.title} — ${site.url}/blog/${article.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm border border-line rounded-full px-4 py-2 hover:bg-sky transition"
            >
              <Share2 size={14} /> Partager
            </a>
          </div>
        </div>
      </article>
    </>
  );
}