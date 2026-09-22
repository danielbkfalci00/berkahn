"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMenu } from "@/components/providers/MenuProvider";
import { BAR_LINKS, isNavLinkActive } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

/**
 * Menu do celular e do tablet: um painel que desce colado na pílula do header.
 *
 * Mantém o nome Sidebar porque é quem o ClientLayout renderiza, mas deixou de
 * ser gaveta lateral: uma gaveta da esquerda não conversa com uma navbar que
 * flutua no centro. Acima de 1024px os links já estão na pílula e o painel
 * não aparece.
 *
 * As camadas ficam abaixo do header (z-100), para o botão de fechar continuar
 * clicável por cima do véu, e abaixo do diálogo de contato (z-150), que antes
 * abria atrás da gaveta antiga (z-200).
 */
export function Sidebar() {
  const { isOpen, close } = useMenu();
  const pathname = usePathname();

  // Se a janela alarga para desktop com o menu aberto, o painel some pelo
  // lg:hidden mas o MenuProvider deixou o body com overflow hidden: a página
  // travaria sem rolar. Fechar ao cruzar 1024px devolve a rolagem.
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) close();
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-[90] bg-black-30 backdrop-blur-[2px] animate-in fade-in-0 duration-300 motion-reduce:animate-none lg:hidden"
      />

      <div
        id="menu-principal"
        className="fixed inset-x-3 top-[68px] z-[95] rounded-[28px] bg-white p-2 text-black shadow-luxury-xl animate-in fade-in-0 slide-in-from-top-2 duration-300 motion-reduce:animate-none md:top-[76px] lg:hidden"
      >
        <nav aria-label="Menu">
          <ul>
            {BAR_LINKS.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-[20px] px-4 py-3.5 text-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                      isActive ? "bg-black-5 text-black" : "text-black-70 hover:bg-black-5 hover:text-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <ContactFormDialog ctaLocation="menu_lateral">
          <button
            type="button"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white transition-colors duration-300 hover:bg-black-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Fale conosco
          </button>
        </ContactFormDialog>
      </div>
    </>
  );
}
