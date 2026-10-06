// backend/src/models/Contact.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IContact extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  /** Déprécié : conservé pour compatibilité des anciens documents */
  name?: string | null;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
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
    name: {
      type: String,
      trim: true,
      maxlength: 160,
      default: null,
      // Plus requis : le frontend envoie firstName + lastName
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      maxlength: 30,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id !== undefined) {
          ret.id = String(ret._id);
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        if (ret._id !== undefined) {
          ret.id = String(ret._id);
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IContact>("Contact", contactSchema);