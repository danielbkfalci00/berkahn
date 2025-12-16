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
import { Clock, Check } from 'lucide-react';
import Image from 'next/image';

export function ExecutionPhases() {
  const [activeTab, setActiveTab] = useState(EXECUTION_PHASES[0].id);

  return (
    <section className="py-xl lg:py-2xl bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll>
          <h2 className="headline-lg lg:headline-xl text-center mb-3 lg:mb-4">
            EXECUÇÃO DE OBRAS
          </h2>
          <p className="body-sm lg:body-md text-center text-black-70 max-w-3xl mx-auto uppercase tracking-wide leading-relaxed mb-12 lg:mb-16">
            ATUANTE EM TODAS AS FASES DO SEU PROJETO. ACOMPANHAMOS A JORNADA DA
            CONSTRUÇÃO DA CONCEPÇÃO DOS PROJETOS À ENTREGA DA OBRA, SEMPRE COM
            FOCO NA QUALIDADE, PRAZO, E EXCELÊNCIA TÉCNICA
          </p>
        </RevealOnScroll>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 bg-transparent mb-8 lg:mb-12">
            {EXECUTION_PHASES.map((phase) => (
              <TabsTrigger
                key={phase.id}
                value={phase.id}
                className="
                  flex flex-col lg:flex-row items-center gap-2 lg:gap-3
                  py-3 lg:py-4 px-3 lg:px-4
                  text-sm font-medium transition-all
                  border-2 border-black-10 rounded-lg
                  hover:border-black-30 hover:bg-black-5
                  data-[state=active]:border-black data-[state=active]:bg-black-5
                "
              >
                {/* Badge sempre visível, tamanho responsivo */}
                <Badge className="text-base lg:text-lg px-3 py-1 lg:px-4 lg:py-2 shrink-0">
                  {phase.number}
                </Badge>

                {/* Título - wrapping controlado */}
                <span className="text-xs lg:text-sm text-center lg:text-left leading-tight">
                  {phase.title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {EXECUTION_PHASES.map((phase) => (
            <TabsContent
              key={phase.id}
              value={phase.id}
              className="focus-visible:outline-none mt-8 lg:mt-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">

                {/* LEFT: Text Content (60% no desktop) */}
                <div className="space-y-6 lg:space-y-8">

                  {/* Header com Badge + Título */}
                  <div className="flex items-start gap-4">
                    <Badge
                      variant="outline"
                      className="text-xl px-4 py-2 shrink-0"
                    >
                      {phase.number}
                    </Badge>
                    <div>
                      <h3 className="headline-md mb-2">{phase.title}</h3>
                      {phase.summary && (
                        <p className="body-md text-black-70 leading-relaxed">
                          {phase.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-black-10" />

                  {/* Key Points (Bullet List) */}
                  {phase.keyPoints && phase.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-black-50 mb-4">
                        Principais Atividades
                      </h4>
                      <ul className="space-y-3">
                        {phase.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-black mt-2" />
                            <span className="body-md text-black-70 leading-relaxed">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverables */}
                  {phase.deliverables && phase.deliverables.length > 0 && (
                    <div className="bg-black-5 rounded-lg p-6 border border-black-10">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-black-50 mb-4">
                        Entregáveis
                      </h4>
                      <ul className="space-y-2">
                        {phase.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-black shrink-0" />
                            <span className="body-sm text-black-70">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-black-50">
                    <Clock className="w-5 h-5" />
                    <span className="body-sm">
                      Duração estimada: {phase.duration}
                    </span>
                  </div>
                </div>

                {/* RIGHT: Image Carousel (40% no desktop) */}
                <div className="w-full lg:sticky lg:top-24">
                  <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {[
                        { src: phase.images.primary, alt: phase.images.primaryAlt },
                        { src: phase.images.secondary, alt: phase.images.secondaryAlt }
                      ].map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-luxury-md">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Navigation - melhorado para mobile */}
                    <div className="flex items-center justify-between mt-4">
                      <CarouselPrevious className="static translate-x-0 translate-y-0" />
                      <p className="text-xs text-black-50 text-center flex-1 mx-4">
                        2 imagens • Use as setas para navegar
                      </p>
                      <CarouselNext className="static translate-x-0 translate-y-0" />
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
