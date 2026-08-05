"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import { Button } from "@/components/ui/button";

/**
 * Hero pinado com scrub por scroll (estilo Apple): o drone atravessa a casa
 * na medida em que o usuário rola. Sequência de frames WebP desenhada em
 * canvas — <video currentTime> por scroll é instável, frames não são.
 *
 * - Runway de 260vh (motion-safe); viewport fica preso via position: sticky
 * - Poster = LCP (pinta no SSR); o canvas assume no primeiro frame carregado
 * - Preload em estágios: 10 primeiros frames imediatos, resto em background;
 *   o draw usa o frame carregado mais próximo (nunca trava esperando rede)
 * - Mobile usa sequência própria (44 frames, 640px, ~1,2 MB)
 * - prefers-reduced-motion: sem runway, sem pin, poster estático + texto
 */
const FRAME_COUNT_DESKTOP = 88;
const FRAME_COUNT_MOBILE = 44;

const framePath = (index: number, isMobile: boolean) =>
  `/videos/hero/${isMobile ? "seq-m" : "seq"}/f_${String(index + 1).padStart(3, "0")}.webp`;

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        const context2d = canvas?.getContext("2d");
        if (!section || !canvas || !context2d) return;

        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const frameCount = isMobile ? FRAME_COUNT_MOBILE : FRAME_COUNT_DESKTOP;
        const images: HTMLImageElement[] = new Array(frameCount);
        const isLoaded: boolean[] = new Array(frameCount).fill(false);
        let currentIndex = 0;
        let isPosterHidden = false;

        // Desenha o frame carregado mais próximo (para trás) do índice pedido
        const draw = (index: number) => {
          let nearest = Math.min(index, frameCount - 1);
          while (nearest > 0 && !isLoaded[nearest]) nearest--;
          if (!isLoaded[nearest]) return;

          const img = images[nearest];
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
          const w = img.naturalWidth * scale;
          const h = img.naturalHeight * scale;
          context2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);

          if (!isPosterHidden && posterWrapRef.current) {
            posterWrapRef.current.style.opacity = "0";
            isPosterHidden = true;
          }
        };

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(canvas.clientWidth * dpr);
          canvas.height = Math.round(canvas.clientHeight * dpr);
          draw(currentIndex);
        };
        resize();
        window.addEventListener("resize", resize);

        // Preload em estágios
        const loadFrame = (index: number) => {
          const img = new window.Image();
          img.src = framePath(index, isMobile);
          img.onload = () => {
            isLoaded[index] = true;
            if (Math.abs(index - currentIndex) <= 2) draw(currentIndex);
          };
          images[index] = img;
        };

        const EAGER_FRAMES = Math.min(10, frameCount);
        for (let i = 0; i < EAGER_FRAMES; i++) loadFrame(i);

        let nextToLoad = EAGER_FRAMES;
        let backgroundLoader: ReturnType<typeof setTimeout> | undefined;
        const loadRemaining = () => {
          if (nextToLoad >= frameCount) return;
          loadFrame(nextToLoad++);
          backgroundLoader = setTimeout(loadRemaining, 35);
        };
        loadRemaining();

        // Master timeline scrubada ao longo do runway inteiro
        const frameState = { frame: 0 };
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        master
          .to(
            frameState,
            {
              frame: frameCount - 1,
              duration: 1,
              ease: "none",
              onUpdate: () => {
                const index = Math.round(frameState.frame);
                if (index !== currentIndex) {
                  currentIndex = index;
                  draw(index);
                }
              },
            },
            0
          )
          // Coreografia dos textos: cue some cedo; conteúdo sobe e limpa a
          // tela antes da revelação final da piscina
          .to("[data-hero-foot]", { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.06)
          .to(
            contentRef.current,
            { yPercent: -24, autoAlpha: 0, duration: 0.32, ease: "none" },
            0.48
          );

        // Entrada (tempo, não scroll): reveal por linha
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .from("[data-hero-label]", { autoAlpha: 0, y: 16, duration: 0.7 }, 0.15)
          .from(
            "[data-hero-bar]",
            { scaleX: 0, transformOrigin: "left center", duration: 0.8 },
            0.2
          )
          .from("[data-hero-line]", { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.25)
          .from("[data-hero-sub]", { autoAlpha: 0, y: 24, duration: 0.9 }, 0.8)
          .from("[data-hero-cta]", { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.95)
          .from("[data-hero-foot]", { autoAlpha: 0, duration: 0.9 }, 1.15);

        return () => {
          window.removeEventListener("resize", resize);
          if (backgroundLoader) clearTimeout(backgroundLoader);
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-carbon h-[100svh] motion-safe:h-[260vh]">
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        {/* Poster: LCP e fallback (reduced-motion / sem JS / frames carregando) */}
        <div
          ref={posterWrapRef}
          className="absolute inset-0 transition-opacity duration-500"
        >
          <Image
            src="/videos/hero/hero-poster.webp"
            alt="Interior de residência de alto padrão construída pela Berkahn em Light Steel Frame"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Sequência scrubada pelo scroll */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Vinheta para legibilidade do texto e das anotações */}
        <div className="absolute inset-0 hero-overlay-vignette" aria-hidden="true" />

        {/* Conteúdo — composição lower-left */}
        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col justify-end pb-28 md:pb-32 pl-6 pr-6 md:pl-16 lg:pl-24 max-w-[1100px]"
        >
          <p
            data-hero-label
            className="font-tech text-xs md:text-sm lowercase tracking-wide text-white-70 mb-5"
          >
            construtora · light steel frame · são paulo
          </p>

          <div
            data-hero-bar
            className="h-[3px] w-14 bg-bronze mb-7"
            aria-hidden="true"
          />

          <h1 className="headline-hero hero-text-shadow mb-7">
            <span className="block overflow-hidden">
              <span data-hero-line className="block md:whitespace-nowrap">
                Especialistas em Light Steel Frame
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block md:whitespace-nowrap">
                Mestres em Construir
              </span>
            </span>
          </h1>

          <p
            data-hero-sub
            className="max-w-xl text-base md:text-lg text-white-70 leading-relaxed mb-9"
          >
            Construímos com a tecnologia certa para cada projeto. Residencial
            ou comercial, simples ou complexo.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div data-hero-cta>
              <ContactFormDialog ctaLocation="home_hero">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-black hover:bg-off-white px-8 text-xs uppercase tracking-wider font-semibold"
                >
                  Fale conosco
                </Button>
              </ContactFormDialog>
            </div>
            <div data-hero-cta>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white-30 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 text-xs uppercase tracking-wider font-semibold"
              >
                <Link href="#projetos">Ver projetos</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Rodapé técnico do hero */}
        <div
          data-hero-foot
          className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between pb-8 pl-6 pr-6 md:pl-16 md:pr-16 lg:pl-24"
        >
          <div className="h-12 w-px bg-white-50 animate-scroll-cue" aria-hidden="true" />
          <p className="hidden md:block font-tech text-xs lowercase tracking-wide text-white-50">
            obra seca · prazo previsível · estrutura leve
          </p>
        </div>
      </div>
    </section>
  );
}
