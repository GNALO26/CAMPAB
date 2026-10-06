// app/admin/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminLoginPage() {
  /* skipRedirect: true est déjà implicite sur cette page, mais on le
     passe explicitement pour la lisibilité et la robustesse. */
  const { login, error: authError, loading } = useAuth({ skipRedirect: true });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isBusy = loading || submitting;
  const canSubmit = Boolean(email) && Boolean(password) && !isBusy;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return; // anti double-soumission

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // Redirection gérée par useAuth (router.push("/admin"))
    } catch {
      // L'erreur est déjà disponible dans `authError`
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-alt)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          padding: "40px 32px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: "8px",
            }}
          >
            CAMPAB
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-500)" }}>
            Espace d&apos;administration
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-500)",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="p.abodecabinet@gmail.com"
              className="form-control"
              disabled={isBusy}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-500)",
                marginBottom: "8px",
              }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              disabled={isBusy}
            />
          </div>

          {authError && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "var(--r-md)",
                color: "#991B1B",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn btn--primary btn--lg"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isBusy ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <LogIn size={16} aria-hidden="true" />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-300)",
          }}
        >
          <Link
            href="/"
            style={{ color: "var(--olive)", textDecoration: "none" }}
          >
            Retour au site public
          </Link>
        </div>

        <p
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "11px",
            color: "var(--text-300)",
            lineHeight: 1.5,
          }}
        >
          Accès protégé. Toute tentative de connexion est limitée en débit.
        </p>
      </div>
    </div>
  );
}