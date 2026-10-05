// backend/src/lib/mailer.ts
import { env } from "./env.js";
import { generateAppointmentPdf } from "./pdf.js";

/* ============================================================
   Authentification Gmail API (OAuth 2.0)
   ============================================================ */
let cachedAccessToken: string | null = null;
let accessTokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedAccessToken && now < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  console.log("[mailer] Obtention d'un nouveau access token Gmail...");

  const body = new URLSearchParams({
    client_id: env.GMAIL_CLIENT_ID,
    client_secret: env.GMAIL_CLIENT_SECRET,
    refresh_token: env.GMAIL_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[mailer] Échec obtention access token :", error);
    throw new Error(`Échec authentification Gmail : ${response.status}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedAccessToken = data.access_token;
  accessTokenExpiresAt = now + data.expires_in * 1000;

  console.log("[mailer] Access token obtenu, expire dans", data.expires_in, "s");

  return data.access_token;
}

/* ============================================================
   Envoi d'un email via Gmail API
   ============================================================ */
interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface SendMailOptions {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}

function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
}

function buildMimeMessage(options: SendMailOptions): string {
  const boundary = `campab-boundary-${Date.now()}`;
  const senderEmail = env.GMAIL_SENDER_EMAIL;

  const lines: string[] = [];

  lines.push(`From: CAMPAB <${senderEmail}>`);
  lines.push(`To: ${options.to}`);
  if (options.replyTo) lines.push(`Reply-To: ${options.replyTo}`);
  lines.push(`Subject: ${encodeSubject(options.subject)}`);
  lines.push(`MIME-Version: 1.0`);

  if (options.attachments && options.attachments.length > 0) {
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    lines.push(``);
    lines.push(`--${boundary}`);
    lines.push(`Content-Type: text/html; charset="UTF-8"`);
    lines.push(`Content-Transfer-Encoding: base64`);
    lines.push(``);
    lines.push(Buffer.from(options.html, "utf-8").toString("base64"));
    lines.push(``);

    for (const att of options.attachments) {
      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${att.contentType}; name="${att.filename}"`);
      lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      lines.push(`Content-Transfer-Encoding: base64`);
      lines.push(``);
      lines.push(att.content.toString("base64"));
    }

    lines.push(`--${boundary}--`);
  } else {
    lines.push(`Content-Type: text/html; charset="UTF-8"`);
    lines.push(`Content-Transfer-Encoding: base64`);
    lines.push(``);
    lines.push(Buffer.from(options.html, "utf-8").toString("base64"));
  }

  return lines.join("\r\n");
}

async function sendMail(options: SendMailOptions): Promise<void> {
  const accessToken = await getAccessToken();

  const mimeMessage = buildMimeMessage(options);

  const raw = Buffer.from(mimeMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[mailer] Échec envoi Gmail :", error);
    throw new Error(`Échec envoi email : ${response.status}`);
  }

  const result = (await response.json()) as { id: string };
  console.log(`[mailer] Email envoyé à ${options.to}, ID Gmail : ${result.id}`);
}

/* ============================================================
   Labels lisibles
   ============================================================ */
const SERVICE_LABELS: Record<string, string> = {
  consultation: "Consultation juridique",
  mediation: "Médiation",
  arbitrage: "Arbitrage OHADA",
};

const URGENCE_LABELS: Record<string, string> = {
  normale: "Normale",
  elevee: "Élevée",
  critique: "Critique",
};

function getServiceLabel(value: string | undefined): string {
  if (!value) return "Non précisé";
  return SERVICE_LABELS[value] ?? value;
}

function getUrgenceLabel(value: string | undefined): string {
  if (!value) return "Normale";
  return URGENCE_LABELS[value] ?? value;
}

function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Helvetica,Arial,sans-serif;color:#17212B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(11,41,66,0.08);">
        <tr><td style="background:#071A2C;padding:28px 32px;">
          <div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:0.08em;">CAMPAB</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px;">Cotonou, Bénin</div>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="background:#F8FAF9;padding:20px 32px;border-top:1px solid #D8E0E4;font-size:11px;color:#5D6872;line-height:1.6;">
          <strong style="color:#17212B;">Cabinet Sètondji Prudencia ABODE</strong><br />
          Cotonou, Bénin<br />
          Téléphone : 01 97 76 29 36<br />
          Email : <a href="mailto:p.abodecabinet@gmail.com" style="color:#5A8F32;text-decoration:none;">p.abodecabinet@gmail.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ============================================================
   CONTACT
   ============================================================ */
export async function sendContactNotification(contact: any) {
  console.log("[mailer] Notification contact :", contact.email);

  const fullName = `${contact.firstName ?? ""} ${
    contact.lastName ?? contact.name ?? ""
  }`.trim();

  await sendMail({
    to: "p.abodecabinet@gmail.com",
    replyTo: contact.email,
    subject: `[Contact] ${contact.subject} : ${fullName}`,
    html: wrapHtml(
      "Nouveau message de contact",
      `
      <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouveau message de contact</h1>
      <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Reçu le ${formatDateTime(new Date())}</p>
      <table role="presentation" width="100%" style="font-size:13px;color:#17212B;">
        <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;">${escapeHtml(contact.email)}</td></tr>
        ${contact.phone ? `<tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;">${escapeHtml(contact.phone)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#5D6872;">Objet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(contact.subject)}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
        <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
        <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${escapeHtml(contact.message)}</div>
      </div>
      `
    ),
  });
}

/* ============================================================
   RENDEZ-VOUS
   ============================================================ */
export async function sendAppointmentEmails(appointment: any) {
  console.log("[mailer] Préparation des emails pour le RDV :", appointment.reference);

  const fullName = `${appointment.firstName} ${appointment.lastName}`.trim();
  const serviceText = getServiceLabel(appointment.typeService);
  const urgenceText = getUrgenceLabel(appointment.urgence);
  const dateText = appointment.preferredDate
    ? new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(appointment.preferredDate))
    : "À définir avec le cabinet";
  const timeText = appointment.preferredTime || "À définir avec le cabinet";

  /* Génération du PDF avec la nouvelle interface */
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await generateAppointmentPdf({
      reference: appointment.reference || "N/A",
      typeService: appointment.typeService || "consultation",
      urgence: appointment.urgence || "normale",
      description: appointment.description || "Non précisée",
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      email: appointment.email,
      phone: appointment.phone,
      organisation: appointment.organisation || null,
      country: appointment.country || "Non précisé",
      preferredDate: appointment.preferredDate || null,
      preferredTime: appointment.preferredTime || null,
      createdAt: appointment.createdAt || new Date(),
    });
    if (pdfBuffer) {
      console.log("[mailer] PDF généré, taille :", pdfBuffer.length, "octets");
    }
  } catch (error) {
    console.error("[mailer] Échec PDF :", error);
  }

  const attachments = pdfBuffer
    ? [
        {
          filename: `confirmation-rdv-${appointment.reference || appointment._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    : [];

  /* Email client */
  try {
    await sendMail({
      to: appointment.email,
      replyTo: "p.abodecabinet@gmail.com",
      subject: `Confirmation de votre demande de rendez-vous : ${appointment.reference || "CAMPAB"}`,
      html: wrapHtml(
        "Confirmation de rendez-vous",
        `
        <h1 style="margin:0 0 16px 0;font-size:22px;color:#071A2C;">Votre demande de rendez-vous est enregistrée</h1>
        <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Bonjour ${escapeHtml(appointment.firstName)},</p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Nous avons bien reçu votre demande. Le cabinet vous recontactera sous 24 à 48 heures ouvrées.</p>
        <div style="padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;margin:20px 0;">
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Référence</div>
          <div style="font-size:18px;color:#071A2C;font-weight:700;margin-bottom:14px;">${escapeHtml(appointment.reference || "N/A")}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Nature</div>
          <div style="font-size:13px;color:#17212B;font-weight:600;margin-bottom:14px;">${escapeHtml(serviceText)}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Date souhaitée</div>
          <div style="font-size:13px;color:#17212B;margin-bottom:14px;">${escapeHtml(dateText)}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Heure souhaitée</div>
          <div style="font-size:13px;color:#17212B;">${escapeHtml(timeText)}</div>
        </div>
        <p style="margin:24px 0 0 0;font-size:14px;color:#17212B;">Cordialement,<br /><strong>Cabinet CAMPAB</strong></p>
        `
      ),
      attachments,
    });
  } catch (error) {
    console.error("[mailer] Échec email client :", error);
    throw error;
  }

  /* Email admin */
  try {
    await sendMail({
      to: "p.abodecabinet@gmail.com",
      replyTo: appointment.email,
      subject: `[Rendez-vous] ${appointment.reference} : ${fullName}`,
      html: wrapHtml(
        "Nouvelle demande de rendez-vous",
        `
        <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouvelle demande de rendez-vous</h1>
        <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Référence <strong>${escapeHtml(appointment.reference || "N/A")}</strong>, reçue le ${formatDateTime(appointment.createdAt || new Date())}</p>
        <table role="presentation" width="100%" style="font-size:13px;color:#17212B;">
          <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;">${escapeHtml(appointment.email)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;">${escapeHtml(appointment.phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Nature</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(serviceText)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Urgence</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(urgenceText)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Date</td><td style="padding:8px 0;">${escapeHtml(dateText)}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Heure</td><td style="padding:8px 0;">${escapeHtml(timeText)}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Description du litige</div>
          <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${escapeHtml(appointment.description || "Non précisée")}</div>
        </div>
        `
      ),
      attachments,
    });
    console.log("[mailer] Notification admin envoyée");
  } catch (error) {
    console.error("[mailer] Échec email admin :", error);
    throw error;
  }
}