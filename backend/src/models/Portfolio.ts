// backend/src/models/Portfolio.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolioItem extends Document {
  title: string;
  description: string;
  category: "these" | "projet" | "publication" | "distinction";
  link?: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
}

const portfolioSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ["these", "projet", "publication", "distinction"],
      required: true,
    },
    link: { type: String, default: null },
    imageUrl: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPortfolioItem>("Portfolio", portfolioSchema);