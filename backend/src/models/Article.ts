// backend/src/models/Article.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import slugify from "slugify";

export type ArticleCategory =
  | "vulgarisation"
  | "conseils"
  | "ethique"
  | "actualite";

export interface IArticle extends Document {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: ArticleCategory;
  tags: string[];
  published: boolean;
  views: number;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      enum: ["vulgarisation", "conseils", "ethique", "actualite"],
      required: true,
      default: "vulgarisation",
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
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

/* ============================================================
   Hooks
   ============================================================ */

/* Génère le slug depuis le titre si absent ou vide */
articleSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "fr",
      trim: true,
    });
  }
  next();
});

/* Positionne publishedAt à la première publication */
articleSchema.pre("save", function (next) {
  if (this.isModified("published")) {
    if (this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    } else if (!this.published) {
      this.publishedAt = null;
    }
  }
  next();
});

/* ============================================================
   Index
   ============================================================ */

/* Liste publique triée par date de publication */
articleSchema.index({ published: 1, publishedAt: -1 });

/* Recherche textuelle */
articleSchema.index({
  title: "text",
  excerpt: "text",
  tags: "text",
});

export default mongoose.model<IArticle>("Article", articleSchema);