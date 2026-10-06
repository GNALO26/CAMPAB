// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Calendar,
  FileText,
  Loader2,
  Mail,
} from 'lucide-react'

import { api } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'
import type {
  Appointment,
  Article,
  ContactMessage,
  PortfolioItem,
} from '@/types'

/* ============================================================
   Types internes
   ============================================================ */
interface DashboardStats {
  appointments: {
    total: number
    pending: number
    confirmed: number
  }
  messages: {
    total: number
    unread: number
  }
  articles: {
    total: number
    published: number
  }
  portfolio: {
    total: number
  }
}

const EMPTY_STATS: DashboardStats = {
  appointments: { total: 0, pending: 0, confirmed: 0 },
  messages: { total: 0, unread: 0 },
  articles: { total: 0, published: 0 },
  portfolio: { total: 0 },
}

function formatDateShort(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function getFullName(firstName?: string, lastName?: string): string {
  const parts = [firstName, lastName]
    .map((p) => (p ?? '').trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Anonyme'
}

/* ============================================================
   Page
   ============================================================ */
export default function AdminDashboardPage() {
  const { admin, loading: authLoading } = useAuth()

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS)
  const [latestAppointments, setLatestAppointments] = useState<Appointment[]>([])
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !admin) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const [apptRes, contactRes, artRes, portRes] = await Promise.allSettled([
        api.get<Appointment[]>('/appointments', true),
        api.get<ContactMessage[]>('/contact', true),
        api.get<Article[]>('/articles/admin/all', true),
        api.get<PortfolioItem[]>('/portfolio', true),
      ])

      if (cancelled) return

      const appointments =
        apptRes.status === 'fulfilled' ? apptRes.value : []
      const messages = contactRes.status === 'fulfilled' ? contactRes.value : []
      const articles = artRes.status === 'fulfilled' ? artRes.value : []
      const portfolio = portRes.status === 'fulfilled' ? portRes.value : []

      setStats({
        appointments: {
          total: appointments.length,
          pending: appointments.filter((a) => a.status === 'pending').length,
          confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        },
        messages: {
          total: messages.length,
          unread: messages.filter((m) => !m.read).length,
        },
        articles: {
          total: articles.length,
          published: articles.filter((a) => a.published).length,
        },
        portfolio: {
          total: portfolio.length,
        },
      })

      setLatestAppointments(
        [...appointments]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5),
      )

      setLatestMessages(
        [...messages]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5),
      )

      /* Si TOUS les appels ont échoué, on remonte une erreur visible */
      const allFailed =
        apptRes.status === 'rejected' &&
        contactRes.status === 'rejected' &&
        artRes.status === 'rejected' &&
        portRes.status === 'rejected'

      if (allFailed) {
        setError(
          'Impossible de charger les statistiques. Vérifiez votre connexion.',
        )
      }

      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [authLoading, admin])

  if (authLoading || loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 'var(--sp-3)',
          color: 'var(--text-500)',
        }}
      >
        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        <span>Chargement du tableau de bord…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: '32rem',
          margin: 'var(--sp-12) auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto var(--sp-5)',
            borderRadius: '50%',
            background: 'var(--danger-soft)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <AlertCircle size={24} />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--text-900)',
            marginBottom: 'var(--sp-3)',
          }}
        >
          Erreur de chargement
        </h2>
        <p style={{ color: 'var(--text-500)', marginBottom: 'var(--sp-6)' }}>
          {error}
        </p>
      </div>
    )
  }

  const cards = [
    {
      label: 'Rendez-vous en attente',
      value: stats.appointments.pending,
      sub: `${stats.appointments.total} au total · ${stats.appointments.confirmed} confirmé(s)`,
      href: '/admin/appointments',
      icon: Calendar,
    },
    {
      label: 'Messages non lus',
      value: stats.messages.unread,
      sub: `${stats.messages.total} au total`,
      href: '/admin/messages',
      icon: Mail,
    },
    {
      label: 'Articles publiés',
      value: stats.articles.published,
      sub: `${stats.articles.total} au total`,
      href: '/admin/articles',
      icon: FileText,
    },
    {
      label: 'Éléments portfolio',
      value: stats.portfolio.total,
      sub: 'thèse, projets, publications',
      href: '/admin/portfolio',
      icon: Briefcase,
    },
  ] as const

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <header style={{ marginBottom: 'var(--sp-8)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text-900)',
            marginBottom: 'var(--sp-2)',
          }}
        >
          Tableau de bord
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)' }}>
          Bienvenue, {admin?.name ?? 'Administrateur'}.
        </p>
      </header>

      {/* Cartes statistiques */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-10)',
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="card card--hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                textDecoration: 'none',
                color: 'inherit',
                padding: 'var(--sp-6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--accent)',
                }}
              >
                <Icon size={20} aria-hidden="true" />
                <ArrowRight size={16} aria-hidden="true" />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 700,
                  color: 'var(--text-900)',
                  lineHeight: 1,
                }}
              >
                {card.value}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-900)',
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-300)',
                    marginTop: 2,
                  }}
                >
                  {card.sub}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Derniers éléments */}
      <div
        style={{
          display: 'grid',
          gap: 'var(--sp-6)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        {/* Derniers RDV */}
        <section className="card" style={{ padding: 'var(--sp-6)' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--sp-4)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-900)',
              }}
            >
              Derniers rendez-vous
            </h2>
            <Link
              href="/admin/appointments"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              Voir tout →
            </Link>
          </header>

          {latestAppointments.length === 0 ? (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-300)',
                margin: 0,
              }}
            >
              Aucun rendez-vous pour le moment.
            </p>
          ) : (
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {latestAppointments.map((a) => (
                <li
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)',
                    paddingBottom: 'var(--sp-3)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--text-900)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getFullName(a.firstName, a.lastName)}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-300)',
                      }}
                    >
                      {a.reference} · {formatDateShort(a.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`category-badge ${
                      a.status === 'pending'
                        ? 'category-badge--amber'
                        : a.status === 'confirmed'
                          ? 'category-badge--sky'
                          : a.status === 'done'
                            ? 'category-badge--olive'
                            : 'category-badge--navy'
                    }`}
                  >
                    {a.status === 'pending'
                      ? 'En attente'
                      : a.status === 'confirmed'
                        ? 'Confirmé'
                        : a.status === 'done'
                          ? 'Terminé'
                          : 'Annulé'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Derniers messages */}
        <section className="card" style={{ padding: 'var(--sp-6)' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--sp-4)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--text-900)',
              }}
            >
              Derniers messages
            </h2>
            <Link
              href="/admin/messages"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              Voir tout →
            </Link>
          </header>

          {latestMessages.length === 0 ? (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-300)',
                margin: 0,
              }}
            >
              Aucun message pour le moment.
            </p>
          ) : (
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {latestMessages.map((m) => (
                <li
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)',
                    paddingBottom: 'var(--sp-3)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--text-900)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getFullName(m.firstName, m.lastName)}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-300)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.subject} · {formatDateShort(m.createdAt)}
                    </div>
                  </div>
                  {!m.read && (
                    <span
                      className="category-badge category-badge--sky"
                      aria-label="Non lu"
                    >
                      Nouveau
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}