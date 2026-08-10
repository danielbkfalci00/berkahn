'use client';

import { useState } from 'react';
import { EXECUTION_PHASES } from '@/lib/servicos-data';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Image from 'next/image';

export function ExecutionPhases() {
  const [activeTab, setActiveTab] = useState(EXECUTION_PHASES[0].id);

  return (
    <section className="py-lg md:py-xl lg:py-2xl bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header - Mais compacto */}
        <RevealOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tighter text-center mb-3">
            EXECUÇÃO DE OBRAS
          </h2>
          <p className="text-xs md:text-sm text-center text-black-70 max-w-2xl mx-auto uppercase tracking-wider leading-relaxed mb-6 md:mb-8 lg:mb-10">
            Da concepção à entrega, com foco em qualidade, prazo e excelência técnica
          </p>
        </RevealOnScroll>

        {/* ===================== MOBILE: ACCORDION ===================== */}
        <div className="block md:hidden">
          <Accordion type="single" collapsible defaultValue="pre-obra" className="space-y-3">
            {EXECUTION_PHASES.map((phase) => (
              <AccordionItem
                key={phase.id}
                value={phase.id}
                className="border border-black-10 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="flex items-center gap-3 px-4 py-4 hover:no-underline hover:bg-black-5 data-[state=open]:bg-black data-[state=open]:text-white">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-current shrink-0"
                  >
                    {phase.number}
                  </Badge>
                  <span className="font-medium text-sm text-left flex-1">
                    {phase.shortTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4 pb-6">
                  <div className="space-y-5">
                    {/* Summary */}
                    {phase.summary && (
                      <p className="text-sm text-black-70 leading-relaxed">
                        {phase.summary}
                      </p>
                    )}

                    {/* Key Points */}
                    {phase.keyPoints && phase.keyPoints.length > 0 && (
                      <div className="pt-4 border-t border-black-10">
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest text-black-70 mb-3">
                          Principais Atividades
                        </h4>
                        <ul className="space-y-2">
                          {phase.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-black-30 shrink-0">—</span>
                              <span className="text-sm text-black-70 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deliverables */}
                    {phase.deliverables && phase.deliverables.length > 0 && (
                      <div className="pt-4 border-t border-black-10">
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest text-black-70 mb-3">
                          Entregáveis
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-black shrink-0" />
                              <span className="text-sm text-black-70">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Image Carousel */}
                    <div className="pt-4">
                      <Carousel
                        className="w-full"
                        opts={{ loop: true }}
                        plugins={[
                          Autoplay({
                            delay: 5000,
                            stopOnInteraction: false,
                            stopOnMouseEnter: true,
                          })
                        ]}
                      >
                        <CarouselContent>
                          {[
                            { src: phase.images.primary, alt: phase.images.primaryAlt },
                            { src: phase.images.secondary, alt: phase.images.secondaryAlt }
                          ].map((img, idx) => (
                            <CarouselItem key={idx}>
                              <div className="aspect-[16/10] relative overflow-hidden rounded-lg">
                                <Image
                                  src={img.src}
                                  alt={img.alt}
                                  fill
                                  className="object-cover"
                                  sizes="100vw"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex items-center justify-center gap-4 mt-3">
                          <CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8" />
                          <span className="text-xs text-black-70">1 / 2</span>
                          <CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8" />
                        </div>
                      </Carousel>
                    </div>

                    {/* Duration */}
                    <p className="text-xs text-black-70 pt-2">
                      Duração estimada: {phase.duration}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* ===================== DESKTOP: TABS ===================== */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs List - 4 colunas */}
            <TabsList className="relative z-10 grid w-full grid-cols-4 gap-2 lg:gap-3 bg-transparent mb-12 lg:mb-16">
              {EXECUTION_PHASES.map((phase) => (
                <TabsTrigger
                  key={phase.id}
                  value={phase.id}
                  className="
                    flex flex-col items-center gap-2
                    py-3 lg:py-4 px-3 lg:px-4
                    text-sm font-medium transition-all
                    border border-black-10 rounded-lg
                    hover:border-black-30 hover:bg-black-5
                    data-[state=active]:border-black data-[state=active]:bg-black
                    data-[state=active]:text-white
                  "
                >
                  <Badge
                    variant="outline"
                    className="text-xs lg:text-sm px-2 py-0.5 border-current"
                  >
                    {phase.number}
                  </Badge>
                  <span className="text-[11px] lg:text-xs text-center leading-snug">
                    {phase.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tabs Content */}
            {EXECUTION_PHASES.map((phase) => (
              <TabsContent key={phase.id} value={phase.id} className="focus-visible:outline-none">
                <div className="grid grid-cols-[1fr_1fr] lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">

                  {/* LEFT: Text Content */}
                  <div className="space-y-6 lg:space-y-8">

                    {/* Summary */}
                    {phase.summary && (
                      <p className="text-lg text-black-70 leading-relaxed">
                        {phase.summary}
                      </p>
                    )}

                    {/* Key Points */}
                    {phase.keyPoints && phase.keyPoints.length > 0 && (
                      <div className="pt-6 border-t border-black-10">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-black-70 mb-4">
                          Principais Atividades
                        </h4>
                        <ul className="space-y-2.5">
                          {phase.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-black-30 shrink-0">—</span>
                              <span className="text-sm text-black-70 leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deliverables */}
                    {phase.deliverables && phase.deliverables.length > 0 && (
                      <div className="pt-6 border-t border-black-10">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-black-70 mb-4">
                          Entregáveis
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2.5">
                              <Check className="w-4 h-4 text-black shrink-0" />
                              <span className="text-sm text-black-70">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Duration */}
                    <p className="text-xs text-black-70 pt-4">
                      Duração estimada: {phase.duration}
                    </p>
                  </div>

                  {/* RIGHT: Image Carousel */}
                  <div className="w-full">
                    <Carousel
                      className="w-full"
                      opts={{ loop: true }}
                      plugins={[
                        Autoplay({
                          delay: 5000,
                          stopOnInteraction: false,
                          stopOnMouseEnter: true,
                        })
                      ]}
                    >
                      <CarouselContent>
                        {[
                          { src: phase.images.primary, alt: phase.images.primaryAlt },
                          { src: phase.images.secondary, alt: phase.images.secondaryAlt }
                        ].map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="aspect-[4/5] relative overflow-hidden rounded-lg">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover"
                                sizes="50vw"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8" />
                        <span className="text-xs text-black-70">1 / 2</span>
                        <CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8" />
                      </div>
                    </Carousel>
                  </div>

                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
