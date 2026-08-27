import { notFound } from "next/navigation";
import { getDocumentoMeta } from "@/lib/documentacoes/queries";
import { listarThreads } from "@/lib/documentacoes/comentarios";
import { DocumentoViewer } from "./DocumentoViewer";
import { getAdminSession } from "@/lib/supabase/sessao";

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

  // As threads vêm do servidor já no primeiro render, para o painel não piscar
  // vazio. Daí em diante o cliente mescla o retorno das server actions no
  // estado local: revalidar remontaria o iframe e refaria o handshake da ponte
  // a cada comentário.
  const threads = await listarThreads(slug);
  const session = await getAdminSession();
  const canComment = session?.membership.role === "owner" || session?.membership.role === "conteudo";

  return <DocumentoViewer meta={meta} threadsIniciais={threads} authorName={session?.membership.nome || ""} canComment={canComment} />;
}
