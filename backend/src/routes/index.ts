import { Router } from "express";
import authRoutes from "./auth.routes";
import contactRoutes from "./contact.routes";
import appointmentRoutes from "./appointment.routes";
import articleRoutes from "./article.routes";
import portfolioRoutes from "./portfolio.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/articles", articleRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/upload", uploadRoutes);

export default router;
