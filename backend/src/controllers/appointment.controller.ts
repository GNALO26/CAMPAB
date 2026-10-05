// backend/src/controllers/appointment.controller.ts
import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment.js";
import { sendAppointmentEmails } from "../lib/mailer.js";
import { generateAppointmentReference } from "../lib/reference.js";
import {
  generateDailySlots,
  filterAvailableSlots,
  isValidTimeSlot,
  isWorkingDay,
  hasMinGap,
} from "../lib/appointment-slots.js";

/**
 * GET /api/appointments/available-slots?date=YYYY-MM-DD
 * Retourne les créneaux disponibles pour une date donnée.
 */
export async function getAvailableSlots(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      res.status(400).json({
        error: "Paramètre date manquant (format YYYY-MM-DD).",
      });
      return;
    }

    const targetDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(targetDate.getTime())) {
      res.status(400).json({ error: "Date invalide." });
      return;
    }

    if (targetDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      res.status(400).json({ error: "La date est déjà passée." });
      return;
    }

    if (!isWorkingDay(targetDate)) {
      res.json({
        date,
        isWorkingDay: false,
        slots: [],
        message: "Le cabinet est fermé à cette date.",
      });
      return;
    }

    // Créneaux théoriques de la journée
    const allSlots = generateDailySlots(targetDate);

    // Récupération des rendez-vous existants à cette date
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Appointment.find({
      preferredDate: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["pending", "confirmed"] },
    })
      .select("preferredTime")
      .lean();

    const existingTimes = existing
      .map((a: any) => a.preferredTime)
      .filter(
        (t: any): t is string => typeof t === "string" && t.length > 0
      );

    // Filtrage des créneaux disponibles
    const availableSlots = filterAvailableSlots(
      allSlots,
      existingTimes.map((t) => ({ time: t }))
    );

    res.json({
      date,
      isWorkingDay: true,
      slots: availableSlots,
      allSlots,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

/**
 * POST /api/appointments
 * Création d'un rendez-vous avec validation renforcée.
 */
export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { preferredDate, preferredTime, ...rest } = req.body;

    // Validation du créneau si une date est fournie
    if (preferredDate && preferredTime) {
      const targetDate = new Date(`${preferredDate}T00:00:00`);

      if (Number.isNaN(targetDate.getTime())) {
        res.status(400).json({ error: "Date invalide." });
        return;
      }

      if (!isWorkingDay(targetDate)) {
        res.status(400).json({
          error:
            "Le cabinet est fermé le jour sélectionné. Choisissez un jour ouvré (lundi à vendredi).",
        });
        return;
      }

      if (!isValidTimeSlot(targetDate, preferredTime)) {
        res.status(400).json({
          error:
            "L'heure sélectionnée ne correspond pas à un créneau valide du cabinet.",
        });
        return;
      }

      // Récupération des rendez-vous existants ce jour-là
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const existing = await Appointment.find({
        preferredDate: { $gte: dayStart, $lte: dayEnd },
        status: { $in: ["pending", "confirmed"] },
      })
        .select("preferredTime")
        .lean();

      const existingTimes = existing
        .map((a: any) => a.preferredTime)
        .filter(
          (t: any): t is string => typeof t === "string" && t.length > 0
        );

      if (
        !hasMinGap(
          preferredTime,
          existingTimes.map((t) => ({ time: t }))
        )
      ) {
        res.status(409).json({
          error:
            "Ce créneau est trop proche d'un autre rendez-vous. Choisissez un créneau avec au moins 30 minutes d'écart.",
        });
        return;
      }
    }

    // Génération d'une référence unique
    const reference = await generateAppointmentReference();

    // Création du rendez-vous
    const appointment = await Appointment.create({
      ...rest,
      preferredDate: preferredDate
        ? new Date(`${preferredDate}T00:00:00`)
        : undefined,
      preferredTime: preferredTime || undefined,
      reference,
    });

    // Envoi des emails en arrière-plan (non bloquant)
    sendAppointmentEmails(appointment).catch(console.error);

    res.status(201).json({
      success: true,
      id: appointment._id,
      reference: appointment.reference,
      message:
        "Rendez-vous enregistré. Un email de confirmation vous a été envoyé.",
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

/**
 * GET /api/appointments
 * Liste tous les rendez-vous (réservé à l'administration).
 */
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

/**
 * PATCH /api/appointments/:id/status
 * Met à jour le statut d'un rendez-vous.
 */
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

/**
 * DELETE /api/appointments/:id
 * Supprime un rendez-vous.
 */
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

/**
 * GET /api/appointments/:id/pdf
 * Télécharge le PDF de confirmation d'un rendez-vous.
 */
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
      subtitle: `CAMPAB, référence : ${appointment.reference || "N/A"}`,
      rows: [
        {
          label: "Client",
          value: `${appointment.firstName} ${appointment.lastName}`,
        },
        { label: "Email", value: appointment.email },
        { label: "Téléphone", value: appointment.phone },
        {
          label: "Objet",
          value: appointment.subject || "Non précisé",
        },
        {
          label: "Date souhaitée",
          value: appointment.preferredDate
            ? new Date(appointment.preferredDate).toLocaleDateString("fr-FR")
            : "À définir",
        },
        {
          label: "Heure souhaitée",
          value: appointment.preferredTime || "À définir",
        },
        { label: "Statut", value: appointment.status },
      ],
      footer: "CAMPAB, 01 97 76 29 36, p.abodecabinet@gmail.com",
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