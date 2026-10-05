// backend/src/lib/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/* ============================================================
   Schéma de validation des variables d'environnement
   ============================================================ */
const envSchema = z.object({
  /* --- Environnement --- */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(10000),

  /* --- Base de données --- */
  MONGODB_URI: z.string().min(1, "MONGODB_URI est requis"),

  /* --- Authentification JWT --- */
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET doit contenir au moins 32 caractères"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  /* --- Frontend (CORS) --- */
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  /* --- Email : Gmail API OAuth 2.0 (recommandé) --- */
  GMAIL_CLIENT_ID: z.string().min(1, "GMAIL_CLIENT_ID est requis"),
  GMAIL_CLIENT_SECRET: z.string().min(1, "GMAIL_CLIENT_SECRET est requis"),
  GMAIL_REFRESH_TOKEN: z.string().min(1, "GMAIL_REFRESH_TOKEN est requis"),
  GMAIL_SENDER_EMAIL: z
    .string()
    .email("GMAIL_SENDER_EMAIL doit être une adresse email valide")
    .default("p.abodecabinet@gmail.com"),

  /* --- Email : SMTP (fallback, optionnel) --- */
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("CAMPAB <p.abodecabinet@gmail.com>"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  /* --- Cloudinary (optionnel) --- */
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  /* --- Uploads --- */
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
  UPLOAD_DIR: z.string().default("uploads"),

  /* --- Contact --- */
  WHATSAPP_NUMBER: z.string().default("2290197762936"),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL doit être une adresse email valide")
    .default("p.abodecabinet@gmail.com"),
  ADMIN_PASSWORD: z.string().optional(),
});

/* ============================================================
   Validation
   ============================================================ */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  console.error("❌ Variables d'environnement invalides :");
  console.error(JSON.stringify(errors, null, 2));
  console.error("");
  console.error("Vérifiez les variables suivantes :");
  console.error("  - MONGODB_URI");
  console.error("  - JWT_SECRET (32 caractères minimum)");
  console.error("  - GMAIL_CLIENT_ID");
  console.error("  - GMAIL_CLIENT_SECRET");
  console.error("  - GMAIL_REFRESH_TOKEN");
  console.error("  - GMAIL_SENDER_EMAIL (ex : p.abodecabinet@gmail.com)");
  console.error("");
  process.exit(1);
}

/* ============================================================
   Export
   ============================================================ */
export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;