"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken, clearToken } from "@/lib/api";
import type { Admin, LoginResponse } from "@/types";

export function useAuth({ redirectIfNotAuth = false } = {}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      if (redirectIfNotAuth) router.replace("/admin/login");
      return;
    }
    api
      .get<Admin>("/auth/me", true)
      .then((data) => setAdmin(data))
      .catch(() => {
        clearToken();
        if (redirectIfNotAuth) router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [redirectIfNotAuth, router]);

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    setToken(res.token);
    setAdmin(res.admin);
    return res.admin;
  }

  function logout() {
    clearToken();
    setAdmin(null);
    router.replace("/admin/login");
  }

  return { admin, loading, login, logout };
}