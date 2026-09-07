"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { LSF_LAYERS } from "@/lib/lsf-data";
import { WALL_SECTION, WALL_LAYER_COPY } from "@/lib/sustentabilidade-data";

/** Distância em Z entre duas camadas vizinhas, no corte aberto. */
const LAYER_GAP = 78;
/** Perspectiva da cena. Quanto menor, mais dramática a fuga. */
const PERSPECTIVE = 1500;
/**
 * Giro da cena. O sinal importa: em `rotateY(θ)`, o eixo Z local aponta para
 * `x = sin(θ)`. Com θ negativo e as camadas em translateZ negativo, o leque
 * abria para a DIREITA e entrava por cima da coluna de texto. Com θ positivo
 * ele abre para a esquerda, onde há espaço vazio.
 */
const SCENE_ROTATE_Y = 30;
const SCENE_ROTATE_X = -8;

/**
 * Corte de parede que se abre em profundidade. As seis camadas começam
 * empilhadas (a parede lida como sólida) e se separam no eixo Z conforme o
 * scroll, enquanto a cena inteira gira para a vista de três quartos.
 *
 * O estado base do HTML é o corte JÁ ABERTO: sem JS, com prefers-reduced-motion
 * ou se o GSAP falhar, a seção continua sendo um diagrama legível. O GSAP anima
 * a partir do empilhado até esse mesmo estado, então o fim da timeline coincide
 * com o CSS estático.
 *
 * O transform mora sempre numa div simples; o <Image fill> vai dentro dela.
 * Pendurar transform 3D no próprio componente de imagem achata a cena no Safari.
 */
export function WallExploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const layers = LSF_LAYERS;
  const total = layers.length;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("[data-wall-track]");
        const wall = root.querySelector<HTMLElement>("[data-wall]");
        const plates = gsap.utils.toArray<HTMLElement>("[data-wall-plate]", root);
        const rows = gsap.utils.toArray<HTMLElement>("[data-wall-row]", root);
        if (!track || !wall || plates.length !== total || rows.length !== total) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.55 },
        });

        // A cena gira primeiro; só depois as camadas se descolam.
        tl.fromTo(
          wall,
          { rotateX: 0, rotateY: 0 },
          { rotateX: SCENE_ROTATE_X, rotateY: SCENE_ROTATE_Y, duration: 0.55 },
          0
        );

        plates.forEach((plate, index) => {
          tl.fromTo(
            plate,
            { z: 0 },
            { z: -index * LAYER_GAP, duration: 0.9 },
            0.3 + index * 0.11
          );
        });

        // A legenda acende na ordem em que a camada se abre.
        rows.forEach((row, index) => {
          tl.fromTo(
            row,
            { opacity: 0.22, x: -12 },
            { opacity: 1, x: 0, duration: 0.28 },
            0.42 + index * 0.11
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="parede"
      className="relative bg-carbon text-white before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[3px] before:bg-white before:content-['']"
      aria-labelledby="parede-title"
    >
      <div data-wall-track className="relative lg:h-[240vh]">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:flex lg:items-center">
          <div className="container py-xl lg:py-0">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* Cena 3D. Só desktop: em telas pequenas o corte vira lista. */}
              <div className="hidden lg:block lg:col-span-6">
                {/* overflow-hidden cria contexto de empilhamento e impede que uma
                    camada em 3D pinte por cima do que vem depois no DOM. Sem ele,
                    a ordenação por Z do preserve-3d ignora a ordem dos irmãos. */}
                <div
                  className="relative h-[62vh] overflow-hidden [clip-path:inset(0)]"
                  style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "58% 46%" }}
                >
                  <div
                    data-wall
                    className="absolute inset-0"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${SCENE_ROTATE_X}deg) rotateY(${SCENE_ROTATE_Y}deg)`,
                    }}
                  >
                    {layers.map((layer, index) => (
                      <div
                        key={layer.id}
                        data-wall-plate
                        className="absolute inset-0 m-auto h-[52vh] w-[34vw] max-w-[520px] border border-white-10 will-change-transform"
                        style={{ transform: `translateZ(${-index * LAYER_GAP}px)` }}
                      >
                        <Image
                          src={layer.image}
                          alt={index === 0 ? WALL_SECTION.sceneAlt : ""}
                          fill
                          quality={70}
                          sizes="(min-width: 1024px) 520px, 100vw"
                          className="object-cover grayscale"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0 bg-carbon/80 px-2 py-1 font-tech text-[10px] tracking-wide text-white"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Texto e legenda das camadas. */}
              <div className="relative z-10 lg:col-span-5 lg:col-start-8">
                <p className="font-tech text-xs lowercase tracking-wide text-white-50">
                  {WALL_SECTION.eyebrow}
                </p>
                <h2 id="parede-title" className="headline-md mt-4 text-white">
                  {WALL_SECTION.headline}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white-70">
                  {WALL_SECTION.copy}
                </p>

                <ul className="mt-10 border-t border-white-10">
                  {layers.map((layer, index) => (
                    <li
                      key={layer.id}
                      data-wall-row
                      className="flex items-baseline gap-4 border-b border-white-10 py-3"
                    >
                      <span className="font-tech text-[11px] tracking-wide text-white-50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-medium text-white">
                        {WALL_LAYER_COPY[index]?.name ?? layer.name}
                      </span>
                      <span className="font-tech text-[11px] tracking-wide text-white-50">
                        {layer.thickness}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
