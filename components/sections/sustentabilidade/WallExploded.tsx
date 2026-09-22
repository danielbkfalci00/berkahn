"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LSF_LAYERS } from "@/lib/lsf-data";
import { WALL_LAYER_COPY, WALL_SECTION } from "@/lib/sustentabilidade-data";

/**
 * A parede, camada por camada: seis cartões lado a lado, na ordem da montagem
 * de fora para dentro, deslizando para o lado conforme a página rola.
 *
 * Duas versões anteriores falharam por motivos que valem registrar. A cena 3D
 * escondia cada placa atrás da seguinte. O acordeão por clip-path prendia a
 * tela (o bloco inteiro ficava sticky) e mostrava de cada camada só a fatia da
 * foto que caía na posição da faixa, por isso as imagens pareciam recortes
 * ruins. Aqui nada prende a rolagem: a fileira anda por scrub enquanto a seção
 * atravessa a tela, e cada cartão mostra a foto inteira, centrada.
 *
 * Abaixo de 1024px o trilho gruda na tela e a rolagem vertical anda a fileira
 * (ver o segundo bloco do matchMedia). Com movimento reduzido, a fileira é um
 * carrossel nativo com snap, sem animação.
 *
 * A seção usa overflow-x-clip, não overflow-hidden: hidden cria um contêiner
 * de rolagem e anula o sticky do trilho no celular.
 */
export function WallExploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const layers = LSF_LAYERS;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const faixa = root.querySelector<HTMLElement>("[data-wall-rail]");
        const fileira = root.querySelector<HTMLElement>("[data-wall-row]");
        if (!faixa || !fileira) return;

        // Anda o quanto a fileira passa da largura visível, nem mais nem menos:
        // o último cartão termina alinhado à margem direita do container.
        const distancia = () => Math.max(0, fileira.scrollWidth - fileira.clientWidth);

        gsap.to(fileira, {
          x: () => -distancia(),
          ease: "none",
          // Começa com a fileira no meio da tela (topo a 45%), para o primeiro
          // cartão ser visto inteiro e parado antes de a fileira andar.
          scrollTrigger: {
            trigger: faixa,
            start: "top 45%",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Parallax leve dentro de cada foto, para a fileira não deslizar
        // como uma chapa só.
        gsap.utils.toArray<HTMLElement>("[data-wall-photo]", root).forEach((foto) => {
          gsap.fromTo(
            foto,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: faixa, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      // Celular: cada cartão tem 78% da tela, então a fileira passa de cinco
      // telas de largura e não dá para deslizá-la só com a seção passando (seria
      // o dobro da velocidade da rolagem). Aqui o trilho gruda na tela por
      // 55vh de rolagem por cartão, e a rolagem vertical anda a fileira.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const trilho = root.querySelector<HTMLElement>("[data-wall-track]");
        const tela = root.querySelector<HTMLElement>("[data-wall-sticky]");
        const fileira = root.querySelector<HTMLElement>("[data-wall-row]");
        if (!trilho || !tela || !fileira) return;

        trilho.style.height = `${layers.length * 55}vh`;
        Object.assign(tela.style, {
          position: "sticky",
          top: "0px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        });
        // O carrossel nativo sai de cena: com transform, rolar o próprio
        // carrossel e rolar a página brigariam pelo mesmo gesto.
        fileira.style.overflow = "visible";
        fileira.style.scrollSnapType = "none";

        gsap.to(fileira, {
          x: () => -Math.max(0, fileira.scrollWidth - fileira.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: trilho,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          trilho.style.removeProperty("height");
          for (const p of ["position", "top", "height", "display", "flex-direction", "justify-content"]) {
            tela.style.removeProperty(p);
          }
          fileira.style.removeProperty("overflow");
          fileira.style.removeProperty("scroll-snap-type");
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="parede"
      className="overflow-x-clip bg-off-white py-xl text-black md:py-3xl"
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

        <div data-wall-track className="relative">
        <div data-wall-sticky>
        <figure data-wall-rail className="mt-16 md:mt-24">
          <ol
            data-wall-row
            aria-label={WALL_SECTION.sceneAlt}
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 lg:will-change-transform"
          >
            {layers.map((layer, index) => (
              <li
                key={layer.id}
                className="w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[min(30vw,420px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
                  <div data-wall-photo className="absolute inset-y-0 -left-[8%] -right-[8%]">
                    <Image
                      src={layer.image}
                      alt=""
                      fill
                      quality={82}
                      sizes="(min-width: 1024px) 460px, 80vw"
                      className="object-cover saturate-[.9] contrast-[.98]"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-black-10 pt-4">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                    {WALL_LAYER_COPY[index]?.name ?? layer.name}
                  </h3>
                  <span className="shrink-0 font-tech text-xs text-black-50">{layer.thickness}</span>
                </div>
                <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-black-70">
                  {layer.description}
                </p>
              </li>
            ))}
          </ol>
          <figcaption className="mt-8 text-xs leading-relaxed text-black-50">
            {WALL_SECTION.note}
          </figcaption>
        </figure>
        </div>
        </div>

        <p className="mt-16 max-w-3xl font-display text-[clamp(1.5rem,2.2vw,2.4rem)] font-semibold leading-snug tracking-[-0.03em] md:mt-24">
          {WALL_SECTION.consequence}
        </p>
      </div>
    </section>
  );
}
