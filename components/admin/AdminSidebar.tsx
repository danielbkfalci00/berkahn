"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Presentation,
  Calculator,
  Settings,
  LogOut,
  ChevronLeft,
  BarChart3,
  BookOpen,
  KanbanSquare,
  Inbox,
  MoreHorizontal,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { disableCurrentAdminPush } from "@/components/admin/AdminPwa";
import { roleCanAccessPath } from "@/lib/admin/access";
import { EVENTO_FEEDBACK_MUDOU } from "@/components/admin/feedback/FeedbackRapido";
import type { AdminMembership } from "@/types/analytics";
import { confirmUnsavedChanges, installUnsavedNavigationGuard } from "@/hooks/use-unsaved-changes";

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
    name: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquarePlus,
  },
  {
    name: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export function getPrimaryAdminPaths(role: AdminMembership["role"] | undefined): string[] {
  if (role === "conteudo") return ["/admin", "/admin/conteudo", "/admin/posts"];
  if (role === "viewer") return ["/admin", "/admin/analytics", "/admin/documentacoes"];
  return ["/admin", "/admin/leads", "/admin/orcamentos"];
}

export function AdminSidebar({ membership, collapsed, onCollapsedChange }: {
  membership: AdminMembership | null;
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unseenLeads, setUnseenLeads] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const mobilePaths = getPrimaryAdminPaths(membership?.role);
  const visibleNavigation = navigation.filter((item) => membership && roleCanAccessPath(membership.role, item.href));

  useEffect(() => {
    installUnsavedNavigationGuard();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // O badge só importa para quem acessa Leads, e só muda quando alguém abre
  // leads; fora de /admin/leads a chave fica fixa e a navegação não refaz o COUNT.
  const canSeeLeads = Boolean(membership && roleCanAccessPath(membership.role, "/admin/leads"));
  const leadsRefreshKey = pathname.startsWith("/admin/leads") ? pathname : "fora-de-leads";
  useEffect(() => {
    if (!canSeeLeads) return;
    let cancelled = false;
    const supabase = createClient();
    void supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("visualizado_em", null)
      .is("arquivado_em", null)
      .is("anonimizado_em", null)
      .then(({ count, error }) => { if (!cancelled && !error) setUnseenLeads(count ?? 0); });
    return () => { cancelled = true; };
  }, [canSeeLeads, leadsRefreshKey]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = moreButtonRef.current;
    const openedPathname = window.location.pathname;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      if (window.location.pathname === openedPathname && returnFocusTarget?.getClientRects().length) returnFocusTarget.focus();
    };
  }, [mobileOpen]);

  // Mesmo raciocínio do badge de leads: o COUNT só refaz ao entrar/sair do
  // mural ou quando o formulário rápido avisa que criou um item, nunca a cada
  // navegação. Tabela ausente (034 não aplicada) devolve erro e o badge some.
  const [openFeedback, setOpenFeedback] = useState(0);
  const [feedbackTick, setFeedbackTick] = useState(0);
  const feedbackRefreshKey = pathname.startsWith("/admin/feedback") ? pathname : "fora-do-feedback";
  useEffect(() => {
    const bump = () => setFeedbackTick((n) => n + 1);
    window.addEventListener(EVENTO_FEEDBACK_MUDOU, bump);
    return () => window.removeEventListener(EVENTO_FEEDBACK_MUDOU, bump);
  }, []);
  useEffect(() => {
    if (!membership) return;
    let cancelled = false;
    const supabase = createClient();
    void supabase
      .from("feedback_itens")
      .select("id", { count: "exact", head: true })
      .eq("status", "aberto")
      .then(({ count, error }) => { if (!cancelled && !error) setOpenFeedback(count ?? 0); });
    return () => { cancelled = true; };
  }, [membership, feedbackRefreshKey, feedbackTick]);

  const handleLogout = async () => {
    if (loggingOut || !confirmUnsavedChanges()) return;
    setLoggingOut(true);
    setLogoutError(null);
    const supabase = createClient();
    try {
      try { await disableCurrentAdminPush(); } catch { /* Push failure must not prevent logout. */ }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError("Não foi possível sair. Tente novamente.");
    } finally { setLoggingOut(false); }
  };

  const trapDrawerFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!mobileOpen || event.key !== "Tab") return;
    const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])') ?? []).filter((element) => element.getClientRects().length > 0);
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
      <a href="#admin-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:p-3">Ir para o conteúdo</a>
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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] transition-[width,transform] duration-200 motion-reduce:transition-none",
          collapsed ? "w-64 lg:w-16" : "w-64",
          mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full lg:visible lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
            <Link href="/admin" className={cn("flex items-center gap-2", collapsed && "lg:hidden")}>
              <span className="text-lg font-bold text-neutral-900">BERKAHN</span>
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          <button
            type="button"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            onClick={() => onCollapsedChange(!collapsed)}
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
            ref={closeButtonRef}
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
          {visibleNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={collapsed ? "lg:hidden" : undefined}>{item.name}</span>
                {item.name === "Leads" && unseenLeads > 0 && (
                  <span className={cn(
                    "ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold",
                    isActive ? "bg-white text-neutral-900" : "bg-blue-600 text-white",
                    collapsed && "absolute left-9 top-1"
                  )}>
                    {unseenLeads > 99 ? "99+" : unseenLeads}
                  </span>
                )}
                {item.name === "Feedback" && openFeedback > 0 && (
                  <span
                    aria-label={`${openFeedback} abertos`}
                    className={cn(
                      "ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold",
                      isActive ? "bg-white text-neutral-900" : "bg-neutral-200 text-neutral-700",
                      collapsed && "absolute left-9 top-1"
                    )}
                  >
                    {openFeedback > 99 ? "99+" : openFeedback}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-2 border-t border-neutral-200">
          {membership && (
            <div className={cn("mb-2 px-3 py-2", collapsed && "lg:hidden")}>
              <p className="truncate text-xs font-medium text-neutral-800">{membership.nome}</p>
              <p className="truncate text-[11px] text-neutral-500">{membership.email}</p>
            </div>
          )}
          <Button
            aria-label="Sair da conta"
            disabled={loggingOut}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-neutral-600 hover:text-red-600 hover:bg-red-50",
              collapsed && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className={collapsed ? "lg:hidden" : undefined}>{loggingOut ? "Saindo…" : "Sair"}</span>
          </Button>
          {logoutError && <p role="alert" className="p-2 text-xs text-red-700">{logoutError}</p>}
        </div>
      </aside>

      <nav
        aria-label="Navegacao principal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-neutral-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden"
      >
        {mobilePaths.flatMap((path) => visibleNavigation.filter((item) => item.href === path)).map((item) => {
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
