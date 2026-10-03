"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Connexion réussie");
      router.replace("/admin");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Identifiants incorrects";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-card shadow-soft p-8 lg:p-10">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="CAMPAB"
            width={72}
            height={72}
            className="mx-auto h-16 w-auto"
          />
          <h1 className="font-serif text-2xl text-navy-deep mt-5">
            Espace administration
          </h1>
          <p className="text-sm text-ink-soft mt-2">Cabinet CAMPAB · Cotonou</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              placeholder="vous@cam-pab.com"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Mot de passe</label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-deep text-white py-3 rounded-full font-medium hover:bg-olive transition-colors disabled:opacity-60"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}