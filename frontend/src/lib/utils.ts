export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const categoryLabels: Record<string, string> = {
  vulgarisation: "Vulgarisation",
  conseils: "Conseils pratiques",
  ethique: "Éthique & Valeurs",
  actualite: "Actualité juridique",
  these: "Thèse",
  projet: "Projet",
  publication: "Publication",
  distinction: "Distinction",
};

export const categoryColors: Record<string, string> = {
  vulgarisation: "bg-sky text-navy-deep",
  conseils: "bg-olive/15 text-olive-dark",
  ethique: "bg-navy-deep/10 text-navy-deep",
  actualite: "bg-amber-100 text-amber-800",
};