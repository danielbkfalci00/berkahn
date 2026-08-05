"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/components/providers/MenuProvider";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { cn } from "@/lib/utils";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  variant?: 'default' | 'orcamento' | 'overlay';
  projectName?: string;
  onDownloadPDF?: () => void;
}

export function Header({
  variant = 'default',
  projectName,
  onDownloadPDF
}: HeaderProps = {}) {
  const pathname = usePathname();
  const { isOpen, toggle } = useMenu();
  const { isScrolled, isPastHero, isPastHeroEnd } = useHeaderScroll();

  // Overlay: transparente sobre o hero full-viewport da home; vira sólido
  // apenas ao passar o FIM do hero (isPastHeroEnd), não nos thresholds antigos.
  const isOverlay = variant === 'overlay';
  const isSolid = !isOverlay || isPastHeroEnd;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-[background-color,box-shadow] duration-300",
        isSolid ? "bg-white" : "bg-transparent",
        isScrolled && isSolid && "shadow-luxury-md"
      )}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center py-5 px-6 max-w-[1440px] mx-auto">
        {/* LEFT: Hamburger or Project Name */}
        {variant !== 'orcamento' ? (
          <button
            onClick={toggle}
            className="justify-self-start w-11 h-11 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity"
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            <span
              className={cn(
                "w-7 h-0.5 transition-all duration-300 ease-expo",
                isSolid || isOpen ? "bg-black" : "bg-white",
                isOpen && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "w-7 h-0.5 transition-all duration-300 ease-expo",
                isSolid || isOpen ? "bg-black" : "bg-white",
                isOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "w-7 h-0.5 transition-all duration-300 ease-expo",
                isSolid || isOpen ? "bg-black" : "bg-white",
                isOpen && "-rotate-45 -translate-y-2"
              )}
            />
          </button>
        ) : (
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium max-w-[180px] md:max-w-none">
            <span className="text-black">Berkahn</span>
            {projectName && (
              <>
                <span className="text-black-50">&</span>
                <span className="text-black-70 truncate">{projectName}</span>
              </>
            )}
          </div>
        )}

        {/* CENTER: Logo + Slogan */}
        <Link
          href="/"
          className="flex flex-col items-center hover:opacity-70 transition-opacity"
        >
          <span
            className={cn(
              "text-2xl font-heading tracking-wider transition-colors duration-300",
              isSolid ? "text-black" : "text-white"
            )}
          >
            BERKAHN
          </span>

          {/* Slogan — visível quando scrollado além da hero */}
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.2em] text-black-50 font-body mt-0.5 transition-all duration-300",
              (isOverlay ? isPastHeroEnd : isPastHero)
                ? "opacity-100 max-h-4"
                : "opacity-0 max-h-0 overflow-hidden"
            )}
          >
            Erguendo o amanhã
          </span>
        </Link>

        {/* RIGHT: CTA - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex justify-self-end">
          {variant !== 'orcamento' ? (
            <ContactFormDialog ctaLocation="header">
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "justify-self-end transition-colors text-xs uppercase tracking-wider font-medium",
                  isSolid
                    ? "bg-black text-white hover:bg-black-90"
                    : "border border-white-50 bg-transparent text-white hover:bg-white hover:text-black"
                )}
              >
                Fale Conosco
              </Button>
            </ContactFormDialog>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadPDF}
              className="justify-self-end bg-black text-white hover:bg-black-90 transition-colors text-xs uppercase tracking-wider font-medium"
            >
              Baixar PDF
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
