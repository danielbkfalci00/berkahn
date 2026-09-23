"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AdminSidebar, primaryAdminPaths } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminPwaRegistration } from "./AdminPwa";
import { FeedbackRapido } from "./feedback/FeedbackRapido";
import type { AdminMembership } from "@/types/analytics";
import { roleCanAccessPath } from "@/lib/admin/access";

function blocksPageSwipe(target: EventTarget | null, boundary: HTMLElement): boolean {
  if (!(target instanceof Element)) return true;
  if (target.closest('a, button, input, textarea, select, svg, canvas, [contenteditable="true"], [role="dialog"], [role="slider"], [data-no-page-swipe]')) return true;
  for (let node: Element | null = target; node && node !== boundary; node = node.parentElement) {
    if (node.scrollWidth <= node.clientWidth + 8) continue;
    const overflow = getComputedStyle(node).overflowX;
    if (overflow === "auto" || overflow === "scroll") return true;
  }
  return false;
}

interface AdminLayoutClientProps {
  children: React.ReactNode;
  membership: AdminMembership | null;
}

export function AdminLayoutClient({ children, membership }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [swipeX, setSwipeX] = useState(0);

  useEffect(() => { setSwipeX(0); swipeStart.current = null; }, [pathname]);

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    if (event.touches.length !== 1 || !membership || !mainRef.current || window.innerWidth >= 1024) return;
    if (!primaryAdminPaths.includes(pathname)) return;
    const touch = event.touches[0];
    if (touch.clientX < 28 || touch.clientX > window.innerWidth - 28 || blocksPageSwipe(event.target, mainRef.current)) return;
    swipeStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchMove(event: TouchEvent<HTMLElement>) {
    if (!swipeStart.current || event.touches.length !== 1) return;
    const dx = event.touches[0].clientX - swipeStart.current.x;
    const dy = event.touches[0].clientY - swipeStart.current.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSwipeX(Math.max(-72, Math.min(72, dx * 0.35)));
    }
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    setSwipeX(0);
    if (!start || !membership || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < Math.max(72, window.innerWidth * 0.18) || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    const allowed = primaryAdminPaths.filter((path) => roleCanAccessPath(membership.role, path));
    const current = allowed.indexOf(pathname);
    const next = allowed[current + (dx < 0 ? 1 : -1)];
    if (next) router.push(next);
  }

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
    <div className="admin-shell min-h-screen overflow-x-clip bg-neutral-50">
      <AdminPwaRegistration />
      <AdminSidebar membership={membership} />
      <div className="lg:pl-64">
        <AdminHeader membership={membership} />
        {/* Espaço de rolagem para os últimos controles não ficarem sob o feedback flutuante. */}
        <main ref={mainRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={() => { swipeStart.current = null; setSwipeX(0); }} style={{ transform: swipeX ? `translateX(${swipeX}px)` : undefined, transitionDuration: swipeStart.current ? "0ms" : undefined }} className="px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-4 transition-transform duration-150 ease-out motion-reduce:transition-none sm:px-6 sm:pb-40 sm:pt-6 lg:pb-24 print:pb-0">
          {children}
        </main>
      </div>
      {/* Só com membro resolvido: sem sessão a action recusaria de qualquer jeito. */}
      {membership && <FeedbackRapido />}
    </div>
  );
}
