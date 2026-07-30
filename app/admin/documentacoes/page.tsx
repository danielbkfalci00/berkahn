import { listarDocumentos } from "@/lib/documentacoes/queries";
import { DocumentacoesContent } from "./DocumentacoesContent";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documentações | Berkahn Admin",
};

export default async function DocumentacoesPage() {
  const documentos = await listarDocumentos();

  if (documentos.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-neutral-300" />
          <h2 className="mt-4 text-lg font-semibold text-neutral-900">
            Nenhum documento publicado
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Os relatórios de performance são publicados automaticamente pelo cron
            mensal. Documentos de estratégia entram pelo seed.
          </p>
          <pre className="mt-6 overflow-x-auto rounded bg-neutral-50 p-3 text-left text-xs text-neutral-600">
            node --env-file=.env.local scripts/documentacoes/seed-documentos.mjs
          </pre>
        </div>
      </div>
    );
  }

  return <DocumentacoesContent documentos={documentos} />;
}
