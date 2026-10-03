import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendMail, appointmentClientTemplate, appointmentAdminTemplate } from "../lib/mailer";
import { generateAppointmentPDF } from "../lib/pdf";
import { generateAppointmentReference } from "../lib/reference";
import { env } from "../lib/env";

const appointmentSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  subject: z.string().min(2).max(200),
  message: z.string().max(5000).optional(),
  preferredDate: z.string().datetime().optional().nullable(),
});

export async function createAppointment(req: Request, res: Response): Promise<void> {
  const data = appointmentSchema.parse(req.body);
  const reference = await generateAppointmentReference();
  const appointment = await prisma.appointment.create({
    data: {
      ...data,
      reference,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      status: "pending",
    },
  });

  const pdfBuffer = await generateAppointmentPDF({
    reference: appointment.reference,
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    email: appointment.email,
    phone: appointment.phone,
    subject: appointment.subject,
    message: appointment.message,
    preferredDate: appointment.preferredDate ? appointment.preferredDate.toLocaleDateString("fr-FR") : null,
  });

  Promise.allSettled([
    sendMail({
      to: appointment.email,
      subject: `Votre demande de RDV — ${appointment.reference}`,
      html: appointmentClientTemplate({
        firstName: appointment.firstName,
        reference: appointment.reference,
        subject: appointment.subject,
        preferredDate: appointment.preferredDate ? appointment.preferredDate.toLocaleDateString("fr-FR") : null,
      }),
      attachments: [{ filename: `confirmation-${appointment.reference}.pdf`, content: pdfBuffer }],
    }),
    sendMail({
      to: env.EMAIL_ADMIN,
      subject: `Nouveau RDV — ${appointment.reference}`,
      html: appointmentAdminTemplate({
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        email: appointment.email,
        phone: appointment.phone,
        subject: appointment.subject,
        message: appointment.message,
        preferredDate: appointment.preferredDate ? appointment.preferredDate.toLocaleDateString("fr-FR") : null,
        reference: appointment.reference,
      }),
    }),
  ]).then((results) => results.forEach((r) => r.status === "rejected" && console.error("Mail error:", r.reason)));

  res.status(201).json({ ok: true, reference: appointment.reference, id: appointment.id });
}

export async function listAppointments(req: Request, res: Response): Promise<void> {
  const { status, from, to } = req.query;
  const where: Record<string, unknown> = {};
  if (typeof status === "string" && status) where.status = status;
  if (typeof from === "string" || typeof to === "string") {
    where.createdAt = {};
    if (typeof from === "string") (where.createdAt as Record<string, unknown>).gte = new Date(from);
    if (typeof to === "string") (where.createdAt as Record<string, unknown>).lte = new Date(to);
  }
  const appointments = await prisma.appointment.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(appointments);
}

export async function updateAppointmentStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body as { status?: string };
  const allowed = ["pending", "confirmed", "cancelled", "done"];
  if (!status || !allowed.includes(status)) { res.status(400).json({ error: "Statut invalide" }); return; }
  const updated = await prisma.appointment.update({ where: { id: req.params.id }, data: { status } });
  res.json(updated);
}

export async function deleteAppointment(req: Request, res: Response): Promise<void> {
  await prisma.appointment.delete({ where: { id: req.params.id } });
  res.status(204).end();
}

export async function downloadAppointmentPDF(req: Request, res: Response): Promise<void> {
  const a = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!a) { res.status(404).json({ error: "RDV introuvable" }); return; }
  const pdfBuffer = await generateAppointmentPDF({
    reference: a.reference, firstName: a.firstName, lastName: a.lastName,
    email: a.email, phone: a.phone, subject: a.subject, message: a.message,
    preferredDate: a.preferredDate ? a.preferredDate.toLocaleDateString("fr-FR") : null,
  });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="confirmation-${a.reference}.pdf"`);
  res.send(pdfBuffer);
}
