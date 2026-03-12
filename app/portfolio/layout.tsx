import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Berkahn Construtora Steel Frame",
  description:
    "Veja os projetos realizados pela Berkahn em Light Steel Frame: casas, galpões, escritórios e reformas em Belo Horizonte e região.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
