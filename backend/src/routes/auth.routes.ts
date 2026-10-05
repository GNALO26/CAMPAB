// backend/src/routes/auth.routes.ts
import { Router } from "express";
import { login, me, createAdmin } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

/* Route de connexion (publique) */
router.post("/login", login);

/* Route pour récupérer le profil (protégée) */
router.get("/me", requireAuth, me);

/* Route de création d'admin (publique mais protégée par secret) */
router.post("/create-admin", createAdmin);

export default router;