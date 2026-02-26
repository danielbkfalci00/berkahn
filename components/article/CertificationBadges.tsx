"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { CertificationBadges as CertificationBadgesType } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Award, ExternalLink } from "lucide-react";

interface CertificationBadgesProps {
  certifications: CertificationBadgesType;
  className?: string;
}

export function CertificationBadges({
  certifications,
  className = "",
}: CertificationBadgesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine layout (force carousel on mobile)
  const layout =
    isMobile && certifications.layout !== "list"
      ? "carousel"
      : certifications.layout || "grid";

  // Render single certification card
  const renderCertification = (cert: (typeof certifications.certifications)[0], index: number) => {
    const content = (
      <motion.div
        key={index}
        className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-black-10 rounded-lg hover:border-black-30 hover:shadow-md transition-all cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Logo or Icon */}
        <div className="w-20 h-20 mb-4 flex items-center justify-center">
          {cert.logo ? (
            <div className="relative w-full h-full">
              <Image
                src={cert.logo}
                alt={cert.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <Award className="w-full h-full text-black-30" />
          )}
        </div>

        {/* Certification Name */}
        <h4 className="text-center font-heading font-semibold text-sm mb-1">
          {cert.name}
        </h4>

        {/* Issuer */}
        <p className="text-xs text-black-60 mb-2">{cert.issuer}</p>

        {/* Code Badge */}
        {cert.code && (
          <Badge
            variant="outline"
            className="font-mono text-xs mb-2"
          >
            {cert.code}
          </Badge>
        )}

        {/* Year */}
        {cert.year && (
          <p className="text-xs text-black-50">Ano: {cert.year}</p>
        )}

        {/* External Link Indicator */}
        {cert.link && (
          <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-black-30 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.div>
    );

    // Wrap with tooltip if description exists
    if (cert.description) {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{cert.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return cert.link ? (
      <a
        key={index}
        href={cert.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    ) : (
      content
    );
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      {certifications.title && (
        <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
          <h3 className="headline-sm">{certifications.title}</h3>
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        {layout === "carousel" ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {certifications.certifications.map((cert, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/3"
                >
                  {renderCertification(cert, index)}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : layout === "list" ? (
          <div className="space-y-4">
            {certifications.certifications.map((cert, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 bg-black-5 rounded-lg hover:bg-black-10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Logo */}
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  {cert.logo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={cert.logo}
                        alt={cert.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Award className="w-full h-full text-black-30" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-heading font-semibold mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-black-60 mb-2">{cert.issuer}</p>
                  {cert.description && (
                    <p className="text-xs text-black-50 leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {cert.code && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {cert.code}
                      </Badge>
                    )}
                    {cert.year && (
                      <span className="text-xs text-black-50">
                        Ano: {cert.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Link */}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="w-5 h-5 text-black-50 hover:text-black transition-colors" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // Grid layout (default)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {certifications.certifications.map((cert, index) =>
              renderCertification(cert, index)
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
