"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { slugifyQuestion, type FAQCategory } from "@/lib/faq-data";

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

function renderSegmentWithLinks(text: string, highlightTerm?: string, keyPrefix = ""): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = linkRegex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      const before = text.slice(lastIndex, m.index);
      nodes.push(<span key={`${keyPrefix}-t-${i++}`}>{highlightTerm ? highlightText(before, highlightTerm) : before}</span>);
    }
    const [, linkText, href] = m;
    const isExternal = /^https?:\/\//.test(href);
    nodes.push(
      <Link
        key={`${keyPrefix}-l-${i++}`}
        href={href}
        className="text-black underline underline-offset-2 hover:text-black-70 transition-colors"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {highlightTerm ? highlightText(linkText, highlightTerm) : linkText}
      </Link>
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    const rest = text.slice(lastIndex);
    nodes.push(<span key={`${keyPrefix}-t-${i++}`}>{highlightTerm ? highlightText(rest, highlightTerm) : rest}</span>);
  }
  return nodes.length > 0 ? nodes : (highlightTerm ? highlightText(text, highlightTerm) : text);
}

/** Parse **bold** markers, [text](url) links, and optionally apply search highlight */
function renderFormattedText(text: string, highlightTerm?: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const segments = parts.map((part, i) => {
    const isBold = i % 2 === 1;
    const content = renderSegmentWithLinks(part, highlightTerm, `s${i}`);
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
  // Auto-abre o accordion correspondente ao hash da URL (#slug-da-pergunta).
  // Permite que anchor links de LLMs/Google levem direto à resposta expandida.
  const [openByCategory, setOpenByCategory] = useState<Record<string, string>>({});

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      for (const category of categories) {
        const index = category.questions.findIndex(
          (q) => slugifyQuestion(q.question) === hash
        );
        if (index !== -1) {
          setOpenByCategory((prev) => ({
            ...prev,
            [category.id]: `${category.id}-${index}`,
          }));
          requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          break;
        }
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [categories]);

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
                value={openByCategory[category.id]}
                onValueChange={(v) =>
                  setOpenByCategory((prev) => ({ ...prev, [category.id]: v }))
                }
              >
                {category.questions.map((item, index) => {
                  const slug = slugifyQuestion(item.question);
                  return (
                  <AccordionItem
                    key={index}
                    id={slug}
                    value={`${category.id}-${index}`}
                    className="bg-white rounded-lg shadow-luxury-md px-4 sm:px-6 border-none scroll-mt-24"
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
                  );
                })}
              </Accordion>
            </div>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
