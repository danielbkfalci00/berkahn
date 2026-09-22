"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LSF_LAYERS } from "@/lib/lsf-data";
import { WALL_LAYER_COPY, WALL_SECTION } from "@/lib/sustentabilidade-data";

const LAYER_GAP = 72;
const PERSPECTIVE = 1550;
const SCENE_ROTATE_Y = 28;
const SCENE_ROTATE_X = -6;

export function WallExploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const layers = LSF_LAYERS;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1200px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("[data-wall-track]");
        const sticky = root.querySelector<HTMLElement>("[data-wall-sticky]");
        const container = root.querySelector<HTMLElement>("[data-wall-container]");
        const wall = root.querySelector<HTMLElement>("[data-wall]");
        const plates = gsap.utils.toArray<HTMLElement>("[data-wall-plate]", root);
        const layerImages = gsap.utils.toArray<HTMLElement>("[data-wall-layer-image]", root);
        const copy = root.querySelector<HTMLElement>("[data-wall-copy]");
        if (!track || !sticky || !container || !wall || plates.length !== layers.length) return;

        track.style.height = "225vh";
        Object.assign(sticky.style, {
          position: "sticky",
          top: "84px",
          display: "flex",
          height: "calc(100vh - 84px)",
          alignItems: "center",
          overflow: "hidden",
        });
        container.style.paddingTop = "0px";
        container.style.paddingBottom = "0px";

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        timeline.fromTo(
          wall,
          { rotateX: 0, rotateY: 0, scale: 0.92 },
          { rotateX: SCENE_ROTATE_X, rotateY: SCENE_ROTATE_Y, scale: 1, duration: 0.52 },
          0,
        );

        plates.forEach((plate, index) => {
          timeline.fromTo(
            plate,
            { z: 0, x: 0 },
            { z: -index * LAYER_GAP, x: index * 2, duration: 0.78 },
            0.18 + index * 0.065,
          );
        });

        timeline.fromTo(
          layerImages,
          { filter: "grayscale(100%) saturate(72%) contrast(102%)" },
          {
            filter: "grayscale(0%) saturate(88%) contrast(98%)",
            duration: 0.58,
            stagger: 0.035,
          },
          0.32,
        );

        if (copy) {
          timeline.fromTo(copy, { opacity: 0.55 }, { opacity: 1, duration: 0.38 }, 0.5);
        }

        return () => {
          track.style.removeProperty("height");
          for (const property of ["position", "top", "display", "height", "align-items", "overflow"]) {
            sticky.style.removeProperty(property);
          }
          container.style.removeProperty("padding-top");
          container.style.removeProperty("padding-bottom");
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="parede"
      className="bg-off-white text-black"
      aria-labelledby="parede-title"
    >
      <div data-wall-track className="relative">
        <div data-wall-sticky>
          <div data-wall-container className="container py-xl md:py-3xl">
            <div className="grid gap-14 xl:grid-cols-12 xl:items-center xl:gap-10">
              <div className="order-2 hidden xl:order-1 xl:col-span-7 xl:block">
                <div
                  className="relative h-[clamp(290px,48vh,450px)] overflow-hidden [clip-path:inset(0)]"
                  style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "62% 48%" }}
                  role="img"
                  aria-label={WALL_SECTION.sceneAlt}
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
                        className="absolute inset-0 m-auto h-[clamp(245px,40vh,380px)] w-[clamp(310px,34vw,510px)] will-change-transform"
                        style={{
                          transform: `translate3d(${index * 2}px, 0, ${-index * LAYER_GAP}px)`,
                          zIndex: layers.length - index,
                          boxShadow: "-20px 24px 42px rgba(0,0,0,.16), -4px 7px 12px rgba(0,0,0,.12)",
                        }}
                      >
                        <Image
                          data-wall-layer-image
                          src={layer.image}
                          alt=""
                          fill
                          quality={78}
                          sizes="(min-width: 1280px) 510px, 100vw"
                          className="object-cover saturate-[.88] contrast-[.98]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div data-wall-copy className="order-1 xl:order-2 xl:col-span-5">
                <h2
                  id="parede-title"
                  className="max-w-xl font-display text-[clamp(2.7rem,3.7vw,5rem)] font-semibold leading-[0.94] tracking-[-0.05em]"
                >
                  {WALL_SECTION.headline}
                </h2>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-black-70 md:text-lg">
                  {WALL_SECTION.copy}
                </p>
                <p className="mt-6 max-w-lg font-display text-xl font-semibold leading-snug tracking-[-0.02em] md:text-2xl">
                  {WALL_SECTION.consequence}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4" aria-label="Componentes mostrados no recorte">
                  {layers.map((layer, index) => (
                    <p key={layer.id} className="text-sm font-medium leading-snug text-black-70">
                      {WALL_LAYER_COPY[index]?.name ?? layer.name}
                    </p>
                  ))}
                </div>
                <p className="mt-7 max-w-lg text-xs leading-relaxed text-black-50">
                  {WALL_SECTION.note}
                </p>
              </div>

              <div className="order-2 xl:hidden">
                <div
                  className="grid aspect-[5/3] grid-cols-6 overflow-hidden bg-carbon shadow-[0_28px_70px_rgba(0,0,0,.16)]"
                  role="img"
                  aria-label={WALL_SECTION.sceneAlt}
                >
                  {layers.map((layer) => (
                    <div key={layer.id} className="relative">
                      <Image
                        src={layer.image}
                        alt=""
                        fill
                        quality={75}
                        sizes="17vw"
                        className="object-cover saturate-[.88] contrast-[.98]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
