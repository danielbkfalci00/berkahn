"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, SearchX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQAccordionGroup } from "@/components/faq/FAQAccordionGroup";
import type { FAQCategory } from "@/lib/faq-data";

interface FAQSearchProps {
  categories: FAQCategory[];
}

export function FAQSearch({ categories }: FAQSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Debounce search term (250ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const normalize = useCallback((text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }, []);

  const filteredCategories = useMemo(() => {
    const term = normalize(debouncedTerm);

    return categories
      .map((category) => {
        // Filter by active category
        if (activeCategory && category.id !== activeCategory) {
          return { ...category, questions: [] };
        }

        // Filter by search term
        if (!term) return category;

        const filtered = category.questions.filter((q) => {
          const question = normalize(q.question);
          const answer = normalize(q.answer);
          return question.includes(term) || answer.includes(term);
        });

        return { ...category, questions: filtered };
      })
      .filter((cat) => cat.questions.length > 0);
  }, [categories, debouncedTerm, activeCategory, normalize]);

  // Compute per-category counts (respects current search term)
  const categoryCounts = useMemo(() => {
    const term = normalize(debouncedTerm);
    const counts: Record<string, number> = {};

    for (const cat of categories) {
      if (!term) {
        counts[cat.id] = cat.questions.length;
      } else {
        counts[cat.id] = cat.questions.filter((q) => {
          const question = normalize(q.question);
          const answer = normalize(q.answer);
          return question.includes(term) || answer.includes(term);
        }).length;
      }
    }

    return counts;
  }, [categories, debouncedTerm, normalize]);

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );

  const totalQuestions = categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );

  const isFiltering = debouncedTerm !== "" || activeCategory !== null;

  return (
    <div>
      {/* Sticky search + chips */}
      <div className="pb-6">
        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black-40" />
          <input
            type="text"
            placeholder="Buscar pergunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-lg border border-black-10 bg-white text-base shadow-luxury-sm placeholder:text-black-40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black-40 hover:text-black-70 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category chips with counts */}
        <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0",
              activeCategory === null
                ? "bg-black text-white"
                : "bg-black-5 text-black-60 hover:bg-black-10"
            )}
          >
            Todos
            <span className={cn(
              "ml-1.5",
              activeCategory === null ? "text-white/60" : "text-black-30"
            )}>
              ({totalQuestions})
            </span>
          </button>
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] ?? cat.questions.length;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0",
                  activeCategory === cat.id
                    ? "bg-black text-white"
                    : "bg-black-5 text-black-60 hover:bg-black-10"
                )}
              >
                {cat.label}
                <span className={cn(
                  "ml-1.5",
                  activeCategory === cat.id ? "text-white/60" : "text-black-30"
                )}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count (only when filtering) */}
      {isFiltering && (
        <p className="text-sm text-black-50 mb-8 mt-2">
          {totalResults === 0
            ? "Nenhum resultado encontrado"
            : `${totalResults} ${totalResults === 1 ? "resultado" : "resultados"} encontrado${totalResults === 1 ? "" : "s"}`}
        </p>
      )}

      {/* FAQ Accordion */}
      {filteredCategories.length > 0 ? (
        <FAQAccordionGroup
          categories={filteredCategories}
          highlightTerm={debouncedTerm}
        />
      ) : (
        <div className="text-center py-16">
          <SearchX className="w-10 h-10 text-black-20 mx-auto mb-4" />
          <p className="text-black-50 body-lg mb-2">
            Nenhuma pergunta encontrada
          </p>
          <p className="text-black-40 body-md">
            Tente buscar por outro termo ou{" "}
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory(null);
              }}
              className="underline hover:text-black-70 transition-colors"
            >
              limpe os filtros
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
