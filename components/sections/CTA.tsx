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
            <p className="body-md text-black-70">
              Entre em contato conosco e descubra como podemos ajudar a
              construir a casa dos seus sonhos com tecnologia, precisão e
              excelência.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
