// app/admin/appointments/page.tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { api, ApiException } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'
import type {
  Appointment,
  AppointmentStatus,
  AppointmentService,
  AppointmentUrgency,
} from '@/types'

/* ============================================================
   Étiquettes
   ============================================================ */
const SERVICE_LABELS: Record<AppointmentService, string> = {
  consultation: 'Consultation juridique',
  mediation: 'Médiation',
  arbitrage: 'Arbitrage OHADA',
}

const URGENCY_LABELS: Record<AppointmentUrgency, string> = {
  normale: 'Normale',
  elevee: 'Élevée',
  critique: 'Critique',
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  done: 'Terminé',
}

const STATUS_VARIANTS: Record<AppointmentStatus, string> = {
  pending: 'category-badge--amber',
  confirmed: 'category-badge--sky',
  cancelled: 'category-badge--navy',
  done: 'category-badge--olive',
}

const URGENCY_VARIANTS: Record<AppointmentUrgency, string> = {
  normale: 'category-badge--navy',
  elevee: 'category-badge--amber',
  critique: 'category-badge--olive',
}

/* ============================================================
   Utilitaires
   ============================================================ */
function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function formatDateOnly(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function getFullName(appointment: Appointment): string {
  const parts = [appointment.firstName, appointment.lastName]
    .map((p) => (p ?? '').trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Anonyme'
}

/* ============================================================
   Filtres
   ============================================================ */
type StatusFilter = 'all' | AppointmentStatus
type UrgencyFilter = 'all' | AppointmentUrgency

/* ============================================================
   Page
   ============================================================ */
export default function AdminAppointmentsPage() {
  const { admin, loading: authLoading } = useAuth({ redirectIfNotAuth: true })

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  /* ============================================================
     Chargement
     ============================================================ */
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<Appointment[]>('/admin/appointments', true)
      setAppointments(data)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible de charger les rendez-vous.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && admin) {
      void fetchAppointments()
    }
  }, [authLoading, admin, fetchAppointments])

  /* ============================================================
     Filtrage
     ============================================================ */
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return appointments.filter((appt) => {
      if (statusFilter !== 'all' && appt.status !== statusFilter) return false
      if (urgencyFilter !== 'all' && appt.urgence !== urgencyFilter) return false
      if (!needle) return true
      const haystack = [
        appt.reference,
        getFullName(appt),
        appt.email,
        appt.phone,
        appt.country,
        appt.organisation ?? '',
        SERVICE_LABELS[appt.typeService] ?? appt.typeService,
        appt.description,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [appointments, statusFilter, urgencyFilter, query])

  const counts = useMemo(
    () => ({
      all: appointments.length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      done: appointments.filter((a) => a.status === 'done').length,
    }),
    [appointments],
  )

  /* ============================================================
     Actions
     ============================================================ */
  async function updateStatus(appt: Appointment, status: AppointmentStatus) {
    setBusyId(appt.id)
    try {
      await api.patch(
        `/admin/appointments/${appt.id}`,
        { status },
        true,
      )
      setAppointments((prev) =>
        prev.map((a) => (a.id === appt.id ? { ...a, status } : a)),
      )
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}.`)
    } catch (err) {
      const message =
        err instanceof ApiException ? err.message : 'La mise à jour a échoué.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  async function removeAppointment(appt: Appointment) {
    if (
      !window.confirm(
        `Supprimer définitivement le rendez-vous ${appt.reference} ?`,
      )
    ) {
      return
    }
    setBusyId(appt.id)
    try {
      await api.delete(`/admin/appointments/${appt.id}`, true)
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id))
      toast.success('Rendez-vous supprimé.')
    } catch (err) {
      const message =
        err instanceof ApiException ? err.message : 'La suppression a échoué.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  async function downloadPdf(appt: Appointment) {
    setBusyId(appt.id)
    try {
      const res = await api.get<{ pdfBase64: string }>(
        `/admin/appointments/${appt.id}/pdf`,
        true,
      )
      if (!res.pdfBase64) {
        toast.error('PDF indisponible pour ce rendez-vous.')
        return
      }
      const bin = atob(res.pdfBase64)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `confirmation-rdv-${appt.reference}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : 'Le téléchargement a échoué.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  function toggleExpanded(appt: Appointment) {
    setExpandedId((current) => (current === appt.id ? null : appt.id))
  }

  /* ============================================================
     États
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
        <span>Chargement des rendez-vous…</span>
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
          onClick={() => void fetchAppointments()}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>Réessayer</span>
        </button>
      </div>
    )
  }

  /* ============================================================
     Rendu
     ============================================================ */
  return (
    <div>
      {/* En-tête */}
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
            Demandes de rendez-vous
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-500)' }}>
            {counts.all} demande{counts.all > 1 ? 's' : ''}
            {counts.pending > 0 && ` · ${counts.pending} en attente`}
            {counts.confirmed > 0 && ` · ${counts.confirmed} confirmée${counts.confirmed > 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          type="button"
          className="btn btn--outline btn--md"
          onClick={() => void fetchAppointments()}
          disabled={loading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>Actualiser</span>
        </button>
      </header>

      {/* Filtres */}
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
              { value: 'all', label: `Tous (${counts.all})` },
              { value: 'pending', label: `En attente (${counts.pending})` },
              { value: 'confirmed', label: `Confirmés (${counts.confirmed})` },
              { value: 'cancelled', label: `Annulés (${counts.cancelled})` },
              { value: 'done', label: `Terminés (${counts.done})` },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-pill ${statusFilter === opt.value ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(opt.value)}
              aria-pressed={statusFilter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {(
            [
              { value: 'all', label: 'Toutes urgences' },
              { value: 'normale', label: 'Normale' },
              { value: 'elevee', label: 'Élevée' },
              { value: 'critique', label: 'Critique' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-pill ${urgencyFilter === opt.value ? 'is-active' : ''}`}
              onClick={() => setUrgencyFilter(opt.value)}
              aria-pressed={urgencyFilter === opt.value}
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
            placeholder="Référence, nom, email, description…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ paddingLeft: '2.25rem' }}
            aria-label="Rechercher un rendez-vous"
          />
        </div>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="empty-state__title">
            {appointments.length === 0
              ? 'Aucun rendez-vous pour le moment'
              : 'Aucun rendez-vous ne correspond'}
          </p>
          <p className="empty-state__desc">
            {appointments.length === 0
              ? 'Les demandes envoyées depuis le formulaire de prise de rendez-vous apparaîtront ici.'
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
          {filtered.map((appt) => {
            const isBusy = busyId === appt.id
            const isExpanded = expandedId === appt.id
            const fullName = getFullName(appt)

            return (
              <li
                key={appt.id}
                className="card"
                style={{
                  padding: 0,
                  borderLeft:
                    appt.status === 'pending'
                      ? '3px solid var(--accent)'
                      : appt.status === 'confirmed'
                        ? '3px solid var(--accent-green)'
                        : '3px solid var(--border)',
                }}
              >
                {/* Ligne condensée */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(appt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--sp-5) var(--sp-6)',
                  }}
                  aria-expanded={isExpanded}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-3)',
                      alignItems: 'center',
                      marginBottom: 'var(--sp-2)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: 'var(--accent)',
                      }}
                    >
                      {appt.reference}
                    </span>
                    <span className={`category-badge ${STATUS_VARIANTS[appt.status]}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                    <span className={`category-badge ${URGENCY_VARIANTS[appt.urgence]}`}>
                      {URGENCY_LABELS[appt.urgence]}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-300)',
                        marginLeft: 'auto',
                      }}
                    >
                      {formatDateTime(appt.createdAt)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-4)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-500)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 600,
                        color: 'var(--text-900)',
                      }}
                    >
                      <User size={14} aria-hidden="true" />
                      {fullName}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={14} aria-hidden="true" />
                      {appt.email}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={14} aria-hidden="true" />
                      {appt.phone}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <CalendarDays size={14} aria-hidden="true" />
                      {SERVICE_LABELS[appt.typeService] ?? appt.typeService}
                    </span>
                  </div>
                </button>

                {/* Détails */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '0 var(--sp-6) var(--sp-6)',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gap: 'var(--sp-4)',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        marginTop: 'var(--sp-5)',
                      }}
                    >
                      <div>
                        <p className="contact-info-item__label">Coordonnées</p>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-700)',
                            marginTop: 'var(--sp-2)',
                          }}
                        >
                          {fullName}
                          <br />
                          <a href={`mailto:${appt.email}`} style={{ color: 'var(--accent)' }}>
                            {appt.email}
                          </a>
                          <br />
                          <a
                            href={`tel:${appt.phone.replace(/\s/g, '')}`}
                            style={{ color: 'var(--accent)' }}
                          >
                            {appt.phone}
                          </a>
                        </p>
                      </div>

                      <div>
                        <p className="contact-info-item__label">Localisation</p>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-700)',
                            marginTop: 'var(--sp-2)',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={14} aria-hidden="true" />
                            {appt.country}
                          </span>
                          {appt.organisation && (
                            <>
                              <br />
                              <span style={{ color: 'var(--text-500)' }}>
                                {appt.organisation}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="contact-info-item__label">Date souhaitée</p>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-700)',
                            marginTop: 'var(--sp-2)',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <CalendarDays size={14} aria-hidden="true" />
                            {formatDateOnly(appt.preferredDate)}
                          </span>
                          {appt.preferredTime && (
                            <>
                              <br />
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <Clock size={14} aria-hidden="true" />
                                {appt.preferredTime}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="contact-info-item__label">Créée le</p>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-700)',
                            marginTop: 'var(--sp-2)',
                          }}
                        >
                          {formatDateTime(appt.createdAt)}
                          <br />
                          <span style={{ color: 'var(--text-300)', fontSize: 'var(--text-xs)' }}>
                            Mise à jour : {formatDateTime(appt.updatedAt)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginTop: 'var(--sp-5)' }}>
                      <p className="contact-info-item__label">Description de la situation</p>
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-700)',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-line',
                          marginTop: 'var(--sp-2)',
                        }}
                      >
                        {appt.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--sp-2)',
                        marginTop: 'var(--sp-6)',
                        paddingTop: 'var(--sp-5)',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      {appt.status !== 'confirmed' && (
                        <button
                          type="button"
                          className="btn btn--primary btn--sm"
                          onClick={() => void updateStatus(appt, 'confirmed')}
                          disabled={isBusy}
                        >
                          <Check size={14} aria-hidden="true" />
                          <span>Confirmer</span>
                        </button>
                      )}

                      {appt.status !== 'done' && appt.status !== 'cancelled' && (
                        <button
                          type="button"
                          className="btn btn--olive btn--sm"
                          onClick={() => void updateStatus(appt, 'done')}
                          disabled={isBusy}
                        >
                          <CheckCircle2 size={14} aria-hidden="true" />
                          <span>Marquer terminé</span>
                        </button>
                      )}

                      {appt.status !== 'cancelled' && (
                        <button
                          type="button"
                          className="btn btn--outline btn--sm"
                          onClick={() => void updateStatus(appt, 'cancelled')}
                          disabled={isBusy}
                        >
                          <X size={14} aria-hidden="true" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => void downloadPdf(appt)}
                        disabled={isBusy}
                      >
                        {isBusy ? (
                          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <Download size={14} aria-hidden="true" />
                        )}
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => void removeAppointment(appt)}
                        disabled={isBusy}
                        style={{ color: 'var(--danger)', marginLeft: 'auto' }}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}