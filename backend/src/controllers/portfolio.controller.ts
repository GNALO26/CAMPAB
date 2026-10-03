// backend/src/controllers/portfolio.controller.ts
import { Request, Response, NextFunction } from "express";
import Portfolio from "../models/Portfolio.js";

export async function listPortfolio(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const items = await Portfolio.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function getPortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Élément introuvable" });
      return;
    }
    res.json(item);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function createPortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json(item);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function updatePortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ error: "Élément introuvable" });
      return;
    }
    res.json(item);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function deletePortfolioItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ success: true });
    return;
  } catch (error) {
    next(error);
    return;
  }
}