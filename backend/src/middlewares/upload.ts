import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function storageFor(folder: "articles" | "portfolio") {
  const dest = path.join(UPLOAD_ROOT, folder);
  ensureDir(dest);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
      cb(null, safe);
    },
  });
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (ALLOWED.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Format d'image non supporté (JPEG, PNG, WebP ou AVIF uniquement)."));
}

const MAX_SIZE = Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024;

export const uploadArticleImage = multer({
  storage: storageFor("articles"),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single("image");

export const uploadPortfolioImage = multer({
  storage: storageFor("portfolio"),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single("image");
