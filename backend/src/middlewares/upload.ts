// backend/src/middlewares/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../lib/env.js";

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const articleDir = path.join(uploadDir, "articles");
const portfolioDir = path.join(uploadDir, "portfolio");

[articleDir, portfolioDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configuration de stockage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Filtre pour n'accepter que les images
const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format d'image non supporté. Utilisez JPG, PNG, WebP ou AVIF."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

export const uploadArticleImage = upload.single("image");
export const uploadPortfolioImage = upload.single("image");