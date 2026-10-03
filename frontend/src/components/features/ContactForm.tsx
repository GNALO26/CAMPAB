"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { contactSchema } from "@/lib/schemas";
import type { ContactFormData } from "@/lib/schemas";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitting(true);
    try {
      await api.post("/contact", data);
      setSent(true);
      reset();
      toast.success("Message envoyé");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white border border-line rounded-card p-8 text-center">
        <CheckCircle2 size={32} className="text-olive mx-auto mb-4" />
        <h3 className="font-serif text-xl text-navy-deep">Message reçu</h3>
        <p className="text-sm text-ink-soft mt-2">
          Nous vous répondrons dans les meilleurs délais.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 px-5 py-2 rounded-full border border-line text-sm hover:bg-sky transition"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Nom complet</label>
        <input {...register("name")} className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Email</label>
          <input {...register("email")} type="email" className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition" />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Téléphone (optionnel)</label>
          <input {...register("phone")} className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Objet</label>
        <input {...register("subject")} className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition" />
        {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Message</label>
        <textarea {...register("message")} rows={5} className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition resize-none" />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-navy-deep text-white py-3.5 rounded-full font-medium hover:bg-olive transition disabled:opacity-60"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {submitting ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}