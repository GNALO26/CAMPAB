// backend/src/models/Portfolio.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type PortfolioCategory =
  | "these"
  | "projet"
  | "publication"
  | "distinction";

export interface IPortfolio extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  imageUrl?: string | null;
  link?: string | null;
  category: PortfolioCategory;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      enum: ["these", "projet", "publication", "distinction"],
      required: true,
      default: "projet",
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
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

/* Liste triée par ordre croissant, puis par date */
portfolioSchema.index({ order: 1, createdAt: -1 });

/* Filtre par catégorie */
portfolioSchema.index({ category: 1 });

export default mongoose.model<IPortfolio>("Portfolio", portfolioSchema);