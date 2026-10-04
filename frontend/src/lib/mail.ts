// src/lib/mail.ts
import nodemailer, { type Transporter } from 'nodemailer'
import { site } from '@/lib/site'
import { APPOINTMENT_SERVICES, APPOINTMENT_URGENCIES } from '@/lib/schemas'
import type { AppointmentPdfData } from '@/lib/pdf'

/* ============================================================
   Configuration SMTP (Gmail via EMAIL_USER / EMAIL_PASS,
   ou tout autre fournisseur via SMTP_*)
   ============================================================ */
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
const SMTP_FROM = process.env.SMTP_FROM ?? `${site.shortName} <${EMAIL_USER ?? 'no-reply@cam-pab.com'}>`
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'p.abodecabinet@gmail.com'

let cached: Transporter | null = null

function getTransporter(): Transporter {
  if (cached) return cached

  /* Gmail explicite */
  if (!SMTP_HOST && EMAIL_USER && EMAIL_PASS) {
    cached = nodemailer.createTransport({ service: 'gmail', auth: { user: EMAIL_USER, pass: EMAIL_PASS } })
    return cached
  }

  /* SMTP générique */
  if (SMTP_HOST && EMAIL_USER && EMAIL_PASS) {
    cached = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
    return cached
  }

  throw new Error('Configuration SMTP manquante : renseignez EMAIL_USER et EMAIL_PASS, ou SMTP_HOST / SMTP_USER / SMTP_PASSWORD.')
}

export function isMailConfigured(): boolean {
  return Boolean((EMAIL_USER && EMAIL_PASS) || (SMTP_HOST && EMAIL_USER && EMAIL_PASS))
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
          <div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:0.08em;">${site.sigle}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px;">${site.address.city}, ${site.address.country}</div>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="background:#F8FAF9;padding:20px 32px;border-top:1px solid #D8E0E4;font-size:11px;color:#5D6872;line-height:1.6;">
          <strong style="color:#17212B;">${site.name}</strong><br />${site.address.full}<br />
          Téléphone : ${site.contact.phone}<br />
          Email : <a href="mailto:${site.contact.emailPro}" style="color:#5A8F32;text-decoration:none;">${site.contact.emailPro}</a><br />
          Site : <a href="${site.url}" style="color:#5A8F32;text-decoration:none;">${site.url}</a>
        </td></tr>
      </table>
      <div style="font-size:10px;color:#8B959F;margin-top:16px;text-align:center;">Message confidentiel, protégé par le secret professionnel.</div>
    </td></tr>
  </table>
</body></html>`
}

function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function fmtDate(v: string | Date): string {
  const d = typeof v === 'string' ? new Date(v) : v
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

function fmtDateLong(v?: string | null): string {
  if (!v) return 'Non précisée'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return 'Non précisée'
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

function labelOf(list: readonly { value: string; label: string }[], v: string): string {
  return list.find((x) => x.value === v)?.label ?? v
}

/* ============================================================
   CONTACT — 2 emails
   ============================================================ */
export interface ContactEmailData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  receivedAt: Date | string
}

export async function sendContactNotificationToAdmin(data: ContactEmailData): Promise<void> {
  const full = `${data.firstName} ${data.lastName}`.trim()
  const body = `
    <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouveau message de contact</h1>
    <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Reçu le ${fmtDate(data.receivedAt)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#17212B;">
      <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${esc(full)}</td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}" style="color:#5A8F32;text-decoration:none;">${esc(data.email)}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${esc(data.phone)}" style="color:#5A8F32;text-decoration:none;">${esc(data.phone)}</a></td></tr>` : ''}
      <tr><td style="padding:8px 0;color:#5D6872;">Objet</td><td style="padding:8px 0;font-weight:600;">${esc(data.subject)}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
      <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${esc(data.message)}</div>
    </div>
    <div style="margin-top:24px;"><a href="mailto:${esc(data.email)}?subject=Re:%20${encodeURIComponent(data.subject)}" style="display:inline-block;background:#0B2942;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">Répondre à ${esc(data.firstName)}</a></div>
  `
  await getTransporter().sendMail({
    from: SMTP_FROM, to: ADMIN_EMAIL, replyTo: data.email,
    subject: `[Contact] ${data.subject} — ${full}`,
    html: wrapHtml('Nouveau message de contact', body),
    text: `Nouveau message de contact\n\n${full}\n${data.email}\n${data.phone ?? 'Téléphone non renseigné'}\n\nObjet : ${data.subject}\n\n${data.message}`,
  })
}

export async function sendContactConfirmationToClient(data: ContactEmailData): Promise<void> {
  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;color:#071A2C;">Votre message a bien été reçu</h1>
    <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Bonjour ${esc(data.firstName)},</p>
    <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Nous avons bien reçu votre message. Notre équipe vous répondra dans les meilleurs délais, généralement sous 24 à 48 heures ouvrées.</p>
    <div style="padding:16px;background:#F8FAF9;border-left:3px solid #0B2942;border-radius:6px;margin:20px 0;">
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Objet</div>
      <div style="font-size:14px;color:#17212B;font-weight:600;">${esc(data.subject)}</div>
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin:16px 0 6px 0;">Votre message</div>
      <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${esc(data.message)}</div>
    </div>
    <p style="margin:20px 0 0 0;font-size:13px;color:#5D6872;line-height:1.7;">Pour toute urgence : ${site.contact.phone} ou WhatsApp.</p>
    <p style="margin:24px 0 0 0;font-size:14px;color:#17212B;">Cordialement,<br /><strong>${site.name}</strong></p>
  `
  await getTransporter().sendMail({
    from: SMTP_FROM, to: data.email, replyTo: ADMIN_EMAIL,
    subject: `Confirmation de réception — ${site.shortName}`,
    html: wrapHtml('Confirmation de réception', body),
    text: `Bonjour ${data.firstName},\n\nNous avons bien reçu votre message concernant « ${data.subject} ».\n\n${site.name}\n${site.contact.phone}`,
  })
}

/* ============================================================
   RENDEZ-VOUS — 2 emails avec PDF joint
   ============================================================ */
export interface AppointmentEmailData extends AppointmentPdfData {
  pdfBuffer: Buffer
}

export async function sendAppointmentNotificationToAdmin(data: AppointmentEmailData): Promise<void> {
  const full = `${data.firstName} ${data.lastName}`.trim()
  const serviceLabel = labelOf(APPOINTMENT_SERVICES, data.typeService)
  const urgenceLabel = labelOf(APPOINTMENT_URGENCIES, data.urgence)

  const body = `
    <h1 style="margin:0 0 8px 0;font-size:20px;color:#071A2C;">Nouvelle demande de rendez-vous</h1>
    <p style="margin:0 0 24px 0;font-size:13px;color:#5D6872;">Référence <strong style="color:#0B2942;">${esc(data.reference)}</strong> — reçue le ${fmtDate(data.createdAt)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#17212B;">
      <tr><td style="padding:8px 0;color:#5D6872;width:140px;">Nom complet</td><td style="padding:8px 0;font-weight:600;">${esc(full)}</td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}" style="color:#5A8F32;text-decoration:none;">${esc(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${esc(data.phone)}" style="color:#5A8F32;text-decoration:none;">${esc(data.phone)}</a></td></tr>
      ${data.organisation ? `<tr><td style="padding:8px 0;color:#5D6872;">Organisation</td><td style="padding:8px 0;">${esc(data.organisation)}</td></tr>` : ''}
      <tr><td style="padding:8px 0;color:#5D6872;">Pays</td><td style="padding:8px 0;">${esc(data.country)}</td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Nature</td><td style="padding:8px 0;font-weight:600;">${esc(serviceLabel)}</td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Urgence</td><td style="padding:8px 0;font-weight:600;">${esc(urgenceLabel)}</td></tr>
      <tr><td style="padding:8px 0;color:#5D6872;">Date souhaitée</td><td style="padding:8px 0;">${esc(fmtDateLong(data.preferredDate))}</td></tr>
      ${data.preferredTime ? `<tr><td style="padding:8px 0;color:#5D6872;">Heure souhaitée</td><td style="padding:8px 0;">${esc(data.preferredTime)}</td></tr>` : ''}
    </table>
    <div style="margin-top:20px;padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;">
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Description du litige</div>
      <div style="font-size:13px;color:#17212B;white-space:pre-wrap;line-height:1.7;">${esc(data.description)}</div>
    </div>
    <div style="margin-top:24px;padding:14px;background:#F0F7F0;border:1px solid #CFE3CF;border-radius:6px;font-size:12px;color:#17212B;">La confirmation PDF est jointe à cet email.</div>
    <div style="margin-top:24px;"><a href="mailto:${esc(data.email)}?subject=Confirmation%20de%20rendez-vous%20-%20${encodeURIComponent(data.reference)}" style="display:inline-block;background:#0B2942;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:600;">Répondre à ${esc(data.firstName)}</a></div>
  `
  await getTransporter().sendMail({
    from: SMTP_FROM, to: ADMIN_EMAIL, replyTo: data.email,
    subject: `[Rendez-vous] ${data.reference} — ${full}`,
    html: wrapHtml('Nouvelle demande de rendez-vous', body),
    text: `Nouvelle demande de rendez-vous\n\nRéférence : ${data.reference}\n${full}\n${data.email}\n${data.phone}\nNature : ${serviceLabel}\nUrgence : ${urgenceLabel}\nDate souhaitée : ${fmtDateLong(data.preferredDate)}\n\n${data.description}`,
    attachments: [{ filename: `confirmation-rdv-${data.reference}.pdf`, content: data.pdfBuffer, contentType: 'application/pdf' }],
  })
}

export async function sendAppointmentConfirmationToClient(data: AppointmentEmailData): Promise<void> {
  const serviceLabel = labelOf(APPOINTMENT_SERVICES, data.typeService)
  const preferredDate = data.preferredDate ? fmtDateLong(data.preferredDate) : 'À définir avec le cabinet'
  const body = `
    <h1 style="margin:0 0 16px 0;font-size:22px;color:#071A2C;">Votre rendez-vous est enregistré</h1>
    <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Bonjour ${esc(data.firstName)},</p>
    <p style="margin:0 0 16px 0;font-size:14px;color:#17212B;line-height:1.7;">Nous avons bien reçu votre demande. Le cabinet vous recontactera sous 24 à 48 heures ouvrées pour confirmer la date et l’heure définitives.</p>
    <div style="padding:16px;background:#F8FAF9;border-left:3px solid #5A8F32;border-radius:6px;margin:20px 0;">
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Référence</div>
      <div style="font-size:18px;color:#071A2C;font-weight:700;letter-spacing:0.05em;margin-bottom:14px;">${esc(data.reference)}</div>
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Nature</div>
      <div style="font-size:13px;color:#17212B;font-weight:600;margin-bottom:14px;">${esc(serviceLabel)}</div>
      <div style="font-size:11px;color:#5D6872;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Date souhaitée</div>
      <div style="font-size:13px;color:#17212B;">${esc(preferredDate)}</div>
    </div>
    <p style="margin:20px 0 0 0;font-size:13px;color:#5D6872;line-height:1.7;">Le récapitulatif complet est joint en PDF. Conservez-le, il contient votre référence de dossier.</p>
    <p style="margin:24px 0 0 0;font-size:14px;color:#17212B;">Cordialement,<br /><strong>${site.name}</strong></p>
  `
  await getTransporter().sendMail({
    from: SMTP_FROM, to: data.email, replyTo: ADMIN_EMAIL,
    subject: `Votre demande de rendez-vous — ${data.reference}`,
    html: wrapHtml('Confirmation de rendez-vous', body),
    text: `Bonjour ${data.firstName},\n\nVotre demande de rendez-vous a été enregistrée.\n\nRéférence : ${data.reference}\nNature : ${serviceLabel}\nDate souhaitée : ${preferredDate}\n\n${site.name}`,
    attachments: [{ filename: `confirmation-rdv-${data.reference}.pdf`, content: data.pdfBuffer, contentType: 'application/pdf' }],
  })
}