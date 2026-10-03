import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

interface Attachment { filename: string; content: Buffer; }
interface MailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export async function sendMail(options: MailOptions) {
  return getTransporter().sendMail({
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  });
}

export function appointmentClientTemplate(data: {
  firstName: string;
  reference: string;
  subject: string;
  preferredDate?: string | null;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#17212B">
    <div style="background:#0B2942;padding:28px 32px">
      <h1 style="color:#fff;font-size:20px;margin:0">Cabinet CAMPAB</h1>
      <p style="color:#DCECF4;font-size:13px;margin:6px 0 0">Cotonou &middot; Bénin</p>
    </div>
    <div style="padding:32px;background:#F8FAF9;border:1px solid #D8E0E4">
      <p style="font-size:15px">Bonjour <strong>${data.firstName}</strong>,</p>
      <p style="font-size:15px;line-height:1.6">Nous avons bien reçu votre demande. Référence :</p>
      <p style="font-size:22px;font-weight:bold;color:#0B2942;text-align:center;padding:16px;background:#DCECF4;border-radius:8px">${data.reference}</p>
      <p style="font-size:15px"><strong>Objet :</strong> ${data.subject}</p>
      ${data.preferredDate ? `<p style="font-size:15px"><strong>Date souhaitée :</strong> ${data.preferredDate}</p>` : ""}
      <p style="font-size:13px;color:#5D6872;margin-top:24px">Notre équipe vous recontacte sous 24 à 48h ouvrées.</p>
    </div>
  </div>`;
}

export function appointmentAdminTemplate(data: {
  firstName: string; lastName: string; email: string; phone: string;
  subject: string; message?: string | null; preferredDate?: string | null;
  reference: string;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;color:#17212B">
    <div style="background:#5A8F32;padding:20px 24px"><h2 style="color:#fff;margin:0">Nouvelle demande de RDV</h2></div>
    <div style="padding:24px;background:#F8FAF9">
      <p><strong>Référence :</strong> ${data.reference}</p><hr/>
      <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email :</strong> ${data.email}</p>
      <p><strong>Téléphone :</strong> ${data.phone}</p>
      <p><strong>Objet :</strong> ${data.subject}</p>
      ${data.preferredDate ? `<p><strong>Date :</strong> ${data.preferredDate}</p>` : ""}
      ${data.message ? `<p><strong>Message :</strong></p><p style="white-space:pre-line;background:#fff;padding:12px;border-left:3px solid #5A8F32">${data.message}</p>` : ""}
    </div>
  </div>`;
}

export function contactAdminTemplate(data: {
  name: string; email: string; phone?: string | null; subject: string; message: string;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px">
    <div style="background:#0B2942;padding:20px 24px"><h2 style="color:#fff;margin:0">Nouveau message</h2></div>
    <div style="padding:24px;background:#F8FAF9">
      <p><strong>De :</strong> ${data.name} &lt;${data.email}&gt;</p>
      ${data.phone ? `<p><strong>Tél :</strong> ${data.phone}</p>` : ""}
      <p><strong>Objet :</strong> ${data.subject}</p>
      <p style="white-space:pre-line;background:#fff;padding:12px;border-left:3px solid #5A8F32">${data.message}</p>
    </div>
  </div>`;
}
