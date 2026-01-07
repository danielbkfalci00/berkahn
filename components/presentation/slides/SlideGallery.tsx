"use client";

import { SlideSection } from "../ui/SlideSection";
import { DomeGallery } from "../DomeGallery";

// Gerar array de imagens da galeria
const galleryImages = Array.from({ length: 35 }, (_, i) => ({
  src: `/images/galeria/projeto-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Projeto BERKAHN ${i + 1}`,
}));

export function SlideGallery() {
  return (
    <SlideSection dark className="relative overflow-hidden">
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="text-center pt-12 pb-8 z-10 relative">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-2">
            Portfólio
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Galeria de Projetos
          </h2>
        </div>

        {/* Gallery Container */}
        <div className="flex-1 relative min-h-0">
          <DomeGallery
            images={galleryImages}
            fit={0.8}
            minRadius={900}
            maxVerticalRotationDeg={0}
            segments={26}
            dragDampening={1.2}
            grayscale={false}
            overlayBlurColor="#0a0a0a"
            imageBorderRadius="16px"
          />
        </div>

        {/* Instruction */}
        <div className="text-center pt-4 pb-10 z-10 relative">
          <p className="text-xs text-white/40">
            Arraste para explorar • Clique para ampliar
          </p>
        </div>
      </div>
    </SlideSection>
  );
}
