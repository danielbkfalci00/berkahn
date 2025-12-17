'use client';

import { useState } from 'react';
import { EXECUTION_PHASES } from '@/lib/servicos-data';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
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
          <p className="text-xs md:text-sm text-center text-black-50 max-w-2xl mx-auto uppercase tracking-wider leading-relaxed mb-6 md:mb-8 lg:mb-10">
            Da concepção à entrega, com foco em qualidade, prazo e excelência técnica
          </p>
        </RevealOnScroll>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs List - 4 colunas desde md */}
          <TabsList className="relative z-10 grid w-full grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 lg:gap-3 bg-transparent mb-6 md:mb-8 lg:mb-10">
            {EXECUTION_PHASES.map((phase) => (
              <TabsTrigger
                key={phase.id}
                value={phase.id}
                className="
                  flex flex-col items-center gap-1.5 md:gap-2
                  py-2.5 md:py-3 lg:py-4 px-2 md:px-3 lg:px-4
                  text-sm font-medium transition-all
                  border border-black-10 rounded-lg
                  hover:border-black-30 hover:bg-black-5
                  data-[state=active]:border-black data-[state=active]:bg-black
                  data-[state=active]:text-white
                "
              >
                {/* Badge compacto */}
                <Badge
                  variant="outline"
                  className="text-[10px] md:text-xs lg:text-sm px-1.5 py-0 md:px-2 md:py-0.5 border-current"
                >
                  {phase.number}
                </Badge>

                {/* Titulo - shortTitle em mobile, title em desktop */}
                <span className="text-[10px] md:text-[11px] lg:text-xs text-center leading-snug">
                  <span className="block md:hidden">{phase.shortTitle}</span>
                  <span className="hidden md:block">{phase.title}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {EXECUTION_PHASES.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 lg:gap-12 items-start">

                {/* LEFT: Text Content */}
                <div className="space-y-6 lg:space-y-8 order-2 md:order-1">

                  {/* Header */}
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold tracking-tight mb-3">
                      {phase.title}
                    </h3>
                    {phase.summary && (
                      <p className="text-sm md:text-base text-black-70 leading-relaxed">
                        {phase.summary}
                      </p>
                    )}
                  </div>

                  {/* Key Points - Simplificado */}
                  {phase.keyPoints && phase.keyPoints.length > 0 && (
                    <div className="pt-6 border-t border-black-10">
                      <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-black-50 mb-4">
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

                  {/* Deliverables - Minimalista */}
                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div className="pt-6 border-t border-black-10">
                      <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-black-50 mb-4">
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

                  {/* Duration - Simplificado */}
                  <p className="text-xs text-black-50 pt-4">
                    Duração estimada: {phase.duration}
                  </p>
                </div>

                {/* RIGHT: Image Carousel */}
                <div className="w-full order-2 mb-8 md:mb-0">
                  <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {[
                        { src: phase.images.primary, alt: phase.images.primaryAlt },
                        { src: phase.images.secondary, alt: phase.images.secondaryAlt }
                      ].map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="aspect-[16/10] md:aspect-[4/3] relative overflow-hidden rounded-lg">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation - Minimal */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8" />
                      <span className="text-xs text-black-50">
                        1 / 2
                      </span>
                      <CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8" />
                    </div>
                  </Carousel>
                </div>

              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
