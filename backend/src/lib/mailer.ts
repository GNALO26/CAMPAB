// backend/src/lib/mailer.ts
import nodemailer from "nodemailer";
import { env } from "./env.js";
import { generatePdf } from "./pdf.js";

/* ============================================================
   Transporteur SMTP (Gmail)
   ============================================================ */
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  console.log("[mailer] Configuration du transporteur :", {
    hasEmailUser: Boolean(env.EMAIL_USER),
    hasEmailPass: Boolean(env.EMAIL_PASS),
    from: env.EMAIL_FROM,
  });

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new Error(
      "Configuration email manquante : EMAIL_USER et EMAIL_PASS doivent être définis."
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  return transporter;
}

/* ============================================================
   Labels lisibles pour les emails
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

function formatDateLong(value: string | Date | undefined | null): string {
  if (!value) return "À définir avec le cabinet";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "À définir avec le cabinet";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
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

/* ============================================================
   Habillage HTML commun
   ============================================================ */
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
          Email : <a href="mailto:p.abodecabinet@gmail.com" style="color:#5A8F32;text-decoration:none;">p.abodecabinet@gmail.com</a><br />
          Site : <a href="https://cam-pab.com" style="color:#5A8F32;text-decoration:none;">cam-pab.com</a>
        </td></tr>
      </table>
      <div style="font-size:10px;color:#8B959F;margin-top:16px;text-align:center;">Message confidentiel, protégé par le secret professionnel.</div>
    </td></tr>
  </table>
</body></html>`;
}

/* ============================================================
   CONTACT
   ============================================================ */
export async function sendContactNotification(contact: any) {
  console.log("[mailer] Envoi notification contact à l'admin :", contact.email);

  const fullName = `${contact.firstName ?? ""} ${
    contact.lastName ?? contact.name ?? ""
  }`.trim();

  await getTransporter().sendMail({
    from: env.EMAIL_FROM,
    to: "p.abodecabinet@gmail.com",
    replyTo: contact.email,
    subject: `[Contact] ${contact.subject} : ${fullName}`,
    html: wrapHtml(
      "Nouveau message de contact",
      `
      <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouveau message de contact</h1>
      <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Reçu le ${formatDateTime(
        new Date()
      )}</p>
      <table role="presentation" width="100%" style="font-size:13px;color:#17212B;">
        <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(
          fullName
        )}</td></tr>
        <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(
          contact.email
        )}" style="color:#5A8F32;">${escapeHtml(contact.email)}</a></td></tr>
        ${
          contact.phone
            ? `<tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;">${escapeHtml(
                contact.phone
              )}</td></tr>`
            : ""
        }
        <tr><td style="padding:8px 0;color:#5D6872;">Objet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(
          contact.subject
        )}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
        <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
        <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${escapeHtml(
          contact.message
        )}</div>
      </div>
      <div style="margin-top:24px;"><a href="mailto:${escapeHtml(
        contact.email
      )}?subject=Re:%20${encodeURIComponent(
        contact.subject
      )}" style="display:inline-block;background:#0B2942;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">Répondre</a></div>
      `
    ),
  });

  console.log("[mailer] Notification contact envoyée avec succès");
}

/* ============================================================
   RENDEZ-VOUS
   ============================================================ */
export async function sendAppointmentEmails(appointment: any) {
  console.log(
    "[mailer] Préparation des emails pour le RDV :",
    appointment.reference
  );

  const fullName = `${appointment.firstName} ${appointment.lastName}`.trim();
  const serviceText = getServiceLabel(appointment.typeService);
  const urgenceText = getUrgenceLabel(appointment.urgence);
  const dateText = formatDateLong(appointment.preferredDate);
  const timeText = appointment.preferredTime || "À définir avec le cabinet";

  /* Génération du PDF */
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await generatePdf({
      title: "Confirmation de rendez-vous",
      subtitle: `CAMPAB, référence : ${appointment.reference || "N/A"}`,
      rows: [
        { label: "Client", value: fullName },
        { label: "Email", value: appointment.email },
        { label: "Téléphone", value: appointment.phone },
        {
          label: "Organisation",
          value: appointment.organisation || "Non précisée",
        },
        { label: "Pays", value: appointment.country || "Non précisé" },
        { label: "Nature", value: serviceText },
        { label: "Urgence", value: urgenceText },
        { label: "Date souhaitée", value: dateText },
        { label: "Heure souhaitée", value: timeText },
        { label: "Statut", value: appointment.status || "En attente" },
      ],
      footer: "CAMPAB, 01 97 76 29 36, p.abodecabinet@gmail.com",
    });
    console.log("[mailer] PDF généré, taille :", pdfBuffer.length, "octets");
  } catch (error) {
    console.error("[mailer] Échec de génération du PDF :", error);
  }

  const attachments = pdfBuffer
    ? [
        {
          filename: `confirmation-rdv-${
            appointment.reference || appointment._id
          }.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    : [];

  /* Email au client */
  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to: appointment.email,
      replyTo: "p.abodecabinet@gmail.com",
      subject: `Confirmation de votre demande de rendez-vous : ${
        appointment.reference || "CAMPAB"
      }`,
      html: wrapHtml(
        "Confirmation de rendez-vous",
        `
        <h1 style="margin:0 0 16px 0;font-size:22px;color:#071A2C;">Votre demande de rendez-vous est enregistrée</h1>
        <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Bonjour ${escapeHtml(
          appointment.firstName
        )},</p>
        <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Nous avons bien reçu votre demande. Le cabinet vous recontactera sous 24 à 48 heures ouvrées pour confirmer la date et l'heure définitives.</p>
        <div style="padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;margin:20px 0;">
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Référence</div>
          <div style="font-size:18px;color:#071A2C;font-weight:700;letter-spacing:0.05em;margin-bottom:14px;">${escapeHtml(
            appointment.reference || "N/A"
          )}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Nature</div>
          <div style="font-size:13px;color:#17212B;font-weight:600;margin-bottom:14px;">${escapeHtml(
            serviceText
          )}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Date souhaitée</div>
          <div style="font-size:13px;color:#17212B;margin-bottom:14px;">${escapeHtml(
            dateText
          )}</div>
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Heure souhaitée</div>
          <div style="font-size:13px;color:#17212B;">${escapeHtml(timeText)}</div>
        </div>
        <p style="margin:20px 0 0 0;font-size:13px;color:#5D6872;line-height:1.7;">Le récapitulatif complet est joint en PDF. Conservez-le, il contient votre référence de dossier.</p>
        <p style="margin:24px 0 0 0;font-size:14px;color:#17212B;">Cordialement,<br /><strong>Cabinet CAMPAB</strong></p>
        `
      ),
      attachments,
    });
    console.log(
      "[mailer] Email de confirmation envoyé au client :",
      appointment.email
    );
  } catch (error) {
    console.error("[mailer] Échec de l'envoi au client :", error);
    throw error;
  }

  /* Email à l'admin (la juriste) */
  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to: "p.abodecabinet@gmail.com",
      replyTo: appointment.email,
      subject: `[Rendez-vous] ${appointment.reference} : ${fullName}`,
      html: wrapHtml(
        "Nouvelle demande de rendez-vous",
        `
        <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouvelle demande de rendez-vous</h1>
        <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Référence <strong style="color:#0B2942;">${escapeHtml(
          appointment.reference || "N/A"
        )}</strong>, reçue le ${formatDateTime(
          appointment.createdAt || new Date()
        )}</p>
        <table role="presentation" width="100%" style="font-size:13px;color:#17212B;">
          <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(
            fullName
          )}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(
            appointment.email
          )}" style="color:#5A8F32;">${escapeHtml(appointment.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${escapeHtml(
            appointment.phone
          )}" style="color:#5A8F32;">${escapeHtml(appointment.phone)}</a></td></tr>
          ${
            appointment.organisation
              ? `<tr><td style="padding:8px 0;color:#5D6872;">Organisation</td><td style="padding:8px 0;">${escapeHtml(
                  appointment.organisation
                )}</td></tr>`
              : ""
          }
          <tr><td style="padding:8px 0;color:#5D6872;">Pays</td><td style="padding:8px 0;">${escapeHtml(
            appointment.country || "Non précisé"
          )}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Nature</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(
            serviceText
          )}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Urgence</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(
            urgenceText
          )}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Date souhaitée</td><td style="padding:8px 0;">${escapeHtml(
            dateText
          )}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6872;">Heure souhaitée</td><td style="padding:8px 0;">${escapeHtml(
            timeText
          )}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
          <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Description du litige</div>
          <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${escapeHtml(
            appointment.description || "Non précisée"
          )}</div>
        </div>
        <div style="margin-top:24px;"><a href="mailto:${escapeHtml(
          appointment.email
        )}?subject=Re:%20${encodeURIComponent(
          "Confirmation de rendez-vous " + appointment.reference
        )}" style="display:inline-block;background:#0B2942;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">Répondre au client</a></div>
        `
      ),
      attachments,
    });
    console.log("[mailer] Notification envoyée à l'admin");
  } catch (error) {
    console.error("[mailer] Échec de l'envoi à l'admin :", error);
    throw error;
  }
}