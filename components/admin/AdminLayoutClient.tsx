"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminPwaRegistration } from "./AdminPwa";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();

  // Login page doesn't need sidebar/header
  const isLoginPage = pathname === "/admin/login";

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
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
