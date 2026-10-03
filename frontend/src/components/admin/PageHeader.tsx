import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl text-navy-deep">{title}</h1>
        {subtitle && <p className="text-ink-soft mt-2 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}