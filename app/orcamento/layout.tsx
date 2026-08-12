import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orçamento Steel Frame | Berkahn Construtora",
  description:
    "Solicite seu orçamento para construção em Light Steel Frame. Projetos residenciais, comerciais e industriais com garantia e qualidade premium.",
  robots: "noindex, nofollow", // Pagina personalizada por cliente
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
  );
}
