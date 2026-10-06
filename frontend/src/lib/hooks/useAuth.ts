// src/lib/hooks/useAuth.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, clearToken, getToken, setToken } from "@/lib/api";
import type { Admin } from "@/types";

/* ============================================================
   Endpoints alignés sur le backend Express
   Voir backend/src/routes/auth.routes.ts
   ============================================================ */
const AUTH_LOGIN_ENDPOINT = "/auth/login";
const AUTH_ME_ENDPOINT = "/auth/me";
const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin";

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
   * Le comportement par défaut (redirection si non authentifié) s'applique.
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

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Détection de la page de login : garantit l'absence de boucle
     même si l'appelant oublie `skipRedirect`. */
  const isLoginPage = pathname === LOGIN_PATH;
  const shouldSkipRedirect = skipRedirect || isLoginPage;

  /* Garde anti-fuite : true dès qu'on quitte le hook. */
  const cancelledRef = useRef(false);

  /* ----------------------------------------------------------
     Vérification de la session au montage (et au changement de path)
     ---------------------------------------------------------- */
  useEffect(() => {
    cancelledRef.current = false;

    const token = getToken();

    if (!token) {
      setAdmin(null);
      setLoading(false);
      if (!shouldSkipRedirect) {
        router.replace(LOGIN_PATH);
      }
      return () => {
        cancelledRef.current = true;
      };
    }

    api
      .get<Admin>(AUTH_ME_ENDPOINT, true)
      .then((me) => {
        if (cancelledRef.current) return;
        setAdmin(me);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelledRef.current) return;
        console.error("[useAuth] Échec de vérification de session :", err);
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

  /* ----------------------------------------------------------
     Connexion
     ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     Déconnexion
     ---------------------------------------------------------- */
  const logout = useCallback((): void => {
    clearToken();
    setAdmin(null);
    setError(null);
    router.push(LOGIN_PATH);
  }, [router]);

  return { admin, loading, error, login, logout };
}