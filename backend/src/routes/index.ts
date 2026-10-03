// backend/src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import articleRoutes from "./article.routes.js";
import portfolioRoutes from "./portfolio.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/articles", articleRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/upload", uploadRoutes);

export default router;