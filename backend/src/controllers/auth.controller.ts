// backend/src/controllers/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../lib/env.js";
import type { AuthRequest } from "../middlewares/auth.js";

/* ============================================================
   Connexion admin
   ============================================================ */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = (req.body ?? {}) as {
      email?: unknown;
      password?: unknown;
    };

    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis." });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      // Message identique dans les deux cas pour ne pas révéler
      // l'existence d'un compte.
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn },
    );

    res.json({
      token,
      admin: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[auth] Échec login :", error);
    next(error);
  }
}

/* ============================================================
   Profil admin courant
   ============================================================ */
export async function me(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Non authentifié." });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable." });
      return;
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("[auth] Échec me :", error);
    next(error);
  }
}

/* ============================================================
   Création du premier administrateur (usage unique)
   Protégée par ADMIN_CREATION_SECRET.
   Se verrouille dès qu'un admin existe.
   ============================================================ */
export async function createAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const secret = env.ADMIN_CREATION_SECRET;
    if (!secret) {
      res.status(503).json({
        error:
          "La création d'administrateur est désactivée sur ce serveur.",
      });
      return;
    }

    const body = (req.body ?? {}) as {
      email?: unknown;
      password?: unknown;
      name?: unknown;
      secret?: unknown;
    };

    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name : "";
    const providedSecret =
      typeof body.secret === "string" ? body.secret : "";

    if (providedSecret !== secret) {
      res.status(403).json({ error: "Accès refusé." });
      return;
    }

    if (!email || !password || !name) {
      res.status(400).json({ error: "Tous les champs sont requis." });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        error: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    // Verrouillage : refuse si un admin existe déjà.
    const existingAdmin = await User.findOne({ role: "admin" }).lean();
    if (existingAdmin) {
      res.status(409).json({
        error:
          "Un administrateur existe déjà. La création via cette route est désormais désactivée.",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      res.status(409).json({
        error: "Un utilisateur avec cet email existe déjà.",
      });
      return;
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
      name: name.trim(),
      role: "admin",
    });

    console.log(`[auth] Premier administrateur créé : ${user.email}`);

    res.status(201).json({
      success: true,
      admin: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Administrateur créé avec succès.",
    });
  } catch (error) {
    console.error("[auth] Échec createAdmin :", error);
    next(error);
  }
}