"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { comprimirImagem, nomeComprimido } from "@/lib/imagens/comprimir";
import { definirCapa, removerCapa, type TipoCapa } from "@/app/admin/conteudo/actions";
import { BlocoColapsavel } from "./BlocoColapsavel";
import { cn } from "@/lib/utils";

interface Props {
  pautaId: string;
  tipo: TipoCapa;
  titulo: string;
  /** Proporção-alvo, só como dica visual do preview. */
  proporcao: string;
  dica: string;
  urlInicial: string | null;
}

type Fase = "ocioso" | "enviando" | "erro";

export function BlocoCapa({ pautaId, tipo, titulo, proporcao, dica, urlInicial }: Props) {
  const [url, setUrl] = useState(urlInicial);
  const [fase, setFase] = useState<Fase>("ocioso");
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function enviar(file: File) {
    if (!file.type.startsWith("image/")) {
      setFase("erro");
      setErro("O arquivo precisa ser uma imagem.");
      return;
    }

    setFase("enviando");
    setErro(null);
    try {
      const comprimida = await comprimirImagem(file);
      const fd = new FormData();
      fd.append("pautaId", pautaId);
      fd.append("tipo", tipo);
      // Campo `arquivo`, não `file`: é o nome que definirCapa espera. E o nome
      // do arquivo precisa acompanhar a compressão, porque a action deriva a
      // extensão dele — bytes JPEG num `.png` gravariam o objeto errado.
      fd.append("arquivo", comprimida, nomeComprimido(file.name));

      const res = await definirCapa(fd);
      if (res.error) {
        setFase("erro");
        setErro(res.error);
        return;
      }
      setUrl(res.data?.url ?? null);
      setFase("ocioso");
    } catch (e) {
      setFase("erro");
      setErro(e instanceof Error ? e.message : "Falha ao processar a imagem.");
    } finally {
      // Sem isto, escolher o mesmo arquivo de novo não dispara o onChange.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remover() {
    setFase("enviando");
    setErro(null);
    const res = await removerCapa(pautaId, tipo);
    if (res.error) {
      setFase("erro");
      setErro(res.error);
      return;
    }
    setUrl(null);
    setFase("ocioso");
  }

  const enviando = fase === "enviando";

  return (
    <BlocoColapsavel
      titulo={titulo}
      icone={<ImageIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
      abertoInicial={Boolean(urlInicial)}
      resumo={url ? "capa definida" : undefined}
    >
      {url ? (
        <div className="space-y-2">
          {/* <img> cru: é preview de admin que troca a cada upload, e o
              otimizador do next/image só somaria round-trip e cache velho.
              Zero uso de next/image em todo o admin. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Capa ${titulo}`}
            className={cn("w-full rounded-md border border-neutral-200 object-cover", proporcao)}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-neutral-500">{dica}</p>
            <button
              type="button"
              onClick={remover}
              disabled={enviando}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50"
            >
              {enviando ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden />
              ) : (
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              )}
              Remover
            </button>
          </div>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void enviar(f);
            }}
          />
          <button
            type="button"
            disabled={enviando}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastando(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void enviar(f);
            }}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-10 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-60",
              arrastando
                ? "border-neutral-400 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
          >
            {enviando ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" strokeWidth={1.75} aria-hidden />
                <span className="text-sm text-neutral-600">Enviando…</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-neutral-400" strokeWidth={1.75} aria-hidden />
                <span className="text-sm text-neutral-700">
                  Clique ou arraste a imagem
                </span>
                <span className="text-xs text-neutral-400">{dica}</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Em erro a imagem que já estava lá não é removida da tela: continua
          válida, e só a tentativa nova falhou. */}
      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
    </BlocoColapsavel>
  );
}
