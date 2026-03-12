import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | Berkahn Construtora Steel Frame",
  description:
    "Conheça os serviços da Berkahn: construção residencial e comercial em Light Steel Frame, reformas, ampliações e projetos customizados em Belo Horizonte.",
};

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
