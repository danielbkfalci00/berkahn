"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const { isVisible, acceptAll, acceptNecessary } = useCookieConsent();
  return (
    <>
      {isVisible && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[140] animate-in fade-in-0 slide-in-from-bottom-4 duration-500 motion-reduce:animate-none",
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
                  className="text-xs text-black/70 underline underline-offset-2 hover:text-black transition-colors"
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
        </div>
      )}
    </>
  );
}
