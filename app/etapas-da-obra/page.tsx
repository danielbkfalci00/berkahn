import type { Metadata } from "next";
import Image from "next/image";
import { FluxogramaEtapasObra } from "@/components/fluxograma/FluxogramaEtapasObra";

// Página limpa para envio direto a clientes (sem Header/Footer do site — ver
// ClientLayout/ConditionalFooter). noindex, mas com OG para o link preview no WhatsApp.
export const metadata: Metadata = {
  title: "Etapas da Obra | BERKAHN — Processo Construtivo",
  description:
    "Fluxograma completo do processo construtivo BERKAHN: da compra do terreno à mobilização da obra, com os marcos de orçamento de cada fase.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Etapas da Obra | BERKAHN",
    description:
      "Fluxograma completo do processo construtivo: da compra do terreno à mobilização da obra.",
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
    title: "Etapas da Obra | BERKAHN",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
};

const WHATSAPP_URL = `https://wa.me/5511966415742?text=${encodeURIComponent(
  "Olá! Vi o fluxograma de etapas da obra da Berkahn e gostaria de saber mais."
)}`;

export default function EtapasDaObraPage() {
  return (
    <div className="min-h-screen bg-off-white fluxograma-grid-bg print:bg-white print:bg-none">
      {/* Header minimalista — paridade com o artefato v1 */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-8 px-6 py-4 lg:px-20">
          <div className="flex items-center gap-3.5">
            <Image
              src="/images/logo/berkahn-logo.webp"
              alt=""
              width={400}
              height={400}
              priority
              className="h-12 w-auto lg:h-16"
            />
            <div>
              <p className="font-heading text-xl font-extrabold tracking-[0.18em] lg:text-2xl">BERKAHN</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/50 lg:text-[10px]">
                Construtora de Alto Padrão
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-black/60">
              Processo Construtivo
            </p>
            <h1 className="font-heading text-2xl font-extrabold uppercase leading-tight tracking-[0.10em] lg:text-[32px]">
              Etapas da Obra
            </h1>
          </div>
        </div>
      </header>

      <main>
        <FluxogramaEtapasObra variant="page" />
      </main>

      <footer className="mt-2 border-t border-black/10 px-6 py-8 pb-10 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.26em]">Berkahn</p>
        <p className="mt-1.5 text-[10.5px] font-medium text-black/40">
          Construtora de Alto Padrão · © 2026
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-black px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ease-expo hover:bg-black hover:text-white print:hidden"
        >
          Falar com a Berkahn
        </a>
      </footer>
    </div>
  );
}
