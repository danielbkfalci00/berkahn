"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LSF_LAYERS } from "@/lib/lsf-data";

// Animation variants for smooth transitions
const imageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function WallLayersTabs() {
  const [activeTab, setActiveTab] = useState("layer-1");

  return (
    <>
      {/* ===================== MOBILE: ACCORDION ===================== */}
      <div className="block md:hidden">
        <Accordion type="single" collapsible defaultValue="layer-1" className="space-y-3">
          {LSF_LAYERS.map((layer) => (
            <AccordionItem
              key={layer.id}
              value={`layer-${layer.id}`}
              className="border border-black-10 rounded-lg overflow-hidden bg-white"
            >
              <AccordionTrigger className="flex items-center gap-3 px-4 py-4 hover:no-underline hover:bg-black-5 data-[state=open]:bg-black data-[state=open]:text-white">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-current shrink-0"
                >
                  {layer.id}
                </Badge>
                <span className="font-medium text-sm text-left flex-1">
                  {layer.name}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 pb-6">
                <div className="space-y-4">
                  {/* Imagem no topo do accordion */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src={layer.image}
                      alt={`Camada ${layer.id}: ${layer.name}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Descrição */}
                  <p className="text-sm text-black-70 leading-relaxed">
                    {layer.fullDescription}
                  </p>

                  {/* Especificações */}
                  <div className="pt-4 border-t border-black-10 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-black-50">Espessura</span>
                      <span className="font-medium">{layer.thickness}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black-50">Material</span>
                      <span className="font-medium">{layer.material}</span>
                    </div>
                  </div>

                  {/* Função */}
                  <div className="bg-black-5 rounded-lg p-3 mt-2">
                    <p className="text-xs font-medium text-black-50 mb-1">Função principal:</p>
                    <p className="text-sm text-black-70">{layer.function}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* ===================== DESKTOP: TABS ===================== */}
      <div className="hidden md:block">
        <Tabs
          defaultValue="layer-1"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tab Triggers - Horizontal List */}
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-black-5">
            {LSF_LAYERS.map((layer) => (
              <TabsTrigger
                key={layer.id}
                value={`layer-${layer.id}`}
                className="flex flex-col items-center py-3 px-2 text-xs data-[state=active]:bg-white data-[state=active]:shadow-luxury-md transition-all duration-200"
              >
                <span className="font-heading font-bold text-lg mb-1">{layer.id}</span>
                <span className="text-[10px] text-center leading-tight">
                  {layer.name.split(' ')[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content - Details Card with Image */}
          {LSF_LAYERS.map((layer) => (
            <TabsContent key={layer.id} value={`layer-${layer.id}`}>
              <Card className="mt-6 shadow-luxury-lg border-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                  {/* Coluna da Imagem (esquerda) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`image-${layer.id}`}
                      variants={imageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]"
                    >
                      <Image
                        src={layer.image}
                        alt={`Camada ${layer.id}: ${layer.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      {/* Overlay gradiente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

                      {/* Badge da camada sobre a imagem */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/80 text-white hover:bg-black/90 backdrop-blur-sm">
                          Camada {layer.id}
                        </Badge>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Coluna do Conteúdo (direita) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${layer.id}`}
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                      className="flex flex-col"
                    >
                      <CardHeader className="bg-black text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl font-heading">
                              {layer.name}
                            </CardTitle>
                            <p className="text-white/80 mt-2">{layer.description}</p>
                          </div>
                          <Badge className="bg-white text-black hover:bg-white/90 shrink-0 ml-4">
                            {layer.thickness}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 space-y-6 flex-1">
                        {/* Full Description */}
                        <p className="body-lg text-black-70 leading-relaxed">
                          {layer.fullDescription}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black-10">
                          <div>
                            <p className="text-sm font-medium text-black-50 mb-1">Espessura</p>
                            <p className="font-medium">{layer.thickness}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black-50 mb-1">Material</p>
                            <p className="font-medium">{layer.material}</p>
                          </div>
                        </div>

                        {/* Function Box */}
                        <div className="bg-black-5 rounded-lg p-4 mt-4">
                          <p className="text-sm font-medium mb-2">Função principal:</p>
                          <p className="text-black-70">{layer.function}</p>
                        </div>
                      </CardContent>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
