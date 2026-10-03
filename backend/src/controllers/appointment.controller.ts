// backend/src/controllers/appointment.controller.ts
import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment.js";
import { sendAppointmentEmails } from "../lib/mailer.js";
import { generateAppointmentReference } from "../lib/reference.js";

export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Générer une référence unique
    const reference = await generateAppointmentReference();

    const appointment = await Appointment.create({
      ...req.body,
      reference,
    });

    // Envoi des emails en arrière-plan (non bloquant)
    sendAppointmentEmails(appointment).catch(console.error);

    res.status(201).json({
      success: true,
      id: appointment._id,
      reference: appointment.reference,
      message: "Rendez-vous enregistré. Un email de confirmation vous a été envoyé.",
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function listAppointments(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function updateAppointmentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) {
      res.status(404).json({ error: "Rendez-vous introuvable" });
      return;
    }
    res.json(appointment);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function deleteAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function downloadAppointmentPDF(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ error: "Rendez-vous introuvable" });
      return;
    }

    const { generatePdf } = await import("../lib/pdf.js");
    const buffer = await generatePdf({
      title: "Confirmation de rendez-vous",
      subtitle: `CAMPAB - Référence : ${appointment.reference || "N/A"}`,
      rows: [
        { label: "Client", value: `${appointment.firstName} ${appointment.lastName}` },
        { label: "Email", value: appointment.email },
        { label: "Téléphone", value: appointment.phone },
        { label: "Objet", value: appointment.subject },
        { label: "Date souhaitée", value: appointment.preferredDate || "À définir" },
        { label: "Statut", value: appointment.status },
      ],
      footer: "CAMPAB - 01 97 76 29 36 - p.abodecabinet@gmail.com",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rdv-${appointment.reference || appointment._id}.pdf"`
    );
    res.send(buffer);
    return;
  } catch (error) {
    next(error);
    return;
  }
}