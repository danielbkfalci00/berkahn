"use client";

import { motion } from "framer-motion";
import { PROJECT_CATEGORIES } from "@/data/projects";
import { ProjectCategory } from "@/types/project";

interface CategoryFilterProps {
  activeCategory: ProjectCategory | "all";
  onCategoryChange: (category: ProjectCategory | "all") => void;
  className?: string;
}

const categories = [
  { id: "all" as const, name: "Todos", namePlural: "Todos" },
  ...PROJECT_CATEGORIES,
];

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 md:gap-4 ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className="relative px-4 py-2 text-sm md:text-base font-medium transition-colors duration-300"
        >
          <span
            className={`relative z-10 transition-colors duration-300 ${
              activeCategory === category.id
                ? "text-black"
                : "text-black-50 hover:text-black"
            }`}
          >
            {category.name}
          </span>

          {/* Active indicator - animated underline */}
          {activeCategory === category.id && (
            <motion.div
              layoutId="activeCategory"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// Pill-style variant
export function CategoryFilterPills({
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
            activeCategory === category.id
              ? "bg-black text-white"
              : "bg-black-5 text-black-70 hover:bg-black-10 hover:text-black"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
}

// Minimal line variant
export function CategoryFilterMinimal({
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-8 ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className="group relative py-2"
        >
          <span
            className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
              activeCategory === category.id
                ? "text-black"
                : "text-black-30 group-hover:text-black-70"
            }`}
          >
            {category.name}
          </span>

          {/* Hover line */}
          <span
            className={`absolute bottom-0 left-0 h-px bg-black transition-all duration-500 ease-expo ${
              activeCategory === category.id
                ? "w-full"
                : "w-0 group-hover:w-full"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
