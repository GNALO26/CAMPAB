import { Router } from "express";
import {
  listPortfolio, getPortfolioItem,
  createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
} from "../controllers/portfolio.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", listPortfolio);
router.get("/:id", getPortfolioItem);

router.post("/", requireAuth, createPortfolioItem);
router.put("/:id", requireAuth, updatePortfolioItem);
router.delete("/:id", requireAuth, deletePortfolioItem);

export default router;
