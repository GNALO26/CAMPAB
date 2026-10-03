import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const portfolioSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  imageUrl: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  category: z.enum(["these", "projet", "publication", "distinction"]),
  order: z.coerce.number().int().default(0),
});

// ==== PUBLIC ====
export async function listPortfolio(req: Request, res: Response): Promise<void> {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const items = await prisma.portfolioItem.findMany({
    where: category ? { category } : {},
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json(items);
}

export async function getPortfolioItem(req: Request, res: Response): Promise<void> {
  const item = await prisma.portfolioItem.findUnique({ where: { id: req.params.id } });
  if (!item) { res.status(404).json({ error: "Élément introuvable" }); return; }
  res.json(item);
}

// ==== ADMIN ====
export async function createPortfolioItem(req: Request, res: Response): Promise<void> {
  const data = portfolioSchema.parse(req.body);
  const item = await prisma.portfolioItem.create({ data });
  res.status(201).json(item);
}

export async function updatePortfolioItem(req: Request, res: Response): Promise<void> {
  const data = portfolioSchema.partial().parse(req.body);
  const item = await prisma.portfolioItem.update({ where: { id: req.params.id }, data });
  res.json(item);
}

export async function deletePortfolioItem(req: Request, res: Response): Promise<void> {
  await prisma.portfolioItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
