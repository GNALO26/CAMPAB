// backend/src/lib/appointment-slots.ts

/**
 * Gestion des créneaux de rendez-vous.
 * Horaires d'ouverture : Lundi à vendredi, 08h00 à 13h30 et 15h00 à 20h00.
 * Samedi et dimanche : fermé.
 * Écart minimum entre deux rendez-vous : 30 minutes.
 */

export const OPENING_HOURS = {
  // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  0: [], // dimanche fermé
  1: [
    { start: '08:00', end: '13:30' },
    { start: '15:00', end: '20:00' },
  ],
  2: [
    { start: '08:00', end: '13:30' },
    { start: '15:00', end: '20:00' },
  ],
  3: [
    { start: '08:00', end: '13:30' },
    { start: '15:00', end: '20:00' },
  ],
  4: [
    { start: '08:00', end: '13:30' },
    { start: '15:00', end: '20:00' },
  ],
  5: [
    { start: '08:00', end: '13:30' },
    { start: '15:00', end: '20:00' },
  ],
  6: [], // samedi fermé
} as const

export const SLOT_DURATION_MINUTES = 30
export const MIN_GAP_MINUTES = 30

/**
 * Retourne true si la date fournie est un jour ouvré.
 */
export function isWorkingDay(date: Date): boolean {
  const day = date.getDay()
  return OPENING_HOURS[day as keyof typeof OPENING_HOURS].length > 0
}

/**
 * Convertit 'HH:MM' en minutes depuis minuit.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Convertit des minutes depuis minuit en 'HH:MM'.
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Génère tous les créneaux théoriques d'une journée (bornes incluses).
 */
export function generateDailySlots(date: Date): string[] {
  const day = date.getDay()
  const ranges = OPENING_HOURS[day as keyof typeof OPENING_HOURS]
  const slots: string[] = []

  for (const range of ranges) {
    const startMin = timeToMinutes(range.start)
    const endMin = timeToMinutes(range.end)

    for (let m = startMin; m + SLOT_DURATION_MINUTES <= endMin; m += SLOT_DURATION_MINUTES) {
      slots.push(minutesToTime(m))
    }
  }

  return slots
}

/**
 * Vérifie qu'une heure donnée correspond à un créneau valide (dans les horaires).
 */
export function isValidTimeSlot(date: Date, time: string): boolean {
  const slots = generateDailySlots(date)
  return slots.includes(time)
}

/**
 * Filtre les créneaux pour ne garder que ceux qui respectent
 * l'écart minimum avec les rendez-vous existants.
 */
export function filterAvailableSlots(
  allSlots: string[],
  existingAppointments: Array<{ time: string }>,
): string[] {
  const bookedMinutes = existingAppointments.map((a) => timeToMinutes(a.time))

  return allSlots.filter((slot) => {
    const slotMin = timeToMinutes(slot)
    return bookedMinutes.every(
      (booked) => Math.abs(booked - slotMin) >= MIN_GAP_MINUTES,
    )
  })
}

/**
 * Vérifie qu'une heure respecte l'écart minimum avec les rendez-vous existants.
 */
export function hasMinGap(
  time: string,
  existingAppointments: Array<{ time: string }>,
): boolean {
  const targetMin = timeToMinutes(time)
  return existingAppointments.every(
    (a) => Math.abs(timeToMinutes(a.time) - targetMin) >= MIN_GAP_MINUTES,
  )
}