"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { MaterialSpecSheet } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, ExternalLink, FileText } from "lucide-react";

interface SpecificationSheetProps {
  specSheet: MaterialSpecSheet;
  className?: string;
}

export function SpecificationSheet({
  specSheet,
  className = "",
}: SpecificationSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
        <div className="flex items-start gap-4">
          {/* Image */}
          {specSheet.image && (
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-black-5 rounded-lg overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={specSheet.image}
                  alt={specSheet.material}
                  fill
                  sizes="(max-width: 767px) 80px, 96px"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="headline-sm mb-1">{specSheet.material}</h3>
                {specSheet.manufacturer && (
                  <p className="text-sm text-black-60">
                    Fabricante: {specSheet.manufacturer}
                  </p>
                )}
              </div>

              {/* Datasheet Download */}
              {specSheet.datasheetUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-shrink-0"
                >
                  <a
                    href={specSheet.datasheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Datasheet PDF
                  </a>
                </Button>
              )}
            </div>

            {/* Category and Certifications */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {specSheet.category && (
                <Badge variant="secondary">{specSheet.category}</Badge>
              )}
              {specSheet.certifications?.map((cert, index) => (
                <Badge key={index} variant="outline" className="font-mono text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <Accordion type="multiple" defaultValue={["spec-0"]} className="w-full">
          {specSheet.specifications.map((spec, specIndex) => (
            <AccordionItem
              key={specIndex}
              value={`spec-${specIndex}`}
              className="border-b border-black-10 last:border-b-0"
            >
              <AccordionTrigger className="text-left py-4 text-base font-heading font-semibold hover:text-black-70">
                {spec.category}
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-black-5">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-black-70">
                          Propriedade
                        </th>
                        <th className="text-left py-2 px-3 font-medium text-black-70">
                          Valor
                        </th>
                        {spec.items.some((item) => item.tolerance) && (
                          <th className="text-left py-2 px-3 font-medium text-black-70">
                            Tolerância
                          </th>
                        )}
                        {spec.items.some((item) => item.standard) && (
                          <th className="text-left py-2 px-3 font-medium text-black-70">
                            Norma
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {spec.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          className="border-b border-black-5 last:border-b-0"
                        >
                          <td className="py-2.5 px-3 text-black-70">
                            {item.property}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {item.value}
                            {item.unit && (
                              <span className="text-black-50 ml-1">
                                {item.unit}
                              </span>
                            )}
                          </td>
                          {spec.items.some((i) => i.tolerance) && (
                            <td className="py-2.5 px-3 text-black-60 font-mono text-xs">
                              {item.tolerance || "-"}
                            </td>
                          )}
                          {spec.items.some((i) => i.standard) && (
                            <td className="py-2.5 px-3">
                              {item.standard ? (
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {item.standard}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Applications */}
        {specSheet.applications && specSheet.applications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-black-10">
            <h4 className="font-heading font-semibold text-sm mb-3">
              Aplicações
            </h4>
            <ul className="grid gap-2 md:grid-cols-2">
              {specSheet.applications.map((app, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-black-70"
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  {app}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {specSheet.notes && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Observações:</strong> {specSheet.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black-10">
          <p className="text-xs text-black-50">
            Especificações sujeitas a alterações sem aviso prévio
          </p>
          {specSheet.datasheetUrl && (
            <Button variant="default" size="sm" asChild>
              <a
                href={specSheet.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Completo
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
