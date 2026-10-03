// backend/src/lib/reference.ts
import Appointment from "../models/Appointment.js";

/**
 * Génère une référence unique pour un rendez-vous.
 * Format : RDV-YYYY-NNNN (ex: RDV-2026-0001)
 */
export async function generateAppointmentReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RDV-${year}-`;

  // Compter les rendez-vous de l'année en cours
  const count = await Appointment.countDocuments({
    reference: { $regex: `^${prefix}` },
  });

  // Générer le numéro suivant
  let nextNumber = count + 1;
  let reference = `${prefix}${nextNumber.toString().padStart(4, "0")}`;

  // Sécurité : si la référence existe déjà, incrémenter
  let exists = await Appointment.findOne({ reference });
  while (exists) {
    nextNumber++;
    reference = `${prefix}${nextNumber.toString().padStart(4, "0")}`;
    exists = await Appointment.findOne({ reference });
  }

  return reference;
}