"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminPwaRegistration } from "./AdminPwa";
import { FeedbackRapido } from "./feedback/FeedbackRapido";
import type { AdminMembership } from "@/types/analytics";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  membership: AdminMembership | null;
}

export function AdminLayoutClient({ children, membership }: AdminLayoutClientProps) {
  const pathname = usePathname();

  // Login page doesn't need sidebar/header
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/definir-senha";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-neutral-50">
      <AdminPwaRegistration />
      <AdminSidebar membership={membership} />
      <div className="lg:pl-64">
        <AdminHeader membership={membership} />
        {/* Espaço de rolagem para os últimos controles não ficarem sob o feedback flutuante. */}
        <main className="px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-40 sm:pt-6 lg:pb-24 print:pb-0">
          {children}
        </main>
      </div>
      {/* Só com membro resolvido: sem sessão a action recusaria de qualquer jeito. */}
      {membership && <FeedbackRapido />}
    </div>
  );
}
