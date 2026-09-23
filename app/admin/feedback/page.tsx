import { listarFeedback } from "@/lib/feedback/queries";
import { parseFiltro } from "@/types/feedback";
import { FeedbackLista } from "@/components/admin/feedback/FeedbackLista";
import { AvisoFeedback } from "@/components/admin/feedback/AvisoFeedback";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Feedback | Berkahn Admin",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  // O filtro mora na URL para o link ser compartilhável e o voltar do
  // navegador funcionar.
  const { status } = await searchParams;
  const filtro = parseFiltro(Array.isArray(status) ? status[0] : status);
  const leitura = await listarFeedback(filtro);

  if (leitura.estado !== "ok") {
    return <AvisoFeedback estado={leitura.estado} mensagem={leitura.mensagem} />;
  }
  return <FeedbackLista itens={leitura.data} filtro={filtro} />;
}
