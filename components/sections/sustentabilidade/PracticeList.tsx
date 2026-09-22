"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PRACTICE_SECTION } from "@/lib/sustentabilidade-data";

// Escada das três práticas no desktop. O caminho é calculado a partir da
// posição real dos pontos, então mudar essa escada não quebra a curva.
const POSITIONS = ["md:col-span-4", "md:col-span-4 md:mt-24", "md:col-span-4 md:mt-48"];

interface Ponto {
  x: number;
  y: number;
}

/**
 * Monta o caminho que passa pelos pontos das práticas.
 *
 * No desktop os pontos ficam 48px acima de cada título. Entre um ponto e o
 * seguinte o traço corre na horizontal na altura do ponto, por cima do texto,
 * e só dobra para baixo, numa curva, já em cima do próximo ponto, onde a
 * escada deixa espaço vazio. Uma curva em S direta atravessava os títulos.
 * No celular os pontos ficam numa coluna à esquerda e o caminho vira uma
 * linha reta na calha.
 */
function montarCaminho(pontos: Ponto[], larguraArea: number): string {
  const [primeiro] = pontos;
  let d = `M ${primeiro.x} ${primeiro.y - 140} L ${primeiro.x} ${primeiro.y}`;

  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1];
    const b = pontos[i];
    if (Math.abs(b.x - a.x) < 4) {
      d += ` L ${b.x} ${b.y}`;
      continue;
    }
    const raio = Math.max(0, Math.min(48, (b.y - a.y) / 2, Math.abs(b.x - a.x) / 2));
    d += ` L ${b.x - raio} ${a.y} Q ${b.x} ${a.y}, ${b.x} ${a.y + raio} L ${b.x} ${b.y}`;
  }

  // Rabo para a direita, sugerindo que o caminho continua fora da tela. Só
  // quando há espaço, ou seja, no desktop.
  const ultimo = pontos[pontos.length - 1];
  if (larguraArea - ultimo.x > 60 && pontos.some((p) => Math.abs(p.x - primeiro.x) > 4)) {
    d += ` L ${larguraArea} ${ultimo.y}`;
  }
  return d;
}

export function PracticeList() {
  const practicesRef = useRef<HTMLElement>(null);
  const honestyRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = practicesRef.current;
      if (!root) return;
      const area = root.querySelector<HTMLElement>("[data-path-area]");
      const linha = root.querySelector<SVGPathElement>("[data-path-line]");
      const fantasma = root.querySelector<SVGPathElement>("[data-path-ghost]");
      const pontos = gsap.utils.toArray<HTMLElement>("[data-path-dot]", root);
      const itens = gsap.utils.toArray<HTMLElement>("[data-path-item]", root);
      if (!area || !linha || !fantasma || pontos.length < 2) return;

      let comprimento = 0;
      const construir = () => {
        const caixa = area.getBoundingClientRect();
        const centros = pontos.map((ponto) => {
          const r = ponto.getBoundingClientRect();
          return { x: r.left + r.width / 2 - caixa.left, y: r.top + r.height / 2 - caixa.top };
        });
        const d = montarCaminho(centros, caixa.width);
        linha.setAttribute("d", d);
        fantasma.setAttribute("d", d);
        comprimento = linha.getTotalLength();
        linha.style.strokeDasharray = `${comprimento}`;
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        construir();
        // A curva depende da posição dos pontos, que muda com a largura. O
        // refreshInit roda antes de o ScrollTrigger recalcular os valores.
        ScrollTrigger.addEventListener("refreshInit", construir);

        gsap.fromTo(
          linha,
          { strokeDashoffset: () => comprimento },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: area,
              start: "top 78%",
              end: "bottom 62%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        itens.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 66%",
            onEnter: () => pontos[i].setAttribute("data-active", "true"),
            onLeaveBack: () => pontos[i].setAttribute("data-active", "false"),
          });
        });

        return () => ScrollTrigger.removeEventListener("refreshInit", construir);
      });

      // Movimento reduzido: o caminho aparece inteiro e os pontos acesos.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        construir();
        linha.style.strokeDashoffset = "0";
        pontos.forEach((ponto) => ponto.setAttribute("data-active", "true"));
        ScrollTrigger.addEventListener("refreshInit", construir);
        return () => ScrollTrigger.removeEventListener("refreshInit", construir);
      });
    },
    { scope: practicesRef },
  );

  useGSAP(
    () => {
      const risco = honestyRef.current?.querySelector<HTMLElement>("[data-strike]");
      if (!risco) return;
      const mm = gsap.matchMedia();
      // O HTML já nasce riscado (estado final). Com movimento, o risco é
      // puxado da esquerda para a direita, linha por linha, conforme a rolagem.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          risco,
          { backgroundSize: "0% 0.075em" },
          {
            backgroundSize: "100% 0.075em",
            ease: "none",
            scrollTrigger: { trigger: risco, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
          },
        );
      });
    },
    { scope: honestyRef },
  );

  const { honesty } = PRACTICE_SECTION;

  return (
    <>
      <section
        ref={practicesRef}
        id="pratica"
        className="overflow-hidden bg-white py-xl text-black md:py-3xl"
        aria-labelledby="pratica-title"
      >
        <div className="container">
          <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
            <h2
              id="pratica-title"
              className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
            >
              {PRACTICE_SECTION.headline}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
              {PRACTICE_SECTION.lede}
            </p>
          </div>

          <div data-path-area className="relative mt-40 md:mt-52">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <path data-path-ghost d="" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              <path
                data-path-line
                d=""
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <ol className="relative grid gap-20 md:grid-cols-12 md:gap-10">
              {PRACTICE_SECTION.practices.map((practice, index) => (
                <li
                  key={practice.title}
                  data-path-item
                  className={`relative pl-9 md:pl-0 md:pt-12 ${POSITIONS[index]}`}
                >
                  <span
                    data-path-dot
                    aria-hidden="true"
                    className="absolute left-0 top-[0.5em] h-3.5 w-3.5 rounded-full border-[1.5px] border-black bg-white transition-colors duration-500 data-[active=true]:bg-black md:top-0"
                  />
                  <h3 className="max-w-xs font-display text-[clamp(1.65rem,2.4vw,2.65rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
                    {practice.title}
                  </h3>
                  <p className="mt-6 max-w-sm text-base leading-relaxed text-black-70">
                    {practice.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        ref={honestyRef}
        id="o-que-nao-afirmamos"
        className="bg-carbon py-xl text-white md:py-3xl"
        aria-labelledby="honestidade-title"
      >
        <div className="container">
          <h2
            id="honestidade-title"
            className="text-xs font-medium uppercase tracking-[0.18em] text-white-50"
          >
            {honesty.title}
          </h2>

          <p className="mt-10 max-w-6xl font-display text-[clamp(2.4rem,1rem+4.6vw,6.2rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white/35">
            {/* O risco é um fundo de 0.075em a 58% da altura da linha. Em texto
                quebrado o fundo corre de linha em linha, então animar a largura
                risca uma linha depois da outra. */}
            <span
              data-strike
              className="bg-[linear-gradient(#fff,#fff)] bg-no-repeat [background-position:0_58%] [background-size:100%_0.075em]"
            >
              {honesty.claim}
            </span>
          </p>

          <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
            <p className="font-display text-[clamp(1.6rem,2.6vw,2.8rem)] font-semibold leading-[1.15] tracking-[-0.03em] lg:col-span-7">
              {honesty.conclusion}
            </p>
            <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-4 lg:col-start-9 lg:self-end lg:text-lg">
              {honesty.body}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
