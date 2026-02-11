"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LSF_FAQ } from "@/lib/lsf-data";

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {LSF_FAQ.map((item, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className="bg-white rounded-lg shadow-luxury-md px-6 border-none"
        >
          <AccordionTrigger className="hover:no-underline py-6">
            <span className="font-medium text-base text-left">
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <p className="body-md text-black-70 leading-relaxed">
              {item.answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
