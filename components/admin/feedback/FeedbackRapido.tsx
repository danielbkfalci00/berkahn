"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { criarFeedback } from "@/app/admin/feedback/actions";
import {
  CATEGORIAS_FEEDBACK,
  CATEGORIA_LABEL,
  LIMITES_FEEDBACK,
  validarNovoFeedback,
  type CategoriaFeedback,
} from "@/types/feedback";

/** Outras telas (lista do mural) pedem a abertura do formulário por evento. */
export const EVENTO_ABRIR_FEEDBACK = "admin-feedback:abrir";
/** Avisa a sidebar para recontar os abertos sem esperar navegação. */
export const EVENTO_FEEDBACK_MUDOU = "admin-feedback:mudou";

export function abrirFeedbackRapido() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_FEEDBACK));
}

// Telas com barra de ações presa ao rodapé (wizard de orçamento). O botão sobe
// para não cobrir o "Próximo".
const COM_BARRA_NO_RODAPE = /^\/admin\/orcamentos\/(novo\/form|[^/]+\/edit)/;

export function FeedbackRapido() {
  const pathname = usePathname() ?? "/admin";
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [origem, setOrigem] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaFeedback>("melhoria");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [criadoId, setCriadoId] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const tituloRef = useRef<HTMLInputElement>(null);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const abrir = () => {
      setOrigem(window.location.pathname);
      setAberto(true);
    };
    window.addEventListener(EVENTO_ABRIR_FEEDBACK, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_FEEDBACK, abrir);
  }, []);

  function mudarAberto(valor: boolean) {
    if (valor) setOrigem(pathname);
    if (!valor) {
      // Fechar depois de enviar limpa tudo; fechar sem enviar guarda o rascunho.
      if (criadoId) {
        setTitulo("");
        setDescricao("");
        setCategoria("melhoria");
        setCriadoId(null);
      }
      setErro(null);
    }
    setAberto(valor);
  }

  function enviar(event: React.FormEvent) {
    event.preventDefault();
    if (pendente) return;
    setErro(null);
    const validado = validarNovoFeedback({ titulo, categoria, descricao, paginaOrigem: origem });
    if (!validado.ok) {
      setErro(validado.erro);
      (titulo.trim() ? tituloRef : descricaoRef).current?.focus();
      return;
    }
    iniciar(async () => {
      const { data, error } = await criarFeedback(validado.valor);
      if (error) setErro(error);
      if (data?.id) {
        setCriadoId(data.id);
        window.dispatchEvent(new Event(EVENTO_FEEDBACK_MUDOU));
        if (pathname.startsWith("/admin/feedback")) router.refresh();
      }
    });
  }

  // No mural o botão sairia por cima do composer do chat, e a lista já tem o
  // próprio "Novo feedback".
  const escondeBotao = pathname.startsWith("/admin/feedback");

  return (
    <>
      {!escondeBotao && (
        <button
          type="button"
          onClick={() => mudarAberto(true)}
          aria-label="Enviar feedback sobre o admin"
          title="Enviar feedback"
          className={cn(
            "group fixed right-4 z-30 flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-3 text-neutral-600 shadow-md backdrop-blur transition-colors hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 lg:right-6 print:hidden",
            COM_BARRA_NO_RODAPE.test(pathname)
              ? "bottom-[calc(10rem+env(safe-area-inset-bottom))] lg:bottom-28"
              : "bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-6"
          )}
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="hidden text-xs font-medium lg:inline">Feedback</span>
        </button>
      )}

      <Dialog open={aberto} onOpenChange={mudarAberto}>
        <DialogContent
          className={cn(
            "max-h-[calc(100dvh-env(safe-area-inset-top)-0.75rem)] overflow-y-auto sm:max-h-[90dvh] sm:max-w-md",
            // Mobile: folha de baixo, colada no rodapé e acima da área segura.
            "max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:border-x-0 max-sm:border-b-0 max-sm:px-4 max-sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]",
            "max-sm:data-[state=open]:![--tw-enter-translate-x:0] max-sm:data-[state=open]:![--tw-enter-translate-y:100%]",
            "max-sm:data-[state=closed]:![--tw-exit-translate-x:0] max-sm:data-[state=closed]:![--tw-exit-translate-y:100%]"
          )}
        >
          <div className="mx-auto -mt-2 mb-1 h-1 w-10 rounded-full bg-neutral-200 sm:hidden" aria-hidden />
          <DialogTitle className="text-base">Enviar feedback</DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Descreva a sugestão ou o problema. O título é opcional; todo o time pode responder.
          </DialogDescription>

          {criadoId ? (
            <div className="space-y-4">
              <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                {erro ?? "Feedback enviado. Obrigado!"}
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" className="min-h-11" onClick={() => mudarAberto(false)}>
                  Fechar
                </Button>
                <Button asChild className="min-h-11">
                  <Link href={`/admin/feedback/${criadoId}`} onClick={() => mudarAberto(false)}>
                    Ver conversa
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="feedback-titulo" className="text-xs font-medium text-neutral-700">
                  Título (opcional)
                </label>
                <input
                  ref={tituloRef}
                  id="feedback-titulo"
                  autoFocus
                  value={titulo}
                  onChange={(e) => { setTitulo(e.target.value); setErro(null); }}
                  maxLength={LIMITES_FEEDBACK.tituloMax}
                  placeholder="Ex.: filtro de leads por cidade"
                  className="min-h-11 w-full rounded-md border border-neutral-200 px-3 text-base outline-none focus:border-neutral-500 sm:text-sm"
                />
              </div>

              <fieldset className="space-y-1.5">
                <legend className="text-xs font-medium text-neutral-700">Categoria</legend>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIAS_FEEDBACK.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={c === categoria}
                      onClick={() => setCategoria(c)}
                      className={cn(
                        "min-h-11 rounded-md border text-xs font-medium transition-colors",
                        c === categoria
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      )}
                    >
                      {CATEGORIA_LABEL[c]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-1.5">
                <label htmlFor="feedback-descricao" className="text-xs font-medium text-neutral-700">
                  Descrição
                </label>
                <textarea
                  ref={descricaoRef}
                  id="feedback-descricao"
                  value={descricao}
                  onChange={(e) => { setDescricao(e.target.value); setErro(null); }}
                  maxLength={LIMITES_FEEDBACK.corpoMax}
                  rows={4}
                  placeholder="O que acontece hoje e o que ajudaria."
                  className="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-base outline-none focus:border-neutral-500 sm:text-sm"
                />
                {origem && (
                  <p className="text-[11px] text-neutral-400">
                    Página registrada: <span className="font-mono">{origem}</span>
                  </p>
                )}
              </div>

              {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="min-h-11" onClick={() => mudarAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="min-h-11" disabled={pendente}>
                  {pendente && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  Enviar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
