"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building,
  Layers,
  ClipboardCheck,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import type { ContentBlock } from "@/lib/types";

interface TransparencyItem extends ContentBlock {
  icon: LucideIcon;
}

const ICONS: LucideIcon[] = [Building, Layers, ClipboardCheck, DollarSign];

interface TransparencyAccordionProps {
  data: ContentBlock[];
}

export function TransparencyAccordion({ data }: TransparencyAccordionProps) {
  const items: TransparencyItem[] = data.map((block, i) => ({
    ...block,
    icon: ICONS[i] || Building,
  }));

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {items.map((item, index) => (
        <RevealOnScroll key={item.title} delay={index * 0.08}>
          <AccordionItem
            value={`item-${index}`}
            className="border border-black-10 px-6 py-1 data-[state=open]:border-black-30 transition-colors duration-300"
          >
            <AccordionTrigger className="hover:no-underline gap-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-black-50">
              <div className="flex items-center gap-4 text-left">
                <item.icon
                  className="w-5 h-5 text-black-50 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-heading text-base font-semibold tracking-tight">
                  {item.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 pb-5">
              <p className="body-md text-black-70 leading-relaxed">
                {item.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        </RevealOnScroll>
      ))}
    </Accordion>
  );
}
