"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useDrag } from "@use-gesture/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
  images: string[];
  open: boolean;
  onClose: () => void;
  /** Índice inicial ao abrir (ex: imagem clicada na grade) */
  initialIndex?: number;
  title?: string;
  /** Linha de metadados, ex: "595 m² · 2024 · Campinas" */
  meta?: string;
  /** Rodapé, ex: programa do projeto */
  footer?: string;
}

/**
 * Lightbox fullscreen compartilhado para as imagens de projeto dos arquitetos.
 * Navegação por setas (botões), teclado (←/→) e swipe no mobile. Esc fecha (Radix Dialog).
 */
export function ArchitectImageLightbox({
  images,
  open,
  onClose,
  initialIndex = 0,
  title,
  meta,
  footer,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const count = images.length;

  // Sincroniza o índice ao abrir / mudar a imagem inicial
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  // Swipe horizontal no mobile (reusa @use-gesture já instalado)
  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (count < 2) return;
      if (swipeX === -1) next();
      else if (swipeX === 1) prev();
    },
    { axis: "x", filterTaps: true }
  );

  if (!count) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        hideCloseButton
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === "ArrowLeft") prev();
          else if (e.key === "ArrowRight") next();
        }}
        className="max-w-[95vw] w-[95vw] h-[90vh] p-0 bg-black border-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">{title ?? "Imagem do projeto"}</DialogTitle>

        <div className="relative w-full h-full flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 lg:px-10 py-5 text-white">
            <div className="space-y-1 min-w-0">
              {title && (
                <h4 className="font-heading text-xl md:text-2xl font-light tracking-tight truncate">
                  {title}
                </h4>
              )}
              {meta && (
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                  {meta}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {count > 1 && (
                <span className="text-sm font-light tabular-nums text-white/70 hidden sm:inline">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image area (swipeable) */}
          <div
            {...bind()}
            className="flex-1 relative flex items-center justify-center px-6 lg:px-16 pb-6 touch-pan-y select-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[index]}
                  alt={`${title ?? "Imagem"} — ${index + 1}`}
                  fill
                  className="object-contain pointer-events-none"
                  sizes="95vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-7 h-7 lg:w-9 lg:h-9" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-7 h-7 lg:w-9 lg:h-9" />
                </button>
              </>
            )}
          </div>

          {/* Bottom */}
          {footer && (
            <div className="px-6 lg:px-10 py-4 border-t border-white/10 text-white/60 text-xs uppercase tracking-[0.2em]">
              {footer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
