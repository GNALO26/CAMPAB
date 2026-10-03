"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Article, ArticleCategory } from "@/types";

// ============================================================
// SCHÉMA
// ============================================================
const schema = z.object({
  title: z.string().min(3, "Titre trop court").max(200),
  excerpt: z.string().min(10, "Résumé trop court").max(500),
  content: z.string().min(50, "Contenu trop court"),
  category: z.enum(["vulgarisation", "conseils", "ethique", "actualite"]),
  tagsRaw: z.string().optional(),
  published: z.boolean().default(false),
  coverImage: z.string().optional().nullable(),
});

// ⚠️ IMPORTANT : utiliser z.input au lieu de z.infer
type FormData = z.input<typeof schema>;

const categories: { value: ArticleCategory; label: string }[] = [
  { value: "vulgarisation", label: "Vulgarisation" },
  { value: "conseils", label: "Conseils" },
  { value: "ethique", label: "Éthique" },
  { value: "actualite", label: "Actualité" },
];

// ============================================================
// COMPOSANT
// ============================================================
export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const isEdit = !!article;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: article
      ? {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          tagsRaw: article.tags.join(", "),
          published: article.published,
          coverImage: article.coverImage || "",
        }
      : {
          published: false,
          category: "vulgarisation",
          title: "",
          excerpt: "",
          content: "",
          tagsRaw: "",
          coverImage: "",
        },
  });

  const coverImage = watch("coverImage");
  const published = watch("published");

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.upload<{ url: string }>("/upload/article", fd);
      setValue("coverImage", res.url);
      toast.success("Image téléchargée");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur upload";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        published: data.published ?? false,
        coverImage: data.coverImage || null,
        tags: (data.tagsRaw || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEdit && article) {
        await api.put(`/articles/${article.id}`, payload);
        toast.success("Article mis à jour");
      } else {
        await api.post("/articles", payload, true);
        toast.success("Article créé");
      }
      router.push("/admin/articles");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-line rounded-card p-6">
          <label className="block text-sm font-medium text-ink mb-2">Titre</label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition text-lg font-serif"
            placeholder="Titre de l'article"
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
          )}

          <label className="block text-sm font-medium text-ink mb-2 mt-6">
            Résumé (extrait)
          </label>
          <textarea
            {...register("excerpt")}
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-none"
            placeholder="Court résumé affiché dans la liste..."
          />
          {errors.excerpt && (
            <p className="text-xs text-red-600 mt-1">{errors.excerpt.message}</p>
          )}

          <label className="block text-sm font-medium text-ink mb-2 mt-6">
            Contenu
          </label>
          <textarea
            {...register("content")}
            rows={18}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition font-mono text-sm"
            placeholder="Contenu de l'article (supporté : markdown simple, sauts de ligne préservés)"
          />
          {errors.content && (
            <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>
          )}
          <p className="text-xs text-ink-soft mt-2">
            Astuce : utilisez des sauts de ligne doubles pour créer des paragraphes.
            Le rendu est automatique.
          </p>
        </div>
      </div>

      {/* Colonne latérale */}
      <div className="space-y-6">
        <div className="bg-white border border-line rounded-card p-6">
          <h3 className="font-serif text-lg text-navy-deep mb-4">Publication</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="w-4 h-4 accent-olive"
            />
            <span className="text-sm">{published ? "Publié" : "Brouillon"}</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-navy-deep text-white py-3 rounded-full font-medium hover:bg-olive transition disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isEdit ? "Mettre à jour" : "Créer l'article"}
          </button>
        </div>

        <div className="bg-white border border-line rounded-card p-6">
          <h3 className="font-serif text-lg text-navy-deep mb-4">Catégorie</h3>
          <select
            {...register("category")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition text-sm"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-ink mb-2 mt-6">
            Tags (séparés par virgule)
          </label>
          <input
            {...register("tagsRaw")}
            className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition text-sm"
            placeholder="ohada, médiation, contrat"
          />
        </div>

        <div className="bg-white border border-line rounded-card p-6">
          <h3 className="font-serif text-lg text-navy-deep mb-4">
            Image de couverture
          </h3>

          {coverImage ? (
            <div className="relative aspect-video rounded-md overflow-hidden border border-line mb-4">
              <Image
                src={coverImage}
                alt="Couverture"
                fill
                className="object-cover"
                sizes="400px"
              />
              <button
                type="button"
                onClick={() => setValue("coverImage", "")}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white transition"
                aria-label="Retirer l'image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="aspect-video rounded-md border-2 border-dashed border-line flex items-center justify-center mb-4 bg-sky/30">
              <p className="text-xs text-ink-soft">Aucune image</p>
            </div>
          )}

          <label className="w-full inline-flex items-center justify-center gap-2 border border-line rounded-full py-2.5 text-sm cursor-pointer hover:bg-sky transition">
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Envoi..." : "Choisir une image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleUpload(e.target.files[0])
              }
            />
          </label>
          <p className="text-[11px] text-ink-soft mt-2">JPG, PNG, WebP · 5 Mo max</p>
        </div>
      </div>
    </form>
  );
}