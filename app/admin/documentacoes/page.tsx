import { listarDocumentos } from "@/lib/documentacoes/queries";
import { contarThreadsAbertas } from "@/lib/documentacoes/comentarios";
import { DocumentacoesContent } from "./DocumentacoesContent";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documentações | Berkahn Admin",
};

export default async function DocumentacoesPage() {
  let documentos;
  try {
    documentos = await listarDocumentos();
  } catch {
    return <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
      Não foi possível carregar os documentos. Atualize a página para tentar novamente.
    </div>;
  }

  if (documentos.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-neutral-300" />
          <h2 className="mt-4 text-lg font-semibold text-neutral-900">
            Nenhum documento publicado
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Os relatórios e documentos de estratégia aparecerão aqui quando forem publicados.
          </p>
        </div>
      </div>
    );
  }

  // Uma query a mais, não uma por card: a contagem vem agregada por slug.
  const comentariosAbertos = await contarThreadsAbertas();

  return (
    <DocumentacoesContent
      documentos={documentos}
      comentariosAbertos={comentariosAbertos}
    />
  );
}
