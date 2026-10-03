"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Briefcase,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import type { Admin } from "@/types";

const menu = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Rendez-vous", icon: CalendarDays },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar({ admin }: { admin: Admin }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-navy-deep text-white flex flex-col sticky top-0 h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="CAMPAB"
            width={40}
            height={40}
            className="h-10 w-auto bg-white rounded-full p-1"
          />
          <div className="leading-tight">
            <p className="font-serif text-base font-semibold">Admin</p>
            <p className="text-[10px] tracking-widest uppercase text-olive-light">
              Cabinet CAMPAB
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active
                  ? "bg-olive text-white"
                  : "text-sky/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sky/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink size={18} />
          <span>Voir le site</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sky/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>

        <div className="px-3 py-3 mt-3 bg-white/5 rounded-md">
          <p className="text-xs text-sky/50">Connecté</p>
          <p className="text-sm text-white truncate">{admin.email}</p>
        </div>
      </div>
    </aside>
  );
}