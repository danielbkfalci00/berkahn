// Ponte entre o documento (dentro do iframe sandbox) e o admin.
//
// ⚠️ MESMA REGRA DE lib/documentacoes/ancoragem.ts: `bridgeMain` é serializada
// com Function.prototype.toString() e injetada no HTML. O bundle de servidor do
// Next é minificado, e uma chamada a função de outro módulo vira acesso ao
// objeto do webpack (`(0,e.Ay)(…)`), que não existe dentro do iframe. Como o
// dev server não minifica, essa falha só aparece em produção.
//
// Logo, nada aqui pode importar em runtime — nem de protocolo.ts, por isso as
// strings do protocolo estão repetidas. `import type` é livre.
//
// Por que o iframe segue sandbox sem `allow-same-origin`: o parent não precisa
// tocar no DOM do documento, só trocar mensagens. Manter a origem opaca é o que
// impede o HTML vindo do banco de ler cookies do admin.

import type { Ancora } from "@/types/comentario";
import type { MotorAncoragem, IndiceDocumento, Intervalo } from "./ancoragem";
import type { ConfigPonte, MensagemDoAdmin } from "./protocolo";

export function bridgeMain(cfg: ConfigPonte, motor: MotorAncoragem): void {
  // "Nova aba" abre /raw fora de iframe. Sem este guard a ponte ficaria
  // postando mensagem para si mesma.
  if (window.parent === window) return;

  const NS = "berkahn-doc-bridge";
  const HL_ABERTO = "berkahn-aberto";
  const HL_ATIVO = "berkahn-ativo";

  let indice: IndiceDocumento | null = null;
  let pintados: { threadId: string; range: Range }[] = [];
  let ativo: string | null = null;
  let prontoAnunciado = false;

  function raiz(): Element {
    return document.getElementById("report-root") || document.body;
  }

  function getIndice(): IndiceDocumento {
    // A CSS Custom Highlight API não muta o DOM, então o índice construído uma
    // vez continua válido depois de pintar. Era justamente isso que quebrava
    // com <mark> + splitText: o mapa de nós ficava obsoleto após a primeira
    // pintura e a thread seguinte resolvia contra um mapa morto.
    if (!indice) indice = motor.construirIndice(raiz());
    return indice;
  }

  function enviar(msg: Record<string, unknown>): void {
    // targetOrigin exato: o destino é o admin, cuja origem é conhecida.
    window.parent.postMessage({ ns: NS, ...msg }, cfg.parentOrigin);
  }

  function suportaHighlight(): boolean {
    return typeof CSS !== "undefined" && !!(CSS as unknown as { highlights?: unknown }).highlights;
  }

  function injetarEstilo(): void {
    if (!suportaHighlight()) return;
    const style = document.createElement("style");
    style.textContent =
      "::highlight(" + HL_ABERTO + "){background-color:rgba(250,204,21,.35);}" +
      "::highlight(" + HL_ATIVO + "){background-color:rgba(250,204,21,.8);}";
    document.head.appendChild(style);
  }

  function repintar(): void {
    if (!suportaHighlight()) return;
    const reg = (CSS as unknown as {
      highlights: Map<string, unknown> & { set: (k: string, v: unknown) => void; delete: (k: string) => void };
    }).highlights;

    const abertos: Range[] = [];
    const ativos: Range[] = [];
    for (let i = 0; i < pintados.length; i++) {
      (pintados[i].threadId === ativo ? ativos : abertos).push(pintados[i].range);
    }

    const Ctor = (window as unknown as { Highlight: new (...r: Range[]) => unknown }).Highlight;
    if (abertos.length) reg.set(HL_ABERTO, new Ctor(...abertos));
    else reg.delete(HL_ABERTO);
    if (ativos.length) reg.set(HL_ATIVO, new Ctor(...ativos));
    else reg.delete(HL_ATIVO);
  }

  function pintar(ancoras: { threadId: string; ancora: Ancora }[]): void {
    const idx = getIndice();
    const novos: { threadId: string; range: Range }[] = [];
    const resolvidos: string[] = [];
    const orfaos: string[] = [];

    for (let i = 0; i < ancoras.length; i++) {
      const item = ancoras[i];
      const alvo = motor.resolverAncora(idx, item.ancora) as Intervalo | null;
      const range = alvo ? motor.rangeDe(idx, alvo) : null;
      if (range) {
        novos.push({ threadId: item.threadId, range });
        resolvidos.push(item.threadId);
      } else {
        orfaos.push(item.threadId);
      }
    }

    pintados = novos;
    repintar();
    enviar({ tipo: "resolucao", resolvidos, orfaos });
  }

  function rectDe(range: Range) {
    const rects = range.getClientRects();
    // O ÚLTIMO rect, não o bounding box: numa seleção que cruza blocos o
    // bounding box tem a largura inteira do documento e a pílula sairia
    // ancorada no lugar errado.
    const r = rects.length ? rects[rects.length - 1] : range.getBoundingClientRect();
    return { top: r.top, left: r.left, bottom: r.bottom, right: r.right };
  }

  function aoSelecionar(): void {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      enviar({ tipo: "selecao-cancelada" });
      return;
    }
    const range = sel.getRangeAt(0);
    if (!raiz().contains(range.commonAncestorContainer)) {
      enviar({ tipo: "selecao-cancelada" });
      return;
    }
    const ancora = motor.criarAncora(getIndice(), range);
    if (!ancora) {
      // Trecho curto demais ou fora do índice (dentro de .chart-block, script…).
      enviar({ tipo: "selecao-cancelada" });
      return;
    }
    enviar({ tipo: "selecao", ancora, rect: rectDe(range) });
  }

  function aoClicar(ev: MouseEvent): void {
    if (!pintados.length) return;
    // Highlights da CSS Highlight API não são hit-testáveis: descobrir em qual
    // deles o clique caiu exige converter o ponto em posição de caret.
    const doc = document as Document & {
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
    };
    let no: Node | null = null;
    let off = 0;
    if (doc.caretPositionFromPoint) {
      const p = doc.caretPositionFromPoint(ev.clientX, ev.clientY);
      if (p) {
        no = p.offsetNode;
        off = p.offset;
      }
    } else if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(ev.clientX, ev.clientY);
      if (r) {
        no = r.startContainer;
        off = r.startOffset;
      }
    }
    if (!no) return;

    for (let i = 0; i < pintados.length; i++) {
      if (pintados[i].range.isPointInRange(no, off)) {
        enviar({ tipo: "clique", threadId: pintados[i].threadId });
        return;
      }
    }
  }

  function irPara(threadId: string): void {
    for (let i = 0; i < pintados.length; i++) {
      if (pintados[i].threadId !== threadId) continue;
      const rects = pintados[i].range.getClientRects();
      if (!rects.length) return;
      const alvoY = rects[0].top + window.scrollY - window.innerHeight / 3;
      window.scrollTo({ top: Math.max(0, alvoY), behavior: "smooth" });
      return;
    }
  }

  function aoReceber(ev: MessageEvent): void {
    if (ev.source !== window.parent) return;
    const data = ev.data as MensagemDoAdmin | null;
    if (!data || typeof data !== "object" || data.ns !== NS) return;

    if (data.tipo === "hello") {
      // Sempre responde, mesmo já tendo anunciado: se o child ficou pronto
      // antes de o listener do admin existir, o primeiro `ready` se perdeu e
      // este é o único que chega.
      prontoAnunciado = true;
      enviar({ tipo: "ready" });
    } else if (data.tipo === "pintar") {
      pintar(data.ancoras);
    } else if (data.tipo === "ir-para") {
      irPara(data.threadId);
    } else if (data.tipo === "realce") {
      ativo = data.threadId;
      repintar();
    }
  }

  function anunciarPronto(): void {
    // Idempotente: o `load` do iframe e a prontidão do listener do admin não
    // têm ordem garantida, e com reactStrictMode o efeito monta duas vezes em
    // dev. Os dois lados anunciam, e quem chegar primeiro resolve.
    if (prontoAnunciado) return;
    prontoAnunciado = true;
    enviar({ tipo: "ready" });
  }

  window.addEventListener("message", aoReceber);
  document.addEventListener("pointerup", function () {
    // setTimeout(0): no pointerup a Selection ainda não assentou.
    window.setTimeout(aoSelecionar, 0);
  });
  document.addEventListener("keyup", function (ev) {
    if (ev.shiftKey || ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
      window.setTimeout(aoSelecionar, 0);
    }
  });
  document.addEventListener("click", aoClicar);
  // Sem isto a pílula "Comentar" fica flutuando descolada do trecho.
  window.addEventListener("scroll", function () {
    enviar({ tipo: "selecao-cancelada" });
  });

  injetarEstilo();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", anunciarPronto);
  } else {
    anunciarPronto();
  }
}
