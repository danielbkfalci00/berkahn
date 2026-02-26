"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArticleFAQ } from "@/types/article";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  faq: ArticleFAQ;
  className?: string;
}

export function FAQSection({ faq, className = "" }: FAQSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Group questions by category if categories exist
  const hasCategories = faq.questions.some((q) => q.category);
  const categories = hasCategories
    ? Array.from(new Set(faq.questions.map((q) => q.category || "Geral")))
    : [];

  const getQuestionsByCategory = (category: string) => {
    return faq.questions.filter(
      (q) => (q.category || "Geral") === category
    );
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      {faq.title && (
        <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
          <h3 className="headline-sm">{faq.title}</h3>
        </div>
      )}

      {/* FAQ Content */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        {hasCategories ? (
          // Render by category
          <div className="space-y-8">
            {categories.map((category, catIndex) => (
              <div key={catIndex}>
                <h4 className="text-lg font-heading font-semibold mb-4 text-black">
                  {category}
                </h4>
                <Accordion type="single" collapsible className="w-full">
                  {getQuestionsByCategory(category).map((item, index) => (
                    <AccordionItem
                      key={`${catIndex}-${index}`}
                      value={`item-${catIndex}-${index}`}
                      className="border-b border-black-10 last:border-b-0"
                    >
                      <AccordionTrigger className="text-left py-4 text-base font-medium text-black hover:text-black-70 transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-black-70 leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          // Render without categories
          <Accordion type="single" collapsible className="w-full">
            {faq.questions.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-black-10 last:border-b-0"
              >
                <AccordionTrigger className="text-left py-4 text-base font-medium text-black hover:text-black-70 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-black-70 leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Footer with structured data hint */}
      <div className="px-4 md:px-6 lg:px-8 pb-6 pt-4 border-t border-black-10">
        <p className="text-xs text-black-50 text-center">
          💡 Não encontrou sua dúvida? Entre em contato conosco
        </p>
      </div>

      {/* Schema.org FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.questions.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </motion.div>
  );
}
