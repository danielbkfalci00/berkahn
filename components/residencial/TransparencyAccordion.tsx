"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ContentBlock } from "@/lib/types";

interface TransparencyAccordionProps {
  items: ContentBlock[];
}

export function TransparencyAccordion({ items }: TransparencyAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-black-10">
          <AccordionTrigger className="text-left font-heading text-lg font-semibold py-6 hover:no-underline">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="body-md text-black-70 leading-relaxed pb-6">
            {item.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
