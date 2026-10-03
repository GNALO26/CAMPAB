import { Router } from "express";
import { createContact, listContacts, markContactRead, deleteContact } from "../controllers/contact.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();
router.post("/", createContact);
router.get("/", requireAuth, listContacts);
router.patch("/:id/read", requireAuth, markContactRead);
router.delete("/:id", requireAuth, deleteContact);
export default router;
