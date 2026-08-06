import type { Metadata } from "next";
import { AlertCircle, KanbanSquare } from "lucide-react";
import { listarPautas } from "@/lib/conteudo/queries";
import { QuadroConteudo } from "@/components/admin/conteudo/QuadroConteudo";

export const metadata: Metadata = {
  title: "Conteúdo",
  robots: { index: false, follow: false },
};

export default async function ConteudoPage() {
  const { pautas, erro } = await listarPautas();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Conteúdo</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Cada card é um assunto: pesquisa, artigo, post de LinkedIn e capas no
            mesmo lugar.
          </p>
        </div>
        {pautas.length > 0 && (
          <p className="text-sm tabular-nums text-neutral-500">
            {pautas.length} {pautas.length === 1 ? "pauta" : "pautas"}
          </p>
        )}
      </header>

      {erro ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md bg-[#F8E8E8] p-4 text-sm text-[#B83A3A]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          <div>
            <p className="font-medium">Não consegui carregar o quadro.</p>
            <p className="mt-1 text-[#8F3232]">{erro}</p>
          </div>
        </div>
      ) : pautas.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center">
          <KanbanSquare
            className="h-8 w-8 text-neutral-300"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="mt-4 text-sm font-medium text-neutral-900">
            Nenhuma pauta ainda
          </h2>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            Crie a primeira pela coluna Decisão LK/Blog, ou rode o gerador de seed
            para trazer o calendário editorial.
          </p>
        </div>
      ) : (
        <QuadroConteudo pautas={pautas} />
      )}
    </div>
  );
}
