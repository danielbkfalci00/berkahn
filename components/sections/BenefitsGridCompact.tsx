"use client";

import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BENEFITS } from "@/lib/lsf-data";

// Selecionar os 4 principais benefícios
const MAIN_BENEFITS = BENEFITS.slice(0, 4);

// SVG Icons (minimal, luxury style) - mesmos do BenefitsGrid
const icons = {
  speed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  sustainability: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  ),
  energy: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  acoustic: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  ),
};

export function BenefitsGridCompact() {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <p className="label-text text-black-50 text-center mb-4">
            POR QUE LIGHT STEEL FRAME?
          </p>
          <h2 className="headline-md text-center mb-12">
            Vantagens do Sistema
          </h2>
        </RevealOnScroll>

        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {MAIN_BENEFITS.map((benefit, index) => (
              <RevealOnScroll key={benefit.title} delay={index * 0.1}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-300 text-center cursor-pointer group">
                      {/* Icon */}
                      <div className="flex justify-center text-black group-hover:scale-110 transition-transform duration-300 mb-4">
                        {icons[benefit.icon as keyof typeof icons]}
                      </div>

                      {/* Stat with CountUp */}
                      <div className="mb-2">
                        <CountUp
                          end={benefit.stat}
                          suffix={benefit.suffix}
                          className="text-3xl md:text-4xl font-heading font-light"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm md:text-base font-medium text-black">
                        {benefit.title}
                      </h3>

                      {/* Hint para hover */}
                      <p className="text-xs text-black-30 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Toque para detalhes
                      </p>
                    </div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="bottom"
                    className="max-w-xs p-4 bg-black text-white border-none"
                  >
                    <p className="font-medium mb-2">{benefit.description}</p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {benefit.details}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </RevealOnScroll>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
