// backend/src/routes/auth.routes.ts
import { Router } from "express";
import { login, me, createAdmin } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/create-admin", createAdmin);

export default router;