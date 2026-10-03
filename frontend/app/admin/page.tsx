"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Mail, FileText, Briefcase, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { api } from "@/lib/api";
import StatCard from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Appointment, Article, PortfolioItem, ContactMessage } from "@/types";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Appointment[]>("/appointments", true).catch(() => []),
      api.get<ContactMessage[]>("/contact", true).catch(() => []),
      api.get<Article[]>("/articles/admin/all", true).catch(() => []),
      api.get<PortfolioItem[]>("/portfolio").catch(() => []),
    ])
      .then(([a, m, ar, p]) => {
        setAppointments(a);
        setMessages(m);
        setArticles(ar);
        setPortfolio(p);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = appointments.filter((a) => a.status === "pending").length;
  const unread = messages.filter((m) => !m.read).length;
  const recent = appointments.slice(0, 5);

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PageHeader
        title="Tableau de bord"
        subtitle="Aperçu de l'activité du cabinet en temps réel."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="RDV en attente" value={pending} icon={CalendarDays} accent="olive" />
        <StatCard label="Messages non lus" value={unread} icon={Mail} accent="navy" />
        <StatCard
          label="Articles publiés"
          value={articles.filter((a) => a.published).length}
          icon={FileText}
          accent="sky"
        />
        <StatCard label="Portfolio" value={portfolio.length} icon={Briefcase} accent="navy" />
      </div>

      <div className="bg-white border border-line rounded-card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-navy-deep">Derniers rendez-vous</h2>
          <Link
            href="/admin/appointments"
            className="text-sm text-olive hover:text-olive-dark inline-flex items-center gap-1 transition-colors"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-ink-soft text-sm">Chargement...</p>
        ) : recent.length === 0 ? (
          <p className="text-ink-soft text-sm">Aucun rendez-vous pour le moment.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 lg:mx-0">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="border-b border-line text-left text-[11px] uppercase text-ink-soft tracking-wider">
                <tr>
                  <th className="pb-3 pr-4 pl-6 lg:pl-0">Référence</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Objet</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-6 lg:pr-0">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id} className="border-b border-line/50 last:border-0">
                    <td className="py-3 pr-4 pl-6 lg:pl-0 font-mono text-xs text-navy-deep">
                      {a.reference}
                    </td>
                    <td className="py-3 pr-4">{a.firstName} {a.lastName}</td>
                    <td className="py-3 pr-4 text-ink-soft max-w-[200px] truncate">{a.subject}</td>
                    <td className="py-3 pr-4 text-ink-soft text-xs">
                      {format(new Date(a.createdAt), "dd MMM yyyy", { locale: fr })}
                    </td>
                    <td className="py-3 pr-6 lg:pr-0">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}