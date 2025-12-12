"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, ZoomIn, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: ProjectImage[];
  projectName: string;
}

const typeLabels: Record<ProjectImage["type"], string> = {
  exterior: "Exterior",
  interior: "Interior",
  "floor-plan": "Planta",
  detail: "Detalhe",
  render: "Render",
};

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Limitar preview a 5 imagens para o Bento Grid
  const previewImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") closeLightbox();
  };

  // Componente de imagem reutilizável
  const GalleryImage = ({
    image,
    index,
    isMain = false
  }: {
    image: ProjectImage;
    index: number;
    isMain?: boolean;
  }) => (
    <div
      className={cn(
        "relative cursor-pointer group overflow-hidden rounded-lg h-full",
        !isMain && "aspect-[4/3]"
      )}
      onClick={() => openLightbox(index)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={isMain
          ? "(max-width: 768px) 100vw, 50vw"
          : "(max-width: 768px) 50vw, 25vw"
        }
        priority={isMain}
      />

      {/* Overlay com zoom icon */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ZoomIn className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {/* Badge tipo - apenas na imagem principal */}
      {isMain && (
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/95 text-black text-xs backdrop-blur-sm"
          >
            {typeLabels[image.type]}
          </Badge>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Bento Grid - Layout 1 grande + 4 pequenas */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] md:h-[450px] lg:h-[500px]">
          {/* Imagem Principal - ocupa 2 colunas e 2 linhas */}
          {previewImages[0] && (
            <div className="col-span-2 row-span-2 h-full">
              <GalleryImage
                image={previewImages[0]}
                index={0}
                isMain
              />
            </div>
          )}

          {/* Imagens 2-5 - grid 2x2 no lado direito */}
          {previewImages.slice(1, 5).map((image, idx) => (
            <div key={idx} className="col-span-1 row-span-1">
              <GalleryImage
                image={image}
                index={idx + 1}
              />
            </div>
          ))}
        </div>

        {/* Botão "Ver todas as fotos" - posicionado sobre a última imagem */}
        {hasMoreImages && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm
                       px-4 py-2.5 text-sm font-medium rounded-lg shadow-luxury-md
                       hover:bg-white hover:shadow-luxury-lg transition-all duration-300
                       flex items-center gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Ver todas as {images.length} fotos
          </button>
        )}

        {/* Indicador de mais fotos para mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 md:hidden">
            <span className="text-xs text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              1 / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95"
          onKeyDown={handleKeyDown}
        >
          <VisuallyHidden>
            <DialogTitle>{projectName} - Galeria</DialogTitle>
          </VisuallyHidden>

          {selectedIndex !== null && (
            <div className="relative w-full h-[85vh] flex flex-col items-center justify-center">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Navigation - Previous */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-[60vh] md:h-[65vh]">
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  priority
                />
              </div>

              {/* Navigation - Next */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Caption acima das thumbnails */}
              <div className="mt-4 text-white text-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {typeLabels[images[selectedIndex].type]}
                </Badge>
                <p className="mt-2 text-sm text-white/70 max-w-md">
                  {images[selectedIndex].alt}
                </p>
              </div>

              {/* Thumbnails row no lightbox */}
              <div className="mt-4 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded overflow-hidden transition-all duration-300",
                      selectedIndex === index
                        ? "ring-2 ring-white scale-105"
                        : "opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>

              {/* Counter */}
              <div className="mt-3 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
