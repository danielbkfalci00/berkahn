"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/components/providers/MenuProvider";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
                          ease: [0.19, 1, 0.22, 1], // ease-out-expo
                        }}
                      >
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
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer */}
              <div className="pt-8 border-t border-black-10">
                <p className="text-sm text-black-50">
                  © 2025 Berkahn. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
