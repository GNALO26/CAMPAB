"use client";
import PageHeader from "@/components/admin/PageHeader";
import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader title="Nouvel article" subtitle="Rédigez un article pour le blog du cabinet." />
      <ArticleForm />
    </div>
  );
}