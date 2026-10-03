"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Trash2, Pencil, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { api } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import Button from "@/components/ui/Button";
import type { Article } from "@/types";

const categoryLabels: Record<string, string> = {
  vulgarisation: "Vulgarisation",
  conseils: "Conseils",
  ethique: "Éthique",
  actualite: "Actualité",
};

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<Article[]>("/articles/admin/all", true);
      setArticles(data);
    } catch {
      toast.error("Impossible de charger les articles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success("Article supprimé");
      load();
    } catch {
      toast.error("Erreur");
    }
  }

  async function togglePublish(a: Article) {
    try {
      await api.put(`/articles/${a.id}`, { published: !a.published });
      toast.success(a.published ? "Article dépublié" : "Article publié");
      load();
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader
        title="Articles"
        subtitle={`${articles.length} article(s) · ${articles.filter((a) => a.published).length} publié(s)`}
        action={
          <Button href="/admin/articles/new" size="sm">
            <Plus size={16} className="mr-2" /> Nouvel article
          </Button>
        }
      />

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="animate-spin mx-auto text-navy-deep" size={28} />
          </div>
        ) : articles.length === 0 ? (
          <EmptyState icon={FileText} title="Aucun article" description="Créez votre premier article pour alimenter le blog SEO." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="border-b border-line text-left text-[11px] uppercase text-ink-soft tracking-wider">
                <tr>
                  <th className="px-6 py-4">Titre</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Vues</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-sky/20">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink line-clamp-1">{a.title}</p>
                      <p className="text-xs text-ink-soft font-mono mt-0.5">/{a.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-ink-soft text-xs">
                      {categoryLabels[a.category] || a.category}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(a)}
                        className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition ${
                          a.published
                            ? "bg-olive/10 text-olive-dark border-olive/30"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {a.published ? "Publié" : "Brouillon"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-ink-soft text-xs">{a.views}</td>
                    <td className="px-6 py-4 text-ink-soft text-xs">
                      {a.publishedAt
                        ? format(new Date(a.publishedAt), "dd MMM yyyy", { locale: fr })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        {a.published && (
                          <Link
                            href={`/blog/${a.slug}`}
                            target="_blank"
                            className="p-2 rounded-md hover:bg-sky transition"
                            title="Voir"
                          >
                            <Eye size={15} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          className="p-2 rounded-md hover:bg-sky transition"
                          title="Modifier"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => remove(a.id)}
                          className="p-2 rounded-md hover:bg-red-50 hover:text-red-700 transition"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}