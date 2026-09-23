"use client";

import { cn } from "@/lib/utils";
import type { BlogCategoryFilter } from "@/types/blog";

export interface CategoryFilterItem {
  category: BlogCategoryFilter;
  count: number;
}

interface CategoryFilterProps {
  categories: CategoryFilterItem[];
  activeCategory: BlogCategoryFilter;
  onCategoryChange: (category: BlogCategoryFilter) => void;
}

/**
 * Filtro por categoria em pílulas, no mesmo idioma da navbar.
 *
 * Deixou de ser fixo no topo: era uma tabela de células presa logo abaixo da
 * navbar antiga, e com a pílula flutuante as duas se sobrepunham. No celular a
 * fileira rola na horizontal.
 */
export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por categoria" className="-mx-6 overflow-x-auto px-6 scrollbar-hide sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
      <div className="flex w-max gap-2">
        {categories.map(({ category, count }) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black-10 bg-white text-black-70 hover:border-black-30 hover:text-black"
              )}
            >
              {category}
              <span className={cn("text-xs tabular-nums", isActive ? "text-white/60" : "text-black-50")}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
