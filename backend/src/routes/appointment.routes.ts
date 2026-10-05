// backend/src/routes/appointment.routes.ts
import { Router } from 'express'
import {
  createAppointment,
  listAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  downloadAppointmentPDF,
  getAvailableSlots,
} from '../controllers/appointment.controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

// Endpoint public : créneaux disponibles pour une date
router.get('/available-slots', getAvailableSlots)

// Création d'un rendez-vous (public)
router.post('/', createAppointment)

// Routes admin
router.get('/', requireAuth, listAppointments)
router.patch('/:id/status', requireAuth, updateAppointmentStatus)
router.delete('/:id', requireAuth, deleteAppointment)
router.get('/:id/pdf', requireAuth, downloadAppointmentPDF)

export default router