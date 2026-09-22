"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { COMPARISON_DATA } from "@/lib/lsf-data";

/**
 * As quatro medidas do comparativo, todas em que menor é melhor. `lsfMid` e
 * `traditionalMid` são o meio de cada faixa publicada em COMPARISON_DATA e só
 * servem para o comprimento das barras; na tela o texto continua mostrando a
 * faixa inteira, como está nos dados.
 */
const FEATURED = [
  { category: "Tempo de Obra", label: "Tempo de obra", lsfMid: 4.5, traditionalMid: 10 },
  { category: "Desperdício de Material", label: "Desperdício de material", lsfMid: 5, traditionalMid: 27.5 },
  { category: "Precisão Dimensional", label: "Erro dimensional", lsfMid: 1.5, traditionalMid: 15 },
  { category: "Peso Estrutural", label: "Peso da estrutura", lsfMid: 80, traditionalMid: 1350 },
];

// Barras abaixo disso somem na tela; o peso do LSF é ~6% do convencional.
const MIN_BAR = 0.04;

/**
 * Introdução do Light Steel Frame e o comparativo com o método convencional,
 * numa seção só. Antes eram duas seções coladas, com dois títulos, dois links
 * para a mesma página e o comparativo em tabela de texto. Agora o comparativo
 * são barras: a do convencional é a régua (100%) e a do LSF aparece na mesma
 * escala, então a diferença se lê sem ler número.
 *
 * Movimento: as barras crescem da esquerda na entrada, uma depois da outra. O
 * HTML base tem as barras no tamanho final.
 */
export function ComparisonCompact() {
  const sectionRef = useRef<HTMLElement>(null);

  const rows = FEATURED.map((item) => {
    const data = COMPARISON_DATA.find((row) => row.category === item.category);
    if (!data) return null;
    return { ...item, lsf: data.lsf, traditional: data.traditional, ratio: Math.max(MIN_BAR, item.lsfMid / item.traditionalMid) };
  }).filter((row): row is NonNullable<typeof row> => Boolean(row));

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const bars = gsap.utils.toArray<HTMLElement>("[data-compare-bar]", root);
        if (!bars.length) return;
        gsap.from(bars, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: bars[0], start: "top 82%", once: true },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-off-white py-2xl text-black md:py-3xl" aria-labelledby="lsf-title">
      <div className="container">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-black-50">Sistema construtivo</p>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <h2
            id="lsf-title"
            className="max-w-4xl font-display text-[clamp(2.4rem,1.2rem+3.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em] lg:col-span-7"
          >
            Light Steel Frame: precisão para qualquer projeto.
          </h2>
          <div className="max-w-md space-y-4 text-base leading-relaxed text-black-70 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p>
              Perfis de aço galvanizado, gesso acartonado e placas cimentícias formam estruturas precisas e duráveis
              para projetos residenciais, comerciais e industriais.
            </p>
            <p>
              Usamos o sistema completo ou combinado com concreto armado e aço laminado, quando o projeto pede.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:items-center lg:gap-12">
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-black-5">
              <Image
                src="/images/Home/lsf-estrutura.webp"
                alt="Esqueleto de Light Steel Frame de uma casa montado sobre o radier, com montantes e tesouras de aço galvanizado"
                fill
                quality={80}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-xs leading-relaxed text-black-50">
              Perfis de aço galvanizado, montagem a seco.
            </figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="mb-8 flex items-center justify-between gap-6 text-xs font-medium uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-black" aria-hidden="true" />
                Light Steel Frame
              </span>
              <span className="flex items-center gap-2 text-black-50">
                <span className="h-2.5 w-2.5 bg-black-10" aria-hidden="true" />
                Convencional
              </span>
            </div>

            <dl className="space-y-8">
              {rows.map((row) => (
                <div key={row.category}>
                  <dt className="mb-3 text-sm font-medium text-black">{row.label}</dt>
                  <dd>
                    <div className="flex items-center gap-4">
                      <div className="h-3 flex-1">
                        <div
                          data-compare-bar
                          className="h-full bg-black"
                          style={{ width: `${row.ratio * 100}%` }}
                        />
                      </div>
                      <span className="w-36 shrink-0 whitespace-nowrap text-right font-display text-lg font-semibold tabular-nums tracking-tight md:w-40 md:text-xl">
                        {row.lsf}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="h-3 flex-1">
                        <div data-compare-bar className="h-full w-full bg-black-10" />
                      </div>
                      <span className="w-36 shrink-0 whitespace-nowrap text-right font-display text-lg tabular-nums tracking-tight text-black-50 md:w-40 md:text-xl">
                        {row.traditional}
                      </span>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs text-black-50">Nas quatro medidas, menor é melhor.</p>

            <Link
              href="/lsf"
              className="group mt-10 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-wider text-black"
            >
              <span className="h-[3px] w-10 bg-black transition-all duration-500 ease-expo group-hover:w-16" />
              Conheça o Light Steel Frame
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
