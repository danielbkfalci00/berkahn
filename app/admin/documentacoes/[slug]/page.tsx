import { notFound } from "next/navigation";
import { getDocumentoMeta } from "@/lib/documentacoes/queries";
import { DocumentoViewer } from "./DocumentoViewer";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DocumentoPage({ params }: Props) {
  const { slug } = await params;
  // Só a meta. O HTML vai pela rota /raw, direto para o iframe — nunca passa
  // pelo bundle desta página.
  const meta = await getDocumentoMeta(slug);
  if (!meta) notFound();

  return <DocumentoViewer meta={meta} />;
}
