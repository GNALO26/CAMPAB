"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const { admin, loading } = useAuth({ redirectIfNotAuth: !isLoginPage });

  // Redirige un admin déjà connecté qui arrive sur /admin/login
  useEffect(() => {
    if (!loading && admin && isLoginPage) {
      router.replace("/admin");
    }
  }, [admin, loading, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="animate-spin text-navy-deep" size={32} />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar admin={admin} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}