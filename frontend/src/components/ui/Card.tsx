import { ReactNode } from "react";

type Variant = "default" | "navy" | "olive" | "sky";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: "bg-white border-line",
  navy: "bg-navy-deep border-navy-deep text-white",
  olive: "bg-olive border-olive text-white",
  sky: "bg-sky/60 border-sky",
};

export default function Card({
  children,
  className = "",
  hover = true,
  variant = "default",
}: Props) {
  const hoverCls =
    variant === "default"
      ? "hover:-translate-y-1 hover:shadow-hover hover:border-olive/40"
      : "hover:-translate-y-1 hover:shadow-hover";

  return (
    <div
      className={`border rounded-card p-6 sm:p-8 transition-all duration-300 ${variants[variant]} ${
        hover ? hoverCls : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}