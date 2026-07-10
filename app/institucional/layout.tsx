import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apresentação Institucional | BERKAHN - Construtora",
  description:
    "Documento institucional da BERKAHN: construtora especialista em Light Steel Frame, com projetos, gerenciamento, compatibilização e execução completa de obras.",
  robots: "noindex, nofollow",
};

export default function InstitucionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout isolado - sem Header e Footer
  return <>{children}</>;
}
