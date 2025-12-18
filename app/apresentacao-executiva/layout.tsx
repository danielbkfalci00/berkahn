import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apresentação Executiva | BERKAHN - Soluções em Steel Frame",
  description:
    "Conheça a BERKAHN: empresa especializada em Steel Frame com mais de 20 anos de experiência combinada dos fundadores.",
  robots: "noindex, nofollow",
};

export default function ApresentacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout isolado - sem Header e Footer
  return <>{children}</>;
}
