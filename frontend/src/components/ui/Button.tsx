import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "olive";
type Size = "sm" | "md" | "lg";

interface Props {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

const styles: Record<Variant, string> = {
  primary: "bg-navy-deep text-white hover:bg-olive shadow-card hover:shadow-hover",
  olive: "bg-olive text-white hover:bg-olive-dark shadow-card hover:shadow-hover",
  outline: "border border-navy-deep text-navy-deep hover:bg-navy-deep hover:text-white",
  ghost: "text-navy-deep hover:text-olive",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  href, children, variant = "primary", size = "md",
  className = "", type = "button", onClick, disabled,
}: Props) {
  const cls = `inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all duration-300 ${styles[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`;

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
