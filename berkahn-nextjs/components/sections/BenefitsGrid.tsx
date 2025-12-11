"use client";

import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { BENEFITS } from "@/lib/lsf-data";

// SVG Icons (minimal, luxury style)
const icons = {
  speed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12 mb-4"
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
      className="w-12 h-12 mb-4"
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
      className="w-12 h-12 mb-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.25v19.5"
      />
    </svg>
  ),
  durability: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12 mb-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
};

export function BenefitsGrid() {
  return (
    <section className="py-xl">
      <div className="container">
        <RevealOnScroll>
          <h2 className="headline-md text-center mb-12">
            Vantagens do Light Steel Frame
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <RevealOnScroll key={benefit.title} delay={index * 0.1}>
              <div className="bg-white p-8 rounded-lg shadow-luxury-md hover:shadow-luxury-xl transition-shadow duration-300 text-center group">
                {/* Icon */}
                <div className="flex justify-center text-black group-hover:scale-110 transition-transform duration-300">
                  {icons[benefit.icon as keyof typeof icons]}
                </div>

                {/* Stat with CountUp */}
                <div className="mb-4">
                  <CountUp
                    end={benefit.stat}
                    suffix={benefit.suffix}
                    className="text-4xl md:text-5xl font-heading font-light"
                  />
                </div>

                {/* Title */}
                <h3 className="headline-sm mb-3">{benefit.title}</h3>

                {/* Description */}
                <p className="body-md text-black-70 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Divider */}
                <div className="mt-6 pt-6 border-t border-black-10">
                  <p className="text-sm text-black-50">{benefit.details}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
