import type { Metadata } from "next";
import { CuradoriaProviders } from "@/components/architects/CuradoriaProviders";

export const metadata: Metadata = {
  title: "Arquitetos Parceiros | BERKAHN - Soluções em Steel Frame",
  description:
    "Curadoria de escritórios de arquitetura parceiros da BERKAHN, especializados em projetos de alto padrão em steel frame.",
  robots: "noindex, nofollow",
};

export default function CuradoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CuradoriaProviders>{children}</CuradoriaProviders>;
}
