"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Ancora } from "@/types/comentario";
import {
  NAMESPACE,
  type AncoraParaPintar,
  type MensagemDoAdmin,
  type MensagemDoDocumento,
  type RectSelecao,
  type SemNs,
} from "@/lib/documentacoes/protocolo";

type Opcoes = {
  ancoras: AncoraParaPintar[];
  aoSelecionar: (ancora: Ancora, rect: RectSelecao) => void;
  aoCancelarSelecao: () => void;
  aoClicarDestaque: (threadId: string) => void;
  aoResolver: (resultado: { resolvidos: string[]; orfaos: string[] }) => void;
};

// O handshake pode perder a primeira mensagem em qualquer direção, então o
// admin insiste até o documento responder.
const INTERVALO_HELLO_MS = 250;
const TIMEOUT_HANDSHAKE_MS = 2000;

/**
 * Lado do admin da ponte com o iframe do documento.
 *
 * Toda a comunicação é por postMessage porque o iframe roda em origem opaca
 * (sandbox sem `allow-same-origin`) — o parent não alcança o DOM do documento.
 */
export function useDocumentoBridge({
  ancoras,
  aoSelecionar,
  aoCancelarSelecao,
  aoClicarDestaque,
  aoResolver,
}: Opcoes) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pronto, setPronto] = useState(false);
  const [falhou, setFalhou] = useState(false);

  // Refs para os callbacks: sem isso, um handler recriado a cada render
  // reinstalaria o listener e reiniciaria o handshake.
  const cbs = useRef({
    aoSelecionar,
    aoCancelarSelecao,
    aoClicarDestaque,
    aoResolver,
  });
  cbs.current = { aoSelecionar, aoCancelarSelecao, aoClicarDestaque, aoResolver };

  const enviar = useCallback((msg: SemNs<MensagemDoAdmin>) => {
    const janela = iframeRef.current?.contentWindow;
    if (!janela) return;
    // '*' é obrigatório aqui: a origem opaca do iframe serializa como a string
    // "null", que não parseia como URL e faria postMessage lançar SyntaxError.
    // Por isso nenhuma mensagem daqui carrega segredo.
    janela.postMessage({ ns: NAMESPACE, ...msg } as MensagemDoAdmin, "*");
  }, []);

  useEffect(() => {
    function aoReceber(ev: MessageEvent) {
      // A validação é por IDENTIDADE DE JANELA, não por origem: `ev.origin`
      // vale "null" para qualquer frame de origem opaca da página, então não
      // distingue nada. `ev.source` é referência de objeto e não é forjável.
      if (ev.source !== iframeRef.current?.contentWindow) return;
      const data = ev.data as MensagemDoDocumento | null;
      if (!data || typeof data !== "object" || data.ns !== NAMESPACE) return;

      if (data.tipo === "ready") {
        setPronto(true);
      } else if (data.tipo === "selecao") {
        cbs.current.aoSelecionar(data.ancora, data.rect);
      } else if (data.tipo === "selecao-cancelada") {
        cbs.current.aoCancelarSelecao();
      } else if (data.tipo === "clique") {
        cbs.current.aoClicarDestaque(data.threadId);
      } else if (data.tipo === "resolucao") {
        cbs.current.aoResolver({
          resolvidos: data.resolvidos,
          orfaos: data.orfaos,
        });
      }
    }

    window.addEventListener("message", aoReceber);
    return () => window.removeEventListener("message", aoReceber);
  }, []);

  useEffect(() => {
    if (pronto) return;
    const inicio = Date.now();
    const id = window.setInterval(() => {
      if (Date.now() - inicio > TIMEOUT_HANDSHAKE_MS) {
        window.clearInterval(id);
        setFalhou(true);
        return;
      }
      enviar({ tipo: "hello" });
    }, INTERVALO_HELLO_MS);
    enviar({ tipo: "hello" });
    return () => window.clearInterval(id);
  }, [pronto, enviar]);

  // Chave estável: `ancoras` é recriado a cada render do pai e dispararia
  // repintura infinita se entrasse cru na lista de dependências.
  const chaveAncoras = useMemo(
    () => ancoras.map((a) => a.threadId).join("|"),
    [ancoras]
  );
  const ancorasRef = useRef(ancoras);
  ancorasRef.current = ancoras;

  useEffect(() => {
    if (!pronto) return;
    enviar({ tipo: "pintar", ancoras: ancorasRef.current });
  }, [pronto, chaveAncoras, enviar]);

  const irPara = useCallback(
    (threadId: string) => enviar({ tipo: "ir-para", threadId }),
    [enviar]
  );
  const realcar = useCallback(
    (threadId: string | null) => enviar({ tipo: "realce", threadId }),
    [enviar]
  );

  return { iframeRef, pronto, falhou, irPara, realcar };
}
