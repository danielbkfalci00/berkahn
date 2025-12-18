"use client";

import { cn } from "@/lib/utils";

interface SlideSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function SlideSection({
  children,
  className,
  id,
  dark = false
}: SlideSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative min-h-[100dvh] w-full",
        "flex flex-col items-center justify-center",
        "px-6 py-16 lg:px-12 lg:py-24",
        "overflow-hidden",
        dark ? "bg-black text-white" : "bg-white text-black",
        className
      )}
    >
      {children}
    </section>
  );
}
