// src/types/index.ts

/* ============================================================
   Authentification admin
   ============================================================ */
export interface Admin {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  token: string
  admin: Admin
}

/* ============================================================
   Rendez-vous
   ============================================================ */
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'done'

export type AppointmentService =
  | 'consultation'
  | 'mediation'
  | 'arbitrage'

export type AppointmentUrgency = 'normale' | 'elevee' | 'critique'

export interface Appointment {
  id: string
  reference: string
  typeService: AppointmentService
  urgence: AppointmentUrgency
  description: string
  firstName: string
  lastName: string
  email: string
  phone: string
  organisation?: string | null
  country: string
  preferredDate?: string | null
  preferredTime?: string | null
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentResponse {
  ok: true
  id: string
  reference: string
  message: string
  pdfBase64?: string
}

/* ============================================================
   Contact
   ============================================================ */
export interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  /**
   * Champ hérité : présent uniquement dans d’anciens enregistrements
   * créés avant la séparation prénom / nom. À ne plus utiliser.
   */
  name?: string | null
  email: string
  phone?: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface CreateContactResponse {
  ok: true
  id: string
  message: string
}

/* ============================================================
   Blog
   ============================================================ */
export type ArticleCategory =
  | 'vulgarisation'
  | 'conseils'
  | 'ethique'
  | 'actualite'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string | null
  category: ArticleCategory
  tags: string[]
  published: boolean
  views: number
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ArticleListItem {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage?: string | null
  category: ArticleCategory
  tags: string[]
  publishedAt?: string | null
  views: number
}

export interface Paginated<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/* ============================================================
   Portfolio
   ============================================================ */
export type PortfolioCategory =
  | 'these'
  | 'projet'
  | 'publication'
  | 'distinction'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  link?: string | null
  category: PortfolioCategory
  order: number
  createdAt: string
}

/* ============================================================
   Réponses API génériques
   ============================================================ */
export interface ApiErrorResponse {
  error: string
  details?: Record<string, string[]>
}

export interface ApiSuccessResponse {
  ok: true
  message: string
}