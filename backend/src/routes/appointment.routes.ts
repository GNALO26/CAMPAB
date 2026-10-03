import { Router } from "express";
import {
  createAppointment, listAppointments, updateAppointmentStatus,
  deleteAppointment, downloadAppointmentPDF,
} from "../controllers/appointment.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.post("/", createAppointment);
router.get("/", requireAuth, listAppointments);
router.patch("/:id/status", requireAuth, updateAppointmentStatus);
router.delete("/:id", requireAuth, deleteAppointment);
router.get("/:id/pdf", requireAuth, downloadAppointmentPDF);
export default router;
