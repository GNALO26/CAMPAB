import { Request, Response } from "express";

function buildUrl(req: Request, folder: string, filename: string): string {
  const proto = req.protocol;
  const host = req.get("host");
  return `${proto}://${host}/uploads/${folder}/${filename}`;
}

export async function uploadArticleImageHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) { res.status(400).json({ error: "Aucun fichier fourni" }); return; }
  res.status(201).json({
    ok: true,
    url: buildUrl(req, "articles", req.file.filename),
    filename: req.file.filename,
    size: req.file.size,
  });
}

export async function uploadPortfolioImageHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) { res.status(400).json({ error: "Aucun fichier fourni" }); return; }
  res.status(201).json({
    ok: true,
    url: buildUrl(req, "portfolio", req.file.filename),
    filename: req.file.filename,
    size: req.file.size,
  });
}
