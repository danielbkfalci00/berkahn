"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "video" | "portrait";
  title?: string;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

export function ImageGallery({
  images,
  columns = 3,
  aspectRatio = "video",
  title,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") setSelectedIndex(null);
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}

      <div
        className={cn(
          "grid gap-4",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-4"
        )}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            <div className={cn("relative w-full", aspectRatioClasses[aspectRatio])}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={columns === 4 ? "(max-width: 767px) 50vw, 25vw" : columns === 2 ? "(max-width: 639px) 100vw, 50vw" : "(max-width: 639px) 100vw, (max-width: 767px) 50vw, 33vw"}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {image.caption && (
              <p className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs">
                {image.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent
          className="max-w-5xl p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          {selectedIndex !== null && (
            <div className="relative">
              {/* Image */}
              <div className="relative aspect-video">
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                />
              </div>

              {/* Caption */}
              {images[selectedIndex].caption && (
                <p className="absolute bottom-4 left-4 right-4 text-center text-white text-sm">
                  {images[selectedIndex].caption}
                </p>
              )}

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Counter */}
              <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
