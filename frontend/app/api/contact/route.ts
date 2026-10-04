// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

import { contactSchema } from '@/lib/schemas'
import {
  isMailConfigured,
  sendContactConfirmationToClient,
  sendContactNotificationToAdmin,
} from '@/lib/mail'
import type { CreateContactResponse } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  /* ---------- 1. Parsing ---------- */
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Requête invalide : le corps doit être un JSON valide.' },
      { status: 400 },
    )
  }

  /* ---------- 2. Honeypot ---------- */
  const honeypot = (payload as { website?: string } | null)?.website
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    /* On simule un succès pour ne pas alerter les robots */
    return NextResponse.json<CreateContactResponse>({
      ok: true,
      id: 'ignored',
      message: 'Votre message a bien été reçu.',
    })
  }

  /* ---------- 3. Validation ---------- */
  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return NextResponse.json(
      {
        error: 'Certains champs sont invalides.',
        details: fieldErrors,
      },
      { status: 422 },
    )
  }

  const data = parsed.data
  const id = randomUUID()
  const receivedAt = new Date()

  /* ---------- 4. Envoi des emails ---------- */
  if (!isMailConfigured()) {
    console.error(
      '[api/contact] Configuration SMTP manquante. Aucun email envoyé.',
    )
    return NextResponse.json(
      {
        error:
          'Le service d’envoi d’emails est momentanément indisponible. Réessayez plus tard ou contactez le cabinet par téléphone.',
      },
      { status: 503 },
    )
  }

  const emailData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    receivedAt,
  }

  const results = await Promise.allSettled([
    sendContactNotificationToAdmin(emailData),
    sendContactConfirmationToClient(emailData),
  ])

  const failures = results.filter((r) => r.status === 'rejected')
  if (failures.length === results.length) {
    console.error(
      '[api/contact] Échec de l’envoi de tous les emails :',
      failures.map((f) => (f as PromiseRejectedResult).reason),
    )
    return NextResponse.json(
      {
        error:
          'L’envoi du message a échoué. Vérifiez votre connexion et réessayez.',
      },
      { status: 502 },
    )
  }

  if (failures.length > 0) {
    console.warn(
      '[api/contact] Certains emails n’ont pas pu être envoyés :',
      failures.map((f) => (f as PromiseRejectedResult).reason),
    )
  }

  /* ---------- 5. Réponse ---------- */
  return NextResponse.json<CreateContactResponse>({
    ok: true,
    id,
    message: 'Votre message a bien été transmis au cabinet.',
  })
}