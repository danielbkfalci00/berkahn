import { PRACTICE_SECTION } from "@/lib/sustentabilidade-data";

export function PracticeList() {
  return (
    <section
      id="pratica"
      className="bg-white py-xl text-black md:py-3xl"
      aria-labelledby="pratica-title"
    >
      <div className="container">
        <div className="grid gap-9 lg:grid-cols-12 lg:gap-12">
          <h2
            id="pratica-title"
            className="max-w-5xl font-display text-[clamp(2.7rem,1.3rem+4.4vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] lg:col-span-8"
          >
            {PRACTICE_SECTION.headline}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-black-70 lg:col-span-4 lg:self-end lg:text-lg">
            {PRACTICE_SECTION.lede}
          </p>
        </div>

        <ul className="mt-24 grid gap-16 md:mt-36 md:grid-cols-12 md:gap-10">
          {PRACTICE_SECTION.practices.map((practice, index) => {
            const position = ["md:col-span-4", "md:col-span-4 md:mt-24", "md:col-span-4 md:mt-48"][index];
            return (
              <li key={practice.title} className={position}>
                <h3 className="max-w-xs font-display text-[clamp(1.65rem,2.4vw,2.65rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
                  {practice.title}
                </h3>
                <p className="mt-6 max-w-sm text-base leading-relaxed text-black-70">
                  {practice.body}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-28 bg-carbon px-7 py-16 text-white md:mt-44 md:px-16 md:py-24 lg:px-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <h3 className="max-w-md font-display text-[clamp(2.2rem,3.6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] lg:col-span-5">
              {PRACTICE_SECTION.honesty.title}
            </h3>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-base leading-relaxed text-white-70 md:text-lg">
                {PRACTICE_SECTION.honesty.body}
              </p>
              <p className="mt-10 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-white md:text-2xl">
                {PRACTICE_SECTION.honesty.conclusion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
