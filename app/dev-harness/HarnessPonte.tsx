"use client";

import { useCallback, useEffect, useState } from "react";
import { useDocumentoBridge } from "@/hooks/use-documento-bridge";
import { criarMotorAncoragem } from "@/lib/documentacoes/ancoragem";
import { ComentariosRail } from "@/components/admin/documentacoes/ComentariosRail";
import type { Ancora, Thread } from "@/types/comentario";
import type { AncoraParaPintar, RectSelecao } from "@/lib/documentacoes/protocolo";
import { threadsDeExemplo } from "./fixtures";

type Props = { docs: string[] };

type Salva = AncoraParaPintar & { rotulo: string };

// Fixo: `new Date()` durante o render quebraria a hidratação.
const AGORA = "2026-07-30T20:00:00.000Z";

export function HarnessPonte({ docs }: Props) {
  const [doc, setDoc] = useState(docs[0]);
  const [colar, setColar] = useState("");
  const [modo, setModo] = useState<"ponte" | "painel">("ponte");
  const [fixtures, setFixtures] = useState<Thread[]>(() => threadsDeExemplo(AGORA));
  const [pendente, setPendente] = useState<{ ancora: Ancora; rect: RectSelecao } | null>(null);
  const [salvas, setSalvas] = useState<Salva[]>([]);
  const [orfaos, setOrfaos] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const registrar = useCallback((linha: string) => {
    setLog((atual) => [`${new Date().toISOString().slice(11, 23)}  ${linha}`, ...atual].slice(0, 60));
  }, []);

  const aoSelecionar = useCallback(
    (ancora: Ancora, rect: RectSelecao) => {
      setPendente({ ancora, rect });
      registrar(`selecao "${ancora.textoExato.slice(0, 60)}" secao=${ancora.ancoraSecao ?? "—"}`);
    },
    [registrar]
  );

  const aoCancelarSelecao = useCallback(() => setPendente(null), []);

  const aoClicarDestaque = useCallback(
    (threadId: string) => registrar(`clique no destaque ${threadId}`),
    [registrar]
  );

  const aoResolver = useCallback(
    (r: { resolvidos: string[]; orfaos: string[] }) => {
      setOrfaos(r.orfaos);
      registrar(`resolucao: ${r.resolvidos.length} pintados, ${r.orfaos.length} orfaos`);
    },
    [registrar]
  );

  const { iframeRef, pronto, falhou, irPara, realcar } = useDocumentoBridge({
    ancoras: salvas,
    aoSelecionar,
    aoCancelarSelecao,
    aoClicarDestaque,
    aoResolver,
  });

  const adicionar = useCallback((ancora: Ancora) => {
    setSalvas((atual) => [
      ...atual,
      {
        threadId: `t${atual.length + 1}`,
        ancora,
        rotulo: ancora.textoExato.slice(0, 50),
      },
    ]);
  }, []);

  // Expõe o motor e o `adicionar` no window para checagem roteirizada: a
  // seleção de texto exige gesto do usuário dentro do iframe, e nem sempre há
  // como produzir esse gesto (headless, pane sem composição). Com isto dá para
  // montar uma âncora programaticamente contra o documento real e mandar
  // pintar. Só existe nesta página, que não vai para produção.
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__motorAncoragem = criarMotorAncoragem();
    w.__adicionarAncora = adicionar;
  }, [adicionar]);

  function salvarSelecao() {
    if (!pendente) return;
    adicionar(pendente.ancora);
    setPendente(null);
  }

  function colarAncora() {
    try {
      adicionar(JSON.parse(colar) as Ancora);
      setColar("");
    } catch {
      registrar("JSON inválido");
    }
  }

  return (
    <div className="grid h-screen grid-cols-[1fr_380px] bg-neutral-50">
      <div className="relative overflow-hidden border-r border-neutral-200">
        <iframe
          ref={iframeRef}
          key={doc}
          src={`/dev-harness/documento?doc=${encodeURIComponent(doc)}`}
          title="Documento de teste"
          sandbox="allow-scripts"
          className="h-full w-full border-0 bg-white"
        />
        {pendente && (
          <button
            type="button"
            onClick={salvarSelecao}
            className="absolute z-10 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{ top: pendente.rect.bottom + 8, left: pendente.rect.left }}
          >
            Comentar
          </button>
        )}
      </div>

      {modo === "painel" ? (
        <ComentariosRail
          threads={fixtures}
          orfas={new Set(["fix-2"])}
          documentoAtualizadoEm={AGORA}
          autorNome="Pessoa de teste"
          canComment
          pendente={pendente?.ancora ?? null}
          pendenteEnviando={false}
          pendenteErro={null}
          onCriar={() => registrar("criar: desabilitado no harness (sem banco)")}
          onCancelarPendente={() => setPendente(null)}
          threadAtiva={null}
          onSelecionar={(id) => registrar(`selecionou thread ${id}`)}
          onRealcar={() => {}}
          onAtualizar={(t) => setFixtures((a) => a.map((x) => (x.id === t.id ? t : x)))}
          onRemover={(id) => setFixtures((a) => a.filter((x) => x.id !== id))}
        />
      ) : (
      <aside className="flex flex-col gap-3 overflow-y-auto p-4 text-sm">
        <div>
          <h1 className="text-base font-semibold text-neutral-900">Harness da ponte</h1>
          <p className="mt-1 text-xs text-neutral-500">
            Estado:{" "}
            <span className={pronto ? "text-green-600" : falhou ? "text-red-600" : "text-amber-600"}>
              {pronto ? "conectado" : falhou ? "handshake falhou" : "aguardando…"}
            </span>
          </p>
        </div>

        <select
          value={doc}
          onChange={(e) => {
            setDoc(e.target.value);
            setSalvas([]);
            setOrfaos([]);
          }}
          className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs"
        >
          {docs.map((d) => (
            <option key={d} value={d}>
              {d.split("/").pop()}
            </option>
          ))}
        </select>

        <div>
          <label
            htmlFor="colar-ancora"
            className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
          >
            Colar âncora (JSON)
          </label>
          <textarea
            id="colar-ancora"
            value={colar}
            onChange={(e) => setColar(e.target.value)}
            rows={3}
            placeholder='{"textoExato":"…","prefixo":"","sufixo":"","posicaoRelativa":0,"ancoraSecao":null}'
            className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 font-mono text-[10px]"
          />
          <button
            type="button"
            onClick={colarAncora}
            className="mt-1 rounded-lg bg-neutral-900 px-2.5 py-1 text-xs text-white"
          >
            Pintar
          </button>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Âncoras ({salvas.length})
          </h2>
          <ul className="mt-2 space-y-1">
            {salvas.map((s) => (
              <li key={s.threadId}>
                <button
                  type="button"
                  onClick={() => irPara(s.threadId)}
                  onMouseEnter={() => realcar(s.threadId)}
                  onMouseLeave={() => realcar(null)}
                  className={`w-full rounded-lg border px-2 py-1.5 text-left text-xs ${
                    orfaos.includes(s.threadId)
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  <span className="font-mono text-[10px] text-neutral-400">{s.threadId}</span>{" "}
                  {s.rotulo}
                  {orfaos.includes(s.threadId) && " · órfão"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Log</h2>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-neutral-600">
            {log.join("\n")}
          </pre>
        </div>
      </aside>
      )}

      <button
        type="button"
        onClick={() => setModo((m) => (m === "ponte" ? "painel" : "ponte"))}
        className="fixed bottom-3 right-3 z-50 rounded-full bg-neutral-900 px-3 py-1.5 text-xs text-white shadow-lg"
      >
        {modo === "ponte" ? "Ver painel real" : "Ver debug da ponte"}
      </button>
    </div>
  );
}
