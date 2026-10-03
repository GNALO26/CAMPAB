import { prisma } from "./prisma";

export async function generateAppointmentReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RDV-${year}-`;
  const count = await prisma.appointment.count({ where: { reference: { startsWith: prefix } } });
  return `${prefix}${(count + 1).toString().padStart(4, "0")}`;
}
