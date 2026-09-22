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
  BarChart3,
  BookOpen,
  KanbanSquare,
  Inbox,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("visualizado_em", null)
      .is("arquivado_em", null)
      .then(({ count }) => setUnseenLeads(count ?? 0));
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        moreButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await disableCurrentAdminPush();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const trapDrawerFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!mobileOpen || event.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={drawerRef}
        data-admin-sidebar
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={mobileOpen ? "Mais opcoes do admin" : undefined}
        onKeyDown={trapDrawerFocus}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">BERKAHN</span>
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          )}
          <button
            ref={closeButtonRef}
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
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
          >
            <X className="h-5 w-5" />
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

      <nav
        aria-label="Navegacao principal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-neutral-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden"
      >
        {navigation.slice(0, 3).map((item) => {
          if (!membership || !roleCanAccessPath(membership.role, item.href)) return <span key={item.href} />;
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                active ? "text-neutral-950" : "text-neutral-500"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              <span>{item.name}</span>
              {active && <span className="absolute inset-x-5 top-0 h-0.5 bg-neutral-950" />}
              {item.name === "Leads" && unseenLeads > 0 && (
                <span className="absolute left-1/2 top-1 ml-2 min-w-4 rounded-full bg-blue-600 px-1 text-center text-[9px] font-semibold text-white">
                  {unseenLeads > 99 ? "99+" : unseenLeads}
                </span>
              )}
            </Link>
          );
        })}
        <button
          ref={moreButtonRef}
          type="button"
          aria-label="Abrir mais opcoes"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-neutral-500"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>Mais</span>
        </button>
      </nav>
    </>
  );
}
