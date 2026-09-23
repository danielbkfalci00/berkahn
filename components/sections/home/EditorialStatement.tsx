"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

// Os três pilares saem do texto institucional aprovado, sem acrescentar
// afirmação: antes eles eram dois parágrafos corridos numa tela preta.
const PILLARS = [
  {
    title: "Do terreno ao acabamento",
    body: "Cada etapa da obra executada pela mesma equipe técnica.",
  },
  {
    title: "Light Steel Frame em primeiro lugar",
    body: "Priorizamos o sistema pela eficiência, precisão e sustentabilidade, e dominamos outros sistemas quando o projeto pede.",
  },
  {
    title: "Residencial, comercial e industrial",
    body: "Engenharia de precisão e acompanhamento técnico dedicado, do projeto completo à execução especializada.",
  },
];

/**
 * Apresentação institucional. O título é a afirmação central da Berkahn (antes
 * era o nome da seção, "NOSSA EXPERTISE", e a revelação linha a linha era
 * gasta em duas palavras). Embaixo, uma foto aérea de obra ao lado de três
 * pilares curtos.
 *
 * Movimento: o título revela linha a linha, a foto abre de um recorte menor
 * com recuo de zoom e os pilares sobem um depois do outro. O HTML base é o
 * estado final, então tudo fica legível sem JS e com movimento reduzido.
 */
export function EditorialStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        document.fonts.ready.then(
          contextSafe(() => {
            const target = root.querySelector("[data-statement]");
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
                start: "top 82%",
                end: "top 40%",
                scrub: true,
              },
            });
          })
        );

        const frame = root.querySelector<HTMLElement>("[data-expertise-frame]");
        const photo = root.querySelector<HTMLElement>("[data-expertise-photo]");
        if (frame && photo) {
          const scrollTrigger = { trigger: frame, start: "top 90%", end: "top 30%", scrub: 0.6 };
          gsap.fromTo(
            frame,
            { clipPath: "inset(14% 10% 14% 10%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger }
          );
          gsap.fromTo(photo, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger });
        }

        const pillars = gsap.utils.toArray<HTMLElement>("[data-expertise-pillar]", root);
        if (pillars.length) {
          gsap.from(pillars, {
            y: 32,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "expo.out",
            scrollTrigger: { trigger: pillars[0], start: "top 85%", once: true },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-carbon py-2xl text-off-white md:py-3xl"
      aria-labelledby="expertise-title"
    >
      <div className="container">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-white-50 md:mb-10">
          Nossa expertise
        </p>

        <h2
          id="expertise-title"
          data-statement
          className="max-w-6xl font-display text-[clamp(2.6rem,1.2rem+4.8vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
        >
          Uma construtora completa, especialista em Light Steel Frame.
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <figure
            data-expertise-frame
            className="relative aspect-[4/3] overflow-hidden bg-carbon-soft lg:col-span-7 lg:aspect-[16/10]"
          >
            {/* sizes pela altura: foto 16:9 numa caixa 16:10 (desktop) ou 4:3
                (celular) é desenhada pela altura, e o zoom de 1.15 soma. */}
            <Image
              data-expertise-photo
              src="/images/galeria/projeto-42.webp"
              alt="Vista aérea de uma estrutura em Light Steel Frame sendo erguida entre as casas de um bairro residencial"
              fill
              quality={80}
              sizes="(min-width: 1024px) 75vw, 155vw"
              className="object-cover object-[35%_50%]"
            />
          </figure>

          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <ol className="divide-y divide-white-10 border-y border-white-10">
              {PILLARS.map((pillar) => (
                <li key={pillar.title} data-expertise-pillar className="py-6 md:py-7">
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white-70">{pillar.body}</p>
                </li>
              ))}
            </ol>

            <Link
              href="/empresa"
              className="group mt-10 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-wider text-white"
            >
              <span className="h-[3px] w-10 bg-white transition-all duration-500 ease-expo group-hover:w-16" />
              Conheça a Berkahn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
