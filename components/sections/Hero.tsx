"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
          alt="Construção em Steel Frame"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-left">
        <div className="hero-content-left">
          {/* Decorative Line */}
          <RevealOnScroll delay={0.1}>
            <div className="hero-decorative-line w-24 mb-8" />
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <p className="hero-label text-white mb-6 hero-text-shadow">Erguendo o amanhã</p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.4}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight text-white hero-text-shadow-strong">
              #WELOVESTEELFRAME
            </h1>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
