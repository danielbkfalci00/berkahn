import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Berkahn Construtora Steel Frame",
  description:
    "Veja os projetos realizados pela Berkahn em Light Steel Frame: casas, galpões, escritórios e reformas em São Paulo e região.",
  openGraph: {
    title: "Portfolio | Berkahn Construtora Steel Frame",
    description:
      "Veja os projetos realizados pela Berkahn em Light Steel Frame: casas, galpões, escritórios e reformas em São Paulo e região.",
    url: "https://www.berkahn.com.br/portfolio",
    siteName: "Construtora Berkahn",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/Compartilhamento/og-image.webp", width: 1200, height: 630, alt: "Construtora Berkahn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Berkahn Construtora Steel Frame",
    description:
      "Veja os projetos realizados pela Berkahn em Light Steel Frame: casas, galpões, escritórios e reformas em São Paulo e região.",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
  alternates: {
    canonical: "/portfolio",
    languages: { "pt-BR": "https://www.berkahn.com.br/portfolio" },
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
