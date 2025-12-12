"use client";

import React from "react";
import { Project } from "@/types/project";
import { getSpecificationName } from "@/data/projects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Check, Minus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectModelsProps {
  project: Project;
}

export function ProjectModels({ project }: ProjectModelsProps) {
  const { models, specifications } = project;

  if (models.length === 0) return null;

  // Agrupa especificações por categoria
  const specsByCategory: Record<string, typeof specifications> = {};
  specifications.forEach((spec) => {
    if (!specsByCategory[spec.category]) {
      specsByCategory[spec.category] = [];
    }
    specsByCategory[spec.category].push(spec);
  });

  // Encontra o modelo mais completo (para destaque)
  const mostCompleteModelId = models.reduce((prev, current) => {
    const prevCount = prev.features.filter((f) => f.included).length;
    const currentCount = current.features.filter((f) => f.included).length;
    return currentCount > prevCount ? current : prev;
  }).id;

  return (
    <RevealOnScroll>
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="border-black/10 hover:bg-transparent">
                <TableHead className="w-[250px] font-heading text-black text-base">
                  Item
                </TableHead>
                {models.map((model) => (
                  <TableHead
                    key={model.id}
                    className={`text-center min-w-[100px] ${
                      model.id === mostCompleteModelId
                        ? "bg-gradient-to-b from-black to-black/90 text-white"
                        : "bg-black-5/30"
                    }`}
                  >
                    <div className="space-y-1">
                      {model.id === mostCompleteModelId && (
                        <Badge
                          variant="secondary"
                          className="bg-white text-black text-[10px] mb-1 font-semibold"
                        >
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Recomendado
                        </Badge>
                      )}
                      <div
                        className={`font-heading font-medium text-sm ${
                          model.id === mostCompleteModelId
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {model.shortName || model.name}
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(specsByCategory).map(
                ([category, specs], categoryIndex) => (
                  <React.Fragment key={`category-${category}`}>
                    {/* Category Header */}
                    <TableRow
                      className="bg-black-5/50 hover:bg-black-5/50"
                    >
                      <TableCell
                        colSpan={models.length + 1}
                        className="font-semibold text-xs uppercase tracking-[0.15em] text-black-50 py-3 border-l-2 border-black/20"
                      >
                        {category}
                      </TableCell>
                    </TableRow>

                    {/* Specs in category */}
                    {specs.map((spec, specIndex) => (
                      <TableRow
                        key={spec.id}
                        className={cn(
                          "border-black/5 transition-all duration-200",
                          specIndex % 2 === 0 ? "bg-white" : "bg-black-5/20",
                          "hover:bg-black-5/40 hover:shadow-luxury-sm"
                        )}
                      >
                        <TableCell className="font-medium text-sm text-black-70">
                          {spec.name}
                        </TableCell>
                        {models.map((model) => {
                          const feature = model.features.find(
                            (f) => f.name === spec.id
                          );
                          const included = feature?.included || false;

                          return (
                            <TableCell
                              key={`${model.id}-${spec.id}`}
                              className={`text-center ${
                                model.id === mostCompleteModelId
                                  ? "bg-black/5"
                                  : ""
                              }`}
                            >
                              {included ? (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 border border-black/10 rounded-full flex items-center justify-center">
                                    <Minus className="w-3 h-3 text-black/30" />
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-black-70">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <span>Incluso no modelo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-black/10 rounded-full flex items-center justify-center">
            <Minus className="w-3 h-3 text-black/30" />
          </div>
          <span>Não incluso</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="body-md text-black-70 mb-6">
          Dúvidas sobre qual modelo escolher? Nossa equipe pode ajudar você a
          encontrar a melhor opção para seu projeto.
        </p>
        <a
          href="/contato"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-medium hover:bg-black-90 transition-colors duration-300"
        >
          Falar com um Especialista
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </RevealOnScroll>
  );
}
