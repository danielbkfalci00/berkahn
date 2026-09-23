"use client";

import { useRef } from "react";
import { getImageProps } from "next/image";
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
 * - Mobile usa sequência própria de 36 frames verticais, 608×1080: recorte
 *   9:16 do centro da fonte 1080p, na resolução cheia. A anterior era 960×540
 *   horizontal e, num celular em pé, aparecia ampliada ~4,7x
 * - prefers-reduced-motion: sem runway, sem pin, poster estático + texto
 */
// Resolução nativa da fonte (1920×1080) para o canvas não ampliar em telas
// grandes. 7 fps em vez de 9 compensa o peso do frame maior; o scrub não
// perde fluidez porque o runway de 260vh dá ~27 px de scroll por frame.
const FRAME_COUNT_DESKTOP = 56;
const FRAME_COUNT_MOBILE = 36;

const POSTER_ALT =
  "Corredor de estrutura em Light Steel Frame avançando até um ambiente finalizado";

/**
 * Poster com um arquivo por formato de tela: horizontal no desktop, vertical
 * (recorte 9:16 do centro, na resolução cheia da fonte) no celular. Antes o
 * celular recebia o poster 16:9 e mostrava só a faixa central dele, ampliada.
 *
 * O sizes vai pela altura: a foto cobre uma caixa da altura da tela, então a
 * largura desenhada é a altura vezes a proporção da foto (1.78 e 0.56).
 */
function HeroPoster() {
  const common = { alt: POSTER_ALT, quality: 85 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    src: "/videos/hero/hero-poster.webp",
    width: 1920,
    height: 1080,
    sizes: "max(100vw, 178vh)",
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: "/videos/hero/hero-poster-m.webp",
    width: 608,
    height: 1080,
    sizes: "max(100vw, 57vh)",
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} sizes="max(100vw, 178vh)" />
      <source media="(max-width: 767px)" srcSet={mobile} sizes="max(100vw, 57vh)" />
      <img
        {...rest}
        alt={POSTER_ALT}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_80%]"
      />
    </picture>
  );
}

// AVIF qualidade 50: 42% menor que o WebP q78 e mais fiel à fonte (SSIM
// 0,990 contra 0,984 em luminância, medido sobre quadros do vídeo original).
// O WebP fica como reserva para navegador que não decodifica AVIF.
type FrameFormat = "avif" | "webp";
const framePath = (index: number, isMobile: boolean, format: FrameFormat) =>
  `/videos/hero/${isMobile ? "seq-m" : "seq"}/f_${String(index + 1).padStart(3, "0")}.${format}`;

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
        // Bytes de cada quadro, ainda comprimidos (7,7 MB no total). Decodificar
        // a partir do Blob acontece sempre fora da thread principal; a partir
        // de um <img> o Chrome pode decodificar na thread principal.
        const blobs: (Blob | undefined)[] = new Array(frameCount);
        let format: FrameFormat = "avif";
        const isLoaded: boolean[] = new Array(frameCount).fill(false);
        // Quadros já decodificados (ImageBitmap), só numa janela em volta do
        // atual: decodificar um WebP de 1920px na hora do drawImage travava a
        // tela por dezenas de ms a cada troca de quadro. createImageBitmap
        // decodifica fora da thread principal. A janela existe porque os 56
        // quadros decodificados ocupariam ~460 MB de memória.
        const bitmaps: (ImageBitmap | undefined)[] = new Array(frameCount);
        const pendingBitmap: boolean[] = new Array(frameCount).fill(false);
        const BITMAP_WINDOW = 6;
        let position = 0; // posição fracionária na sequência
        let drawnPosition = -1;
        let isPosterHidden = false;
        let rafId = 0;
        // A mistura de dois quadros dobra o custo de pintura. Em aparelho que
        // não dá conta (desenho acima de ~10 ms, três vezes seguidas), o hero
        // volta ao quadro único e não liga a mistura de novo.
        let blend = true;
        let slowDraws = 0;

        // Tamanho nativo dos quadros de cada sequência.
        const frameW = isMobile ? 608 : 1920;
        const frameH = 1080;

        // O foco vertical baixo preserva o piso e a leitura do percurso.
        const VERTICAL_FOCUS = 0.8;

        const sourceFor = (index: number) => bitmaps[index];

        const paint = (source: CanvasImageSource, alpha: number) => {
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.max(cw / frameW, ch / frameH);
          const w = frameW * scale;
          const h = frameH * scale;
          context2d.globalAlpha = alpha;
          context2d.drawImage(source, (cw - w) / 2, (ch - h) * VERTICAL_FOCUS, w, h);
        };

        // Desenha a posição fracionária misturando os dois quadros vizinhos.
        // Sem isso a imagem saltava de quadro em quadro (56 quadros para 2,6
        // telas de rolagem, um salto a cada ~40px).
        const draw = () => {
          rafId = 0;
          const started = performance.now();
          if (position === drawnPosition) return;
          let base = Math.min(Math.floor(position), frameCount - 1);
          while (base > 0 && !sourceFor(base)) base--;
          const baseSource = sourceFor(base);
          if (!baseSource) return;

          // O padrão do Chrome é suavização "low": qualquer ampliação saía
          // serrilhada. Redefinido a cada desenho porque redimensionar o
          // canvas zera o estado do contexto.
          context2d.imageSmoothingEnabled = true;
          context2d.imageSmoothingQuality = "high";
          paint(baseSource, 1);
          const t = position - base;
          const nextSource = base + 1 < frameCount ? sourceFor(base + 1) : undefined;
          if (blend && t > 0.02 && nextSource) paint(nextSource, t);
          context2d.globalAlpha = 1;
          drawnPosition = position;

          if (blend) {
            slowDraws = performance.now() - started > 10 ? slowDraws + 1 : 0;
            if (slowDraws >= 3) blend = false;
          }

          if (!isPosterHidden && posterWrapRef.current) {
            posterWrapRef.current.style.opacity = "0";
            isPosterHidden = true;
          }
        };
        // No máximo um desenho por quadro de tela, por mais eventos de
        // rolagem que cheguem nesse intervalo.
        const requestDraw = () => {
          if (!rafId) rafId = requestAnimationFrame(draw);
        };

        const refreshBitmaps = () => {
          const center = Math.round(position);
          for (let i = 0; i < frameCount; i++) {
            const inside = Math.abs(i - center) <= BITMAP_WINDOW;
            if (!inside && bitmaps[i]) {
              bitmaps[i]!.close();
              bitmaps[i] = undefined;
            } else if (inside && isLoaded[i] && !bitmaps[i] && !pendingBitmap[i]) {
              pendingBitmap[i] = true;
              createImageBitmap(blobs[i]!)
                .then((bitmap) => {
                  pendingBitmap[i] = false;
                  if (Math.abs(i - Math.round(position)) <= BITMAP_WINDOW) {
                    bitmaps[i] = bitmap;
                    if (Math.abs(i - position) <= 1.5) {
                      drawnPosition = -1;
                      requestDraw();
                    }
                  } else {
                    bitmap.close();
                  }
                })
                .catch(() => {
                  pendingBitmap[i] = false;
                  // Navegador sem AVIF: recomeça tudo em WebP, uma vez só.
                  if (format === "avif") switchToWebp();
                });
            }
          }
        };

        // O canvas não precisa de mais pixels que o próprio quadro: num
        // monitor retina ele tinha 2880px de largura para um vídeo de 1920, e
        // pintava 2,25x mais pixels sem ganhar nitidez nenhuma.
        const resize = () => {
          const cssW = canvas.clientWidth;
          const cssH = canvas.clientHeight;
          const coverScale = Math.max(cssW / frameW, cssH / frameH);
          const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, 1 / coverScale));
          canvas.width = Math.round(cssW * dpr);
          canvas.height = Math.round(cssH * dpr);
          drawnPosition = -1;
          requestDraw();
        };
        resize();
        window.addEventListener("resize", resize);

        let generation = 0;
        const loadFrame = (index: number) => {
          const requested = generation;
          fetch(framePath(index, isMobile, format))
            .then((response) => (response.ok ? response.blob() : Promise.reject(response.status)))
            .then((blob) => {
              if (requested !== generation) return;
              blobs[index] = blob;
              isLoaded[index] = true;
              refreshBitmaps();
            })
            .catch(() => {
              // Quadro que falhou fica de fora; o desenho usa o vizinho.
            });
        };

        // Quatro e não seis: com os frames em 1920 cada um pesa ~180 KB, e o
        // que precisa estar pronto no primeiro scroll são só os iniciais.
        const EAGER_FRAMES = Math.min(4, frameCount);
        for (let i = 0; i < EAGER_FRAMES; i++) loadFrame(i);

        let nextToLoad = EAGER_FRAMES;
        let backgroundLoader: ReturnType<typeof setTimeout> | undefined;
        const loadRemaining = () => {
          if (nextToLoad >= frameCount) return;
          loadFrame(nextToLoad++);
          backgroundLoader = setTimeout(loadRemaining, 35);
        };

        // O resto da sequência (até 7,7 MB) só começa quando a pessoa rola ou
        // depois de 2,5 s parada. Antes começava junto com a página e disputava
        // banda e CPU com o resto do carregamento.
        const switchToWebp = () => {
          format = "webp";
          generation++;
          blobs.fill(undefined);
          isLoaded.fill(false);
          for (let i = 0; i < EAGER_FRAMES; i++) loadFrame(i);
          nextToLoad = EAGER_FRAMES;
          if (started) loadRemaining();
        };

        let started = false;
        const startBackground = () => {
          if (started) return;
          started = true;
          window.removeEventListener("scroll", startBackground);
          loadRemaining();
        };
        window.addEventListener("scroll", startBackground, { passive: true });
        const idleStart = setTimeout(startBackground, 2500);

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
                const previous = Math.round(position);
                position = frameState.frame;
                if (Math.round(position) !== previous) refreshBitmaps();
                requestDraw();
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
          if (rafId) cancelAnimationFrame(rafId);
          bitmaps.forEach((bitmap) => bitmap?.close());
          if (backgroundLoader) clearTimeout(backgroundLoader);
          clearTimeout(idleStart);
          window.removeEventListener("scroll", startBackground);
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
          <HeroPoster />
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
