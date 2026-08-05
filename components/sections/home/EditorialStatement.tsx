"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Momento-assinatura 2: statement editorial em fundo carbon, revelado
 * linha a linha com scrub curto ligado ao scroll (SplitText).
 * Sem JS ou com reduced-motion, o texto fica estático e legível (estado final).
 */
export function EditorialStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // useGSAP sempre fornece contextSafe em runtime; o guard satisfaz o tipo
      if (!contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Split só depois das fontes: quebra de linha correta com Archivo carregada
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
                end: "top 30%",
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
        <p className="font-tech text-xs lowercase tracking-wide text-bronze mb-10">
          01 · a nossa régua
        </p>

        <p
          data-statement
          className="font-display font-medium tracking-tight max-w-5xl text-[clamp(1.9rem,1rem+3.6vw,4.25rem)] leading-[1.12]"
        >
          Uma casa leva meses de obra e décadas de vida. A gente projeta as
          duas com o mesmo cuidado.
        </p>

        <div className="mt-14 flex justify-end">
          <p className="max-w-md text-sm md:text-base leading-relaxed text-white-50">
            Construtora completa, especialista em Light Steel Frame. Cada etapa
            da obra fica com a mesma equipe técnica, do terreno ao acabamento,
            com prazo e orçamento definidos em contrato.
          </p>
        </div>
      </div>
    </section>
  );
}
