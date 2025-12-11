import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function CTA() {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <RevealOnScroll>
            <p className="label-text mb-4">Pronto para construir?</p>
            <h2 className="headline-lg mb-6">
              Transforme seu projeto em realidade com a Berkahn
            </h2>
            <p className="body-md mb-8 text-black-70">
              Entre em contato conosco e descubra como podemos ajudar a
              construir a casa dos seus sonhos com tecnologia, precisão e
              excelência.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-medium hover:bg-black-90 transition-colors duration-300"
            >
              Fale Conosco
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
