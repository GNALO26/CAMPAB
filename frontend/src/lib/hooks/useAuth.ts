// src/lib/hooks/useAuth.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { api, ApiException, clearToken, getToken, setToken } from '@/lib/api'
import type { Admin, LoginResponse } from '@/types'

interface UseAuthOptions {
  /** Redirige vers /admin/login si aucun token valide n’est trouvé. */
  redirectIfNotAuth?: boolean
}

interface UseAuthResult {
  admin: Admin | null
  loading: boolean
  login: (email: string, password: string) => Promise<Admin>
  logout: () => void
  refresh: () => Promise<void>
}

export function useAuth({
  redirectIfNotAuth = false,
}: UseAuthOptions = {}): UseAuthResult {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  /* ============================================================
     Chargement initial du profil admin
     ============================================================ */
  const loadProfile = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setAdmin(null)
      setLoading(false)
      if (redirectIfNotAuth) router.replace('/admin/login')
      return
    }

    try {
      const profile = await api.get<Admin>('/admin/me', true)
      setAdmin(profile)
    } catch (error) {
      /* Token expiré ou invalide : on nettoie et redirige. */
      if (error instanceof ApiException && error.status === 401) {
        clearToken()
        setAdmin(null)
        if (redirectIfNotAuth) router.replace('/admin/login')
      } else {
        /* Erreur réseau ou serveur : on ne force pas la déconnexion. */
        // eslint-disable-next-line no-console
        console.error('[useAuth] Erreur de chargement du profil :', error)
      }
    } finally {
      setLoading(false)
    }
  }, [redirectIfNotAuth, router])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  /* ============================================================
     Connexion
     ============================================================ */
  const login = useCallback(
    async (email: string, password: string): Promise<Admin> => {
      const res = await api.post<LoginResponse>('/admin/login', {
        email,
        password,
      })
      setToken(res.token)
      setAdmin(res.admin)
      return res.admin
    },
    [],
  )

  /* ============================================================
     Déconnexion
     ============================================================ */
  const logout = useCallback(() => {
    clearToken()
    setAdmin(null)
    router.replace('/admin/login')
  }, [router])

  /* ============================================================
     Rafraîchissement manuel
     ============================================================ */
  const refresh = useCallback(async () => {
    setLoading(true)
    await loadProfile()
  }, [loadProfile])

  return { admin, loading, login, logout, refresh }
}