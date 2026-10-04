// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeft, CalendarDays, Eye, Share2 } from 'lucide-react'

import JsonLd from '@/components/features/JsonLd'
import { API_URL } from '@/lib/api'
import { site } from '@/lib/site'
import { categoryLabels } from '@/lib/utils'
import type { Article } from '@/types'

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return (await res.json()) as Article
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article introuvable' }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${site.url}/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${site.url}/blog/${slug}`,
      images: article.coverImage ? [article.coverImage] : undefined,
      publishedTime: article.publishedAt || undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || `${site.url}/og-image.jpg`,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    author: {
      '@type': 'Person',
      name: 'Sètondji Prudencia ABODE',
      url: `${site.url}/equipe`,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site.url}/blog/${slug}`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Actualités', item: `${site.url}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${site.url}/blog/${slug}` },
    ],
  }

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${article.title} — ${site.url}/blog/${article.slug}`,
  )}`

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <article className="section">
        <div className="container container--md">
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-500)',
              marginBottom: 'var(--sp-8)',
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Retour aux articles
          </Link>

          <span className="eyebrow">
            {categoryLabels[article.category] ?? article.category}
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 600,
              color: 'var(--text-900)',
              lineHeight: 1.15,
              marginTop: 'var(--sp-4)',
            }}
          >
            {article.title}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--sp-5)',
              marginTop: 'var(--sp-6)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-500)',
            }}
          >
            {article.publishedAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <CalendarDays size={14} aria-hidden="true" />
                {format(new Date(article.publishedAt), 'd MMMM yyyy', {
                  locale: fr,
                })}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <Eye size={14} aria-hidden="true" />
              {article.views} vues
            </span>
          </div>

          {article.coverImage && (
            <div
              style={{
                position: 'relative',
                aspectRatio: '16 / 9',
                margin: 'var(--sp-10) 0',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <p className="article-lede">{article.excerpt}</p>

          <div className="article-body">
            {paragraphs.map((paragraph, i) => (
              <p key={i} style={{ whiteSpace: 'pre-line' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {article.tags.length > 0 && (
            <div
              className="tag-list"
              style={{
                marginTop: 'var(--sp-12)',
                paddingTop: 'var(--sp-8)',
                borderTop: '1px solid var(--border)',
              }}
            >
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="tag-pill"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="article-actions">
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)', margin: 0 }}>
              Publié par <strong style={{ color: 'var(--text-900)' }}>{site.name}</strong>
            </p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--md"
            >
              <Share2 size={14} aria-hidden="true" />
              <span>Partager sur WhatsApp</span>
            </a>
          </div>
        </div>
      </article>
    </>
  )
}