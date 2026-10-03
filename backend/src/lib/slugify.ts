import slugifyLib from "slugify";

export function makeSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: "fr" });
}

export async function ensureUniqueSlug(
  base: string,
  checker: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = makeSlug(base);
  let slug = baseSlug;
  let i = 2;
  while (await checker(slug)) {
    slug = `${baseSlug}-${i}`;
    i++;
  }
  return slug;
}
