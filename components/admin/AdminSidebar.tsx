"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Presentation,
  FileSpreadsheet,
  Calculator,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BarChart3,
  BookOpen,
  KanbanSquare,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { disableCurrentAdminPush } from "@/components/admin/AdminPwa";
import { roleCanAccessPath } from "@/lib/admin/access";
import type { AdminMembership } from "@/types/analytics";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Inbox,
  },
  {
    name: "Documentações",
    href: "/admin/documentacoes",
    icon: BookOpen,
  },
  {
    name: "Conteúdo",
    href: "/admin/conteudo",
    icon: KanbanSquare,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    name: "Apresentações",
    href: "/admin/apresentacoes",
    icon: Presentation,
  },
  {
    name: "Orçamentos",
    href: "/admin/orcamentos",
    icon: Calculator,
  },
  {
    name: "Propostas",
    href: "/admin/propostas",
    icon: FileSpreadsheet,
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export function AdminSidebar({ membership }: { membership: AdminMembership | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unseenLeads, setUnseenLeads] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("visualizado_em", null)
      .is("arquivado_em", null)
      .then(({ count }) => setUnseenLeads(count ?? 0));
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await disableCurrentAdminPush();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={mobileOpen}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-neutral-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">BERKAHN</span>
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          )}
          <button
            type="button"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navigation.filter((item) => membership && roleCanAccessPath(membership.role, item.href)).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {item.name === "Leads" && unseenLeads > 0 && (
                  <span className={cn(
                    "ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold",
                    isActive ? "bg-white text-neutral-900" : "bg-blue-600 text-white",
                    collapsed && "absolute left-9 top-1"
                  )}>
                    {unseenLeads > 99 ? "99+" : unseenLeads}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-2 border-t border-neutral-200">
          {!collapsed && membership && (
            <div className="mb-2 px-3 py-2">
              <p className="truncate text-xs font-medium text-neutral-800">{membership.nome}</p>
              <p className="truncate text-[11px] text-neutral-500">{membership.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-neutral-600 hover:text-red-600 hover:bg-red-50",
              collapsed && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
