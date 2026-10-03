// app/api/rdv/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Types
interface RdvData {
  typeService: string
  urgence: string
  description: string
  prenom: string
  nom: string
  email: string
  telephone: string
  organisation: string
  pays: string
  date: string
  heure: string
}

// Labels pour les emails
const serviceLabels: Record<string, string> = {
  consultation: 'Consultation juridique',
  arbitrage: 'Arbitrage OHADA',
  mediation: 'Médiation',
}

const urgenceLabels: Record<string, string> = {
  normale: 'Normale',
  elevee: 'Élevée',
  critique: 'Critique',
}

export async function POST(request: Request) {
  try {
    const body: RdvData = await request.json()

    // Vérification des variables d'environnement
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Variables EMAIL_USER ou EMAIL_PASS manquantes')
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    // Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const serviceLabel = serviceLabels[body.typeService] || body.typeService
    const urgenceLabel = urgenceLabels[body.urgence] || body.urgence

    // ============================================================
    // EMAIL 1 : Confirmation au client
    // ============================================================
    const clientMail = {
      from: `"CAMPAB" <${process.env.EMAIL_USER}>`,
      to: body.email,
      replyTo: process.env.EMAIL_USER,
      subject: 'Confirmation de votre rendez-vous - CAMPAB',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- En-tête -->
            <tr>
              <td style="background: linear-gradient(135deg, #0D2B5E 0%, #1A3A7A 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">CAMPAB</h1>
                <p style="color: #D4A017; margin: 8px 0 0; font-size: 13px; letter-spacing: 1px;">
                  Cabinet d'Arbitrage et de Médiation
                </p>
                <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 11px;">
                  Prudencia Abode Badou · Cotonou, Bénin
                </p>
              </td>
            </tr>

            <!-- Corps -->
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #0D2B5E; margin: 0 0 20px; font-size: 22px;">
                  ✅ Rendez-vous confirmé
                </h2>
                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Bonjour <strong>${body.prenom} ${body.nom}</strong>,
                </p>
                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Votre demande de rendez-vous a bien été enregistrée. Voici le récapitulatif :
                </p>

                <!-- Tableau récapitulatif -->
                <table role="presentation" style="width: 100%; margin: 25px 0; border-collapse: collapse; background-color: #F8FAFC; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 12px 20px; color: #666; font-size: 13px; border-bottom: 1px solid #E2E8F0;">Service</td>
                    <td style="padding: 12px 20px; color: #0D2B5E; font-weight: bold; font-size: 13px; border-bottom: 1px solid #E2E8F0;">${serviceLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #666; font-size: 13px; border-bottom: 1px solid #E2E8F0;">Date</td>
                    <td style="padding: 12px 20px; color: #0D2B5E; font-weight: bold; font-size: 13px; border-bottom: 1px solid #E2E8F0;">${body.date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #666; font-size: 13px; border-bottom: 1px solid #E2E8F0;">Heure</td>
                    <td style="padding: 12px 20px; color: #0D2B5E; font-weight: bold; font-size: 13px; border-bottom: 1px solid #E2E8F0;">${body.heure}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #666; font-size: 13px; border-bottom: 1px solid #E2E8F0;">Urgence</td>
                    <td style="padding: 12px 20px; color: #0D2B5E; font-weight: bold; font-size: 13px; border-bottom: 1px solid #E2E8F0;">${urgenceLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px; color: #666; font-size: 13px;">Téléphone</td>
                    <td style="padding: 12px 20px; color: #0D2B5E; font-weight: bold; font-size: 13px;">${body.telephone}</td>
                  </tr>
                </table>

                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Nous vous contacterons dans les plus brefs délais pour confirmer le créneau exact et vous communiquer les modalités de la consultation.
                </p>

                <div style="background-color: #FDF8F0; border-left: 4px solid #D4A017; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                    <strong style="color: #0D2B5E;">📌 Note importante :</strong><br>
                    Le cabinet est ouvert du lundi au vendredi, de 08h00 à 13h30 et de 15h00 à 20h00.
                    Le samedi et le dimanche, le cabinet est fermé.
                  </p>
                </div>

                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                  Merci de votre confiance.
                </p>
                <p style="color: #333; font-size: 15px; line-height: 1.6; margin-top: 25px;">
                  Cordialement,<br>
                  <strong style="color: #0D2B5E;">Me Prudencia Sètondji ABODE BADOU</strong><br>
                  <span style="color: #666; font-size: 13px;">Directrice du Cabinet CAMPAB</span>
                </p>
              </td>
            </tr>

            <!-- Pied de page -->
            <tr>
              <td style="background-color: #0D2B5E; padding: 25px 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px; font-size: 13px;">
                  📞 <a href="tel:+2290197762936" style="color: #D4A017; text-decoration: none;">01 97 76 29 36</a>
                </p>
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px; font-size: 13px;">
                  📧 <a href="mailto:p.abodecabinet@gmail.com" style="color: #D4A017; text-decoration: none;">p.abodecabinet@gmail.com</a>
                </p>
                <p style="color: rgba(255,255,255,0.6); margin: 15px 0 0; font-size: 11px;">
                  © ${new Date().getFullYear()} CAMPAB · Tous droits réservés
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }

    // ============================================================
    // EMAIL 2 : Notification à la juriste (CAMPAB)
    // ============================================================
    const adminMail = {
      from: `"CAMPAB Site" <${process.env.EMAIL_USER}>`,
      to: 'p.abodecabinet@gmail.com',
      replyTo: body.email,
      subject: `🔔 Nouveau rendez-vous : ${body.prenom} ${body.nom} (${serviceLabel})`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background-color: #0D2B5E; padding: 20px 30px;">
                <h1 style="color: #D4A017; margin: 0; font-size: 18px;">🔔 Nouvelle demande de rendez-vous</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #0D2B5E; margin: 0 0 20px;">Détails du client</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 40%;">Nom complet</td><td style="padding: 8px 0; font-weight: bold;">${body.prenom} ${body.nom}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${body.email}" style="color: #2563EB;">${body.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Téléphone</td><td style="padding: 8px 0;"><a href="tel:${body.telephone}" style="color: #2563EB;">${body.telephone}</a></td></tr>
                  ${body.organisation ? `<tr><td style="padding: 8px 0; color: #666;">Organisation</td><td style="padding: 8px 0;">${body.organisation}</td></tr>` : ''}
                  <tr><td style="padding: 8px 0; color: #666;">Pays</td><td style="padding: 8px 0;">${body.pays}</td></tr>
                </table>

                <h2 style="color: #0D2B5E; margin: 30px 0 20px;">Détails de la demande</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 40%;">Service</td><td style="padding: 8px 0; font-weight: bold;">${serviceLabel}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Urgence</td><td style="padding: 8px 0; font-weight: bold;">${urgenceLabel}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Date souhaitée</td><td style="padding: 8px 0;">${body.date}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Heure souhaitée</td><td style="padding: 8px 0;">${body.heure}</td></tr>
                </table>

                <h2 style="color: #0D2B5E; margin: 30px 0 15px;">Description du litige</h2>
                <div style="background-color: #F8FAFC; border-left: 4px solid #2563EB; padding: 15px 20px; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${body.description}</p>
                </div>

                <div style="margin-top: 30px; padding: 15px 20px; background-color: #FDF8F0; border-radius: 4px;">
                  <p style="margin: 0; color: #666; font-size: 13px;">
                    💡 <strong>Action recommandée :</strong> Contacter le client par téléphone ou email dans les 24 à 48 heures pour confirmer le créneau.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #0D2B5E; padding: 15px 30px; text-align: center;">
                <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px;">
                  Notification automatique - Site CAMPAB
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }

    // Envoi des deux emails en parallèle
    await Promise.all([
      transporter.sendMail(clientMail),
      transporter.sendMail(adminMail),
    ])

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous enregistré et emails envoyés'
    })
  } catch (error) {
    console.error('Erreur API RDV:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'envoi des emails',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Configuration pour Next.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'