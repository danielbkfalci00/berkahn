"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LIFECYCLE_SECTION, SITE_SECTION } from "@/lib/sustentabilidade-data";

export function ImpactJourney() {
  const siteRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = siteRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      // Mesmo motivo do recorte da parede: a coluna sticky de imagens só existe
      // a partir do `xl` do Tailwind, então o portão precisa casar com ele. Abaixo
      // disso o movimento apagava os passos para 42% sem a troca de imagem que
      // justifica o apagamento.
      mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        const images = gsap.utils.toArray<HTMLElement>("[data-site-image]", root);
        const steps = gsap.utils.toArray<HTMLElement>("[data-site-step]", root);
        if (images.length !== steps.length) return;

        gsap.set(images, { autoAlpha: 0, scale: 1.035 });
        gsap.set(images[0], { autoAlpha: 1, scale: 1 });
        gsap.set(steps, { opacity: 0.42 });
        gsap.set(steps[0], { opacity: 1 });

        const activate = (index: number) => {
          gsap.to(images, { autoAlpha: 0, duration: 0.35, overwrite: true });
          gsap.to(images[index], { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power2.out", overwrite: true });
          gsap.to(steps, { opacity: 0.42, duration: 0.25, overwrite: true });
          gsap.to(steps[index], { opacity: 1, duration: 0.35, overwrite: true });
        };

        steps.forEach((step, index) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => activate(index),
            onEnterBack: () => activate(index),
          });
        });
      });
    },
    { scope: siteRef },
  );

  return (
    <>
      <section
        ref={siteRef}
        id="canteiro"
        className="bg-carbon py-xl text-white md:py-3xl"
        aria-labelledby="canteiro-title"
      >
        <div className="container">
          <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
            <h2
              id="canteiro-title"
              className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
            >
              {SITE_SECTION.headline}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-4 lg:self-end lg:text-lg">
              {SITE_SECTION.lede}
            </p>
          </div>

          <div className="mt-20 grid gap-16 xl:mt-32 xl:grid-cols-12 xl:gap-12">
            <div className="hidden xl:col-span-7 xl:block">
              <div className="sticky top-[12vh] h-[76vh] overflow-hidden bg-carbon-soft">
                {SITE_SECTION.steps.map((step, index) => (
                  <div
                    key={step.title}
                    data-site-image
                    className="absolute inset-0 will-change-[opacity,transform]"
                    style={{ opacity: index === SITE_SECTION.steps.length - 1 ? 1 : 0 }}
                  >
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      quality={80}
                      sizes="58vw"
                      className={`object-cover saturate-[.9] contrast-[.98] ${step.image.focus ?? ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-4 xl:col-start-9">
              {SITE_SECTION.steps.map((step) => (
                <article
                  key={step.title}
                  data-site-step
                  className="py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 xl:flex xl:min-h-[68vh] xl:flex-col xl:items-stretch xl:justify-center xl:gap-0 xl:py-16"
                >
                  <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-carbon-soft lg:col-span-7 lg:mb-0 lg:aspect-[3/2] xl:hidden">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      quality={78}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className={`object-cover saturate-[.9] contrast-[.98] ${step.image.focus ?? ""}`}
                    />
                  </div>
                  <div className="lg:col-span-4 lg:col-start-9 xl:contents">
                    <h3 className="max-w-md font-display text-[clamp(1.8rem,3vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                      {step.title}
                    </h3>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-white-70">
                      {step.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="ciclo"
        className="bg-off-white py-xl text-black md:py-3xl"
        aria-labelledby="ciclo-title"
      >
        <div className="container">
          <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
            <h2
              id="ciclo-title"
              className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
            >
              {LIFECYCLE_SECTION.headline}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
              {LIFECYCLE_SECTION.lede}
            </p>
          </div>

          <div className="mt-20 grid gap-20 lg:mt-32 lg:grid-cols-2 lg:gap-6">
            {[LIFECYCLE_SECTION.operation, LIFECYCLE_SECTION.steel].map((item, index) => (
              <article key={item.title} className={index === 1 ? "lg:mt-36" : ""}>
                <figure className="relative aspect-[4/3] overflow-hidden bg-carbon-soft">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    quality={80}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={`object-cover saturate-[.9] contrast-[.98] ${item.image.focus ?? ""}`}
                  />
                </figure>
                <div className="grid gap-8 pt-9 md:grid-cols-5 md:gap-10 md:pt-11">
                  <div className="md:col-span-2">
                    <p className="font-display text-[clamp(3.7rem,6vw,6.8rem)] font-semibold leading-[0.82] tracking-[-0.065em]">
                      {item.figure.value}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-black-70">
                      {item.figure.label}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-base leading-relaxed text-black-70">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
