"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { AutoplayVideo, type VideoSource } from "@/components/media/AutoplayVideo";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";
import { Button } from "@/components/ui/button";

/**
 * Sources do vídeo de hero (AV1 → HEVC → H.264), servidos de public/videos/hero/.
 * Fonte: drone fly-through gerado por IA (interior → piscina, golden hour),
 * trim 0,5s–7,8s, sem áudio, +faststart. Poster = primeiro frame do corte.
 */
const HERO_VIDEO_SOURCES: VideoSource[] = [
  { src: "/videos/hero/hero-av1.mp4", type: 'video/mp4; codecs="av01.0.05M.08"' },
  { src: "/videos/hero/hero-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
  { src: "/videos/hero/hero-h264.mp4", type: "video/mp4" },
];

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.from("[data-hero-label]", { autoAlpha: 0, y: 16, duration: 0.7 }, 0.15)
          .from(
            "[data-hero-bar]",
            { scaleX: 0, transformOrigin: "left center", duration: 0.8 },
            0.2
          )
          .from(
            "[data-hero-line]",
            { yPercent: 110, duration: 1.1, stagger: 0.12 },
            0.25
          )
          .from("[data-hero-sub]", { autoAlpha: 0, y: 24, duration: 0.9 }, 0.8)
          .from(
            "[data-hero-cta]",
            { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.08 },
            0.95
          )
          .from("[data-hero-foot]", { autoAlpha: 0, duration: 0.9 }, 1.15);

        // Dolly-in ligado ao scroll: a câmera "entra" na casa conforme rola
        gsap.to(mediaRef.current, {
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Saída sutil: conteúdo desliza e esmaece conforme o hero deixa o viewport
        gsap.to(contentRef.current, {
          yPercent: -14,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 45%",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-carbon"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <AutoplayVideo
          sources={HERO_VIDEO_SOURCES}
          poster="/videos/hero/hero-poster.webp"
          posterAlt="Interior de residência de alto padrão construída pela Berkahn em Light Steel Frame"
          posterPriority
          posterClassName="animate-kenburns"
        />
      </div>

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
            <span data-hero-line className="block">
              Alto padrão,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              erguido em
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Light Steel Frame.
            </span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="max-w-xl text-base md:text-lg text-white-70 leading-relaxed mb-9"
        >
          Projeto, engenharia e obra com a mesma equipe. Prazo e orçamento
          definidos antes do primeiro perfil.
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
    </section>
  );
}
