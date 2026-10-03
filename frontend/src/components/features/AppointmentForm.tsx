"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/api";
import { appointmentSchema, APPOINTMENT_SUBJECTS } from "@/lib/schemas";
import type { AppointmentFormData } from "@/lib/schemas";
import type { CreateAppointmentResponse } from "@/types";

export default function AppointmentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<CreateAppointmentResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  async function onSubmit(data: AppointmentFormData) {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        message: data.message?.trim() || undefined,
        preferredDate: data.preferredDate
          ? new Date(data.preferredDate).toISOString()
          : undefined,
      };
      const res = await api.post<CreateAppointmentResponse>("/appointments", payload);
      setSuccess(res);
      reset();
      toast.success("Votre demande a été enregistrée");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de l'envoi";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-line rounded-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={30} className="text-olive" />
        </div>
        <h3 className="font-serif text-2xl text-navy-deep">Demande enregistrée</h3>
        <p className="text-ink-soft mt-3 leading-relaxed">
          Votre référence est{" "}
          <span className="font-mono text-navy-deep font-semibold">
            {success.reference}
          </span>
          .
          <br />
          Un email de confirmation avec PDF vous a été envoyé.
        </p>
        <p className="text-sm text-ink-soft mt-2">
          Notre équipe vous recontacte sous 24 à 48h ouvrées.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSuccess(null)}
            className="px-5 py-2.5 rounded-full border border-line text-sm hover:bg-sky transition"
          >
            Nouvelle demande
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-navy-deep text-white text-sm hover:bg-olive transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-line rounded-card p-6 lg:p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Prénom <span className="text-olive">*</span>
          </label>
          <input
            {...register("firstName")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
            placeholder="Jean"
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Nom <span className="text-olive">*</span>
          </label>
          <input
            {...register("lastName")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
            placeholder="Dupont"
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Email <span className="text-olive">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
            placeholder="vous@email.com"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Téléphone <span className="text-olive">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
            placeholder="+229 XX XX XX XX"
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Objet <span className="text-olive">*</span>
          </label>
          <select
            {...register("subject")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition bg-white"
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionnez un motif
            </option>
            {APPOINTMENT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2 flex items-center gap-2">
            <CalendarDays size={14} className="text-olive" />
            Date souhaitée
          </label>
          <input
            {...register("preferredDate")}
            type="date"
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Message (optionnel)
        </label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-none"
          placeholder="Décrivez brièvement votre situation..."
        />
      </div>

      <div className="flex items-start gap-3 text-xs text-ink-soft bg-sky/40 p-4 rounded-md">
        <span className="text-olive mt-0.5 shrink-0">•</span>
        <p>
          Vos informations sont traitées de manière strictement confidentielle,
          conformément au secret professionnel.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-navy-deep text-white py-4 rounded-full font-medium hover:bg-olive transition disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
        {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}