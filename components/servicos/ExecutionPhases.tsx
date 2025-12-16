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
import { Clock } from 'lucide-react';
import Image from 'next/image';

export function ExecutionPhases() {
  const [activeTab, setActiveTab] = useState(EXECUTION_PHASES[0].id);

  return (
    <section className="py-2xl bg-white">
      <div className="container-padding">
        {/* Header */}
        <RevealOnScroll>
          <h2 className="headline-lg text-center mb-4">EXECUÇÃO DE OBRAS</h2>
          <p className="body-lg text-center text-black-70 max-w-4xl mx-auto mb-16">
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-transparent mb-12">
            {EXECUTION_PHASES.map((phase) => (
              <TabsTrigger
                key={phase.id}
                value={phase.id}
                className="data-[state=active]:bg-black data-[state=active]:text-white
                           border border-black-10 hover:border-black-30 transition-all
                           py-4 text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {phase.number}
                  </Badge>
                  <span className="hidden md:inline">{phase.title}</span>
                  <span className="md:hidden">Etapa {phase.number}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          {EXECUTION_PHASES.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Text Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="text-lg px-4 py-2 rounded-full bg-black-5"
                    >
                      {phase.number}
                    </Badge>
                    <h3 className="headline-md">{phase.title}</h3>
                  </div>

                  <p className="body-lg text-black-70 leading-relaxed">
                    {phase.description}
                  </p>

                  {phase.duration && (
                    <div className="flex items-center gap-2 text-black-50">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Duração estimada: {phase.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Image Carousel */}
                <div className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-luxury-md">
                          <Image
                            src={phase.images.primary}
                            alt={phase.images.primaryAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="aspect-[4/3] relative overflow-hidden rounded-lg shadow-luxury-md">
                          <Image
                            src={phase.images.secondary}
                            alt={phase.images.secondaryAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                  <p className="text-center text-sm text-black-50 mt-4">
                    2 imagens • Use as setas para navegar
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
