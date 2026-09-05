import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { PRACTICE_SECTION } from "@/lib/sustentabilidade-data";

/**
 * "07 · o que fica com a gente". Server Component: quatro práticas concretas e,
 * fechando a página, o que a gente deliberadamente NÃO afirma sobre carbono.
 * O bloco de ressalva é o único elemento escuro sobre o fundo branco, porque
 * ele é o argumento mais forte de credibilidade da página inteira.
 */
export function PracticeList() {
  return (
    <section className="bg-white py-2xl md:py-3xl" aria-labelledby="pratica-title">
      <div className="container">
        <RevealOnScroll>
          <p className="font-tech text-xs lowercase tracking-wide text-black-50">
            {PRACTICE_SECTION.eyebrow}
          </p>
          <h2 id="pratica-title" className="headline-md mt-4 max-w-2xl">
            {PRACTICE_SECTION.headline}
          </h2>
        </RevealOnScroll>

        <ul className="mt-14 grid gap-px border-t-[3px] border-black bg-black-10 md:grid-cols-2">
          {PRACTICE_SECTION.practices.map((practice, index) => (
            <li
              key={practice.title}
              className={`bg-white ${index % 2 === 1 ? "md:pl-8" : ""}`}
            >
              <RevealOnScroll delay={index * 0.08}>
                <div className="flex gap-5 py-8 pr-6 md:py-10">
                  <span className="font-tech text-[11px] tracking-wide text-black-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{practice.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-black-70">
                      {practice.body}
                    </p>
                  </div>
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
