// backend/src/models/Article.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "vulgarisation" | "conseils" | "ethique" | "actualite";
  tags: string[];
  published: boolean;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["vulgarisation", "conseils", "ethique", "actualite"],
      required: true,
    },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: false },
    coverImage: { type: String, default: null },
  },
  { timestamps: true }
);

// Génération automatique du slug
articleSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

export default mongoose.model<IArticle>("Article", articleSchema);