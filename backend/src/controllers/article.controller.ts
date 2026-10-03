import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ensureUniqueSlug, makeSlug } from "../lib/slugify";

const articleSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50),
  coverImage: z.string().optional().nullable(),
  category: z.enum(["vulgarisation", "conseils", "ethique", "actualite"]),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

// ==== PUBLIC ====
export async function listPublishedArticles(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 9);
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const skip = (page - 1) * limit;

  const where = {
    published: true,
    ...(category ? { category } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, slug: true, title: true, excerpt: true,
        coverImage: true, category: true, tags: true,
        publishedAt: true, views: true,
      },
    }),
    prisma.article.count({ where }),
  ]);

  res.json({
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getArticleBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) {
    res.status(404).json({ error: "Article introuvable" });
    return;
  }
  // Incrément de vues (best effort)
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => {});
  res.json(article);
}

// ==== ADMIN ====
export async function listAllArticles(_req: Request, res: Response): Promise<void> {
  const items = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
}

export async function getArticleById(req: Request, res: Response): Promise<void> {
  const article = await prisma.article.findUnique({ where: { id: req.params.id } });
  if (!article) { res.status(404).json({ error: "Article introuvable" }); return; }
  res.json(article);
}

export async function createArticle(req: Request, res: Response): Promise<void> {
  const data = articleSchema.parse(req.body);

  const slug = await ensureUniqueSlug(data.title, async (s) => {
    const existing = await prisma.article.findUnique({ where: { slug: s } });
    return !!existing;
  });

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      publishedAt: data.published ? new Date() : null,
    },
  });
  res.status(201).json(article);
}

export async function updateArticle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) { res.status(404).json({ error: "Article introuvable" }); return; }

  const data = articleSchema.partial().parse(req.body);

  let slug = existing.slug;
  if (data.title && data.title !== existing.title) {
    slug = await ensureUniqueSlug(data.title, async (s) => {
      const found = await prisma.article.findUnique({ where: { slug: s } });
      return !!found && found.id !== id;
    });
  }

  const published = data.published ?? existing.published;
  const publishedAt =
    published && !existing.publishedAt ? new Date() :
    !published ? null : existing.publishedAt;

  const article = await prisma.article.update({
    where: { id },
    data: { ...data, slug, publishedAt },
  });
  res.json(article);
}

export async function deleteArticle(req: Request, res: Response): Promise<void> {
  await prisma.article.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
