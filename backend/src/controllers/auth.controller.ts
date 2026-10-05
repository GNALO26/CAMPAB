// backend/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../lib/env.js";

interface AuthRequest extends Request {
  userId?: string;
}

/* ============================================================
   Connexion admin
   ============================================================ */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis." });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ============================================================
   Récupérer le profil admin courant
   ============================================================ */
export async function me(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable." });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

/* ============================================================
   Créer un administrateur (usage unique, à retirer après)
   ============================================================ */
export async function createAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name, secret } = req.body;

    /* Protection : mot de passe secret dans l'env */
    if (secret !== process.env.ADMIN_CREATION_SECRET) {
      res.status(403).json({ error: "Accès refusé." });
      return;
    }

    if (!email || !password || !name) {
      res.status(400).json({ error: "Tous les champs sont requis." });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "Un utilisateur avec cet email existe déjà." });
      return;
    }

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role: "admin",
    });

    res.status(201).json({
      success: true,
      id: user._id,
      email: user.email,
      message: "Administrateur créé avec succès.",
    });
  } catch (error) {
    next(error);
  }
}