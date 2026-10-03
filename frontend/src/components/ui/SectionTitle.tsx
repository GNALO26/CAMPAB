interface Props {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  label, title, subtitle, align = "center", light = false,
}: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {label && (
        <span className={`inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4 ${light ? "text-olive-light" : "text-olive"}`}>
          {label}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl leading-tight font-semibold ${light ? "text-white" : "text-navy-deep"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base sm:text-lg leading-relaxed ${light ? "text-sky" : "text-ink-soft"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
