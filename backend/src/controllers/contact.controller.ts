import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendMail, contactAdminTemplate } from "../lib/mailer";
import { env } from "../lib/env";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function createContact(req: Request, res: Response): Promise<void> {
  const data = contactSchema.parse(req.body);
  const saved = await prisma.contactMessage.create({ data });
  sendMail({ to: env.EMAIL_ADMIN, subject: `Contact : ${data.subject}`, html: contactAdminTemplate(data) })
    .catch((e) => console.error("Mail contact error:", e));
  res.status(201).json({ ok: true, id: saved.id, message: "Message reçu." });
}

export async function listContacts(_req: Request, res: Response): Promise<void> {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json(messages);
}

export async function markContactRead(req: Request, res: Response): Promise<void> {
  const msg = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { read: true } });
  res.json(msg);
}

export async function deleteContact(req: Request, res: Response): Promise<void> {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
