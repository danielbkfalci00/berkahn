"use client";

import { useId, useState, type ReactNode } from "react";
import { AlertCircle, Check, ChevronDown, Loader2 } from "lucide-react";
import type { EstadoSave } from "@/lib/conteudo/autosave";
import { cn } from "@/lib/utils";

interface Props {
  titulo: string;
  icone: ReactNode;
  /** Resumo à direita quando fechado (ex.: "1.240 caracteres"). */
  resumo?: string;
  estado?: EstadoSave;
  aoTentarDeNovo?: () => void;
  abertoInicial?: boolean;
  children: ReactNode;
}

function horaCurta(ms: number) {
  return new Date(ms).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function IndicadorSave({ estado, aoTentarDeNovo }: { estado: EstadoSave; aoTentarDeNovo?: () => void }) {
  if (estado.fase === "limpo") return null;

  if (estado.fase === "erro") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-600">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
        <span className="max-w-[22ch] truncate" title={estado.mensagem}>
          {estado.mensagem}
        </span>
        {aoTentarDeNovo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              aoTentarDeNovo();
            }}
            className="rounded underline underline-offset-2 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            tentar de novo
          </button>
        )}
      </span>
    );
  }

  const conteudo =
    estado.fase === "salvando" ? (
      <>
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden />
        Salvando…
      </>
    ) : estado.fase === "salvo" ? (
      <>
        <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        Salvo às {horaCurta(estado.em)}
      </>
    ) : (
      <>Não salvo</>
    );

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs",
        estado.fase === "salvo" ? "text-[#1F6F3D]" : "text-neutral-500"
      )}
    >
      {conteudo}
    </span>
  );
}

/**
 * Bloco do card, no espírito dos toggles do Notion.
 *
 * ⚠️ Não usa components/ui/accordion.tsx por dois motivos independentes: a
 * linha 47 renderiza o Content sem `forceMount`, então fechar DESMONTA o
 * conteúdo — o textarea some, o estado do autosave morre e o cleanup limpa o
 * timer do debounce antes de ele disparar, perdendo texto sem aviso; e a linha
 * 49 anima `height`, que é propriedade de layout.
 *
 * Aqui o corpo fica sempre montado e apenas escondido com `hidden`
 * (= display:none), que tira do fluxo e do tab order sem desmontar. Só o
 * chevron anima, com transform.
 *
 * O indicador de gravação vive no CABEÇALHO, e é o que torna o `hidden`
 * aceitável: bloco fechado com gravação pendente continua sinalizando.
 */
export function BlocoColapsavel({
  titulo,
  icone,
  resumo,
  estado,
  aoTentarDeNovo,
  abertoInicial = false,
  children,
}: Props) {
  const [aberto, setAberto] = useState(abertoInicial);
  const idCorpo = useId();

  return (
    <section className="rounded-lg border border-neutral-200 bg-white">
      <h3>
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={idCorpo}
          onClick={() => setAberto((a) => !a)}
          className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
              aberto && "rotate-180"
            )}
            strokeWidth={2}
            aria-hidden
          />
          <span className="shrink-0 text-neutral-400">{icone}</span>
          <span className="flex-1 text-sm font-medium text-neutral-900">{titulo}</span>

          <span className="flex items-center gap-3" aria-live="polite">
            {estado ? (
              <IndicadorSave estado={estado} aoTentarDeNovo={aoTentarDeNovo} />
            ) : null}
            {!aberto && resumo && (
              <span className="text-xs tabular-nums text-neutral-400">{resumo}</span>
            )}
          </span>
        </button>
      </h3>

      {/* Sempre renderizado — ver a nota acima. */}
      <div id={idCorpo} hidden={!aberto} className="border-t border-neutral-100 p-4">
        {children}
      </div>
    </section>
  );
}
