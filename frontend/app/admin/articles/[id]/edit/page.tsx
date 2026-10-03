"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import ArticleForm from "@/components/admin/ArticleForm";
import type { Article } from "@/types";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    api.get<Article>(`/articles/admin/${params.id}`, true)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-navy-deep" size={28} />
      </div>
    );
  }

  if (!article) {
    return <div className="p-10 text-ink-soft">Article introuvable.</div>;
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader title="Modifier l'article" subtitle={article.title} />
      <ArticleForm article={article} />
    </div>
  );
}