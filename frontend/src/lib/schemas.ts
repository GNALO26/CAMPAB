// src/lib/schemas.ts
import { z } from 'zod'

/* ============================================================
   Utilitaires
   ============================================================ */
const PHONE_REGEX = /^(?=.*\d)[0-9+\s().-]{6,30}$/
const honeypotSchema = z.string().max(0, 'Champ invalide').optional()

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/* ============================================================
   Contact
   ============================================================ */
export const contactSchema = z.object({
  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.').max(80),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(80),
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  phone: z.string().trim().optional().refine((v) => !v || PHONE_REGEX.test(v), {
    message: 'Numéro de téléphone invalide.',
  }),
  subject: z.string().trim().min(2, 'Veuillez sélectionner un objet.').max(200),
  message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères.').max(5000),
  website: honeypotSchema,
})
export type ContactFormData = z.infer<typeof contactSchema>

/* ============================================================
   Rendez-vous : schéma enrichi
   ============================================================ */
export const APPOINTMENT_SERVICES = [
  { value: 'consultation', label: 'Consultation juridique' },
  { value: 'mediation', label: 'Médiation' },
  { value: 'arbitrage', label: 'Arbitrage OHADA' },
] as const

export const APPOINTMENT_URGENCIES = [
  { value: 'normale', label: 'Normale', desc: 'Le dossier peut attendre quelques jours.' },
  { value: 'elevee', label: 'Élevée', desc: 'Une réponse est attendue sous 48 heures.' },
  { value: 'critique', label: 'Critique', desc: 'Situation urgente nécessitant un contact immédiat.' },
] as const

export const APPOINTMENT_COUNTRIES = [
  'Bénin',
  'Togo',
  'Côte d’Ivoire',
  'Sénégal',
  'Burkina Faso',
  'Niger',
  'Mali',
  'Cameroun',
  'Autre pays',
] as const

export const appointmentSchema = z.object({
  typeService: z.enum(['consultation', 'mediation', 'arbitrage'], {
    errorMap: () => ({ message: 'Veuillez sélectionner la nature de votre demande.' }),
  }),
  urgence: z.enum(['normale', 'elevee', 'critique'], {
    errorMap: () => ({ message: 'Veuillez préciser le niveau d’urgence.' }),
  }),
  description: z.string().trim().min(20, 'Décrivez votre situation en au moins 20 caractères.').max(5000),

  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.').max(80),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(80),
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  phone: z.string().trim().min(6, 'Le numéro de téléphone est trop court.').max(30).regex(PHONE_REGEX, 'Numéro de téléphone invalide.'),
  organisation: z.string().trim().max(150).optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Veuillez sélectionner votre pays.').max(80),

  preferredDate: z.string().trim().optional().or(z.literal(''))
    .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), { message: 'La date sélectionnée est invalide.' })
    .refine((v) => !v || new Date(v) >= startOfToday(), { message: 'La date souhaitée ne peut pas être dans le passé.' }),
  preferredTime: z.string().trim().optional().or(z.literal('')),

  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité pour continuer.' }),
  }),
  website: honeypotSchema,
})
export type AppointmentFormData = z.infer<typeof appointmentSchema>

/* ============================================================
   Objets du formulaire de contact
   ============================================================ */
export const CONTACT_SUBJECTS = [
  'Consultation juridique',
  'Médiation ou arbitrage',
  'Droit des affaires',
  'Droit des sociétés',
  'Droit social',
  'Droit civil',
  'Autre demande',
] as const

// src/lib/schemas.ts (ajout à la fin)
export interface AvailableSlotsResponse {
  date: string
  isWorkingDay: boolean
  slots: string[]
  allSlots?: string[]
  message?: string
}