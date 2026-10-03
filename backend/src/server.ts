import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./lib/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/error";
import { publicFormLimiter, adminLimiter } from "./middlewares/rateLimit";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// ==== Fichiers statiques (uploads) ====
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

// ==== Healthcheck ====
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CAMPAB API",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ==== Rate limiting ====
app.use("/api/auth", adminLimiter);
app.use("/api/contact", publicFormLimiter);
app.use("/api/appointments", (req, res, next) => {
  // Rate limit uniquement sur le POST public
  if (req.method === "POST") return publicFormLimiter(req, res, next);
  return adminLimiter(req, res, next);
});
app.use("/api/articles", adminLimiter);
app.use("/api/portfolio", adminLimiter);
app.use("/api/upload", adminLimiter);

// ==== Routes API ====
app.use("/api", routes);

// ==== 404 ====
app.use((_req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// ==== Gestion d'erreurs ====
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`✅ Backend CAMPAB démarré sur http://localhost:${env.PORT}`);
  console.log(`   Environnement : ${env.NODE_ENV}`);
  console.log(`   CORS autorisé : ${env.FRONTEND_URL}`);
  console.log(`   Uploads       : /uploads (${path.resolve(process.cwd(), "uploads")})`);
});