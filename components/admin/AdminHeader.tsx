"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLE_LABELS } from "@/lib/admin/access";
import type { AdminMembership } from "@/types/analytics";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/posts/new": "Novo Post",
  "/admin/apresentacoes": "Apresentações",
  "/admin/apresentacoes/new": "Nova Apresentação",
  "/admin/propostas": "Propostas",
  "/admin/propostas/new": "Nova Proposta",
  "/admin/configuracoes": "Configurações",
  "/admin/documentacoes": "Documentações",
  "/admin/analytics": "Analytics",
  "/admin/leads": "Leads",
  "/admin/conteudo": "Conteúdo",
  "/admin/orcamentos": "Orçamentos",
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
  if (pathname.match(/\/admin\/documentacoes\/[^/]+$/)) {
    return "Documento";
  }

  return "Admin";
}

export function AdminHeader({ membership }: { membership: AdminMembership | null }) {
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
        <Button asChild variant="ghost" size="icon" className="text-neutral-600">
          <Link href="/admin/configuracoes#notificacoes" aria-label="Configurar notificações"><Bell className="h-5 w-5" /></Link>
        </Button>
        <Button asChild variant="ghost" className="hidden gap-2 text-neutral-600 sm:inline-flex">
          <Link href="/admin/configuracoes#conta"><User className="h-4 w-4" /><span>{membership ? ADMIN_ROLE_LABELS[membership.role] : "Conta"}</span></Link>
        </Button>
      </div>
    </header>
  );
}
