// backend/src/models/Appointment.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type AppointmentService = "consultation" | "mediation" | "arbitrage";

export type AppointmentUrgency = "normale" | "elevee" | "critique";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "done";

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  reference: string;
  typeService: AppointmentService;
  urgence: AppointmentUrgency;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation?: string | null;
  country: string;
  preferredDate?: Date | null;
  preferredTime?: string | null;
  status: AppointmentStatus;
  subject?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    typeService: {
      type: String,
      enum: ["consultation", "mediation", "arbitrage"],
      required: true,
    },
    urgence: {
      type: String,
      enum: ["normale", "elevee", "critique"],
      required: true,
      default: "normale",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    organisation: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTime: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "done"],
      default: "pending",
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* Index composé pour accélérer la recherche des créneaux occupés */
appointmentSchema.index({ preferredDate: 1, preferredTime: 1 });

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);