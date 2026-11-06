import { COMPARISON_SECTION } from "@/lib/sustentabilidade-data";

/**
 * Construção a seco x convencional. Três cartões em faixas, sem percentual
 * único e sem carbono. A procedência de cada número vive em
 * lib/sustentabilidade-data.ts e não aparece na tela (decisão do Bruno).
 */
export function ComparisonSection() {
  return (
    <section
      id="comparacao"
      className="bg-carbon py-xl text-white md:py-3xl"
      aria-labelledby="comparacao-title"
    >
      <div className="container">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
          <h2
            id="comparacao-title"
            className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
          >
            {COMPARISON_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white-70 lg:col-span-4 lg:self-end lg:text-lg">
            {COMPARISON_SECTION.lede}
          </p>
        </div>

        <ul className="mt-14 grid gap-px bg-white/10 md:mt-20 md:grid-cols-3">
          {COMPARISON_SECTION.items.map((item) => (
            <li key={item.title} className="flex flex-col gap-6 bg-carbon p-6 md:p-8 lg:p-10">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-white-50">
                {item.title}
              </h3>
              {item.value ? (
                <p className="font-display text-[clamp(2.6rem,1.6rem+2.8vw,4.6rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
                  {item.value}
                </p>
              ) : (
                <p className="font-display text-[clamp(1.9rem,1.3rem+1.8vw,3rem)] font-semibold leading-[1] tracking-[-0.04em]">
                  {item.label}
                </p>
              )}
              {item.value ? (
                <p className="text-base leading-relaxed text-white/80">{item.label}</p>
              ) : null}
              <p className="mt-auto text-sm leading-relaxed text-white-50">{item.note}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-white-50 md:mt-14">
          {COMPARISON_SECTION.footnote}
        </p>
      </div>
    </section>
  );
}
