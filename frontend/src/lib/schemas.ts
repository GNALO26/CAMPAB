import { z } from "zod";

export const appointmentSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court").max(80),
  lastName: z.string().min(2, "Nom trop court").max(80),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .min(6, "Numéro trop court")
    .max(30)
    .regex(/^[0-9+\s().-]+$/, "Numéro invalide"),
  subject: z.string().min(2, "Objet trop court").max(200),
  message: z.string().max(5000).optional(),
  preferredDate: z.string().optional(),
});
export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().max(30).optional(),
  subject: z.string().min(2, "Objet trop court").max(200),
  message: z.string().min(10, "Message trop court").max(5000),
});
export type ContactFormData = z.infer<typeof contactSchema>;

export const APPOINTMENT_SUBJECTS = [
  "Consultation juridique",
  "Médiation",
  "Arbitrage OHADA",
  "Droit des affaires",
  "Droit des sociétés",
  "Droit social",
  "Droit civil",
  "Droit immobilier",
  "Autre",
] as const;