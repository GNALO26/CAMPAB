import { Router } from "express";
import {
  listPublishedArticles, getArticleBySlug,
  listAllArticles, getArticleById,
  createArticle, updateArticle, deleteArticle,
} from "../controllers/article.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public
router.get("/", listPublishedArticles);
router.get("/admin/all", requireAuth, listAllArticles);
router.get("/admin/:id", requireAuth, getArticleById);
router.get("/:slug", getArticleBySlug);

// Admin
router.post("/", requireAuth, createArticle);
router.put("/:id", requireAuth, updateArticle);
router.delete("/:id", requireAuth, deleteArticle);

export default router;
