// backend/src/lib/mailer.ts
import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendContactNotification(contact: any) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: "p.abodecabinet@gmail.com",
    replyTo: contact.email,
    subject: `📩 Nouveau message de ${contact.name}`,
    html: `
      <h2>Nouveau message</h2>
      <p><strong>Nom :</strong> ${contact.name}</p>
      <p><strong>Email :</strong> ${contact.email}</p>
      <p><strong>Téléphone :</strong> ${contact.phone || "Non renseigné"}</p>
      <p><strong>Objet :</strong> ${contact.subject}</p>
      <h3>Message :</h3>
      <p>${contact.message}</p>
    `,
  });
}

export async function sendAppointmentEmails(appointment: any) {
  // Email au client
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: appointment.email,
    subject: `Confirmation de votre rendez-vous - CAMPAB (${appointment.reference || "RDV"})`,
    html: `
      <h1>Rendez-vous confirmé</h1>
      <p>Bonjour ${appointment.firstName} ${appointment.lastName},</p>
      <p><strong>Référence :</strong> ${appointment.reference || "N/A"}</p>
      <p>Votre demande a bien été enregistrée.</p>
      <p><strong>Objet :</strong> ${appointment.subject}</p>
      <p><strong>Date souhaitée :</strong> ${appointment.preferredDate || "À définir"}</p>
      <p>Nous vous contacterons sous 24-48h.</p>
      <p>CAMPAB</p>
    `,
  });

  // Email à l'admin
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: "p.abodecabinet@gmail.com",
    replyTo: appointment.email,
    subject: `🔔 Nouveau RDV : ${appointment.firstName} ${appointment.lastName} (${appointment.reference || "N/A"})`,
    html: `
      <h2>Nouveau rendez-vous</h2>
      <p><strong>Référence :</strong> ${appointment.reference || "N/A"}</p>
      <p><strong>Client :</strong> ${appointment.firstName} ${appointment.lastName}</p>
      <p><strong>Email :</strong> ${appointment.email}</p>
      <p><strong>Téléphone :</strong> ${appointment.phone}</p>
      <p><strong>Objet :</strong> ${appointment.subject}</p>
      <p><strong>Message :</strong> ${appointment.message || "—"}</p>
    `,
  });
}