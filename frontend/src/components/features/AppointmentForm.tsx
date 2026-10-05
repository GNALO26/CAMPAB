// src/components/features/AppointmentForm.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Info,
  Loader2,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import {
  APPOINTMENT_COUNTRIES,
  APPOINTMENT_SERVICES,
  APPOINTMENT_URGENCIES,
  appointmentSchema,
  type AppointmentFormData,
  type AvailableSlotsResponse,
} from '@/lib/schemas'
import type { CreateAppointmentResponse } from '@/types'
import Button from '@/components/ui/Button'

const STEP_FIELDS: Record<number, Array<keyof AppointmentFormData>> = {
  1: ['typeService', 'urgence', 'description'],
  2: ['firstName', 'lastName', 'email', 'phone', 'country'],
  3: ['consent'],
}
const STEP_LABELS = ['Nature du litige', 'Vos coordonnées', 'Confirmation']

function todayInput(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10)
}

function fmtDate(v?: string | null): string {
  if (!v) return 'Non précisée'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function labelFrom<T extends { value: string; label: string }>(
  list: readonly T[],
  v: string,
): string {
  return list.find((x) => x.value === v)?.label ?? v
}

export default function AppointmentForm() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<CreateAppointmentResponse | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null)

  const minDate = useMemo(todayInput, [])

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onTouched',
    defaultValues: {
      typeService: undefined as unknown as AppointmentFormData['typeService'],
      urgence: undefined as unknown as AppointmentFormData['urgence'],
      description: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organisation: '',
      country: '',
      preferredDate: '',
      preferredTime: '',
      consent: false as unknown as true,
    },
  })

  const values = watch()
  const selectedDate = values.preferredDate

  /* Charger les créneaux disponibles à chaque changement de date */
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      setSlotsMessage(null)
      return
    }

    let cancelled = false
    setLoadingSlots(true)
    setSlotsMessage(null)

    api
      .get<AvailableSlotsResponse>(`/appointments/available-slots?date=${selectedDate}`)
      .then((res) => {
        if (cancelled) return
        if (!res.isWorkingDay) {
          setAvailableSlots([])
          setSlotsMessage(res.message ?? 'Le cabinet est fermé à cette date.')
        } else if (res.slots.length === 0) {
          setAvailableSlots([])
          setSlotsMessage('Aucun créneau disponible à cette date. Choisissez un autre jour.')
        } else {
          setAvailableSlots(res.slots)
        }
      })
      .catch((error) => {
        if (cancelled) return
        console.error('[AppointmentForm] Erreur chargement créneaux :', error)
        setAvailableSlots([])
        setSlotsMessage('Impossible de charger les créneaux. Réessayez.')
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedDate])

  /* Réinitialiser l'heure si la date change */
  useEffect(() => {
    setValue('preferredTime', '')
  }, [selectedDate, setValue])

  async function goNext() {
    const fields = STEP_FIELDS[step] ?? []
    const valid = await trigger(fields, { shouldFocus: true })
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function downloadPdf(base64: string, ref: string) {
    const bin = atob(base64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i)
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `confirmation-rdv-${ref}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function onSubmit(data: AppointmentFormData) {
    setSubmitting(true)
    setServerError(null)
    try {
      const payload = {
        ...data,
        organisation: data.organisation?.trim() || undefined,
        preferredDate: data.preferredDate || undefined,
        preferredTime: data.preferredTime || undefined,
        consent: true,
      }
      const res = await api.post<CreateAppointmentResponse>('/appointments', payload)
      setSuccess(res)
      reset()
      toast.success('Votre demande de rendez-vous a bien été enregistrée.')
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'L’envoi a échoué. Réessayez.'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <div className="form-success__icon" aria-hidden="true">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="form-success__title">Demande enregistrée</h3>
        <p className="form-success__desc">
          Votre demande a bien été reçue. Un email de confirmation vous a été envoyé avec le récapitulatif.
        </p>
        <p className="form-success__ref" aria-label="Référence">
          Référence : {success.reference}
        </p>
        <p className="form-success__desc">
          Le cabinet vous recontacte sous 24 à 48 heures ouvrées.
        </p>
        <div className="form-success__actions">
          {success.pdfBase64 && (
            <button
              type="button"
              className="btn btn--primary btn--md"
              onClick={() => downloadPdf(success.pdfBase64!, success.reference)}
            >
              <Download size={16} aria-hidden="true" />
              <span>Télécharger le PDF</span>
            </button>
          )}
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setSuccess(null)
              setStep(1)
            }}
          >
            Nouvelle demande
          </Button>
          <Link href="/" className="btn btn--ghost btn--md">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Formulaire de prise de rendez-vous"
    >
      <ol className="form-steps" aria-label="Étapes">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const isActive = step === n
          const isDone = step > n
          return (
            <li
              key={label}
              className={`form-step ${isActive ? 'is-active' : ''} ${
                isDone ? 'is-done' : ''
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="form-step__num" aria-hidden="true">
                {isDone ? <Check size={14} /> : n}
              </span>
              <span className="form-step__label">{label}</span>
              {n < STEP_LABELS.length && (
                <span className="form-step__line" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>

      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="rdv-website">Site web</label>
        <input
          id="rdv-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website' as never)}
        />
      </div>

      {/* ÉTAPE 1 : Nature */}
      {step === 1 && (
        <div className="space-y-5">
          <fieldset className="form-group">
            <legend className="form-label">
              Nature de votre demande
              <span className="form-required" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="choice-grid">
              {APPOINTMENT_SERVICES.map((opt) => (
                <label key={opt.value} className="choice-card">
                  <input type="radio" value={opt.value} {...register('typeService')} />
                  <span className="choice-card__body">
                    <span className="choice-card__title">{opt.label}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.typeService && (
              <p className="form-error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{errors.typeService.message}</span>
              </p>
            )}
          </fieldset>

          <fieldset className="form-group">
            <legend className="form-label">
              Niveau d’urgence
              <span className="form-required" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="choice-grid">
              {APPOINTMENT_URGENCIES.map((opt) => (
                <label key={opt.value} className="choice-card">
                  <input type="radio" value={opt.value} {...register('urgence')} />
                  <span className="choice-card__body">
                    <span className="choice-card__title">{opt.label}</span>
                    <span className="choice-card__desc">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.urgence && (
              <p className="form-error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{errors.urgence.message}</span>
              </p>
            )}
          </fieldset>

          <div className="form-group">
            <label htmlFor="rdv-description" className="form-label">
              Description de la situation
              <span className="form-required" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              id="rdv-description"
              rows={6}
              className="form-control"
              placeholder="Décrivez les faits, les parties concernées et votre demande."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'rdv-desc-error' : undefined}
              {...register('description')}
            />
            {errors.description && (
              <p id="rdv-desc-error" className="form-error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : Coordonnées */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rdv-firstName" className="form-label">
                Prénom
                <span className="form-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="rdv-firstName"
                type="text"
                autoComplete="given-name"
                className="form-control"
                aria-invalid={!!errors.firstName}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.firstName.message}</span>
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="rdv-lastName" className="form-label">
                Nom
                <span className="form-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="rdv-lastName"
                type="text"
                autoComplete="family-name"
                className="form-control"
                aria-invalid={!!errors.lastName}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.lastName.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rdv-email" className="form-label">
                Email
                <span className="form-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="rdv-email"
                type="email"
                autoComplete="email"
                className="form-control"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="rdv-phone" className="form-label">
                Téléphone
                <span className="form-required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="rdv-phone"
                type="tel"
                autoComplete="tel"
                className="form-control"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.phone.message}</span>
                </p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rdv-organisation" className="form-label">
                Organisation
              </label>
              <input
                id="rdv-organisation"
                type="text"
                autoComplete="organization"
                className="form-control"
                placeholder="Facultatif"
                {...register('organisation')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="rdv-country" className="form-label">
                Pays
                <span className="form-required" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="form-select-wrap">
                <select
                  id="rdv-country"
                  className="form-control"
                  defaultValue=""
                  aria-invalid={!!errors.country}
                  {...register('country')}
                >
                  <option value="" disabled>
                    Sélectionnez un pays
                  </option>
                  {APPOINTMENT_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.country.message}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Confirmation + créneau */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rdv-date" className="form-label">
                Date souhaitée
              </label>
              <input
                id="rdv-date"
                type="date"
                min={minDate}
                className="form-control"
                {...register('preferredDate')}
              />
              {errors.preferredDate ? (
                <p className="form-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.preferredDate.message}</span>
                </p>
              ) : (
                <p className="form-hint">
                  <CalendarDays
                    size={12}
                    style={{ display: 'inline', marginRight: 4, verticalAlign: '-2px' }}
                  />
                  Facultatif. Lundi à vendredi uniquement.
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="rdv-time" className="form-label">
                Heure souhaitée
              </label>
              <div className="form-select-wrap">
                <select
                  id="rdv-time"
                  className="form-control"
                  disabled={!selectedDate || loadingSlots || availableSlots.length === 0}
                  {...register('preferredTime')}
                >
                  <option value="">
                    {loadingSlots
                      ? 'Chargement...'
                      : !selectedDate
                        ? 'Sélectionnez une date'
                        : availableSlots.length === 0
                          ? 'Aucun créneau disponible'
                          : 'Sélectionnez un créneau'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {slotsMessage && (
                <p className="form-hint" style={{ color: '#B45309' }}>
                  <AlertCircle
                    size={12}
                    style={{ display: 'inline', marginRight: 4, verticalAlign: '-2px' }}
                  />
                  {slotsMessage}
                </p>
              )}
              {!slotsMessage && availableSlots.length > 0 && (
                <p className="form-hint">
                  <Clock
                    size={12}
                    style={{ display: 'inline', marginRight: 4, verticalAlign: '-2px' }}
                  />
                </p>
              )}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="summary">
            <div className="summary__row">
              <span className="summary__key">Nature</span>
              <span className="summary__value">
                {labelFrom(APPOINTMENT_SERVICES, values.typeService)}
              </span>
            </div>
            <div className="summary__row">
              <span className="summary__key">Urgence</span>
              <span className="summary__value">
                {labelFrom(APPOINTMENT_URGENCIES, values.urgence)}
              </span>
            </div>
            <div className="summary__row">
              <span className="summary__key">Nom</span>
              <span className="summary__value">
                {values.firstName} {values.lastName}
              </span>
            </div>
            <div className="summary__row">
              <span className="summary__key">Email</span>
              <span className="summary__value">{values.email}</span>
            </div>
            <div className="summary__row">
              <span className="summary__key">Téléphone</span>
              <span className="summary__value">{values.phone}</span>
            </div>
            {values.organisation?.trim() && (
              <div className="summary__row">
                <span className="summary__key">Organisation</span>
                <span className="summary__value">{values.organisation}</span>
              </div>
            )}
            <div className="summary__row">
              <span className="summary__key">Pays</span>
              <span className="summary__value">{values.country}</span>
            </div>
            <div className="summary__row">
              <span className="summary__key">Date souhaitée</span>
              <span className="summary__value">{fmtDate(values.preferredDate)}</span>
            </div>
            {values.preferredTime && (
              <div className="summary__row">
                <span className="summary__key">Heure</span>
                <span className="summary__value">{values.preferredTime}</span>
              </div>
            )}
          </div>

          <label className="form-check" htmlFor="rdv-consent">
            <input
              id="rdv-consent"
              type="checkbox"
              aria-invalid={!!errors.consent}
              {...register('consent')}
            />
            <span className="form-check__label">
              J’accepte que mes informations soient utilisées pour le traitement de
              ma demande, conformément à la{' '}
              <Link href="/confidentialite">politique de confidentialité</Link>.
              <span className="form-required" aria-hidden="true">
                {' '}
                *
              </span>
            </span>
          </label>
          {errors.consent && (
            <p className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{errors.consent.message}</span>
            </p>
          )}

          <div className="form-notice">
            <Info size={16} aria-hidden="true" />
            <p>
              Un email de confirmation avec PDF récapitulatif vous sera envoyé
              immédiatement après validation. Vos données restent strictement
              confidentielles.
            </p>
          </div>
        </div>
      )}

      {serverError && (
        <p className="form-error" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{serverError}</span>
        </p>
      )}

      <div className="form-nav">
        {step > 1 ? (
          <button
            type="button"
            className="btn btn--outline btn--md"
            onClick={goBack}
            disabled={submitting}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Précédent</span>
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            type="button"
            className="btn btn--primary btn--md"
            onClick={goNext}
          >
            <span>Continuer</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send size={16} aria-hidden="true" />
                <span>Confirmer la demande</span>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}