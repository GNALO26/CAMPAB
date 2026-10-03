"use client";
import { useEffect, useState } from "react";
import { Mail, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { api } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import type { ContactMessage } from "@/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<ContactMessage[]>("/contact", true);
      setMessages(data);
    } catch {
      toast.error("Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    setBusy(id);
    try {
      await api.patch(`/contact/${id}/read`, {});
      await load();
    } catch {
      toast.error("Erreur");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    setBusy(id);
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Message supprimé");
      await load();
    } catch {
      toast.error("Erreur");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader
        title="Messages de contact"
        subtitle={`${messages.length} message(s) · ${messages.filter((m) => !m.read).length} non lu(s)`}
      />

      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="animate-spin mx-auto text-navy-deep" size={28} />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-line rounded-card">
          <EmptyState icon={Mail} title="Aucun message" description="Les messages du formulaire de contact s'afficheront ici." />
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white border rounded-card p-6 transition-all ${
                m.read ? "border-line opacity-80" : "border-olive/40 shadow-soft"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-medium text-ink">{m.name}</p>
                    {!m.read && (
                      <span className="text-[10px] uppercase tracking-wider bg-olive text-white px-2 py-0.5 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    <a href={`mailto:${m.email}`} className="hover:text-olive">{m.email}</a>
                    {m.phone && <> · <a href={`tel:${m.phone}`} className="hover:text-olive">{m.phone}</a></>}
                  </p>
                  <p className="text-sm text-navy-deep mt-3 font-medium">{m.subject}</p>
                  <p className="text-sm text-ink-soft mt-2 whitespace-pre-line">{m.message}</p>
                  <p className="text-xs text-ink-soft mt-3">
                    Reçu le {format(new Date(m.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!m.read && (
                    <button
                      disabled={busy === m.id}
                      onClick={() => markRead(m.id)}
                      title="Marquer comme lu"
                      className="p-2 rounded-md border border-line hover:bg-olive hover:text-white transition disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    disabled={busy === m.id}
                    onClick={() => remove(m.id)}
                    title="Supprimer"
                    className="p-2 rounded-md border border-line hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}