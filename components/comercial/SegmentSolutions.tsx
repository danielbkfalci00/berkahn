"use client";

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { SegmentSolution } from "@/lib/comercial-data";

interface SegmentSolutionsProps {
  data: SegmentSolution[];
}

export function SegmentSolutions({ data }: SegmentSolutionsProps) {
  return (
    <Tabs defaultValue={data[0]?.id} className="w-full">
      {/* Tab Triggers */}
      <TabsList className="w-full h-auto bg-transparent p-0 justify-start gap-0 rounded-none border-b border-black-10 mb-10 md:mb-12 overflow-x-auto flex-nowrap">
        {data.map((segment) => (
          <TabsTrigger
            key={segment.id}
            value={segment.id}
            className="relative rounded-none border-b-2 border-transparent px-5 py-4 text-sm font-medium uppercase tracking-wider text-black-50 transition-all whitespace-nowrap shadow-none bg-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-black-70"
          >
            {segment.tabLabel}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Panels */}
      {data.map((segment) => (
        <TabsContent key={segment.id} value={segment.id} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image */}
            <RevealOnScroll>
              <div className="relative aspect-[4/3] overflow-hidden bg-black-5">
                <Image
                  src={segment.image}
                  alt={segment.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>

            {/* Text Content */}
            <RevealOnScroll delay={0.15}>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-6 tracking-tight">
                  {segment.title}
                </h3>
                <div className="space-y-5">
                  {segment.paragraphs.map((paragraph, i) => (
                    <p key={i} className="body-lg text-black-70 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
