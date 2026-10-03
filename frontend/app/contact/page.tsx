// app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import JsonLd from "@/components/features/JsonLd";

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal], [data-stagger]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function ContactPage() {
  useRevealOnScroll();

  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, value.toString());
    });

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact - CAMPAB",
    description:
      "Contactez CAMPAB pour une consultation juridique à Cotonou, Bénin.",
    mainEntity: {
      "@type": "LegalService",
      name: "CAMPAB",
      telephone: "+2290197762936",
      email: "p.abodecabinet@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cotonou",
        addressCountry: "BJ",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://cam-pab.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: "https://cam-pab.com/contact",
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Page Header */}
      <section className="page-header" aria-labelledby="page-title">
        <div className="page-header__bg" aria-hidden="true"></div>
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div
                className="eyebrow eyebrow--white page-header__eyebrow"
                data-reveal="up"
              >
                Prenons contact
              </div>
              <h1
                id="page-title"
                className="page-header__title"
                data-reveal="up"
                data-delay="100"
              >
                Contactez
                <br />
                CAMPAB
              </h1>
            </div>
            <div data-reveal="left">
              <p className="page-header__desc">
                Vous avez un dossier juridique, une question ou souhaitez
                simplement en savoir plus sur mes services ? Décrivez votre
                situation et je vous répondrai dans les meilleurs délais.
              </p>
              <div style={{ marginTop: "var(--sp-6)" }}>
                <div
                  className="trust-badge"
                  style={{ display: "inline-flex" }}
                >
                  <div className="trust-badge__dot"></div>
                  <span
                    className="trust-badge__text"
                    style={{ color: "var(--text-700)" }}
                  >
                    Disponible · Lun–Ven · 8h–20h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section contact layout */}
      <section aria-label="Formulaire de contact et coordonnées">
        <div className="container">
          <div className="contact-layout">
            {/* Colonne gauche : infos */}
            <aside aria-label="Coordonnées">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-3xl)",
                  fontWeight: 600,
                  marginBottom: "var(--sp-8)",
                }}
                data-reveal="up"
              >
                Coordonnées
              </h2>

              <div
                className="contact-info-item"
                data-reveal="up"
                data-delay="80"
              >
                <div className="contact-info-item__icon">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-info-item__label">Téléphone</div>
                  <a
                    href="tel:+2290197762936"
                    className="contact-info-item__value"
                  >
                    01 97 76 29 36
                  </a>
                </div>
              </div>

              <div
                className="contact-info-item"
                data-reveal="up"
                data-delay="160"
              >
                <div className="contact-info-item__icon">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-info-item__label">Adresse email</div>
                  <a
                    href="mailto:p.abodecabinet@gmail.com"
                    className="contact-info-item__value"
                  >
                    p.abodecabinet@gmail.com
                  </a>
                </div>
              </div>

              <div
                className="contact-info-item"
                data-reveal="up"
                data-delay="240"
              >
                <div className="contact-info-item__icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-info-item__label">Localisation</div>
                  <div className="contact-info-item__value">
                    Cotonou, Bénin
                  </div>
                </div>
              </div>

              <div
                className="contact-info-item"
                data-reveal="up"
                data-delay="320"
              >
                <div className="contact-info-item__icon">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="contact-info-item__label">Horaires</div>
                  <div className="contact-info-item__value">
                    Lundi — Vendredi
                  </div>
                  <div className="contact-info-item__sub">
                    08:00 — 13:30 / 15:00 — 20:00
                  </div>
                  <div className="contact-info-item__sub">
                    Samedi &amp; Dimanche : Fermé
                  </div>
                </div>
              </div>

              {/* Engagements */}
              <div
                style={{
                  marginTop: "var(--sp-6)",
                  padding: "var(--sp-6)",
                  background: "var(--blue-subtle)",
                  border: "1px solid var(--border-md)",
                  borderRadius: "var(--r-lg)",
                }}
                data-reveal="up"
                data-delay="400"
              >
                <div
                  className="contact-info-item__label"
                  style={{ marginBottom: "var(--sp-4)" }}
                >
                  Mes engagements
                </div>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--sp-3)",
                    listStyle: "none",
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      gap: "var(--sp-3)",
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    Réponse sous 24 à 48 heures
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "var(--sp-3)",
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    Confidentialité absolue
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "var(--sp-3)",
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    Première évaluation sans engagement
                  </li>
                  <li
                    style={{
                      display: "flex",
                      gap: "var(--sp-3)",
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    Accompagnement personnalisé
                  </li>
                </ul>
              </div>

              {/* Boutons rapides */}
              <div
                style={{
                  marginTop: "var(--sp-6)",
                  display: "flex",
                  gap: "var(--sp-3)",
                  flexDirection: "column",
                }}
                data-reveal="up"
                data-delay="480"
              >
                <a
                  href="tel:+2290197762936"
                  className="btn btn--primary btn--md"
                  style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}
                >
                  <Phone size={16} /> Appeler maintenant
                </a>
                <a
                  href="mailto:p.abodecabinet@gmail.com"
                  className="btn btn--outline btn--md"
                  style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}
                >
                  <Mail size={16} /> Envoyer un email
                </a>
                <Link
                  href="/rdv"
                  className="btn btn--blue btn--md"
                  style={{ justifyContent: "flex-start", gap: "var(--sp-3)" }}
                >
                  <Clock size={16} /> Prendre rendez-vous
                </Link>
              </div>
            </aside>

            {/* Colonne droite : formulaire Netlify */}
            <div data-reveal="scale">
              <div className="contact-form-box">
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-3xl)",
                    fontWeight: 600,
                    marginBottom: "var(--sp-2)",
                  }}
                >
                  Envoyer un message
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-300)",
                    marginBottom: "var(--sp-8)",
                  }}
                >
                  Décrivez votre situation et je vous répondrai rapidement.
                </p>

                <form
                  name="campab-contact"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="contact-form"
                >
                  <input
                    type="hidden"
                    name="form-name"
                    value="campab-contact"
                  />

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="prenom">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        className="form-control"
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="nom">
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        className="form-control"
                        required
                        minLength={2}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="telephone">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">
                      Type de demande *
                    </label>
                    <div className="form-select-wrap">
                      <select
                        id="service"
                        name="service"
                        className="form-control"
                        required
                      >
                        <option value="" disabled defaultValue="">
                          Sélectionnez un service
                        </option>
                        <option value="consultation">
                          Consultation juridique
                        </option>
                        <option value="redaction-actes">
                          Rédaction d&apos;actes
                        </option>
                        <option value="mediation">Médiation</option>
                        <option value="arbitrage-ohada">
                          Arbitrage OHADA
                        </option>
                        <option value="autre">Autre demande</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Votre message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows={5}
                      required
                      minLength={20}
                    ></textarea>
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: "var(--sp-6)" }}
                  >
                    <label
                      style={{
                        display: "flex",
                        gap: "var(--sp-3)",
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="consentement"
                        required
                        style={{
                          accentColor: "var(--blue)",
                          marginTop: "3px",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--text-500)",
                          lineHeight: 1.6,
                        }}
                      >
                        J&apos;accepte que mes informations soient utilisées
                        pour le traitement de ma demande.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading"
                      ? "Envoi en cours..."
                      : "Envoyer le message"}
                  </button>

                  {formStatus === "success" && (
                    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 mt-4">
                      <CheckCircle
                        size={20}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm">
                        Message envoyé avec succès. Je vous répondrai sous 48h.
                      </p>
                    </div>
                  )}

                  {formStatus === "error" && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 mt-4">
                      <AlertCircle
                        size={20}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm">
                        Erreur lors de l&apos;envoi. Veuillez réessayer ou
                        m&apos;appeler directement au{" "}
                        <a
                          href="tel:+2290197762936"
                          className="font-semibold underline"
                        >
                          01 97 76 29 36
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carte Google Maps */}
      <section className="section--sm section--alt" aria-label="Localisation">
        <div className="container">
          <div className="section-header--center" data-reveal="up">
            <div className="eyebrow eyebrow--center">Localisation</div>
            <h2>Où nous trouver</h2>
          </div>
          <div className="map-container" data-reveal="up" data-delay="100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.09603356566!2d2.3990261747519837!3d6.381604693608767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023557b06b90d03%3A0xf3761fe69dc5ce3b!2sCAMPAB!5e0!3m2!1sfr!2sbj!4v1791037223992!5m2!1sfr!2sbj"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localisation du cabinet CAMPAB"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}