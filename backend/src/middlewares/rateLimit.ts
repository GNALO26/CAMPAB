// backend/src/middlewares/rateLimit.ts
import rateLimit from "express-rate-limit";

export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes max par IP
  message: {
    error: "Trop de requêtes. Veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requêtes max pour les admins
  message: {
    error: "Trop de requêtes admin. Veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});