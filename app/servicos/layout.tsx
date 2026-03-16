import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | Berkahn Construtora Steel Frame",
  description:
    "Conheça os serviços da Berkahn: construção residencial e comercial em Light Steel Frame, reformas, ampliações e projetos customizados em São Paulo.",
  openGraph: {
    title: "Serviços | Berkahn Construtora Steel Frame",
    description:
      "Conheça os serviços da Berkahn: construção residencial e comercial em Light Steel Frame, reformas, ampliações e projetos customizados em São Paulo.",
    url: "https://www.berkahn.com.br/servicos",
    siteName: "Construtora Berkahn",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/Compartilhamento/og-image.webp", width: 1200, height: 630, alt: "Construtora Berkahn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serviços | Berkahn Construtora Steel Frame",
    description:
      "Conheça os serviços da Berkahn: construção residencial e comercial em Light Steel Frame, reformas, ampliações e projetos customizados em São Paulo.",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
};

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
