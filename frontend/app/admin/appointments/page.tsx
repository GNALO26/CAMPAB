"use client";
import { useEffect, useState } from "react";
import { CalendarDays, Download, Filter, Trash2, Loader2, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { api, API_URL, getToken } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import type { Appointment, AppointmentStatus } from "@/types";

const STATUSES: { value: AppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmés" },
  { value: "cancelled", label: "Annulés" },
  { value: "done", label: "Terminés" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | "">("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs = filter ? `?status=${filter}` : "";
      const data = await api.get<Appointment[]>(`/appointments${qs}`, true);
      setAppointments(data);
    } catch {
      toast.error("Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function changeStatus(id: string, status: AppointmentStatus) {
    setBusy(id);
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success("Statut mis à jour");
      await load();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce rendez-vous ?")) return;
    setBusy(id);
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Rendez-vous supprimé");
      await load();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setBusy(null);
    }
  }

  async function downloadPDF(id: string, reference: string) {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `confirmation-${reference}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      toast.error("Erreur téléchargement PDF");
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader
        title="Rendez-vous"
        subtitle={`${appointments.length} rendez-vous ${filter ? "filtré(s)" : "au total"}`}
        action={
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-ink-soft" />
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as AppointmentStatus | "")}
                className="appearance-none px-4 py-2 pr-10 rounded-md border border-line bg-white text-sm focus:border-olive outline-none transition"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft"
              />
            </div>
          </div>
        }
      />

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="animate-spin mx-auto text-navy-deep" size={28} />
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Aucun rendez-vous"
            description="Les nouvelles demandes de rendez-vous apparaîtront ici."
          />
        ) : (
          <div className="divide-y divide-line">
            {appointments.map((a) => {
              const isOpen = expanded === a.id;
              return (
                <div key={a.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : a.id)}
                    className="w-full text-left px-6 py-4 hover:bg-sky/30 transition-colors flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-navy-deep">{a.reference}</span>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-2 font-medium text-ink">
                        {a.firstName} {a.lastName}
                      </p>
                      <p className="text-sm text-ink-soft truncate max-w-md">{a.subject}</p>
                    </div>
                    <div className="text-right text-xs text-ink-soft shrink-0">
                      {format(new Date(a.createdAt), "dd MMM yyyy '·' HH:mm", { locale: fr })}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 bg-sky/20 border-t border-line">
                      <div className="grid md:grid-cols-2 gap-6 pt-6">
                        <div className="space-y-3 text-sm">
                          <p>
                            <span className="text-ink-soft">Email : </span>
                            <a href={`mailto:${a.email}`} className="text-olive hover:underline">
                              {a.email}
                            </a>
                          </p>
                          <p>
                            <span className="text-ink-soft">Téléphone : </span>
                            <a href={`tel:${a.phone}`} className="text-olive hover:underline">
                              {a.phone}
                            </a>
                          </p>
                          {a.preferredDate && (
                            <p>
                              <span className="text-ink-soft">Date souhaitée : </span>
                              {format(new Date(a.preferredDate), "dd MMMM yyyy", { locale: fr })}
                            </p>
                          )}
                        </div>
                        {a.message && (
                          <div>
                            <p className="text-[11px] uppercase tracking-wider text-ink-soft mb-2">
                              Message
                            </p>
                            <p className="text-sm bg-white p-4 rounded-md border-l-2 border-olive whitespace-pre-line">
                              {a.message}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-6">
                        {a.status !== "confirmed" && (
                          <button
                            disabled={busy === a.id}
                            onClick={() => changeStatus(a.id, "confirmed")}
                            className="px-4 py-2 text-xs bg-olive text-white rounded-full hover:bg-olive-dark transition disabled:opacity-50"
                          >
                            Confirmer
                          </button>
                        )}
                        {a.status !== "done" && (
                          <button
                            disabled={busy === a.id}
                            onClick={() => changeStatus(a.id, "done")}
                            className="px-4 py-2 text-xs bg-navy-deep text-white rounded-full hover:bg-navy-mid transition disabled:opacity-50"
                          >
                            Marquer terminé
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button
                            disabled={busy === a.id}
                            onClick={() => changeStatus(a.id, "cancelled")}
                            className="px-4 py-2 text-xs border border-line rounded-full hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          onClick={() => downloadPDF(a.id, a.reference)}
                          className="px-4 py-2 text-xs border border-line rounded-full hover:bg-sky transition inline-flex items-center gap-2"
                        >
                          <Download size={14} /> PDF
                        </button>
                        <button
                          disabled={busy === a.id}
                          onClick={() => remove(a.id)}
                          className="px-4 py-2 text-xs border border-line rounded-full hover:bg-red-50 hover:text-red-700 transition inline-flex items-center gap-2 ml-auto disabled:opacity-50"
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}