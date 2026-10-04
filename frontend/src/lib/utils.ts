// src/lib/utils.ts
import type { PortfolioCategory } from '@/types'

/* ============================================================
   1. Dates
   ============================================================ */
export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/* ============================================================
   2. Blog — étiquettes et variantes de catégorie
   ============================================================ */
export const categoryLabels: Record<string, string> = {
  vulgarisation: 'Vulgarisation',
  conseils: 'Conseils pratiques',
  ethique: 'Éthique et valeurs',
  actualite: 'Actualité juridique',
  these: 'Thèse',
  projet: 'Projet',
  publication: 'Publication',
  distinction: 'Distinction',
}

/**
 * Classes CSS sémantiques, définies dans globals.css.
 * Elles s’adaptent automatiquement au mode clair et au mode sombre.
 */
export const categoryVariants: Record<string, string> = {
  vulgarisation: 'category-badge--sky',
  conseils: 'category-badge--olive',
  ethique: 'category-badge--navy',
  actualite: 'category-badge--amber',
  these: 'category-badge--navy',
  projet: 'category-badge--sky',
  publication: 'category-badge--olive',
  distinction: 'category-badge--amber',
}

/* ============================================================
   3. Portfolio — étiquettes et variantes de catégorie
   ============================================================ */
export const portfolioCategoryLabels: Record<PortfolioCategory, string> = {
  these: 'Thèse',
  projet: 'Projet',
  publication: 'Publication',
  distinction: 'Distinction',
}

export const portfolioCategoryVariants: Record<PortfolioCategory, string> = {
  these: 'category-badge--navy',
  projet: 'category-badge--sky',
  publication: 'category-badge--olive',
  distinction: 'category-badge--amber',
}

/* ============================================================
   4. Utilitaires texte
   ============================================================ */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(input: string, length = 140): string {
  if (input.length <= length) return input
  return `${input.slice(0, length).trimEnd()}…`
}

export function getInitials(firstName?: string, lastName?: string): string {
  const a = firstName?.trim().charAt(0) ?? ''
  const b = lastName?.trim().charAt(0) ?? ''
  return `${a}${b}`.toUpperCase() || '?'
}

/* ============================================================
   5. Utilitaires numériques et divers
   ============================================================ */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function formatNumber(value: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(value)
}