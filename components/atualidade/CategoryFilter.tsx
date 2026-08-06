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

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <section
      aria-label="Índice de categorias"
      className="sticky top-[72px] z-40 border-b-[3px] border-black bg-off-white"
    >
      <div className="container">
        <div className="flex snap-x snap-mandatory items-stretch overflow-x-auto scrollbar-hide">
          {categories.map(({ category, count }) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "group flex min-h-16 shrink-0 snap-start items-center gap-3 border-r border-black-10 px-4 font-tech text-[10px] lowercase tracking-wide transition-colors duration-300 first:border-l md:min-h-[72px] md:px-5 md:text-xs",
                  "focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-black",
                  isActive
                    ? "bg-black text-white"
                    : "text-black-50 hover:bg-white hover:text-black"
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    isActive ? "text-white-50" : "text-black-30"
                  )}
                >
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
