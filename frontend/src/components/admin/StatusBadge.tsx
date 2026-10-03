import type { AppointmentStatus } from "@/types";

const styles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-olive/10 text-olive-dark border-olive/30",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  done: "bg-navy-deep/10 text-navy-deep border-navy-deep/20",
};

const labels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  done: "Terminé",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full border uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}