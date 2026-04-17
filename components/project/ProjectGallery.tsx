"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ProjectImage } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { X, ZoomIn, Grid3X3 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

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
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Limitar preview a 5 imagens para o Bento Grid
  const previewImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setCurrentSlide(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  // Sincronizar carroseis principal e thumbnails
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setCurrentSlide(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, onSelect]);

  // Scroll para slide especifico quando lightbox abre
  useEffect(() => {
    if (selectedIndex !== null && mainApi) {
      mainApi.scrollTo(selectedIndex);
    }
  }, [selectedIndex, mainApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") mainApi?.scrollPrev();
      if (e.key === "ArrowRight") mainApi?.scrollNext();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, mainApi]);

  // Componente de imagem reutilizavel
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
        "border border-transparent hover:border-black/20",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury-md",
        !isMain && "aspect-[4/3]"
      )}
      onClick={() => openLightbox(index)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={78}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={isMain
          ? "(max-width: 768px) 100vw, 50vw"
          : "(max-width: 768px) 50vw, 25vw"
        }
        priority={isMain}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-luxury-md">
            <ZoomIn className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>
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
      {/* Bento Grid - Layout mantido */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] md:h-[450px] lg:h-[500px]">
          {previewImages[0] && (
            <div className="col-span-2 row-span-2 h-full">
              <GalleryImage image={previewImages[0]} index={0} isMain />
            </div>
          )}
          {previewImages.slice(1, 5).map((image, idx) => (
            <div key={idx} className="col-span-1 row-span-1">
              <GalleryImage image={image} index={idx + 1} />
            </div>
          ))}
        </div>

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

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 md:hidden">
            <span className="text-xs text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              1 / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Lightbox Dialog - Estilo Airbnb */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-0 bg-black/95 overflow-hidden"
          hideCloseButton
        >
          <VisuallyHidden>
            <DialogTitle>{projectName} - Galeria</DialogTitle>
          </VisuallyHidden>

          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full flex flex-col"
              >
                {/* Header - Close button + Counter */}
                <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6">
                  <div className="text-white text-sm md:text-base font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    {currentSlide + 1} / {images.length}
                  </div>
                  <DialogClose asChild>
                    <button
                      className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                      aria-label="Fechar galeria"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                  </DialogClose>
                </div>

                {/* Main Carousel - Imagem principal */}
                <div className="flex-1 flex items-center justify-center px-4 md:px-16 py-20">
                  <Carousel
                    setApi={setMainApi}
                    opts={{
                      loop: true,
                      startIndex: selectedIndex,
                    }}
                    className="w-full max-w-5xl"
                  >
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index} className="basis-full">
                          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 80vw"
                              priority={index === currentSlide}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation arrows - Desktop */}
                    <CarouselPrevious
                      className="hidden md:flex absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 border-0 text-white rounded-full transition-all duration-300"
                    />
                    <CarouselNext
                      className="hidden md:flex absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 border-0 text-white rounded-full transition-all duration-300"
                    />
                  </Carousel>
                </div>

                {/* Caption */}
                <div className="text-center py-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 mb-2">
                    {typeLabels[images[currentSlide]?.type || 'exterior']}
                  </Badge>
                  <p className="text-sm text-white/70 max-w-md mx-auto px-4">
                    {images[currentSlide]?.alt}
                  </p>
                </div>

                {/* Thumbnails Carousel */}
                <div className="pb-6 px-4">
                  <Carousel
                    setApi={setThumbApi}
                    opts={{
                      align: "center",
                      containScroll: "keepSnaps",
                      dragFree: true,
                    }}
                    className="w-full max-w-3xl mx-auto"
                  >
                    <CarouselContent className="-ml-2">
                      {images.map((image, index) => (
                        <CarouselItem
                          key={index}
                          className="pl-2 basis-1/5 md:basis-1/7 lg:basis-1/9"
                        >
                          <button
                            onClick={() => mainApi?.scrollTo(index)}
                            className={cn(
                              "relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all duration-300",
                              currentSlide === index
                                ? "ring-2 ring-white scale-105 opacity-100"
                                : "opacity-50 hover:opacity-80"
                            )}
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              quality={70}
                              className="object-cover"
                              sizes="64px"
                            />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                {/* Mobile swipe hint */}
                <div className="md:hidden text-center pb-4">
                  <p className="text-xs text-white/50">Deslize para navegar</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
