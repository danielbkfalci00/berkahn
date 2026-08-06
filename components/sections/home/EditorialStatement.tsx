"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Apresentação institucional em fundo carbon. O título mantém o reveal de
 * assinatura; o conteúdo completo permanece legível sem JS e com reduced-motion.
 */
export function EditorialStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        document.fonts.ready.then(
          contextSafe(() => {
            const target = sectionRef.current?.querySelector("[data-statement]");
            if (!target) return;

            const split = SplitText.create(target, {
              type: "lines",
              mask: "lines",
              linesClass: "statement-line",
            });

            gsap.from(split.lines, {
              yPercent: 110,
              opacity: 0.2,
              stagger: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: target,
                start: "top 78%",
                end: "top 42%",
                scrub: true,
              },
            });
          })
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-carbon text-off-white py-2xl md:py-3xl">
      <div className="container">
        <p className="font-tech text-xs lowercase tracking-wide text-white-50 mb-10">
          01 · nossa expertise
        </p>

        <h2
          data-statement
          className="font-display font-semibold tracking-tight max-w-5xl text-[clamp(2.6rem,1.4rem+4.4vw,6rem)] leading-[0.95]"
        >
          NOSSA EXPERTISE
        </h2>

        <div className="mt-14 md:mt-20 grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="h-[3px] w-14 bg-white md:col-span-2" aria-hidden="true" />
          <div className="md:col-span-8 md:col-start-5 space-y-6 text-base md:text-lg leading-relaxed text-white-70">
            <p>
              A Berkahn é uma construtora completa, especialista em Light Steel
              Frame no Brasil. Executamos cada etapa da obra, do terreno ao
              acabamento, com a mesma equipe técnica. Priorizamos a tecnologia
              Steel Frame por sua eficiência, precisão e sustentabilidade, e
              dominamos múltiplos sistemas construtivos quando o projeto pede.
            </p>
            <p>
              Residências, edifícios comerciais ou projetos industriais: cada
              projeto recebe engenharia de precisão e acompanhamento técnico
              dedicado. Do projeto completo à execução especializada, nos
              adaptamos à sua necessidade com rigor técnico em cada etapa.
            </p>
            <Link
              href="/empresa"
              className="group inline-flex items-center gap-4 pt-3 text-sm uppercase tracking-wider font-medium text-white"
            >
              <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
              Saber mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
