// backend/src/controllers/appointment.controller.ts
import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment.js";
import {
  sendAppointmentEmails,
  sendAppointmentConfirmationEmail,
  sendAppointmentCancellationEmail,
} from "../lib/mailer.js";
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

    const allSlots = generateDailySlots(targetDate);

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

    const reference = await generateAppointmentReference();

    const appointment = await Appointment.create({
      ...rest,
      preferredDate: preferredDate
        ? new Date(`${preferredDate}T00:00:00`)
        : undefined,
      preferredTime: preferredTime || undefined,
      reference,
    });

    /* Envoi des emails en arrière-plan (non bloquant) */
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
 * Met à jour le statut d'un rendez-vous et notifie le client
 * par email selon la transition.
 *
 * Transitions qui déclenchent un email :
 *  - pending -> confirmed : email « rendez-vous confirmé » (avec PDF)
 *  - *       -> cancelled : email « rendez-vous annulé »
 */
export async function updateAppointmentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = (req.body ?? {}) as { status?: unknown };

    const ALLOWED = ["pending", "confirmed", "cancelled", "done"] as const;
    type AllowedStatus = (typeof ALLOWED)[number];

    if (
      typeof status !== "string" ||
      !ALLOWED.includes(status as AllowedStatus)
    ) {
      res.status(400).json({ error: "Statut invalide." });
      return;
    }

    const newStatus = status as AllowedStatus;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ error: "Rendez-vous introuvable." });
      return;
    }

    const previousStatus = appointment.status;

    /* Aucun changement : on renvoie tel quel, sans email */
    if (previousStatus === newStatus) {
      res.json(appointment);
      return;
    }

    appointment.status = newStatus;
    await appointment.save();

    /* Notification email en arrière-plan (non bloquant) */
    const snapshot = appointment.toObject();

    if (newStatus === "confirmed" && previousStatus === "pending") {
      sendAppointmentConfirmationEmail(snapshot).catch((err) =>
        console.error("[appointment] Échec email confirmation :", err)
      );
    } else if (newStatus === "cancelled" && previousStatus !== "cancelled") {
      sendAppointmentCancellationEmail(snapshot).catch((err) =>
        console.error("[appointment] Échec email annulation :", err)
      );
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

    /* Import dynamique : le module PDF n'est chargé qu'à la demande. */
    const { generateAppointmentPdf } = await import("../lib/pdf.js");

    const buffer = await generateAppointmentPdf({
      reference: appointment.reference ?? String(appointment._id),
      typeService: (appointment as any).typeService ?? "non_precise",
      urgence: (appointment as any).urgence ?? "normale",
      description:
        (appointment as any).description ??
        appointment.subject ??
        "Non précisée",
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      email: appointment.email,
      phone: appointment.phone,
      organisation: (appointment as any).organisation ?? null,
      country: (appointment as any).country ?? "Non précisé",
      preferredDate: appointment.preferredDate
        ? new Date(appointment.preferredDate).toISOString()
        : null,
      preferredTime: appointment.preferredTime ?? null,
      createdAt: appointment.createdAt ?? new Date(),
      status: appointment.status,
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