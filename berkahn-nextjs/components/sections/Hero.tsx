"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black-70 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <RevealOnScroll delay={0.2}>
          <p className="label-text text-white mb-4">Erguendo o amanhã</p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.4}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight text-white">
            #WELOVESTEELFRAME
          </h1>
        </RevealOnScroll>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white-30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white-50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
