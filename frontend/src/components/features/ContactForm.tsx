// src/components/features/ContactForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, Info, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { contactSchema, type ContactFormData } from '@/lib/schemas'
import Button from '@/components/ui/Button'

const SUBJECTS = [
  'Consultation juridique',
  'Médiation ou arbitrage',
  'Droit des affaires',
  'Droit des sociétés',
  'Droit social',
  'Droit civil',
  'Autre demande',
] as const

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
  })

  async function onSubmit(data: ContactFormData) {
    setSubmitting(true)
    setServerError(null)
    try {
      await api.post('/contact', data)
      setSent(true)
      reset()
      toast.success('Votre message a bien été envoyé.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'L’envoi a échoué. Vérifiez votre connexion et réessayez.'
      setServerError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <div className="form-success__icon" aria-hidden="true">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="form-success__title">Message reçu</h3>
        <p className="form-success__desc">
          Nous avons bien reçu votre message. Une confirmation vous a été
          envoyée par email. Nous vous répondons dans les meilleurs délais,
          généralement sous 24 à 48 heures ouvrées.
        </p>
        <div className="form-success__actions">
          <Button variant="outline" size="md" onClick={() => setSent(false)}>
            Envoyer un autre message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
      aria-label="Formulaire de contact"
    >
      {/* Honeypot anti-spam */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Site web</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website' as never)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-firstName" className="form-label">
            Prénom<span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-firstName"
            type="text"
            autoComplete="given-name"
            className="form-control"
            placeholder="Prudence"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'contact-firstName-error' : undefined}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p id="contact-firstName-error" className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{errors.firstName.message}</span>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contact-lastName" className="form-label">
            Nom<span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-lastName"
            type="text"
            autoComplete="family-name"
            className="form-control"
            placeholder="ABODE"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'contact-lastName-error' : undefined}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p id="contact-lastName-error" className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{errors.lastName.message}</span>
            </p>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email<span className="form-required" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="form-control"
            placeholder="vous@exemple.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="contact-email-error" className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contact-phone" className="form-label">
            Téléphone
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="form-control"
            placeholder="+229 01 97 76 29 36"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'contact-phone-error' : 'contact-phone-hint'}
            {...register('phone')}
          />
          {errors.phone ? (
            <p id="contact-phone-error" className="form-error" role="alert">
              <AlertCircle aria-hidden="true" />
              <span>{errors.phone.message}</span>
            </p>
          ) : (
            <p id="contact-phone-hint" className="form-hint">
              Facultatif, mais utile pour un rappel rapide.
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject" className="form-label">
          Objet<span className="form-required" aria-hidden="true">*</span>
        </label>
        <div className="form-select-wrap">
          <select
            id="contact-subject"
            className="form-control"
            defaultValue=""
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
            {...register('subject')}
          >
            <option value="" disabled>
              Sélectionnez un motif
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        {errors.subject && (
          <p id="contact-subject-error" className="form-error" role="alert">
            <AlertCircle aria-hidden="true" />
            <span>{errors.subject.message}</span>
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">
          Message<span className="form-required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className="form-control"
          placeholder="Décrivez brièvement votre situation ou votre demande."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="contact-message-error" className="form-error" role="alert">
            <AlertCircle aria-hidden="true" />
            <span>{errors.message.message}</span>
          </p>
        )}
      </div>

      <div className="form-notice">
        <Info size={16} aria-hidden="true" />
        <p>
          Vos informations sont traitées de manière strictement confidentielle,
          conformément au secret professionnel et au règlement sur la
          protection des données personnelles.
        </p>
      </div>

      {serverError && (
        <p className="form-error" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{serverError}</span>
        </p>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--lg btn--full"
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
            <span>Envoyer le message</span>
          </>
        )}
      </button>
    </form>
  )
}