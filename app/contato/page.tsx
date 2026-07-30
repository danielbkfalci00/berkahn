import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTATOS } from "@/lib/orcamento-data";
import { WHATSAPP_URL } from "@/lib/contact";

const PAGE_TITLE = "Contato | Berkahn Steel Frame";
const PAGE_DESCRIPTION =
  "Fale com a Berkahn sobre seu projeto em Light Steel Frame. Residencial, comercial ou industrial na Grande São Paulo. Retorno em até 24 horas úteis.";
const PAGE_URL = "https://www.berkahn.com.br/contato";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Construtora Berkahn",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/Compartilhamento/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Construtora Berkahn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/images/Compartilhamento/og-image.webp"],
  },
  alternates: {
    canonical: "/contato",
    languages: { "pt-BR": PAGE_URL },
  },
};

/** O que o visitante precisa saber antes de decidir por qual canal falar. */
const CANAIS = [
  {
    rotulo: "WhatsApp",
    valor: CONTATOS.telefone,
    detalhe: "Resposta mais rápida, em horário comercial",
    href: WHATSAPP_URL,
    externo: true,
  },
  {
    rotulo: "E-mail",
    valor: CONTATOS.email,
    detalhe: "Para briefings, plantas e documentos",
    href: `mailto:${CONTATOS.email}`,
    externo: false,
  },
  {
    rotulo: "Atendimento",
    valor: "Grande São Paulo",
    detalhe: "Obras residenciais, comerciais e industriais",
    href: null,
    externo: false,
  },
];

export default function ContatoPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ name: "Contato", href: "/contato" }]} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Coluna editorial */}
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-black-30">
              Fale conosco
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Conte o que você quer construir.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black-70">
              Quanto mais concreto o contexto — metragem, terreno, prazo, se já
              existe projeto —, mais útil é a primeira resposta. Retornamos em
              até 24 horas úteis com um panorama honesto de custo e prazo, não
              com um catálogo.
            </p>

            <dl className="mt-12 divide-y divide-black-10 border-t border-black-10">
              {CANAIS.map((canal) => (
                <div
                  key={canal.rotulo}
                  className="grid gap-1 py-5 sm:grid-cols-[140px_1fr] sm:gap-6"
                >
                  <dt className="text-[11px] uppercase tracking-[0.15em] text-black-30 sm:pt-1">
                    {canal.rotulo}
                  </dt>
                  <dd>
                    {canal.href ? (
                      <a
                        href={canal.href}
                        {...(canal.externo
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-base font-medium underline decoration-black-10 underline-offset-4 transition-colors hover:decoration-black"
                      >
                        {canal.valor}
                      </a>
                    ) : (
                      <span className="text-base font-medium">{canal.valor}</span>
                    )}
                    <p className="mt-1 text-sm text-black-70">{canal.detalhe}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Formulário — mesmo componente do modal disparado pelos CTAs */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-black-10 bg-white shadow-luxury-md">
              <ContactForm
                ctaLocation="contato_pagina"
                header={
                  <div className="mb-5">
                    <h2 className="font-heading text-lg font-semibold tracking-tight">
                      Enviar mensagem
                    </h2>
                    <p className="mt-1 text-xs text-black-70">
                      Retornaremos em até 24 horas.
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            url: PAGE_URL,
            mainEntity: {
              "@id": "https://www.berkahn.com.br/#organization",
            },
          }),
        }}
      />
    </main>
  );
}
