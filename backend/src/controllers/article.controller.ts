// backend/src/controllers/article.controller.ts
import { Request, Response, NextFunction } from "express";
import Article from "../models/Article.js";

export async function listPublishedArticles(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-content");
    res.json(articles);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function getArticleBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!article) {
      res.status(404).json({ error: "Article introuvable" });
      return;
    }
    res.json(article);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function listAllArticles(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function getArticleById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article introuvable" });
      return;
    }
    res.json(article);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      res.status(404).json({ error: "Article introuvable" });
      return;
    }
    res.json(article);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
    return;
  } catch (error) {
    next(error);
    return;
  }
}