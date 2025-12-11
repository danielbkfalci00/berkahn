"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TECHNICAL_SPECS } from "@/lib/lsf-data";

export function TechnicalSpecs() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {TECHNICAL_SPECS.map((category, index) => (
        <AccordionItem
          key={category.category}
          value={`item-${index}`}
          className="bg-white rounded-lg shadow-luxury-md px-6 border-none"
        >
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-heading text-lg">
                {index + 1}
              </div>
              <span className="headline-sm text-left">{category.category}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-14 space-y-4">
              {category.specs.map((spec, specIndex) => (
                <div
                  key={specIndex}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 py-3 border-b border-black-10 last:border-b-0"
                >
                  <div className="body-md font-medium">{spec.label}</div>
                  <div className="body-md text-black-70">{spec.value}</div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
