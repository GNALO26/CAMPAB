import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "navy" | "olive" | "sky";
}

export default function StatCard({ label, value, icon: Icon, accent = "navy" }: Props) {
  const bg = {
    navy: "bg-navy-deep text-white",
    olive: "bg-olive text-white",
    sky: "bg-sky text-navy-deep",
  }[accent];

  return (
    <div className="bg-white border border-line rounded-card p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-ink-soft truncate">{label}</p>
        <p className="font-serif text-3xl text-navy-deep font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
}