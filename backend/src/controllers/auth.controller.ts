import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Email ou mot de passe invalide" }); return; }
  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) { res.status(401).json({ error: "Identifiants incorrects" }); return; }
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) { res.status(401).json({ error: "Identifiants incorrects" }); return; }
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
}

export async function me(req: Request, res: Response): Promise<void> {
  const anyReq = req as Request & { admin?: { id: string } };
  if (!anyReq.admin) { res.status(401).json({ error: "Non authentifié" }); return; }
  const admin = await prisma.admin.findUnique({
    where: { id: anyReq.admin.id },
    select: { id: true, email: true, name: true, role: true },
  });
  res.json(admin);
}
