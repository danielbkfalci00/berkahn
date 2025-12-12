"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/components/providers/MenuProvider";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { isOpen, toggle } = useMenu();
  const { isScrolled } = useHeaderScroll();

  // Mostrar slogan apenas em páginas não-Home e quando no topo
  const showSlogan = pathname !== "/" && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-white transition-shadow duration-300",
        isScrolled && "shadow-luxury-md"
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-5 px-6 max-w-[1440px] mx-auto">
        {/* LEFT: Hamburger */}
        <button
          onClick={toggle}
          className="justify-self-start w-11 h-11 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "w-7 h-0.5 bg-black transition-all duration-300 ease-expo",
              isOpen && "rotate-45 translate-y-2"
            )}
          />
          <span
            className={cn(
              "w-7 h-0.5 bg-black transition-all duration-300 ease-expo",
              isOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "w-7 h-0.5 bg-black transition-all duration-300 ease-expo",
              isOpen && "-rotate-45 -translate-y-2"
            )}
          />
        </button>

        {/* CENTER: Logo + Slogan */}
        <Link
          href="/"
          className="flex flex-col items-center hover:opacity-70 transition-opacity"
        >
          <span className="text-2xl font-heading tracking-wider">
            BERKAHN
          </span>

          {/* Slogan condicional */}
          {showSlogan && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-black-50 font-body mt-0.5 transition-opacity duration-300">
              Erguendo o amanhã
            </span>
          )}
        </Link>

        {/* RIGHT: CTA - Temporariamente removido */}
        <div className="justify-self-end" />
      </div>
    </header>
  );
}
