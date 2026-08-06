"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import { Button } from "@/components/ui/button";

/**
 * Hero pinado com scrub por scroll: o drone percorre uma estrutura em aço e
 * avança até um ambiente finalizado conforme o usuário rola. A sequência WebP
 * é desenhada em canvas para evitar a instabilidade de <video currentTime>.
 *
 * - Runway de 260vh (motion-safe); viewport preso via position: sticky
 * - Poster = LCP e fallback; o canvas assume no primeiro frame carregado
 * - Preload em estágios: seis frames imediatos, restante em background;
 *   o draw usa o frame carregado mais próximo
 * - Mobile usa sequência própria de 36 frames a 640 px
 * - prefers-reduced-motion: sem runway, sem pin, poster estático + texto
 */
const FRAME_COUNT_DESKTOP = 72;
const FRAME_COUNT_MOBILE = 36;

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

        // O foco vertical baixo preserva o piso e a leitura do percurso.
        const VERTICAL_FOCUS = 0.8;

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
          context2d.drawImage(img, (cw - w) / 2, (ch - h) * VERTICAL_FOCUS, w, h);

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

        const loadFrame = (index: number) => {
          const img = new window.Image();
          img.src = framePath(index, isMobile);
          img.onload = () => {
            isLoaded[index] = true;
            if (Math.abs(index - currentIndex) <= 2) draw(currentIndex);
          };
          images[index] = img;
        };

        const EAGER_FRAMES = Math.min(6, frameCount);
        for (let i = 0; i < EAGER_FRAMES; i++) loadFrame(i);

        let nextToLoad = EAGER_FRAMES;
        let backgroundLoader: ReturnType<typeof setTimeout> | undefined;
        const loadRemaining = () => {
          if (nextToLoad >= frameCount) return;
          loadFrame(nextToLoad++);
          backgroundLoader = setTimeout(loadRemaining, 35);
        };
        loadRemaining();

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
          // Dissolve o conteúdo em estágios para liberar a vista no fim do percurso.
          .to("[data-hero-foot]", { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.06)
          .to(
            ["[data-hero-label]", "[data-hero-bar]"],
            { autoAlpha: 0, duration: 0.14, ease: "none" },
            0.28
          )
          .to(
            "[data-hero-sub]",
            { autoAlpha: 0, y: -18, duration: 0.16, ease: "none" },
            0.38
          )
          .to(
            contentRef.current,
            { yPercent: -20, autoAlpha: 0, duration: 0.28, ease: "none" },
            0.52
          );

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
          .from("[data-hero-cta]", { autoAlpha: 0, y: 18, duration: 0.8 }, 0.95)
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
        <div
          ref={posterWrapRef}
          className="absolute inset-0 transition-opacity duration-500"
        >
          <Image
            src="/videos/hero/hero-poster.webp"
            alt="Corredor de estrutura em Light Steel Frame avançando até um ambiente finalizado"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_80%]"
          />
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        <div className="absolute inset-0 hero-overlay-vignette" aria-hidden="true" />

        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col justify-end pb-48 md:pb-32 pl-6 pr-6 md:pl-16 lg:pl-24 max-w-[1100px]"
        >
          <p
            data-hero-label
            className="font-tech text-xs md:text-sm lowercase tracking-wide text-white-70 mb-5"
          >
            construtora · light steel frame · são paulo
          </p>

          <div
            data-hero-bar
            className="h-[3px] w-14 bg-white mb-7"
            aria-hidden="true"
          />

          <h1 className="headline-hero hero-text-shadow mb-7">
            <span className="block overflow-hidden">
              <span data-hero-line className="block md:whitespace-nowrap">
                <span className="font-light text-white-70">Especialistas em</span>{" "}
                <span className="font-semibold">Light Steel Frame</span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block md:whitespace-nowrap">
                <span className="font-light text-white-70">Mestres em</span>{" "}
                <span className="font-semibold">Construir</span>
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
        </div>

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
