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
}

const ArrowIcon = () => (
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
);

const buttonClasses =
  "inline-flex items-center gap-2 px-8 py-4 bg-white text-black uppercase tracking-wider text-sm font-medium hover:bg-white/90 transition-colors duration-300";

export function CTA({
  label = "PRONTO PARA CONSTRUIR?",
  title = "Vamos conversar sobre seu projeto",
  description = "Conte-nos sobre seu projeto. Trabalhamos com Steel Frame e construção de alto desempenho: projeto completo, execução de obra ou mão de obra especializada.",
  actionType = "dialog",
  actionText = "Fale Conosco",
  actionHref = "/",
  defaultSegment,
}: CTAProps = {}) {
  return (
    <section className="py-xl bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto bg-black p-6 sm:p-10 md:p-16">
          <RevealOnScroll>
            <p className="label-text mb-4 text-white/60">{label}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6 text-white break-words hyphens-auto">{title}</h2>
            <p className="body-md mb-8 text-white/70">{description}</p>

            {actionType === "link" ? (
              <Link href={actionHref} className={buttonClasses}>
                {actionText}
                <ArrowIcon />
              </Link>
            ) : (
              <ContactFormDialog defaultSegment={defaultSegment}>
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
