// app/api/rdv/route.ts
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

import { appointmentSchema } from '@/lib/schemas'
import { generateAppointmentPdf } from '@/lib/pdf'
import {
  isMailConfigured,
  sendAppointmentConfirmationToClient,
  sendAppointmentNotificationToAdmin,
} from '@/lib/mail'
import type { CreateAppointmentResponse } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function buildReference(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i += 1)
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `CAMPAB-RDV-${y}${m}${d}-${suffix}`
}

export async function POST(request: Request) {
  console.log('[api/rdv] Nouvelle requête reçue')

  let payload: unknown
  try {
    payload = await request.json()
  } catch (error) {
    console.error('[api/rdv] Corps de requête invalide :', error)
    return NextResponse.json(
      { error: 'Requête invalide : le corps doit être un JSON valide.' },
      { status: 400 },
    )
  }

  /* Honeypot */
  const honey = (payload as { website?: string } | null)?.website
  if (typeof honey === 'string' && honey.trim().length > 0) {
    console.warn('[api/rdv] Honeypot déclenché, requête ignorée')
    return NextResponse.json(
      {
        ok: true,
        id: 'ignored',
        reference: 'CAMPAB-RDV-IGNORED',
        message: 'Votre demande a bien été reçue.',
      },
      { status: 200 },
    )
  }

  const parsed = appointmentSchema.safeParse(payload)
  if (!parsed.success) {
    console.warn(
      '[api/rdv] Validation échouée :',
      parsed.error.flatten().fieldErrors,
    )
    return NextResponse.json(
      {
        error: 'Certains champs sont invalides.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    )
  }

  const data = parsed.data
  const createdAt = new Date()
  const id = randomUUID()
  const reference = buildReference(createdAt)

  console.log('[api/rdv] Données validées, génération du PDF', {
    reference,
    service: data.typeService,
    urgence: data.urgence,
  })

  /* Génération du PDF */
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await generateAppointmentPdf({
      reference,
      typeService: data.typeService,
      urgence: data.urgence,
      description: data.description,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      organisation: data.organisation || null,
      country: data.country,
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      createdAt,
    })
    console.log('[api/rdv] PDF généré avec succès')
  } catch (error) {
    console.error('[api/rdv] Échec de génération du PDF :', error)
    return NextResponse.json(
      {
        error:
          'La confirmation n’a pas pu être générée. Réessayez dans un instant.',
      },
      { status: 500 },
    )
  }

  /* Vérification de la configuration email */
  if (!isMailConfigured()) {
    console.error(
      '[api/rdv] Configuration SMTP manquante. Vérifiez les variables EMAIL_USER et EMAIL_PASS sur Netlify.',
    )
    return NextResponse.json<CreateAppointmentResponse>({
      ok: true,
      id,
      reference,
      message:
        'Votre demande est enregistrée. La confirmation par email est momentanément indisponible, mais votre PDF est prêt.',
      pdfBase64: pdfBuffer.toString('base64'),
    })
  }

  const emailData = {
    reference,
    typeService: data.typeService,
    urgence: data.urgence,
    description: data.description,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    organisation: data.organisation || null,
    country: data.country,
    preferredDate: data.preferredDate || null,
    preferredTime: data.preferredTime || null,
    createdAt,
    pdfBuffer,
  }

  console.log('[api/rdv] Envoi des emails...')
  const results = await Promise.allSettled([
    sendAppointmentNotificationToAdmin(emailData),
    sendAppointmentConfirmationToClient(emailData),
  ])

  results.forEach((result, index) => {
    const label = index === 0 ? 'notification admin' : 'confirmation client'
    if (result.status === 'fulfilled') {
      console.log(`[api/rdv] Email ${label} envoyé avec succès`)
    } else {
      console.error(`[api/rdv] Échec de l'email ${label} :`, result.reason)
    }
  })

  const failures = results.filter((r) => r.status === 'rejected')
  if (failures.length > 0) {
    console.warn(
      `[api/rdv] ${failures.length} email(s) n'ont pas pu être envoyés.`,
    )
  }

  return NextResponse.json<CreateAppointmentResponse>({
    ok: true,
    id,
    reference,
    message:
      'Votre demande de rendez-vous a bien été enregistrée. Un email de confirmation vous a été envoyé.',
    pdfBase64: pdfBuffer.toString('base64'),
  })
}