import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";
import { site } from "@/lib/site";
import type { Paginated, ArticleListItem } from "@/types";

export const revalidate = 3600;

async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/articles?limit=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error();
    const data: Paginated<ArticleListItem> = await res.json();
    return data.items.map((a) => a.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/cabinet`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/expertises`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/arbitrage`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/mediation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/equipe`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const slugs = await getAllArticleSlugs();
  const articleRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${site.url}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}