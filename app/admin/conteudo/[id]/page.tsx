import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPauta, listarArtigosVinculaveis, listarTagsConteudo } from "@/lib/conteudo/queries";
import { PainelPauta } from "@/components/admin/conteudo/detalhe/PainelPauta";

export const metadata: Metadata = {
  title: "Pauta",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PautaPage({ params }: Props) {
  const { id } = await params;
  const [pauta, artigosLivres, tagsCatalogo] = await Promise.all([
    getPauta(id),
    listarArtigosVinculaveis(),
    listarTagsConteudo(),
  ]);
  if (!pauta) notFound();

  return <PainelPauta pauta={pauta} artigosLivres={artigosLivres} tagsCatalogo={tagsCatalogo} />;
}
