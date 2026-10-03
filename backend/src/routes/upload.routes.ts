import { Router } from "express";
import { uploadArticleImage, uploadPortfolioImage } from "../middlewares/upload";
import { uploadArticleImageHandler, uploadPortfolioImageHandler } from "../controllers/upload.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/article", requireAuth, uploadArticleImage, uploadArticleImageHandler);
router.post("/portfolio", requireAuth, uploadPortfolioImage, uploadPortfolioImageHandler);

export default router;
