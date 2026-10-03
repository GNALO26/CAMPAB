"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import type { PortfolioItem, PortfolioCategory } from "@/types";

// ============================================================
// SCHÉMA
// ============================================================
const schema = z.object({
  title: z.string().min(2, "Titre trop court").max(200),
  description: z.string().min(10, "Description trop courte").max(2000),
  category: z.enum(["these", "projet", "publication", "distinction"]),
  link: z.string().url("URL invalide").optional().or(z.literal("")),
  imageUrl: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

// ⚠️ IMPORTANT : utiliser z.input au lieu de z.infer
type FormData = z.input<typeof schema>;

const categoryLabels: Record<PortfolioCategory, string> = {
  these: "Thèse",
  projet: "Projet",
  publication: "Publication",
  distinction: "Distinction",
};

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<PortfolioItem[]>("/portfolio");
      setItems(data);
    } catch {
      toast.error("Impossible de charger le portfolio");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success("Élément supprimé");
      load();
    } catch {
      toast.error("Erreur");
    }
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditing(item);
    setShowForm(true);
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader
        title="Portfolio"
        subtitle={`${items.length} élément(s) — thèse, projets, publications`}
        action={
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-navy-deep text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-olive transition"
          >
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="animate-spin mx-auto text-navy-deep" size={28} />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-line rounded-card">
          <EmptyState
            icon={Briefcase}
            title="Portfolio vide"
            description="Ajoutez la thèse de la juriste, ses projets et publications."
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-line rounded-card overflow-hidden">
              {item.imageUrl && (
                <div className="relative aspect-video">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              )}
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-widest text-olive font-semibold">
                  {categoryLabels[item.category]}
                </span>
                <h3 className="font-serif text-lg text-navy-deep mt-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-soft mt-2 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-xs border border-line rounded-full py-2 hover:bg-sky transition"
                  >
                    <Pencil size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center justify-center text-xs border border-line rounded-full p-2 hover:bg-red-50 hover:text-red-700 transition"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PortfolioModal
          item={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// MODALE
// ============================================================
function PortfolioModal({
  item,
  onClose,
  onSaved,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
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
    defaultValues: item
      ? {
          title: item.title,
          description: item.description,
          category: item.category,
          link: item.link || "",
          imageUrl: item.imageUrl || "",
          order: item.order,
        }
      : { category: "projet", order: 0, title: "", description: "", link: "", imageUrl: "" },
  });

  const imageUrl = watch("imageUrl");

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.upload<{ url: string }>("/upload/portfolio", fd);
      setValue("imageUrl", res.url);
      toast.success("Image téléchargée");
    } catch {
      toast.error("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        order: data.order ?? 0,
        link: data.link || null,
        imageUrl: data.imageUrl || null,
      };
      if (item) {
        await api.put(`/portfolio/${item.id}`, payload);
        toast.success("Élément mis à jour");
      } else {
        await api.post("/portfolio", payload, true);
        toast.success("Élément ajouté");
      }
      onSaved();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-navy-deep/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-card shadow-soft max-w-2xl w-full my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-serif text-xl text-navy-deep">
            {item ? "Modifier" : "Ajouter"} un élément
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sky rounded-md transition"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Titre</label>
            <input
              {...register("title")}
              className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Catégorie</label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition text-sm"
              >
                {Object.entries(categoryLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                {...register("order")}
                className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Lien externe (optionnel)
            </label>
            <input
              {...register("link")}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-md border border-line focus:border-olive outline-none transition text-sm"
            />
            {errors.link && (
              <p className="text-xs text-red-600 mt-1">{errors.link.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Image (optionnelle)
            </label>
            {imageUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden border border-line mb-3">
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="400px" />
                <button
                  type="button"
                  onClick={() => setValue("imageUrl", "")}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5"
                  aria-label="Retirer l'image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <label className="inline-flex items-center gap-2 border border-line rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-sky transition">
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              {uploading ? "Envoi..." : "Choisir une image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleUpload(e.target.files[0])
                }
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-line hover:bg-sky transition text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-navy-deep text-white hover:bg-olive transition text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {item ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}