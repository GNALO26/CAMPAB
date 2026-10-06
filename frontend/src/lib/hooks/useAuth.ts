// src/lib/hooks/useAuth.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, clearToken, getToken, setToken } from "@/lib/api";
import type { Admin } from "@/types";

/* ============================================================
   Endpoints alignés sur le backend Express
   ============================================================ */
const AUTH_LOGIN_ENDPOINT = "/auth/login";
const AUTH_ME_ENDPOINT = "/auth/me";
const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin";

/* ============================================================
   Cache mémoire partagé entre tous les composants
   Évite que layout + page déclenchent deux /auth/me distincts.
   ============================================================ */
let meCache: Admin | null = null;
let meCacheAt = 0;
const ME_CACHE_TTL_MS = 30_000;

function readMeCache(): Admin | null {
  if (meCache && Date.now() - meCacheAt < ME_CACHE_TTL_MS) return meCache;
  return null;
}

function writeMeCache(admin: Admin | null): void {
  meCache = admin;
  meCacheAt = admin ? Date.now() : 0;
}

function invalidateMeCache(): void {
  meCache = null;
  meCacheAt = 0;
}

/* ============================================================
   Types
   ============================================================ */
interface LoginApiResponse {
  token: string;
  admin: Admin;
}

interface UseAuthOptions {
  /** Si true, aucune redirection automatique n'est effectuée. */
  skipRedirect?: boolean;
  /**
   * @deprecated Conservé pour compatibilité. Utilisez `skipRedirect`.
   */
  redirectIfNotAuth?: boolean;
}

interface UseAuthResult {
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ============================================================
   Hook
   ============================================================ */
export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const { skipRedirect = false } = options;
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState<Admin | null>(() => readMeCache());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoginPage = pathname === LOGIN_PATH;
  const shouldSkipRedirect = skipRedirect || isLoginPage;

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const token = getToken();

    if (!token) {
      invalidateMeCache();
      setAdmin(null);
      setLoading(false);
      if (!shouldSkipRedirect) {
        router.replace(LOGIN_PATH);
      }
      return () => {
        cancelledRef.current = true;
      };
    }

    /* Cache valide : on hydrate immédiatement, sans requête réseau */
    const cached = readMeCache();
    if (cached) {
      setAdmin(cached);
      setLoading(false);
      return () => {
        cancelledRef.current = true;
      };
    }

    api
      .get<Admin>(AUTH_ME_ENDPOINT, true)
      .then((me) => {
        if (cancelledRef.current) return;
        writeMeCache(me);
        setAdmin(me);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelledRef.current) return;
        console.error("[useAuth] Échec de vérification de session :", err);
        invalidateMeCache();
        clearToken();
        setAdmin(null);
        setLoading(false);
        if (!shouldSkipRedirect) {
          router.replace(LOGIN_PATH);
        }
      });

    return () => {
      cancelledRef.current = true;
    };
  }, [router, shouldSkipRedirect]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setError(null);

      try {
        const res = await api.post<LoginApiResponse>(AUTH_LOGIN_ENDPOINT, {
          email,
          password,
        });

        if (!res || !res.token || !res.admin) {
          throw new Error(
            "Réponse d'authentification invalide. Contactez l'administrateur.",
          );
        }

        setToken(res.token);
        writeMeCache(res.admin);
        setAdmin(res.admin);
        setError(null);
        router.push(DASHBOARD_PATH);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Échec de la connexion.";
        setError(message);
        throw err;
      }
    },
    [router],
  );

  const logout = useCallback((): void => {
    clearToken();
    invalidateMeCache();
    setAdmin(null);
    setError(null);
    router.push(LOGIN_PATH);
  }, [router]);

  return { admin, loading, error, login, logout };
}