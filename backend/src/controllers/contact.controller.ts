// backend/src/controllers/contact.controller.ts
import { Request, Response, NextFunction } from "express";
import Contact from "../models/Contact.js";
import { sendContactNotification } from "../lib/mailer.js";

export async function createContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const contact = await Contact.create(req.body);
    sendContactNotification(contact).catch(console.error);
    res.status(201).json({ success: true, id: contact._id });
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function listContacts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function markContactRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) {
      res.status(404).json({ error: "Contact introuvable" });
      return;
    }
    res.json(contact);
    return;
  } catch (error) {
    next(error);
    return;
  }
}

export async function deleteContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
    return;
  } catch (error) {
    next(error);
    return;
  }
}