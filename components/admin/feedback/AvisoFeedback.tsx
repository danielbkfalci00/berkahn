import Link from "next/link";
import { AlertTriangle } from "lucide-react";

// Aviso único para "migration 034 pendente" e erro de leitura, usado pela
// lista e pelo detalhe. Sem ele a página cairia no error boundary genérico.
export function AvisoFeedback({
  estado,
  mensagem,
}: {
  estado: "pendente" | "erro";
  mensagem: string;
}) {
  return (
    <div className="max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="space-y-2">
          <h1 className="text-base font-semibold text-amber-900">
            {estado === "pendente" ? "Mural de feedback ainda não ativado" : "Não foi possível carregar o feedback"}
          </h1>
          <p className="text-sm text-amber-800">{mensagem}</p>
          {estado === "pendente" && (
            <p className="text-xs text-amber-700">
              Aplique <span className="font-mono">supabase/migrations/034_admin_feedback.sql</span> no SQL
              Editor do Supabase e recarregue a página.
            </p>
          )}
          <Link href="/admin" className="inline-block text-xs font-medium text-amber-900 underline">
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
