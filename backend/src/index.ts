// backend/src/index.ts
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./lib/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { publicFormLimiter, adminLimiter } from "./middlewares/rateLimit.js";

const app = express();

// ⚠️ IMPORTANT : Render utilise un proxy. Sans ce réglage, express-rate-limit
// ne peut pas identifier correctement les IP et peut bloquer les requêtes.
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: [
      env.FRONTEND_URL,
      "https://cam-pab.com",
      "https://www.cam-pab.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "CAMPAB API",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", adminLimiter);
app.use("/api/contact", publicFormLimiter);
app.use("/api/appointments", (req, res, next) => {
  if (req.method === "POST") return publicFormLimiter(req, res, next);
  return adminLimiter(req, res, next);
});
app.use("/api/articles", adminLimiter);
app.use("/api/portfolio", adminLimiter);
app.use("/api/upload", adminLimiter);

app.use("/api", routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.use(errorHandler);

export default app;