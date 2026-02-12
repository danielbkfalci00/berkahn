"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { ContentBlock } from "@/lib/types";

interface ContentBlocksGridProps {
  data: ContentBlock[];
  columns?: 2 | 3;
}

export function ContentBlocksGrid({ data, columns = 3 }: ContentBlocksGridProps) {
  return (
    <div
      className={`grid grid-cols-1 ${
        columns === 3
          ? "md:grid-cols-2 lg:grid-cols-3"
          : "md:grid-cols-2"
      } gap-8`}
    >
      {data.map((block, index) => (
        <RevealOnScroll key={block.title} delay={index * 0.1}>
          <div className="p-8 bg-white border border-black-10 hover:border-black-30 transition-colors duration-300">
            <h3 className="font-heading text-lg font-semibold mb-4 tracking-tight">
              {block.title}
            </h3>
            <p className="body-md text-black-70 leading-relaxed">
              {block.description}
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
