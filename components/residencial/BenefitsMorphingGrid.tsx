"use client";

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import { PlusIcon } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  image: string;
}

interface BenefitsMorphingGridProps {
  benefits: Benefit[];
}

export function BenefitsMorphingGrid({ benefits }: BenefitsMorphingGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit) => (
        <MorphingDialog
          key={benefit.title}
          transition={{
            type: "spring",
            bounce: 0.05,
            duration: 0.25,
          }}
        >
          <MorphingDialogTrigger
            style={{ borderRadius: "12px" }}
            className="flex w-full flex-col overflow-hidden border border-black-10 bg-white text-left"
          >
            <MorphingDialogImage
              src={benefit.image}
              alt={benefit.title}
              className="h-48 w-full object-cover"
            />
            <div className="flex grow flex-row items-end justify-between px-4 py-3">
              <MorphingDialogTitle className="font-heading font-semibold text-black text-sm leading-snug">
                {benefit.title}
              </MorphingDialogTitle>
              <span
                className="relative ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-black-10 text-black-50 transition-colors hover:bg-black-5 hover:text-black"
                aria-label="Expandir"
              >
                <PlusIcon size={12} />
              </span>
            </div>
          </MorphingDialogTrigger>

          <MorphingDialogContainer>
            <MorphingDialogContent
              style={{ borderRadius: "24px" }}
              className="pointer-events-auto relative flex h-auto w-[calc(100%-2rem)] max-h-[80vh] flex-col overflow-hidden border border-black-10 bg-white sm:w-[420px]"
            >
              <MorphingDialogImage
                src={benefit.image}
                alt={benefit.title}
                className="h-48 w-full shrink-0 object-cover"
              />
              <div className="overflow-y-auto p-6">
                <MorphingDialogTitle className="font-heading font-semibold text-black text-xl">
                  {benefit.title}
                </MorphingDialogTitle>
                <MorphingDialogDescription
                  disableLayoutAnimation
                  variants={{
                    initial: { opacity: 0, scale: 0.8, y: 100 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.8, y: 100 },
                  }}
                >
                  <p className="mt-3 body-md text-black-70 leading-relaxed">
                    {benefit.description}
                  </p>
                </MorphingDialogDescription>
              </div>
              <MorphingDialogClose className="text-white bg-black/50 backdrop-blur-sm rounded-full p-1.5" />
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  );
}
