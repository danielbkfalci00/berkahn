"use client";

import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

interface Benefit {
  title: string;
  description: string;
  image: string;
}

interface BenefitsScrollSectionProps {
  benefits: Benefit[];
}

export function BenefitsScrollSection({ benefits }: BenefitsScrollSectionProps) {
  const content = benefits.map((benefit) => ({
    title: benefit.title,
    description: benefit.description,
    content: (
      <div className="relative w-full h-full">
        <Image
          src={benefit.image}
          alt={benefit.title}
          fill
          className="object-cover rounded-lg"
          sizes="384px"
        />
      </div>
    ),
  }));

  return <StickyScroll content={content} />;
}
