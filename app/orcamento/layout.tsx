import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orcamento Steel Frame | Berkahn Construtora",
  description:
    "Solicite seu orcamento para construcao em Light Steel Frame. Projetos residenciais, comerciais e industriais com garantia e qualidade premium.",
  robots: "noindex, nofollow", // Pagina personalizada por cliente
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
