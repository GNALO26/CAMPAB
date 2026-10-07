// app/blog/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowRight, CalendarDays } from 'lucide-react'

import Card from '@/components/ui/Card'
import JsonLd from '@/components/features/JsonLd'
import { API_URL } from '@/lib/api'
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { categoryLabels } from '@/lib/utils'
import type { ArticleCategory, ArticleListItem, Paginated } from '@/types'

export const metadata = buildMetadata({
  title: 'Blog juridique et actualités OHADA',
  description:
    'Blog juridique du Cabinet CAMPAB : vulgarisation du droit OHADA, conseils pratiques, éthique et actualités juridiques au Bénin.',
  path: '/blog',
  keywords: [
    'blog juridique Bénin',
    'actualités OHADA',
    'conseils juridiques Cotonou',
    'droit des affaires Bénin',
  ],
})

const FILTERS: { value: ArticleCategory | ''; label: string }[] = [
  { value: '', label: 'Tous' },
  { value: 'vulgarisation', label: 'Vulgarisation' },
  { value: 'conseils', label: 'Conseils' },
  { value: 'ethique', label: 'Éthique' },
  { value: 'actualite', label: 'Actualités' },
]

const EMPTY: Paginated<ArticleListItem> = {
  items: [],
  pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
}

/* ============================================================
   Récupération des articles
   Tolère DEUX formes de réponse du backend :
     - un tableau brut : [article, ...]
     - un objet paginé : { items: [...], pagination: {...} }
   ============================================================ */
async function getArticles(
  category?: string,
  page = 1,
): Promise<Paginated<ArticleListItem>> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', '9')
  if (category) params.set('category', category)

  try {
    const url = `${API_URL}/articles?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return EMPTY

    const raw: unknown = await res.json()

    /* Cas 1 : tableau brut renvoyé par le backend actuel */
    if (Array.isArray(raw)) {
      const items = raw as ArticleListItem[]
      return {
        items,
        pagination: {
          page,
          limit: 9,
          total: items.length,
          totalPages: items.length > 9 ? Math.ceil(items.length / 9) : 1,
        },
      }
    }

    /* Cas 2 : objet paginé déjà structuré */
    if (
      raw &&
      typeof raw === 'object' &&
      'items' in raw &&
      Array.isArray((raw as { items: unknown }).items)
    ) {
      return raw as Paginated<ArticleListItem>
    }

    /* Forme inconnue : on retourne un état vide propre */
    return EMPTY
  } catch (error) {
    console.error('[blog] Échec fetch articles :', error)
    return EMPTY
  }
}

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams
  const category = (sp.category ?? '') as ArticleCategory | ''
  const page = Math.max(1, Number(sp.page) || 1)

  const { items, pagination } = await getArticles(
    category || undefined,
    page,
  )

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />

      <section className="page-header" aria-labelledby="blog-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Actualités</div>
              <h1 id="blog-title" className="page-header__title">
                Réflexions et analyses juridiques.
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Comprendre le droit, anticiper les risques, saisir les
                opportunités. Nos analyses à destination des entreprises et des
                particuliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <nav
            className="filter-pills"
            aria-label="Filtrer les articles par catégorie"
          >
            {FILTERS.map((filter) => {
              const active = filter.value === category
              const href = filter.value
                ? `/blog?category=${filter.value}`
                : '/blog'
              return (
                <Link
                  key={filter.value || 'all'}
                  href={href}
                  className={`filter-pill ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {filter.label}
                </Link>
              )
            })}
          </nav>

          {items.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__title">Aucun article pour le moment</p>
              <p className="empty-state__desc">
                De nouvelles publications paraîtront très prochainement. Revenez
                nous rendre visite ou abonnez-vous à notre newsletter.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 'var(--sp-8)',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
            >
              {items.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  style={{ display: 'block', height: '100%' }}
                >
                  <Card hover className="post-card">
                    <div className="post-card__media">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <span
                          className="post-card__placeholder"
                          aria-hidden="true"
                        >
                          {article.title.charAt(0)}
                        </span>
                      )}
                      <span className="post-card__category">
                        {categoryLabels[article.category] ?? article.category}
                      </span>
                    </div>

                    <div className="post-card__body">
                      <p className="post-card__meta">
                        <CalendarDays size={12} aria-hidden="true" />
                        {article.publishedAt
                          ? format(
                              new Date(article.publishedAt),
                              'd MMMM yyyy',
                              { locale: fr },
                            )
                          : 'Publication à venir'}
                      </p>
                      <h2 className="post-card__title">{article.title}</h2>
                      <p className="post-card__excerpt">{article.excerpt}</p>
                      <span className="post-card__cta">
                        Lire l’article
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Navigation entre les pages d’articles"
            >
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const p = i + 1
                const params = new URLSearchParams()
                if (category) params.set('category', category)
                params.set('page', String(p))
                const active = p === pagination.page
                return (
                  <Link
                    key={p}
                    href={`/blog?${params.toString()}`}
                    className={`pagination__item ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}