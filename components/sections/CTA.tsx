// Client Component de propósito. O botão daqui é passado como `children` para o
// DialogTrigger `asChild` do Radix; quando o CTA era Server Component, esse filho
// chegava pelo payload RSC e a hidratação falhava em dev (React 18.3 no cliente,
// React embutido do Next 16 no servidor): a árvore era regenerada, o botão sumia
// do DOM e o <script> do layout era reinserido no <head>. Ver app/layout.tsx.
"use client";

import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

interface CTAProps {
  label?: string;
  title?: string;
  description?: string;
  actionType?: "dialog" | "link";
  actionText?: string;
  actionHref?: string;
  defaultSegment?: "residencial" | "comercial" | "";
  /** Vai para o GA4 como `cta_location`. Ex: "blog:custo-steel-frame-m2-2026". */
  ctaLocation?: string;
  /**
   * "editorial" alinha o bloco à esquerda e ocupa a largura do container, para
   * o CTA não ser o único elemento centralizado de uma página editorial.
   */
  variant?: "default" | "editorial";
}

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-4 h-4 transition-transform duration-300 ease-expo group-hover:translate-x-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

// O hover anterior era bg-white/90: 4% de luminância numa paleta mono, ou seja,
// invisível. Agora inverte, e o foco de teclado tem contorno próprio.
const buttonClasses =
  "group inline-flex items-center gap-2 border-[3px] border-white bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-black transition-colors duration-300 hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px";

export function CTA({
  label = "PRONTO PARA CONSTRUIR?",
  title = "Vamos conversar sobre seu projeto",
  description = "Conte-nos sobre seu projeto. Trabalhamos com Steel Frame e construção de alto desempenho: projeto completo, execução de obra ou mão de obra especializada.",
  actionType = "dialog",
  actionText = "Fale Conosco",
  actionHref = "/",
  defaultSegment,
  ctaLocation = "cta_secao",
  variant = "default",
}: CTAProps = {}) {
  return (
    <section className={variant === "editorial" ? "bg-white pb-xl" : "py-xl bg-white"}>
      <div className="container">
        <div
          className={`bg-black p-6 sm:p-10 md:p-16 ${
            variant === "editorial" ? "text-left" : "mx-auto max-w-3xl text-center"
          }`}
        >
          <RevealOnScroll>
            <p className="label-text mb-4 text-white/60">{label}</p>
            <h2 className="mb-6 break-words hyphens-none text-3xl font-heading font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h2>
            <p className="body-md mb-8 text-white/70">{description}</p>

            {actionType === "link" ? (
              <Link href={actionHref} className={buttonClasses}>
                {actionText}
                <ArrowIcon />
              </Link>
            ) : (
              <ContactFormDialog defaultSegment={defaultSegment} ctaLocation={ctaLocation}>
                <button className={buttonClasses}>
                  {actionText}
                  <ArrowIcon />
                </button>
              </ContactFormDialog>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
