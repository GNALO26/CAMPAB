// app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/appointments", label: "Rendez-vous", icon: Calendar },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* Marque le <body> pour que globals.css masque le footer public
     et les widgets flottants (WhatsApp, back-top). */
  useEffect(() => {
    document.body.setAttribute("data-admin", "true");
    return () => {
      document.body.removeAttribute("data-admin");
    };
  }, []);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedAdminLayout pathname={pathname}>{children}</ProtectedAdminLayout>
  );
}

function ProtectedAdminLayout({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const { admin, loading, logout } = useAuth();

  if (loading || !admin) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - var(--nav-h))",
          marginTop: "var(--nav-h)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          background: "var(--bg-alt)",
          color: "var(--text-500)",
          fontSize: "14px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0 }}>Chargement de l&apos;espace admin...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    /* Ancrage sous la navbar : occupe tout l'espace restant, sans scroll global */
    <div
      style={{
        position: "fixed",
        top: "var(--nav-h)",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        background: "var(--bg-alt)",
        zIndex: 1,
      }}
    >
      {/* Sidebar fixe */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          height: "100%",
          background: "var(--navy-deep)",
          color: "var(--on-dark-700)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "8px",
            letterSpacing: "0.05em",
          }}
        >
          CAMPAB
        </div>
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "32px",
          }}
        >
          Administration
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                  background: isActive
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {admin.email}
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "6px",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              fontSize: "13px",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={14} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Zone de contenu : seule à défiler */}
      <main
        style={{
          flex: 1,
          height: "100%",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}