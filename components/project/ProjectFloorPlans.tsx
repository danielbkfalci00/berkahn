"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProjectFloorPlansProps {
  plans: ProjectImage[];
  projectName: string;
}

export function ProjectFloorPlans({ plans, projectName }: ProjectFloorPlansProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? plans.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === plans.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <>
      {/* Grid de Plantas */}
      <div
        className={`grid gap-6 ${
          plans.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : plans.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {plans.map((plan, index) => (
          <RevealOnScroll key={index} delay={index * 0.1}>
            <div
              className="relative bg-white p-4 shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300 cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black-5">
                <Image
                  src={plan.src}
                  alt={plan.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-luxury-md">
                      <ZoomIn className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="mt-4 text-center">
                <p className="font-medium">{plan.alt}</p>
                <p className="text-sm text-black-50 mt-1">
                  Clique para ampliar
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-white"
          onKeyDown={handleKeyDown}
        >
          <VisuallyHidden>
            <DialogTitle>{projectName} - Plantas Baixas</DialogTitle>
          </VisuallyHidden>

          {selectedIndex !== null && (
            <div className="relative w-full h-[85vh] flex items-center justify-center bg-white">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              {/* Navigation - Previous */}
              {plans.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-50 w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </button>
              )}

              {/* Image */}
              <div className="relative w-full h-full p-8">
                <Image
                  src={plans[selectedIndex].src}
                  alt={plans[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  priority
                />
              </div>

              {/* Navigation - Next */}
              {plans.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 z-50 w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </button>
              )}

              {/* Caption */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                <p className="font-medium text-black">
                  {plans[selectedIndex].alt}
                </p>
                {plans.length > 1 && (
                  <p className="text-sm text-black-50 mt-1">
                    {selectedIndex + 1} de {plans.length}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
