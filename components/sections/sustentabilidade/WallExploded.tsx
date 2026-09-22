"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LSF_LAYERS } from "@/lib/lsf-data";
import { WALL_LAYER_COPY, WALL_SECTION } from "@/lib/sustentabilidade-data";

/**
 * A parede como um corte: as seis camadas lado a lado, na ordem da montagem,
 * com uma aberta por vez.
 *
 * A versão anterior abria as camadas em 3D. Girada a 28 graus, cada placa
 * escondia a seguinte: sobrava uma foto legível e cinco lascas. E o bloco de
 * texto inteiro morava dentro do sticky, então em janela abaixo de ~730px de
 * altura o topo do título era cortado (medido: estoura 40px a 1920x720).
 *
 * Aqui o cabeçalho rola normal, como no resto da página, e só o corte fica
 * preso na tela, com altura fixa que cabe em qualquer janela. Os nomes saíram
 * da lista em duas colunas e foram para cima da camada que nomeiam.
 *
 * As seis camadas estão sempre no HTML. A rolagem só muda qual está aberta e
 * colorida, então nada depende de JavaScript para existir na página.
 */

// Fração da largura para a camada aberta. As outras cinco dividem o resto e
// ficam como lombadas, estreitas mas largas o bastante para o nome na vertical.
const ABERTA = 0.44;

interface Faixa {
  esquerda: number;
  largura: number;
}

export function WallExploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const layers = LSF_LAYERS;
  const fechada = (1 - ABERTA) / (layers.length - 1);

  const faixas = (aberta: number): Faixa[] => {
    let esquerda = 0;
    return layers.map((_, index) => {
      const largura = index === aberta ? ABERTA : fechada;
      const faixa = { esquerda, largura };
      esquerda += largura;
      return faixa;
    });
  };

  const recorte = (faixa: Faixa) =>
    `inset(0 ${((1 - faixa.esquerda - faixa.largura) * 100).toFixed(3)}% 0 ${(faixa.esquerda * 100).toFixed(3)}%)`;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("[data-wall-track]");
        const sticky = root.querySelector<HTMLElement>("[data-wall-sticky]");
        const corte = root.querySelector<HTMLElement>("[data-wall-cut]");
        const itens = gsap.utils.toArray<HTMLElement>("[data-wall-layer]", root);
        const rotulos = gsap.utils.toArray<HTMLElement>("[data-wall-label]", root);
        const fotos = gsap.utils.toArray<HTMLElement>("[data-wall-photo]", root);
        const espessuras = gsap.utils.toArray<HTMLElement>("[data-wall-thickness]", root);
        if (!track || !sticky || !corte || itens.length !== layers.length) return;

        // 60vh de rolagem por camada. Com 26vh um giro de roda atravessava
        // duas camadas e não dava para ver a foto aberta; a seção fica mais
        // longa, mas é o preço de cada imagem ficar na tela.
        track.style.height = `${layers.length * 60}vh`;
        Object.assign(sticky.style, {
          position: "sticky",
          top: "84px",
          display: "flex",
          height: "calc(100vh - 84px)",
          alignItems: "center",
        });

        let atual = 0;

        const aplicar = (indice: number, instantaneo = false) => {
          const largura = corte.clientWidth;
          const duracao = instantaneo ? 0 : 0.7;
          faixas(indice).forEach((faixa, i) => {
            gsap.to(itens[i], {
              clipPath: recorte(faixa),
              duration: duracao,
              ease: "power3.out",
              overwrite: true,
            });
            gsap.to(rotulos[i], {
              x: faixa.esquerda * largura,
              duration: duracao,
              ease: "power3.out",
              overwrite: true,
            });
            gsap.to(fotos[i], {
              filter:
                i === indice
                  ? "grayscale(0%) saturate(90%) contrast(98%)"
                  : "grayscale(100%) contrast(104%)",
              duration: instantaneo ? 0 : 0.55,
              overwrite: true,
            });
            gsap.to(espessuras[i], {
              opacity: i === indice ? 1 : 0,
              duration: instantaneo ? 0 : 0.4,
              overwrite: true,
            });
          });
        };

        aplicar(0, true);

        ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const indice = Math.min(
              layers.length - 1,
              Math.max(0, Math.floor(self.progress * layers.length)),
            );
            if (indice === atual) return;
            atual = indice;
            aplicar(indice);
          },
          // A posição do rótulo é em pixels, então precisa ser refeita sempre
          // que a largura do corte muda.
          onRefresh: () => aplicar(atual, true),
        });

        return () => {
          track.style.removeProperty("height");
          for (const propriedade of ["position", "top", "display", "height", "align-items"]) {
            sticky.style.removeProperty(propriedade);
          }
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="parede"
      className="bg-off-white py-xl text-black md:py-3xl"
      aria-labelledby="parede-title"
    >
      <div className="container">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
          <h2
            id="parede-title"
            className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
          >
            {WALL_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
            {WALL_SECTION.copy}
          </p>
        </div>
      </div>

      <div data-wall-track className="relative mt-12 md:mt-16">
        <div data-wall-sticky>
          <div className="container w-full">
            <figure>
              <ol
                data-wall-cut
                aria-label={WALL_SECTION.sceneAlt}
                className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 lg:block lg:h-[clamp(300px,46vh,520px)] lg:gap-0 lg:overflow-hidden lg:pb-0"
              >
                {layers.map((layer, index) => (
                  <li
                    key={layer.id}
                    data-wall-layer
                    className="relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden bg-carbon sm:w-[52%] lg:absolute lg:inset-0 lg:aspect-auto lg:w-full lg:[clip-path:var(--faixa)]"
                    style={{ "--faixa": recorte(faixas(0)[index]) } as CSSProperties}
                  >
                    <Image
                      data-wall-photo
                      src={layer.image}
                      alt=""
                      fill
                      quality={78}
                      sizes="(min-width: 1024px) 92vw, 80vw"
                      className={`object-cover saturate-[.9] contrast-[.98] ${
                        index === 0 ? "" : "lg:grayscale lg:contrast-[1.04]"
                      }`}
                    />

                    {/* Véu de baixo para cima no carrossel; na faixa, o véu
                        viaja junto com o rótulo, senão a lombada da direita
                        fica com texto branco sobre foto clara. */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.72))] lg:hidden" />

                    <div
                      data-wall-label
                      className="absolute bottom-0 left-0 p-5 lg:inset-y-0 lg:flex lg:w-[94px] lg:items-end lg:bg-[linear-gradient(90deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.34)_58%,transparent_100%)] lg:p-4"
                    >
                      <p className="font-display text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-white lg:rotate-180 lg:[writing-mode:vertical-rl]">
                        {WALL_LAYER_COPY[index]?.name ?? layer.name}
                        <span
                          data-wall-thickness
                          className={`font-normal tracking-normal text-white/55 ${
                            index === 0 ? "" : "lg:opacity-0"
                          }`}
                        >
                          {" "}
                          {layer.thickness}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <figcaption className="mt-5 text-xs leading-relaxed text-black-50 lg:mt-6">
                {WALL_SECTION.note}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div className="container">
        {/* No desktop o sticky já deixa uns 180px de ar embaixo do corte, então
            a margem aqui encolhe para o buraco não somar duas vezes. */}
        <p className="mt-12 max-w-3xl font-display text-[clamp(1.5rem,2.2vw,2.4rem)] font-semibold leading-snug tracking-[-0.03em] md:mt-16 lg:mt-4">
          {WALL_SECTION.consequence}
        </p>
      </div>
    </section>
  );
}
