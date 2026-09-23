"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/components/providers/MenuProvider";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { BAR_LINKS, isNavLinkActive } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

interface HeaderProps {
  /**
   * overlay: a pílula começa transparente, com texto branco, sobre um hero
   * escuro, e ganha fundo branco quando a rolagem sai dele. default: começa
   * branca, porque a página não tem hero escuro embaixo do header.
   */
  variant?: "default" | "overlay";
  /** Fim do hero em múltiplos do viewport. Ver useHeaderScroll. */
  heroEndFactor?: number;
}

/**
 * Navbar flutuante em pílula: marca, links de primeiro nível e o CTA.
 *
 * Solta do topo e das laterais, com 48px de altura, para ocupar o mínimo de
 * tela. Abaixo de 1024px os links não cabem na pílula e vão para o painel do
 * menu (Sidebar), aberto pelo botão de duas linhas.
 */
export function Header({ variant = "default", heroEndFactor }: HeaderProps = {}) {
  const pathname = usePathname();
  const { isOpen, toggle } = useMenu();
  // Overlay: o hero da home é pinado (runway de 260vh), então o flip para
  // sólido acontece no fim do runway, não no fim do primeiro viewport.
  const { isPastHeroEnd } = useHeaderScroll({
    heroEndFactor: heroEndFactor ?? (variant === "overlay" ? 1.55 : 0.92),
  });

  // Com o menu aberto a pílula fica branca: o painel desce colado nela, e uma
  // pílula transparente de texto branco em cima de um painel branco some.
  const isSolid = variant !== "overlay" || isPastHeroEnd || isOpen;

  return (
    // O header ocupa a largura toda só para centralizar a pílula; fora dela ele
    // não pode engolir clique no conteúdo que passa por baixo.
    <header className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-3 md:top-4">
      <nav
        aria-label="Principal"
        className={cn(
          "pointer-events-auto flex h-12 w-full items-center justify-between rounded-full pl-4 pr-1.5 transition-[background-color,box-shadow,color] duration-300 ease-expo lg:w-auto lg:justify-start lg:gap-12",
          isSolid
            ? "bg-white/95 text-black shadow-[0_10px_30px_-12px_rgba(0,0,0,0.28)] ring-1 ring-black-5 backdrop-blur-md"
            : "bg-transparent text-white"
        )}
      >
        <Link
          href="/"
          prefetch={false}
          aria-label="Berkahn, página inicial"
          className="-ml-1 flex items-center gap-1.5 rounded-full transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          {/* O "B" ocupa 64% do arquivo; a 28px ele aparece com uns 18px. No
              estado transparente o filtro pinta o preto de branco. */}
          <Image
            src="/images/logo/berkahn-logo.webp"
            alt=""
            width={28}
            height={28}
            priority
            className={cn(
              "h-7 w-7 transition-[filter] duration-300",
              !isSolid && "brightness-0 invert"
            )}
          />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[15px] font-medium tracking-[0.14em]">
              BERKAHN
            </span>
            {/* Slogan só com a pílula branca, como no header antigo. Anima
                altura e opacidade para a marca subir e descer sem pulo. */}
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap font-heading text-[6.5px] uppercase tracking-[0.18em] text-black-50 transition-all duration-300 ease-expo",
                isSolid ? "mt-[3px] max-h-3 opacity-100" : "mt-0 max-h-0 opacity-0"
              )}
              aria-hidden={!isSolid}
            >
              Erguendo o amanhã
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {BAR_LINKS.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full text-sm font-medium transition-opacity duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center">
          <ContactFormDialog ctaLocation="header">
            <button
              type="button"
              className={cn(
                "hidden h-9 items-center rounded-full px-5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 lg:inline-flex",
                isSolid
                  ? "bg-black text-white hover:bg-black-90"
                  : "bg-white text-black hover:bg-white-90"
              )}
            >
              Fale conosco
            </button>
          </ContactFormDialog>

          <button
            type="button"
            onClick={toggle}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            aria-controls="menu-principal"
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current lg:hidden"
          >
            <span
              className={cn(
                "h-[1.5px] w-[18px] bg-current transition-transform duration-300 ease-expo",
                isOpen && "translate-y-[3.25px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-[18px] bg-current transition-transform duration-300 ease-expo",
                isOpen && "-translate-y-[3.25px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
