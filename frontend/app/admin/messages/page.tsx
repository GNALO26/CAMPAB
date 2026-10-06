// app/admin/messages/page.tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { api, ApiException } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'
import type { ContactMessage } from '@/types'

type Filter = 'all' | 'unread' | 'read'

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function getContactName(contact: {
  firstName?: string | null
  lastName?: string | null
  name?: string | null
}): string {
  const parts = [contact.firstName, contact.lastName]
    .map((p) => (p ?? '').trim())
    .filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  if (contact.name && contact.name.trim().length > 0) return contact.name.trim()
  return 'Anonyme'
}

export default function AdminMessagesPage() {
  const { admin, loading: authLoading } = useAuth()

  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  /* ============================================================
     Chargement des messages
     Endpoint backend : GET /api/contact (protégé)
     ============================================================ */
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<ContactMessage[]>('/contact', true)
      setMessages(data)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible de charger les messages.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && admin) {
      void fetchMessages()
    }
  }, [authLoading, admin, fetchMessages])

  /* ============================================================
     Filtrage local
     ============================================================ */
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return messages.filter((msg) => {
      if (filter === 'unread' && msg.read) return false
      if (filter === 'read' && !msg.read) return false
      if (!needle) return true
      const haystack = [
        getContactName(msg),
        msg.email,
        msg.phone ?? '',
        msg.subject,
        msg.message,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [messages, filter, query])

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages],
  )

  /* ============================================================
     Actions
     PATCH  /api/contact/:id/read
     DELETE /api/contact/:id
     ============================================================ */
  async function toggleRead(msg: ContactMessage) {
    setBusyId(msg.id)
    try {
      const next = !msg.read
      await api.patch(`/contact/${msg.id}/read`, { read: next }, true)
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: next } : m)),
      )
      toast.success(next ? 'Marqué comme lu.' : 'Marqué comme non lu.')
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : 'La mise à jour a échoué.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  async function removeMessage(msg: ContactMessage) {
    if (
      !window.confirm(
        `Supprimer définitivement le message de ${getContactName(msg)} ?`,
      )
    ) {
      return
    }
    setBusyId(msg.id)
    try {
      await api.delete(`/contact/${msg.id}`, true)
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      toast.success('Message supprimé.')
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : 'La suppression a échoué.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  /* ============================================================
     États de chargement / erreur
     ============================================================ */
  if (authLoading || loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          gap: 'var(--sp-3)',
          color: 'var(--text-500)',
        }}
      >
        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        <span>Chargement des messages…</span>
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
        <button
          type="button"
          className="btn btn--primary btn--md"
          onClick={() => void fetchMessages()}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>Réessayer</span>
        </button>
      </div>
    )
  }

  /* ============================================================
     Rendu principal
     ============================================================ */
  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <header
        style={{
          marginBottom: 'var(--sp-8)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-4)',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 600,
              color: 'var(--text-900)',
              marginBottom: 'var(--sp-2)',
            }}
          >
            Messages de contact
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)' }}>
            {messages.length} message{messages.length > 1 ? 's' : ''} reçu
            {messages.length > 1 ? 's' : ''}
            {unreadCount > 0 &&
              ` · ${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          type="button"
          className="btn btn--outline btn--md"
          onClick={() => void fetchMessages()}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
            className={loading ? 'animate-spin' : undefined}
          />
          <span>Actualiser</span>
        </button>
      </header>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-3)',
          marginBottom: 'var(--sp-6)',
          alignItems: 'center',
        }}
      >
        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {(
            [
              { value: 'all', label: 'Tous' },
              { value: 'unread', label: `Non lus (${unreadCount})` },
              { value: 'read', label: 'Lus' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-pill ${filter === opt.value ? 'is-active' : ''}`}
              onClick={() => setFilter(opt.value)}
              aria-pressed={filter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 220,
            maxWidth: 380,
          }}
        >
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-300)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            className="form-control"
            placeholder="Rechercher un nom, email, sujet…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ paddingLeft: '2.25rem' }}
            aria-label="Rechercher dans les messages"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="empty-state"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="empty-state__title">
            {messages.length === 0
              ? 'Aucun message pour le moment'
              : 'Aucun message ne correspond'}
          </p>
          <p className="empty-state__desc">
            {messages.length === 0
              ? 'Les messages envoyés depuis le formulaire de contact apparaîtront ici.'
              : 'Essayez de modifier les filtres ou la recherche.'}
          </p>
        </div>
      ) : (
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {filtered.map((msg) => {
            const isBusy = busyId === msg.id
            const fullName = getContactName(msg)
            return (
              <li
                key={msg.id}
                className="card"
                style={{
                  padding: 'var(--sp-6)',
                  borderLeft: msg.read
                    ? '3px solid var(--border)'
                    : '3px solid var(--accent)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--sp-4)',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-3)',
                        marginBottom: 'var(--sp-2)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--text-lg)',
                          color: 'var(--text-900)',
                        }}
                      >
                        {fullName}
                      </strong>

                      {!msg.read && (
                        <span
                          className="category-badge category-badge--sky"
                          aria-label="Non lu"
                        >
                          Nouveau
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-300)',
                          marginLeft: 'auto',
                        }}
                      >
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--sp-4)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-500)',
                        marginBottom: 'var(--sp-3)',
                      }}
                    >
                      <a
                        href={`mailto:${msg.email}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'inherit',
                        }}
                      >
                        <Mail size={14} aria-hidden="true" />
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone.replace(/\s/g, '')}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'inherit',
                          }}
                        >
                          <Phone size={14} aria-hidden="true" />
                          {msg.phone}
                        </a>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: 'var(--text-900)',
                        marginBottom: 'var(--sp-2)',
                      }}
                    >
                      {msg.subject}
                    </p>

                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-500)',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-line',
                        margin: 0,
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--sp-2)',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => void toggleRead(msg)}
                      disabled={isBusy}
                      aria-label={
                        msg.read ? 'Marquer comme non lu' : 'Marquer comme lu'
                      }
                    >
                      {isBusy ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : msg.read ? (
                        <Mail size={14} aria-hidden="true" />
                      ) : (
                        <MailOpen size={14} aria-hidden="true" />
                      )}
                      <span>{msg.read ? 'Non lu' : 'Lu'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => void removeMessage(msg)}
                      disabled={isBusy}
                      aria-label={`Supprimer le message de ${fullName}`}
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Supprimer</span>
                    </button>

                    {msg.read && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 'var(--text-xs)',
                          color: 'var(--accent-green)',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle2 size={12} aria-hidden="true" />
                        Traité
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}