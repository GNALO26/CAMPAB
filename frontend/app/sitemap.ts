// app/sitemap.ts
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cam-pab.com";

/* ============================================================
   Pages statiques du site
   ============================================================ */
const STATIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/cabinet", priority: 0.9, changeFrequency: "monthly" },
  { path: "/expertises", priority: 0.9, changeFrequency: "monthly" },
  { path: "/equipe", priority: 0.8, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  { path: "/rdv", priority: 0.9, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
];

/* ============================================================
   Récupération des articles publiés pour les entrées dynamiques
   ============================================================ */
async function getBlogPosts(): Promise<
  Array<{
    slug: string;
    updatedAt?: string;
    publishedAt?: string;
  }>
> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://campab-serveur.onrender.com";
    const res = await fetch(`${apiUrl}/api/articles`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data: unknown = await res.json();

    if (Array.isArray(data)) {
      return data as Array<{ slug: string; updatedAt?: string; publishedAt?: string }>;
    }

    if (
      data &&
      typeof data === "object" &&
      "items" in data &&
      Array.isArray((data as { items: unknown }).items)
    ) {
      return (data as { items: Array<{ slug: string; updatedAt?: string; publishedAt?: string }> })
        .items;
    }

    return [];
  } catch (error) {
    console.error("[sitemap] Échec récupération articles :", error);
    return [];
  }
}

/* ============================================================
   Sitemap
   ============================================================ */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const posts = await getBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => typeof post.slug === "string" && post.slug.length > 0)
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishedAt
          ? new Date(post.publishedAt)
          : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...blogEntries];
}