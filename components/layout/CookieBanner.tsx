"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const { isVisible, acceptAll, acceptNecessary } = useCookieConsent();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          transition={{
            duration: 0.5,
            ease: [0.19, 1, 0.22, 1],
          }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[140]",
            "px-4 pb-4 md:pb-6",
            "md:left-auto md:right-6 md:w-auto md:max-w-md"
          )}
        >
          <div
            className={cn(
              "bg-white rounded-lg",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
              "border border-black/10",
              "p-4 md:p-5"
            )}
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <div>
                <p className="text-sm text-black/90 leading-relaxed">
                  Utilizamos cookies para melhorar sua experiência em nosso site.
                </p>
                <a
                  href="/privacidade"
                  className="text-xs text-black/50 underline underline-offset-2 hover:text-black transition-colors"
                >
                  Política de Privacidade
                </a>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className={cn(
                    "flex-1 text-xs",
                    "border-black/10 text-black/70",
                    "hover:bg-black/5 hover:text-black"
                  )}
                >
                  Apenas necessários
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={acceptAll}
                  className={cn(
                    "flex-1 text-xs",
                    "bg-black text-white",
                    "hover:bg-black/90"
                  )}
                >
                  Aceitar todos
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
