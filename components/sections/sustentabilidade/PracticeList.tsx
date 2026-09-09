import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { PRACTICE_SECTION } from "@/lib/sustentabilidade-data";

/**
 * "07 · a prática". Server Component: três práticas concretas e, fechando a
 * página, o que a gente deliberadamente NÃO afirma sobre carbono.
 * O bloco de ressalva é o único elemento escuro sobre o fundo branco, porque
 * ele é o argumento mais forte de credibilidade da página inteira.
 */
export function PracticeList() {
  return (
    <section id="pratica" className="bg-white pt-xl pb-lg md:pt-2xl" aria-labelledby="pratica-title">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-black-70">
            {PRACTICE_SECTION.eyebrow}
          </p>
          <h2 id="pratica-title" className="headline-md mt-4 max-w-2xl">
            {PRACTICE_SECTION.headline}
          </h2>
        </RevealOnScroll>

        {/* Régua de 3px por coluna em vez do truque de gap-px com fundo: são
            três práticas, e três células iguais numa grade de duas deixavam um
            buraco na segunda linha. */}
        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {PRACTICE_SECTION.practices.map((practice, index) => (
            <li key={practice.title}>
              <RevealOnScroll delay={index * 0.08}>
                <div className="border-t-[3px] border-black pt-5">
                  <span className="font-tech text-[11px] tracking-wide text-black-70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{practice.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black-70">{practice.body}</p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ul>

        <RevealOnScroll>
          <div className="mt-16 bg-carbon p-8 text-white md:mt-20 md:p-12">
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <span className="block h-[3px] w-10 bg-white" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {PRACTICE_SECTION.honesty.title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-white-70 md:col-span-7 md:col-start-6 md:text-lg">
                {PRACTICE_SECTION.honesty.body}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
