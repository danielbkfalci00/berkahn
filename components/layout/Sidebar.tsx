"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/components/providers/MenuProvider";
import { NAV_LINKS, NavLinkItem, NavLinkChild } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type guard para detectar se link tem children
function hasChildren(
  link: typeof NAV_LINKS[number]
): link is typeof NAV_LINKS[number] & {
  children: NonNullable<typeof NAV_LINKS[number]["children"]>;
} {
  return "children" in link && Array.isArray(link.children) && link.children.length > 0;
}

// Componente para itens com children (nested menu)
interface NavItemWithChildrenProps {
  link: NavLinkItem & { children: NavLinkChild[] };
  isActive: boolean;
  close: () => void;
  pathname: string;
}

function NavItemWithChildren({ link, isActive, close, pathname }: NavItemWithChildrenProps) {
  // Hash tracking para active state de sub-links
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);

      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  // Verifica se sub-link está ativo
  const isChildActive = (childHref: string) => {
    const [childPath, childHash] = childHref.split("#");
    return pathname === childPath && currentHash === `#${childHash}`;
  };

  // Handler para smooth scroll + fechar menu
  const handleSubLinkClick = (href: string) => {
    close();
    // Se já estamos na página, apenas scroll
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (pathname === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <AccordionItem value={link.href} className="border-none">
      <div className="flex items-center">
        {/* Label do pai - navega para página principal */}
        <Link
          href={link.href}
          onClick={close}
          className={cn(
            "flex-1 py-3 px-4 text-lg transition-all duration-300",
            isActive && !link.children.some((c) => isChildActive(c.href))
              ? "bg-black text-white font-medium"
              : "text-black-70 hover:text-black hover:bg-black-5"
          )}
        >
          {link.label}
        </Link>

        {/* Chevron - expande/colapsa accordion */}
        <AccordionTrigger className="py-3 px-4 hover:bg-black-5 transition-colors duration-300 [&[data-state=open]>svg]:rotate-180 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-black-50" />
      </div>

      {/* Sub-links */}
      <AccordionContent className="pb-0">
        <ul className="pl-4 border-l border-black-10 ml-4 space-y-1">
          {link.children.map((child, childIndex) => (
            <motion.li
              key={child.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 * childIndex,
                duration: 0.2,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <Link
                href={child.href}
                onClick={() => handleSubLinkClick(child.href)}
                className={cn(
                  "block py-2 px-4 text-base transition-all duration-300",
                  isChildActive(child.href)
                    ? "text-black font-medium bg-black-5"
                    : "text-black-50 hover:text-black hover:bg-black-5"
                )}
              >
                {child.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

export function Sidebar() {
  const { isOpen, close } = useMenu();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black-50 z-[200]"
            onClick={close}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.5,
              ease: [0.65, 0, 0.35, 1], // ease-in-out
            }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[201] shadow-luxury-xl"
          >
            <div className="flex flex-col h-full p-8">
              {/* Logo */}
              <div className="mb-12">
                <Link
                  href="/"
                  onClick={close}
                  className="text-3xl font-heading tracking-wider block"
                >
                  BERKAHN
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                <Accordion type="single" collapsible className="w-full">
                  <ul className="space-y-2">
                    {NAV_LINKS.map((link, index) => {
                      const isActive = pathname === link.href;

                      return (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 + index * 0.05,
                            duration: 0.3,
                            ease: [0.19, 1, 0.22, 1],
                          }}
                        >
                          {hasChildren(link) ? (
                            <NavItemWithChildren
                              link={link}
                              isActive={isActive}
                              close={close}
                              pathname={pathname}
                            />
                          ) : (
                            <Link
                              href={link.href}
                              onClick={close}
                              className={cn(
                                "block py-3 px-4 text-lg transition-all duration-300",
                                isActive
                                  ? "bg-black text-white font-medium"
                                  : "text-black-70 hover:text-black hover:bg-black-5"
                              )}
                            >
                              {link.label}
                            </Link>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </Accordion>
              </nav>

              {/* CTA Button - Mobile Only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + NAV_LINKS.length * 0.05,
                  duration: 0.3,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="mt-8 px-4"
              >
                <ContactFormDialog>
                  <button className="w-full py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black-90 transition-colors duration-300 border border-black">
                    Fale Conosco
                  </button>
                </ContactFormDialog>
              </motion.div>

              {/* Footer */}
              <div className="pt-8 border-t border-black-10">
                <p className="text-sm text-black-50">
                  © 2026 Berkahn. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
