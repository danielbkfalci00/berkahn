"use client";

import Link from "next/link";
import { useMenuController } from "@/hooks/useMenuController";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { cn } from "@/lib/utils";

export function Header() {
  const { isOpen, toggle } = useMenuController();
  const { isScrolled } = useHeaderScroll();

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

        {/* CENTER: Logo */}
        <Link
          href="/"
          className="text-2xl font-heading tracking-wider hover:opacity-70 transition-opacity"
        >
          BERKAHN
        </Link>

        {/* RIGHT: CTA */}
        <Link
          href="/contato"
          className="justify-self-end px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-black-90 transition-colors duration-300"
        >
          Fale Conosco
        </Link>
      </div>
    </header>
  );
}
