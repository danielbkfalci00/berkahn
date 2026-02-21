import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { FAQ_CATEGORIES, getAllFAQItems } from "@/lib/faq-data";
import { ArrowRight } from "lucide-react";

const FAQSearch = dynamic(() =>
  import("@/components/faq/FAQSearch").then((m) => m.FAQSearch)
);

export const metadata = {
  title: "Perguntas Frequentes | Berkahn Steel Frame",
  description:
    "Respostas sobre custo, prazo, financiamento, durabilidade, manutenção e processo construtivo em Light Steel Frame. Tudo o que você precisa saber antes de construir.",
};

const EXPLORE_CARDS = [
  {
    title: "Residencial",
    desc: "Conheça nosso processo para casas e saiba por que o Steel Frame é ideal para sua família.",
    image: "/images/Services/residencial.webp",
    href: "/residencial",
  },
  {
    title: "Comercial & Industrial",
    desc: "Soluções para empresas: velocidade, flexibilidade e retorno mais rápido sobre o investimento.",
    image: "/images/Services/comercial.webp",
    href: "/comercial-industrial",
  },
  {
    title: "Tecnologia LSF",
    desc: "Tudo sobre o Light Steel Frame: composição, normas, comparativos e especificações técnicas.",
    image: "/images/Lsf/lsf-1.webp",
    href: "/lsf",
  },
  {
    title: "Conheça a Berkahn",
    desc: "Nossa história, valores e como trabalhamos para entregar projetos com excelência.",
    image: "/images/empresa/primeira-imagem.webp",
    href: "/empresa",
  },
];

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

      {/* 3. Aprofunde seu Conhecimento — 4 cards com imagens */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text text-center mb-4">EXPLORE MAIS</p>
            <h2 className="headline-md text-center mb-12">
              Aprofunde seu Conhecimento
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {EXPLORE_CARDS.map((card, i) => (
              <RevealOnScroll key={card.title} delay={i * 0.1}>
                <Link
                  href={card.href}
                  className="group block overflow-hidden rounded-lg border border-black-10 hover:shadow-luxury-md transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-black-5">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-heading text-lg font-semibold mb-1.5">
                      {card.title}
                    </h3>
                    <p className="body-sm text-black-50 mb-3">{card.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-black-60 group-hover:text-black group-hover:gap-2 transition-all">
                      Explorar
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
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
                text: item.answer.replace(/\*\*/g, ""),
              },
            })),
          }),
        }}
      />
    </>
  );
}
