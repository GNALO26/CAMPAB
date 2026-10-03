// app/rdv/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  FileDown,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RdvPDF from "./components/RdvPDF";
import RdvProgress from "./components/RdvProgress";

interface RendezVousData {
  typeService: string;
  urgence: string;
  description: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  organisation: string;
  pays: string;
  date: string;
  heure: string;
}

export default function RdvPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [formData, setFormData] = useState<RendezVousData>({
    typeService: "",
    urgence: "normale",
    description: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    organisation: "",
    pays: "bénin",
    date: new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    heure: "11:30",
  });

  const totalSteps = 3;

  const handleChange = (field: keyof RendezVousData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.typeService && formData.description?.length >= 10;
    }
    if (step === 2) {
      return (
        formData.prenom &&
        formData.nom &&
        formData.email &&
        formData.telephone
      );
    }
    return true;
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const params = new URLSearchParams();
      params.append("form-name", "campab-rdv");
      params.append("typeService", formData.typeService);
      params.append("urgence", formData.urgence);
      params.append("description", formData.description);
      params.append("prenom", formData.prenom);
      params.append("nom", formData.nom);
      params.append("email", formData.email);
      params.append("telephone", formData.telephone);
      params.append("organisation", formData.organisation || "");
      params.append("pays", formData.pays);
      params.append("date", formData.date);
      params.append("heure", formData.heure);

      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-navy-deep dark:text-sky">
              Étape 1 : Nature du litige
            </h2>
            <p className="text-ink-soft">
              Décrivez brièvement votre situation pour que je puisse vous
              orienter au mieux.
            </p>

            <div className="form-group">
              <label className="form-label">Type de service *</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { value: "consultation", label: "Consultation" },
                  { value: "arbitrage", label: "Arbitrage" },
                  { value: "mediation", label: "Médiation" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("typeService", option.value)}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      formData.typeService === option.value
                        ? "border-olive bg-olive/10"
                        : "border-line hover:border-olive/50"
                    }`}
                  >
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Niveau d&apos;urgence</label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: "normale", label: "Normale" },
                  { value: "elevee", label: "Élevée" },
                  { value: "critique", label: "Critique" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      formData.urgence === option.value
                        ? "border-olive bg-olive/10"
                        : "border-line hover:border-olive/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgence"
                      value={option.value}
                      checked={formData.urgence === option.value}
                      onChange={(e) => handleChange("urgence", e.target.value)}
                      className="hidden"
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${
                        option.value === "normale"
                          ? "bg-green-500"
                          : option.value === "elevee"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description du litige *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="form-control"
                rows={4}
                placeholder="Décrivez votre situation juridique, les parties impliquées, et ce que vous souhaitez obtenir…"
                required
                minLength={10}
              />
              <div className="mt-2 text-xs text-ink-soft">
                {formData.description.length}/10 caractères minimum
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-navy-deep dark:text-sky">
              Étape 2 : Vos coordonnées
            </h2>
            <p className="text-ink-soft">
              Indiquez vos informations pour que je puisse vous contacter.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prenom">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  className="form-control"
                  placeholder="Jean"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nom">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  className="form-control"
                  placeholder="KOUASSI"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="form-control"
                placeholder="jean.kouassi@exemple.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="telephone">
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                className="form-control"
                placeholder="(229) XXXX XXXX"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="organisation">
                  Entreprise / Organisation
                </label>
                <input
                  type="text"
                  id="organisation"
                  value={formData.organisation}
                  onChange={(e) => handleChange("organisation", e.target.value)}
                  className="form-control"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pays">
                  Pays
                </label>
                <div className="form-select-wrap">
                  <select
                    id="pays"
                    value={formData.pays}
                    onChange={(e) => handleChange("pays", e.target.value)}
                    className="form-control"
                  >
                    <option value="bénin">Bénin</option>
                    <option value="burkina-faso">Burkina Faso</option>
                    <option value="cameroun">Cameroun</option>
                    <option value="côte-divoire">Côte d&apos;Ivoire</option>
                    <option value="sénégal">Sénégal</option>
                    <option value="togo">Togo</option>
                    <option value="france">France</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-navy-deep dark:text-sky">
              Étape 3 : Confirmation
            </h2>
            <p className="text-ink-soft">
              Vérifiez vos informations avant de confirmer votre rendez-vous.
            </p>

            <div className="rounded-xl border border-line bg-sky/30 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Service</div>
                    <div className="font-semibold">
                      {formData.typeService === "consultation" &&
                        "Consultation juridique"}
                      {formData.typeService === "arbitrage" &&
                        "Arbitrage OHADA"}
                      {formData.typeService === "mediation" && "Médiation"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="text-olive flex-shrink-0 mt-1"
                  />
                  <div>
                    <div className="text-xs text-ink-soft">Urgence</div>
                    <div className="font-semibold capitalize">
                      {formData.urgence}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Nom complet</div>
                    <div className="font-semibold">
                      {formData.prenom} {formData.nom}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Email</div>
                    <div className="font-semibold">{formData.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Téléphone</div>
                    <div className="font-semibold">{formData.telephone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    size={18}
                    className="text-olive flex-shrink-0 mt-1"
                  />
                  <div>
                    <div className="text-xs text-ink-soft">Date</div>
                    <div className="font-semibold">{formData.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Heure</div>
                    <div className="font-semibold">{formData.heure}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-olive flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-ink-soft">Pays</div>
                    <div className="font-semibold capitalize">
                      {formData.pays}
                    </div>
                  </div>
                </div>
              </div>

              {formData.organisation && (
                <div className="mt-4 flex items-start gap-3 border-t border-line pt-4">
                  <Building2
                    size={18}
                    className="text-olive flex-shrink-0 mt-1"
                  />
                  <div>
                    <div className="text-xs text-ink-soft">Organisation</div>
                    <div className="font-semibold">
                      {formData.organisation}
                    </div>
                  </div>
                </div>
              )}

              {formData.description && (
                <div className="mt-4 border-t border-line pt-4">
                  <div className="text-xs text-ink-soft mb-1">
                    Description du litige
                  </div>
                  <div className="text-sm">{formData.description}</div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <PDFDownloadLink
                document={<RdvPDF data={formData} />}
                fileName={`rendez-vous-${formData.nom}-${formData.prenom}.pdf`}
                className="btn btn--primary btn--lg"
              >
                {({ loading }) => (
                  <>
                    <FileDown size={16} className="mr-2" />
                    {loading
                      ? "Préparation du PDF..."
                      : "Télécharger le PDF"}
                  </>
                )}
              </PDFDownloadLink>

              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn--blue btn--lg"
                disabled={isSubmitting || submitStatus === "success"}
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : submitStatus === "success" ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Rendez-vous envoyé
                  </>
                ) : (
                  "Confirmer le rendez-vous"
                )}
              </button>
            </div>

            {submitStatus === "success" && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <Check size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Votre demande de rendez-vous a bien été envoyée. Nous vous
                  contacterons dans les 24 à 48 heures.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Erreur lors de l&apos;envoi. Veuillez réessayer ou nous
                  contacter directement au{" "}
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-olive hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" /> Retour à l&apos;accueil
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft dark:bg-navy-deep md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-deep dark:text-sky">
            Prendre rendez-vous
          </h1>
          <p className="mt-2 text-ink-soft">
            Remplissez ce formulaire pour planifier une consultation juridique.
          </p>
        </div>

        <RdvProgress currentStep={step} totalSteps={totalSteps} />

        <div className="mt-8">{renderStep()}</div>

        <div className="mt-10 flex justify-between border-t border-line pt-6">
          <button
            type="button"
            onClick={prevStep}
            className={`btn btn--outline ${step === 1 ? "invisible" : ""}`}
          >
            <ChevronLeft size={16} className="mr-1" /> Précédent
          </button>
          {step < totalSteps && (
            <button
              type="button"
              onClick={nextStep}
              className="btn btn--primary"
              disabled={!isStepValid()}
            >
              Suivant <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}