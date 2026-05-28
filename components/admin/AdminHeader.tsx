"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/posts/new": "Novo Post",
  "/admin/apresentacoes": "Apresentações",
  "/admin/apresentacoes/new": "Nova Apresentação",
  "/admin/propostas": "Propostas",
  "/admin/propostas/new": "Nova Proposta",
  "/admin/configuracoes": "Configurações",
};

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Check for edit pages
  if (pathname.match(/\/admin\/posts\/[^/]+$/)) {
    return "Editar Post";
  }
  if (pathname.match(/\/admin\/apresentacoes\/[^/]+$/)) {
    return "Editar Apresentação";
  }
  if (pathname.match(/\/admin\/propostas\/[^/]+$/)) {
    return "Editar Proposta";
  }

  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname || "");

  return (
    <header data-admin-header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-neutral-900 lg:ml-0 ml-12">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search button */}
        <Button variant="ghost" size="icon" className="text-neutral-600">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-neutral-600 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* User menu */}
        <Button variant="ghost" size="icon" className="text-neutral-600">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
