"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import type { BlogPost } from "@/types/blog";

interface HeroEditorialProps {
  post?: BlogPost;
}

/**
 * Abertura de /atualidades: o artigo em destaque ocupa a primeira tela, com a
 * capa de borda a borda e o texto por cima, e a pílula da navbar passa
 * transparente sobre ela (a rota está em FULL_BLEED_ROUTES).
 *
 * Antes: título "Atualidades" pequeno, destaque espremido numa caixa com réguas
 * de 3px e rótulos em fonte monoespaçada, e uma faixa branca sobrando acima do
 * bloco preto por causa do espaço reservado ao header antigo.
 *
 * O H1 continua sendo o nome da seção, pequeno, para a página ter um título
 * que não muda a cada artigo destacado. O título do artigo é o H2.
 *
 * Um bloco só, ancorado embaixo: com um segundo bloco no topo e
 * justify-between, em notebooks de ~800px de altura os dois se encostavam e o
 * botão saía cortado. A frase da seção foi para o cabeçalho da lista. O título
 * escala também pela altura da tela, para caber em duas ou três linhas.
 */
export function HeroEditorial({ post }: HeroEditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const photo = root.querySelector<HTMLElement>("[data-hero-photo]");
        const text = root.querySelector<HTMLElement>("[data-hero-text]");
        const scrollTrigger = { trigger: root, start: "top top", end: "bottom top", scrub: 0.4 };
        if (photo) gsap.fromTo(photo, { scale: 1.06, yPercent: 0 }, { scale: 1, yPercent: 10, ease: "none", scrollTrigger });
        if (text) gsap.to(text, { yPercent: -12, autoAlpha: 0.2, ease: "none", scrollTrigger: { ...scrollTrigger, start: "40% top" } });
      });
    },
    { scope: sectionRef }
  );

  if (!post) {
    return (
      <section className="bg-carbon pb-16 pt-40 text-white">
        <div className="container">
          <h1 className="font-display text-[clamp(3rem,6vw,6rem)] font-semibold tracking-[-0.045em]">Atualidades</h1>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[92svh] min-h-[620px] overflow-hidden bg-carbon text-white">
      <div data-hero-photo className="absolute inset-0 will-change-transform">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="(max-width: 767px) 100vh, max(100vw, 160vh)"
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5)_0%,rgba(0,0,0,.1)_28%,rgba(0,0,0,.35)_55%,rgba(0,0,0,.9)_100%)]"
        aria-hidden="true"
      />
      {/* Escurece o lado do texto, onde a foto costuma ter mais detalhe. */}
      <div
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,.6)_0%,rgba(0,0,0,.3)_45%,rgba(0,0,0,0)_75%)] md:block"
        aria-hidden="true"
      />

      <div data-hero-text className="relative flex h-full flex-col justify-end pb-12 pt-28 md:pb-14 md:pt-32">
        <div className="container">
          <h1 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/70">Atualidades</h1>
          <Link
            href={`/atualidades/${post.slug}`}
            prefetch={false}
            className="group block max-w-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white">
              <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-white/60" aria-hidden="true" />
              Em destaque · {post.category}
            </p>
            <h2 className="mt-4 max-w-[24ch] text-balance font-display text-[clamp(2.2rem,min(1rem+4vw,7.2vh),4.4rem)] font-semibold leading-[1] tracking-[-0.04em] [text-shadow:0_2px_30px_rgba(0,0,0,.35)]">
              {post.title}
            </h2>
            <p className="mt-5 line-clamp-2 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 font-medium text-black transition-colors duration-300 group-hover:bg-white/85">
                Ler artigo
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <span className="text-white/70">
                {post.date} · {post.readTime} de leitura
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
