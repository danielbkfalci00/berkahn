import { notFound } from "next/navigation";
import { buscarFeedback } from "@/lib/feedback/queries";
import { getAdminSession } from "@/lib/supabase/sessao";
import { FeedbackConversa } from "@/components/admin/feedback/FeedbackConversa";
import { AvisoFeedback } from "@/components/admin/feedback/AvisoFeedback";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Feedback | Berkahn Admin",
};

// Página própria em vez de painel lateral: no celular o chat precisa da tela
// inteira e do teclado virtual, e o link direto serve para o push e a CLI.
export default async function FeedbackDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [leitura, session] = await Promise.all([buscarFeedback(id), getAdminSession()]);

  if (leitura.estado !== "ok") {
    return <AvisoFeedback estado={leitura.estado} mensagem={leitura.mensagem} />;
  }
  if (!leitura.data) notFound();

  return (
    <FeedbackConversa
      item={leitura.data.item}
      mensagens={leitura.data.mensagens}
      usuarioId={session?.user.id ?? null}
      podeMudarStatus={session?.membership.role === "owner"}
    />
  );
}
