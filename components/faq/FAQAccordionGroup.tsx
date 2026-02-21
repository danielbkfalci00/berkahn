"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Wrench,
  ClipboardList,
  DollarSign,
  Shield,
  Building2,
} from "lucide-react";
import type { FAQCategory } from "@/lib/faq-data";

function highlightText(text: string, term: string): React.ReactNode {
  if (!term) return text;

  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizedText = normalize(text);
  const normalizedTerm = normalize(term);
  const index = normalizedText.indexOf(normalizedTerm);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + term.length);
  const after = text.slice(index + term.length);

  return (
    <>
      {before}
      <mark className="bg-yellow-200/60 text-inherit rounded-sm px-0.5">
        {match}
      </mark>
      {after}
    </>
  );
}

/** Parse **bold** markers and optionally apply search highlight */
function renderFormattedText(text: string, highlightTerm?: string): React.ReactNode {
  // Split on **bold** pattern, capturing the bold content
  const parts = text.split(/\*\*(.+?)\*\*/g);

  // parts alternates: [normal, bold, normal, bold, ...]
  const segments = parts.map((part, i) => {
    const isBold = i % 2 === 1;
    const content = highlightTerm ? highlightText(part, highlightTerm) : part;

    if (isBold) {
      return (
        <strong key={i} className="font-semibold text-black">
          {content}
        </strong>
      );
    }
    return <span key={i}>{content}</span>;
  });

  return <>{segments}</>;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  tecnologia: Wrench,
  processo: ClipboardList,
  financeiro: DollarSign,
  "pos-obra": Shield,
  empresa: Building2,
};

interface FAQAccordionGroupProps {
  categories: FAQCategory[];
  highlightTerm?: string;
}

export function FAQAccordionGroup({ categories, highlightTerm = "" }: FAQAccordionGroupProps) {
  return (
    <div className="space-y-10">
      {categories.map((category, catIndex) => {
        const Icon = CATEGORY_ICONS[category.id] || Wrench;

        return (
          <RevealOnScroll key={category.id} delay={catIndex * 0.1}>
            <div>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-5 h-5 text-black-50" strokeWidth={1.5} />
                <h3 className="headline-sm">{category.label}</h3>
                <span className="text-sm text-black-30 font-normal">
                  · {category.questions.length} {category.questions.length === 1 ? "pergunta" : "perguntas"}
                </span>
              </div>

              {/* Questions accordion */}
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-4"
              >
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.id}-${index}`}
                    className="bg-white rounded-lg shadow-luxury-md px-4 sm:px-6 border-none"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <span className="font-medium text-base text-left">
                        {highlightTerm ? highlightText(item.question, highlightTerm) : item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="body-md text-black-70 leading-relaxed">
                        {renderFormattedText(item.answer, highlightTerm || undefined)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
