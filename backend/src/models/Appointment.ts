// backend/src/models/Appointment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message?: string;
  preferredDate?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    reference: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 5000 },
    preferredDate: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);