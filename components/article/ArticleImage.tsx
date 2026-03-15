"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArticleImage as ArticleImageType } from "@/types/article";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface ArticleImageProps {
  image: ArticleImageType;
  className?: string;
}

export function ArticleImage({ image, className = "" }: ArticleImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Aspect ratio mapping
  const aspectRatioMap = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:2": "aspect-[3/2]",
    "auto": "",
  };

  const aspectRatioClass = aspectRatioMap[image.aspectRatio || "auto"];

  // Layout classes
  const layoutClasses = {
    full: "w-full",
    wide: "w-full max-w-4xl mx-auto",
    center: "w-full max-w-2xl mx-auto",
    "float-left": "float-left mr-6 mb-4 w-full md:w-1/2 lg:w-2/5",
    "float-right": "float-right ml-6 mb-4 w-full md:w-1/2 lg:w-2/5",
  };

  const layoutClass = layoutClasses[image.layout || "center"];

  const imageContent = (
    <div
      className={`relative ${aspectRatioClass} ${layoutClass} overflow-hidden rounded-lg bg-neutral-100`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill={aspectRatioClass !== ""}
        width={aspectRatioClass === "" ? 1200 : undefined}
        height={aspectRatioClass === "" ? 800 : undefined}
        className={`${aspectRatioClass ? "object-cover" : "w-full h-auto"}`}
        priority={image.priority}
        quality={90}
        sizes="(max-width: 768px) 100vw, 768px"
      />

      {/* Lightbox indicator */}
      {image.enableLightbox && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 cursor-pointer group">
          <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-neutral-700" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.figure
      ref={ref}
      className={`my-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      {image.enableLightbox ? (
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>{imageContent}</DialogTrigger>
          <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                quality={95}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        imageContent
      )}

      {/* Caption and Credit */}
      {(image.caption || image.credit) && (
        <figcaption className="mt-3 text-sm text-neutral-600 text-center">
          {image.caption && <p>{image.caption}</p>}
          {image.credit && (
            <p className="text-xs text-neutral-500 mt-1">
              Crédito:{" "}
              {image.sourceUrl ? (
                <a
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {image.credit}
                </a>
              ) : (
                image.credit
              )}
            </p>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
}
