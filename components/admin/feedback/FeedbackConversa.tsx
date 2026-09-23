"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tempoRelativo } from "@/components/admin/documentacoes/tipos-ui";
import { definirStatus, responder } from "@/app/admin/feedback/actions";
import { EVENTO_FEEDBACK_MUDOU } from "./FeedbackRapido";
import { SeloCategoria, SeloStatus } from "./FeedbackLista";
import {
  LIMITES_FEEDBACK,
  type ItemFeedback,
  type MensagemFeedback,
} from "@/types/feedback";

type Props = {
  item: ItemFeedback;
  mensagens: MensagemFeedback[];
  usuarioId: string | null;
  podeMudarStatus: boolean;
};

export function FeedbackConversa({ item, mensagens, usuarioId, podeMudarStatus }: Props) {
  const fimRef = useRef<HTMLDivElement>(null);

  // Abre já no fim da conversa, como qualquer chat; e acompanha resposta nova.
  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: "end" });
  }, [mensagens.length]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Link
        href="/admin/feedback"
        className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Todos os feedbacks
      </Link>

      <header className="space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeloCategoria categoria={item.categoria} />
          <SeloStatus status={item.status} />
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">{item.titulo}</h1>
        <p className="text-xs text-neutral-500">
          {item.autorNome} · <time dateTime={item.criadoEm}>{tempoRelativo(item.criadoEm)}</time>
          {item.paginaOrigem && (
            <>
              {" · "}
              <Link href={item.paginaOrigem} className="font-mono underline-offset-2 hover:underline">
                {item.paginaOrigem}
              </Link>
            </>
          )}
        </p>
        {item.status === "implementado" && (
          <p className="text-xs text-emerald-700">
            Implementado {item.implementadoEm ? tempoRelativo(item.implementadoEm) : ""}
            {item.implementadoPor ? ` por ${item.implementadoPor}` : ""}
          </p>
        )}
        {item.notaImplementacao && (
          <p className="whitespace-pre-wrap break-words rounded-md bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600">
            {item.notaImplementacao}
          </p>
        )}
        {podeMudarStatus && <ControleStatus item={item} />}
      </header>

      <section aria-label="Conversa" className="space-y-3">
        {mensagens.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-400">
            Sem mensagens ainda. Conte mais detalhes abaixo.
          </p>
        )}
        {mensagens.map((m) => (
          <Bolha key={m.id} mensagem={m} minha={Boolean(usuarioId) && m.autorId === usuarioId} />
        ))}
        <div ref={fimRef} />
      </section>

      <ComposerFeedback itemId={item.id} />
    </div>
  );
}

function Bolha({ mensagem, minha }: { mensagem: MensagemFeedback; minha: boolean }) {
  const viaClaude = mensagem.origem === "cli";
  return (
    <article className={cn("flex flex-col gap-1", minha ? "items-end" : "items-start")}>
      <div className="flex items-center gap-1.5 px-1 text-[11px] text-neutral-500">
        <span className="font-medium text-neutral-700">{mensagem.autorNome}</span>
        {viaClaude && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 font-medium text-orange-700 ring-1 ring-inset ring-orange-200">
            <Bot className="h-3 w-3" />
            via Claude
          </span>
        )}
        <time dateTime={mensagem.criadoEm}>{tempoRelativo(mensagem.criadoEm)}</time>
      </div>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          minha
            ? "rounded-br-md bg-neutral-900 text-white"
            : viaClaude
              ? "rounded-bl-md border border-orange-200 bg-orange-50/60 text-neutral-800"
              : "rounded-bl-md border border-neutral-200 bg-white text-neutral-800"
        )}
      >
        {mensagem.corpo}
      </div>
    </article>
  );
}

/**
 * Composer próprio em vez do de documentacoes/Composer.tsx: aquele exige um
 * TipoComentario (duvida, aprovacao…) que não existe aqui. Tornar o tipo
 * opcional mexeria na API de um componente em uso por outra feature.
 */
function ComposerFeedback({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [corpo, setCorpo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function enviar() {
    const limpo = corpo.trim();
    if (!limpo || pendente) return;
    setErro(null);
    iniciar(async () => {
      const { error } = await responder({ itemId, corpo: limpo });
      if (error) {
        setErro(error);
        return;
      }
      setCorpo("");
      router.refresh();
    });
  }

  return (
    <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] rounded-xl border border-neutral-200 bg-white p-2 shadow-sm lg:bottom-4">
      <div className="flex items-end gap-2">
        <label htmlFor="feedback-resposta" className="sr-only">Responder</label>
        <textarea
          id="feedback-resposta"
          value={corpo}
          onChange={(e) => setCorpo(e.target.value)}
          onKeyDown={(e) => {
            // Enter quebra linha; Ctrl/Cmd+Enter envia, como nos comentários.
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              enviar();
            }
          }}
          rows={2}
          maxLength={LIMITES_FEEDBACK.corpoMax}
          placeholder="Escreva uma resposta"
          className="min-h-11 flex-1 resize-none rounded-lg px-2.5 py-2 text-base text-neutral-800 outline-none placeholder:text-neutral-400 sm:text-sm"
        />
        <Button
          type="button"
          size="icon"
          onClick={enviar}
          disabled={pendente || !corpo.trim()}
          aria-label="Enviar resposta"
          className="h-11 w-11 shrink-0 rounded-lg"
        >
          {pendente ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {erro && <p role="alert" className="px-2 pb-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}

function ControleStatus({ item }: { item: ItemFeedback }) {
  const router = useRouter();
  const [nota, setNota] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const proximo = item.status === "aberto" ? "implementado" : "aberto";

  function aplicar() {
    setErro(null);
    iniciar(async () => {
      const { error } = await definirStatus({ itemId: item.id, status: proximo, nota: nota || null });
      if (error) {
        setErro(error);
        return;
      }
      setNota("");
      window.dispatchEvent(new Event(EVENTO_FEEDBACK_MUDOU));
      router.refresh();
    });
  }

  return (
    <div className="mt-2 space-y-2 border-t border-neutral-100 pt-3">
      <label htmlFor="feedback-nota" className="text-xs font-medium text-neutral-700">
        Nota opcional (ex.: link do PR)
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="feedback-nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          maxLength={LIMITES_FEEDBACK.notaMax}
          placeholder="PR #123"
          className="min-h-11 flex-1 rounded-md border border-neutral-200 px-3 text-base outline-none focus:border-neutral-500 sm:text-sm"
        />
        <Button
          type="button"
          variant={proximo === "implementado" ? "default" : "outline"}
          onClick={aplicar}
          disabled={pendente}
          className="min-h-11"
        >
          {pendente && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          {proximo === "implementado" ? "Marcar como implementado" : "Reabrir"}
        </Button>
      </div>
      {erro && <p role="alert" className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
