// src/lib/api.ts
/**
 * Client HTTP centralisé.
 * Corrige automatiquement l'URL de base pour toujours inclure /api.
 */

const DEFAULT_BASE = '/api'
const DEFAULT_TIMEOUT = 20_000

function normalizeBaseUrl(input: string | undefined): string {
  if (!input) return DEFAULT_BASE

  let url = input.trim().replace(/\/$/, '')

  // Si l'URL ne contient ni /api ni http://localhost, on ajoute /api
  if (!url.endsWith('/api') && !url.includes('localhost')) {
    url = `${url}/api`
  }

  return url
}

export const API_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)

export const API_BASE = API_URL.endsWith('/api')
  ? API_URL.slice(0, -4)
  : API_URL

const TOKEN_KEY = 'campab_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* stockage indisponible, on ignore silencieusement */
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* stockage indisponible, on ignore silencieusement */
  }
}

/* ============================================================
   Erreurs
   ============================================================ */
export interface ApiErrorPayload {
  status: number
  message: string
  details?: Record<string, string[]>
}

export class ApiException extends Error {
  status: number
  details?: Record<string, string[]>

  constructor({ status, message, details }: ApiErrorPayload) {
    super(message)
    this.name = 'ApiException'
    this.status = status
    this.details = details
  }
}

/* ============================================================
   Requête bas niveau
   ============================================================ */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
  isFormData?: boolean
  timeoutMs?: number
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    auth = false,
    isFormData = false,
    timeoutMs = DEFAULT_TIMEOUT,
    headers,
    signal,
    ...rest
  } = options

  const finalHeaders = new Headers(headers)
  if (!isFormData && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }
  finalHeaders.set('Accept', 'application/json')

  if (auth) {
    const token = getToken()
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  const url = /^https?:\/\//.test(path) ? path : `${API_URL}${path}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: finalHeaders,
      signal: controller.signal,
      body: isFormData
        ? (body as FormData)
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiException({
        status: 0,
        message: 'La requête a expiré. Vérifiez votre connexion et réessayez.',
      })
    }
    throw new ApiException({
      status: 0,
      message: 'Impossible de joindre le serveur. Vérifiez votre connexion internet.',
    })
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 204) return undefined as T

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  let data: unknown = null
  if (isJson) {
    data = await response.json().catch(() => null)
  } else {
    const text = await response.text().catch(() => '')
    if (!response.ok && text) {
      throw new ApiException({
        status: response.status,
        message: `Erreur ${response.status}`,
      })
    }
  }

  if (!response.ok) {
    const err =
      (data as {
        error?: string
        message?: string
        details?: Record<string, string[]>
      }) ?? {}
    throw new ApiException({
      status: response.status,
      message: err.error || err.message || `Erreur ${response.status}`,
      details: err.details,
    })
  }

  return data as T
}

export const api = {
  get: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: 'GET', auth }),

  post: <T>(path: string, body?: unknown, auth = false) =>
    apiFetch<T>(path, { method: 'POST', body, auth }),

  put: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: 'PUT', body, auth }),

  patch: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: 'PATCH', body, auth }),

  delete: <T>(path: string, auth = true) =>
    apiFetch<T>(path, { method: 'DELETE', auth }),

  upload: <T>(path: string, formData: FormData) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: formData,
      auth: true,
      isFormData: true,
    }),
}