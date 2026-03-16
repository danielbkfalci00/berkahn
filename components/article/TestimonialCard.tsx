"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { ArticleTestimonial } from "@/types/article";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote, MapPin, Briefcase } from "lucide-react";

interface TestimonialCardProps {
  testimonial: ArticleTestimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className = "",
}: TestimonialCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine layout (force carousel on mobile if multiple testimonials)
  const layout =
    isMobile && testimonial.testimonials.length > 1
      ? "carousel"
      : testimonial.layout || "cards";

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-black-20"
            }`}
          />
        ))}
      </div>
    );
  };

  // Render single testimonial
  const renderTestimonial = (
    item: (typeof testimonial.testimonials)[0],
    index: number
  ) => (
    <Card
      key={index}
      className="h-full shadow-luxury-md hover:shadow-luxury-lg transition-shadow"
    >
      <CardContent className="p-6">
        {/* Quote Icon */}
        <Quote className="w-10 h-10 text-black-10 mb-4" />

        {/* Quote Text */}
        <blockquote className="text-black-80 leading-relaxed mb-6 italic">
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        {/* Author Info */}
        <div className="flex items-start gap-4 pt-4 border-t border-black-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {item.avatar ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={item.avatar}
                  alt={item.author}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-black-10 flex items-center justify-center">
                <span className="text-lg font-heading font-semibold text-black-50">
                  {item.author.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="flex-1 min-w-0">
            <div className="font-heading font-semibold text-black mb-1">
              {item.author}
            </div>

            {item.role && (
              <div className="flex items-center gap-1.5 text-sm text-black-60 mb-1">
                <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {item.role}
                  {item.company && ` • ${item.company}`}
                </span>
              </div>
            )}

            {item.project && (
              <div className="text-xs text-black-50 mb-2">
                Projeto: {item.project}
              </div>
            )}

            {/* Rating */}
            {item.rating && <div className="mb-2">{renderStars(item.rating)}</div>}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-black-50">
              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.date && <span>{item.date}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      {testimonial.title && (
        <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
          <h3 className="headline-sm">{testimonial.title}</h3>
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
              {testimonial.testimonials.map((item, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {renderTestimonial(item, index)}
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : layout === "list" ? (
          <div className="space-y-6">
            {testimonial.testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {renderTestimonial(item, index)}
              </motion.div>
            ))}
          </div>
        ) : (
          // Cards grid (default)
          <div className="grid gap-6 md:grid-cols-2">
            {testimonial.testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {renderTestimonial(item, index)}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Schema.org Review markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Construtora Berkahn",
            review: testimonial.testimonials.map((item) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: item.author,
              },
              reviewBody: item.quote,
              reviewRating: item.rating
                ? {
                    "@type": "Rating",
                    ratingValue: item.rating,
                    bestRating: 5,
                  }
                : undefined,
              datePublished: item.date,
            })),
          }),
        }}
      />
    </motion.div>
  );
}
