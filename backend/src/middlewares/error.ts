// backend/src/middlewares/error.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("❌ Erreur :", err);

  // Erreur Mongoose - validation
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Erreur de validation",
      details: Object.values(err.errors).map((e: any) => e.message),
    });
    return;
  }

  // Erreur Mongoose - duplicate key
  if (err.code === 11000) {
    res.status(409).json({
      error: "Doublon détecté",
      field: Object.keys(err.keyPattern)[0],
    });
    return;
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Token invalide" });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expiré" });
    return;
  }

  // Erreur personnalisée avec status
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Erreur serveur interne";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}