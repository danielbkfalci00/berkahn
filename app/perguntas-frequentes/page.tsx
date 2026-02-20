import dynamic from "next/dynamic";
import Link from "next/link";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CountUp } from "@/components/animations/CountUp";
import { FAQ_CATEGORIES, getAllFAQItems } from "@/lib/faq-data";
import { Home, Building2, Wrench, ArrowRight } from "lucide-react";

const FAQSearch = dynamic(() =>
  import("@/components/faq/FAQSearch").then((m) => m.FAQSearch)
);

const FAQQuestionForm = dynamic(() =>
  import("@/components/faq/FAQQuestionForm").then((m) => m.FAQQuestionForm)
);

export const metadata = {
  title: "Perguntas Frequentes | Berkahn Steel Frame",
  description:
    "Respostas sobre custo, prazo, financiamento, durabilidade, manutenção e processo construtivo em Light Steel Frame. Tudo o que você precisa saber antes de construir.",
};

export default function PerguntasFrequentes() {
  const allFAQs = getAllFAQItems();

  return (
    <>
      {/* 1. Hero */}
      <ParallaxHero
        label="TIRE SUAS DÚVIDAS"
        title="Tudo o que Você Precisa Saber"
        subtitle="Respostas diretas sobre Steel Frame, nosso processo, financiamento e pós-obra."
        backgroundImage="/images/galeria/projeto-07.webp"
      />

      {/* 2. FAQ Accordion por categorias */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <p className="label-text text-center mb-4">
              PERGUNTAS FREQUENTES
            </p>
            <h2 className="headline-md text-center mb-12">
              Encontre Respostas para suas Dúvidas
            </h2>
          </RevealOnScroll>

          <FAQSearch categories={FAQ_CATEGORIES} />
        </div>
      </section>

      {/* 3. Não encontrou sua resposta? */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Text column */}
            <RevealOnScroll>
              <div className="lg:sticky lg:top-32">
                <p className="label-text mb-4">NÃO ENCONTROU?</p>
                <h2 className="headline-md mb-6">
                  Envie sua Dúvida
                </h2>
                <p className="body-lg text-black-50 leading-relaxed">
                  Se a sua pergunta não está aqui, envie para nós.
                  Respondemos por e-mail em até 24 horas úteis.
                </p>
              </div>
            </RevealOnScroll>

            {/* Form column */}
            <RevealOnScroll delay={0.2}>
              <FAQQuestionForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. Números que respondem */}
      <section className="py-xl bg-black text-white">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-center text-white/50 mb-4">
              NÚMEROS QUE FALAM
            </p>
            <h2 className="headline-md text-center text-white mb-12">
              Steel Frame em Dados
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
            {[
              { end: 90, prefix: "+", suffix: "", label: "Anos de durabilidade", desc: "Vida útil comprovada do aço galvanizado pelo IPT" },
              { end: 70, prefix: "", suffix: "%", label: "Mais rápido", desc: "Redução no prazo de obra comparado à alvenaria" },
              { end: 0, prefix: "", suffix: "", label: "NBR 16970", desc: "Regulamentado como sistema construtivo convencional", isText: true, textValue: "NBR 16970" },
              { end: 100, prefix: "", suffix: "%", label: "Reciclável", desc: "Todo o aço da estrutura pode ser reciclado" },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.1}>
                <div className="bg-black px-6 lg:px-8 py-10 text-center">
                  {stat.isText ? (
                    <p className="font-heading text-2xl xl:text-3xl font-bold text-white mb-3 tracking-tighter">
                      {stat.textValue}
                    </p>
                  ) : (
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      className="font-heading text-4xl xl:text-5xl font-bold text-white mb-3 tracking-tighter block"
                      duration={2000}
                    />
                  )}
                  <div className="w-8 h-px bg-white/20 mx-auto mb-3" />
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Links de aprofundamento */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-center mb-4">EXPLORE MAIS</p>
            <h2 className="headline-md text-center mb-12">
              Aprofunde seu Conhecimento
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Home,
                title: "Residencial",
                desc: "Conheça nosso processo para casas e saiba por que o Steel Frame é ideal para sua família.",
                href: "/residencial",
              },
              {
                icon: Building2,
                title: "Comercial & Industrial",
                desc: "Soluções para empresas: velocidade, flexibilidade e retorno mais rápido sobre o investimento.",
                href: "/comercial-industrial",
              },
              {
                icon: Wrench,
                title: "Tecnologia LSF",
                desc: "Tudo sobre o Light Steel Frame: composição, normas, comparativos e especificações técnicas.",
                href: "/lsf",
              },
            ].map((card, i) => (
              <RevealOnScroll key={card.title} delay={i * 0.1}>
                <Link
                  href={card.href}
                  className="group block p-6 md:p-8 rounded-lg border border-black-10 hover:border-black-30 hover:shadow-luxury-md transition-all duration-300"
                >
                  <card.icon
                    className="w-6 h-6 text-black-40 group-hover:text-black-70 transition-colors mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {card.title}
                  </h3>
                  <p className="body-sm text-black-50 mb-4">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-black-60 group-hover:text-black group-hover:gap-2 transition-all">
                    Explorar
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <CTA />

      {/* FAQ Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allFAQs.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
