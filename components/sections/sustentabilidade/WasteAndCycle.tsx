"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LIFECYCLE_SECTION, SITE_SECTION } from "@/lib/sustentabilidade-data";

export function ImpactJourney() {
  const siteRef = useRef<HTMLElement>(null);
  const cycleRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = siteRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      // Todas as larguras: a foto grudada existe no celular também (em tela
      // cheia, atrás do texto), então a troca por passo vale para os dois.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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

  // Ciclo: cada foto se revela de baixo para cima, com um leve recuo de zoom,
  // e o número sobe no mesmo trecho. Sem contagem: número aqui é faixa ou
  // aproximação, e contador mutila as duas coisas.
  useGSAP(
    () => {
      const root = cycleRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-cycle-item]", root).forEach((item) => {
          const frame = item.querySelector<HTMLElement>("[data-cycle-frame]");
          const photo = item.querySelector<HTMLElement>("[data-cycle-photo]");
          const figure = item.querySelector<HTMLElement>("[data-cycle-figure]");
          if (!frame || !photo || !figure) return;
          const scrollTrigger = { trigger: item, start: "top 88%", end: "top 38%", scrub: 0.6 };
          gsap.fromTo(frame, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger });
          gsap.fromTo(photo, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger });
          gsap.fromTo(figure, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { ...scrollTrigger, start: "top 60%", end: "top 25%" } });
        });
      });
    },
    { scope: cycleRef },
  );

  return (
    <>
      <section
        ref={siteRef}
        id="canteiro"
        className="bg-carbon text-white"
        aria-labelledby="canteiro-title"
      >
        <div className="container pb-16 pt-xl md:pt-3xl xl:pb-24">
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
        </div>

        {/* Desktop: tela dividida, como na extração. Celular e tablet: a foto
            gruda em tela cheia e os passos passam por cima dela. O wrapper da
            coluna vira `contents` abaixo do xl para a foto sticky ser filha
            direta deste bloco e grudar pela altura inteira dele. */}
        <div className="relative xl:grid xl:grid-cols-2">
            <div className="contents xl:block">
              <div className="sticky top-0 h-[100svh] overflow-hidden bg-carbon-soft">
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
                      sizes="(min-width: 1280px) 50vw, 100vw"
                      className={`object-cover saturate-[.9] contrast-[.98] ${step.image.focus ?? ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                ))}
                {/* Véu só abaixo do xl, onde o texto branco fica por cima. */}
                <div className="absolute inset-0 bg-black/50 xl:hidden" />
              </div>
            </div>

            <div className="container relative z-10 -mt-[100svh] xl:mt-0 xl:max-w-none xl:px-16 2xl:px-24">
              {SITE_SECTION.steps.map((step) => (
                <article
                  key={step.title}
                  data-site-step
                  className="flex min-h-[100svh] flex-col justify-center py-16"
                >
                  <h3 className="max-w-md font-display text-[clamp(1.9rem,3vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 xl:text-white-70">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
        </div>
      </section>

      <section
        ref={cycleRef}
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
              <article key={item.title} data-cycle-item className={index === 1 ? "lg:mt-36" : ""}>
                <figure data-cycle-frame className="relative aspect-[4/3] overflow-hidden bg-carbon-soft">
                  <Image
                    data-cycle-photo
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    quality={80}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={`object-cover saturate-[.9] contrast-[.98] ${item.image.focus ?? ""}`}
                  />
                </figure>
                <div className="grid gap-8 pt-9 md:grid-cols-5 md:gap-10 md:pt-11">
                  <div data-cycle-figure className="md:col-span-2">
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
