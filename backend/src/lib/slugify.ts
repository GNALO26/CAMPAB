// backend/src/lib/slugify.ts
import slugifyLib from "slugify";

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  });
}