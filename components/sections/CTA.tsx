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
  "inline-flex items-center gap-2 px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-medium hover:bg-black-90 transition-colors duration-300";

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
    <section className="py-xl bg-black-5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <RevealOnScroll>
            <p className="label-text mb-4">{label}</p>
            <h2 className="headline-lg mb-6">{title}</h2>
            <p className="body-md mb-8 text-black-70">{description}</p>

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
