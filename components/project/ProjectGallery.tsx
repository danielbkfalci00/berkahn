"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

  return (
    <>
      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </div>

                {/* Badge tipo */}
                <div className="absolute bottom-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-black text-xs"
                  >
                    {typeLabels[image.type]}
                  </Badge>
                </div>

                {/* Counter */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {index + 1}/{images.length}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 bg-white shadow-luxury-md border-0" />
        <CarouselNext className="hidden md:flex -right-4 bg-white shadow-luxury-md border-0" />
      </Carousel>

      {/* Thumbnails row */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-300 ${
              selectedIndex === index
                ? "ring-2 ring-black"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
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
            <div className="relative w-full h-[85vh] flex items-center justify-center">
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
                className="absolute left-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Image */}
              <div className="relative w-full h-full">
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
                className="absolute right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>

              {/* Caption */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-center">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {typeLabels[images[selectedIndex].type]}
                </Badge>
                <p className="mt-2 text-sm text-white/70">
                  {images[selectedIndex].alt}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
