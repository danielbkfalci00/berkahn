"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { HOW_WE_WORK_TIMELINE } from "@/lib/servicos-data";
import { CheckIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function HowWeWorkTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for progress indicator
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform scroll progress to line height (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-xl bg-white">
      <div className="container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="label-text mb-4">NOSSA METODOLOGIA</p>
            <h2 className="headline-md mb-6">Como Trabalhamos</h2>
            <p className="body-lg text-black-70 max-w-3xl mx-auto">
              Do primeiro contato à entrega das chaves, acompanhamos cada etapa
              do seu projeto com transparência, qualidade e compromisso. Já
              possui projeto definido? Podemos atuar diretamente na execução com
              nossa mão de obra especializada.
            </p>
          </div>
        </RevealOnScroll>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line (Background) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-black-10 -translate-x-1/2" />

          {/* Vertical Line (Progress) */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-black -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {HOW_WE_WORK_TIMELINE.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <RevealOnScroll key={step.step} delay={index * 0.15}>
                  <div
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                      isEven ? "" : "md:grid-flow-dense"
                    }`}
                  >
                    {/* Step Number Circle (Timeline Dot) */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-black flex items-center justify-center z-10 border-4 border-white shadow-luxury-lg">
                      <span className="text-white font-heading text-2xl font-bold">
                        {step.step}
                      </span>
                    </div>

                    {/* Content (alternates left/right on desktop) */}
                    <div
                      className={`pl-20 md:pl-0 ${
                        isEven
                          ? "md:pr-16 md:text-right"
                          : "md:pl-16 md:col-start-2"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                      >
                        <div className="inline-block mb-3">
                          <span className="label-text bg-black-5 px-4 py-2 rounded-full">
                            Passo {step.step}
                          </span>
                        </div>

                        <h3 className="headline-sm mb-4">{step.title}</h3>

                        <p className="body-md text-black-70 mb-6 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Highlights */}
                        <ul
                          className={`space-y-2 ${
                            isEven ? "md:ml-auto md:text-right" : ""
                          }`}
                        >
                          {step.highlights.map((highlight, hIndex) => (
                            <li
                              key={hIndex}
                              className={`flex items-center gap-2 text-sm text-black-70 ${
                                isEven ? "md:flex-row-reverse" : ""
                              }`}
                            >
                              <CheckIcon className="w-4 h-4 text-black flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Image Carousel (alternates right/left on desktop) */}
                    <div
                      className={`pl-20 md:pl-0 ${
                        isEven
                          ? "md:pl-16"
                          : "md:pr-16 md:col-start-1 md:row-start-1"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-luxury-lg"
                      >
                        <Carousel
                          plugins={[
                            Autoplay({
                              delay: 5000,
                              stopOnInteraction: false,
                            }),
                          ]}
                          opts={{ loop: true }}
                          className="w-full h-full"
                        >
                          <CarouselContent className="h-full -ml-0">
                            {step.images.map((imageUrl, imgIndex) => (
                              <CarouselItem
                                key={imgIndex}
                                className="h-full pl-0"
                              >
                                <div className="relative w-full h-[300px] md:h-[400px] group">
                                  <Image
                                    src={imageUrl}
                                    alt={`${step.title} - Imagem ${imgIndex + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                  {/* Overlay gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black-90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </motion.div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
