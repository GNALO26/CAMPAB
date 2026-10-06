// src/lib/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, clearToken, getToken, setToken } from '@/lib/api'
import type { Admin, LoginResponse } from '@/types'

/* ============================================================
   Types
   ============================================================ */
type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

interface UseAuthResult {
  state: AuthState
  admin: Admin | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

/* ============================================================
   Hook principal
   ============================================================ */
export function useAuth(options?: {
  redirectTo?: string
  requireAuth?: boolean
}): UseAuthResult {
  const router = useRouter()
  const [state, setState] = useState<AuthState>('loading')
  const [admin, setAdmin] = useState<Admin | null>(null)

  const redirectTo = options?.redirectTo ?? '/admin/login'
  const requireAuth = options?.requireAuth ?? false

  /* ---------- Vérification initiale ---------- */
  useEffect(() => {
    let cancelled = false

    async function check() {
      const token = getToken()

      if (!token) {
        if (!cancelled) {
          setState('unauthenticated')
          setAdmin(null)
          if (requireAuth) router.replace(redirectTo)
        }
        return
      }

      try {
        const me = await api.get<Admin>('/auth/me', true)
        if (cancelled) return

        setAdmin(me)
        setState('authenticated')
      } catch (error) {
        console.warn('[useAuth] Token invalide, suppression.', error)
        clearToken()
        if (cancelled) return

        setAdmin(null)
        setState('unauthenticated')
        if (requireAuth) router.replace(redirectTo)
      }
    }

    check()

    return () => {
      cancelled = true
    }
  }, [redirectTo, requireAuth, router])

  /* ---------- Connexion ---------- */
  async function login(email: string, password: string): Promise<void> {
    setState('loading')

    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      })

      setToken(res.token)
      setAdmin(res.admin)
      setState('authenticated')

      /* Redirection après un court délai pour laisser le state se propager */
      setTimeout(() => {
        router.replace('/admin')
      }, 100)
    } catch (error) {
      clearToken()
      setAdmin(null)
      setState('unauthenticated')
      throw error
    }
  }

  /* ---------- Déconnexion ---------- */
  function logout(): void {
    clearToken()
    setAdmin(null)
    setState('unauthenticated')
    router.replace('/admin/login')
  }

  return { state, admin, login, logout }
}