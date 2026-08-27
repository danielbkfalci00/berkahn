"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminPwaRegistration } from "./AdminPwa";
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
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
