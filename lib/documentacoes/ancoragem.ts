// Motor de ancoragem de comentários por trecho de texto.
//
// ⚠️ FORMATO OBRIGATÓRIO: uma única factory que declara tudo no próprio corpo.
//
// Este arquivo é serializado com Function.prototype.toString() e injetado dentro
// do iframe sandbox de /admin/documentacoes/[slug]/raw (ver lib/documentacoes/
// bridge.ts). O bundle de servidor do Next é minificado: uma chamada a função de
// OUTRO módulo vira acesso ao objeto do webpack — `(0,e.Ay)(…)` — e `e` não
// existe dentro do iframe. Como o dev server não minifica, essa falha só
// aparece em produção.
//
// Logo: nada aqui pode importar em runtime, referenciar constante de módulo ou
// chamar função declarada fora da factory. `import type` é livre (some na
// compilação). Os números de LIMITES em types/comentario.ts estão repetidos
// abaixo pelo mesmo motivo.

import type { Ancora } from "@/types/comentario";

/** Posição de um trecho no índice de texto do documento. */
export interface Intervalo {
  inicio: number;
  fim: number;
}

/** Trecho resolvido, com o quão confiável foi o casamento. */
export interface Resolucao extends Intervalo {
  /** 0..1. Abaixo de ~0.5 o casamento foi por texto só, sem contexto. */
  confianca: number;
}

/**
 * Índice plano do texto visível do documento.
 *
 * `texto` é a versão normalizada (whitespace colapsado). `charNode` e `charOff`
 * mapeiam cada caractere do índice de volta para o nó de texto e o offset de
 * origem — construídos na MESMA passada da normalização, porque normalizar um
 * `textContent` pronto destrói o mapeamento (o markdown-it deixa `\n` literal
 * entre `</td>` e `<td>`).
 */
export interface IndiceDocumento {
  texto: string;
  nodes: Text[];
  charNode: number[];
  charOff: number[];
  secoes: { idx: number; rotulo: string }[];
}

export interface MotorAncoragem {
  normalizar(bruto: string): string;
  construirIndice(raiz: Element): IndiceDocumento;
  criarAncora(indice: IndiceDocumento, range: Range): Ancora | null;
  resolverAncora(indice: IndiceDocumento, ancora: Ancora): Resolucao | null;
  rangeDe(indice: IndiceDocumento, alvo: Intervalo): Range | null;
}

export function criarMotorAncoragem(): MotorAncoragem {
  // Espelham LIMITES de types/comentario.ts (não pode importar — ver topo).
  const QUOTE_MIN = 4;
  const QUOTE_MAX = 2000;
  const CONTEXTO = 100;
  // Teto de ocorrências consideradas. Sem ele, selecionar "28" numa tabela de
  // performance gera milhares de candidatos e o scoring trava a aba.
  const MAX_CANDIDATOS = 200;
  // Nota mínima para aceitar um casamento quando o trecho aparece MAIS DE UMA
  // vez. Abaixo disso o texto bateu mas o contexto não, e devolver a primeira
  // ocorrência qualquer seria apontar para o lugar errado com cara de acerto —
  // o oposto do que este modelo promete. Calibrado contra o relatório de
  // performance de 07/2026: mesmo documento e contexto intacto dá 1.0; prosa
  // com vizinhança alterada dá ~0.50; casamento em lugar errado dá ~0.05.
  const CONFIANCA_MIN = 0.25;
  const IGNORAR = /^(SCRIPT|STYLE|NOSCRIPT|CANVAS|SVG|TEMPLATE|HEAD)$/;
  // O \s do JS já inclui NBSP e os espaços tipográficos U+2007 / U+202F.
  const ESPACO = /\s/;

  function normalizar(bruto: string): string {
    return bruto.normalize("NFC").replace(/\s+/g, " ").trim();
  }

  function deveIgnorar(no: Node): boolean {
    let atual: Node | null = no.parentNode;
    while (atual && atual.nodeType === 1) {
      const el = atual as Element;
      // toUpperCase: em SVG o tagName vem minúsculo (namespace XML).
      if (IGNORAR.test(el.tagName.toUpperCase())) return true;
      // Chart.js redimensiona sozinho; não tocar em nada dentro do bloco.
      if (el.classList && el.classList.contains("chart-block")) return true;
      atual = atual.parentNode;
    }
    return false;
  }

  function construirIndice(raiz: Element): IndiceDocumento {
    const doc = raiz.ownerDocument;
    const walker = doc.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);

    const partes: string[] = [];
    const nodes: Text[] = [];
    const charNode: number[] = [];
    const charOff: number[] = [];
    const secoes: { idx: number; rotulo: string }[] = [];

    let total = 0;
    // Colapso de whitespace com estado ATRAVÉS dos nós: sem isso, um nó que
    // termina em espaço seguido de outro que começa em espaço produziria dois.
    let ultimoFoiEspaco = true;
    let secaoAtual: Element | null = null;

    let no = walker.nextNode() as Text | null;
    while (no) {
      if (deveIgnorar(no)) {
        no = walker.nextNode() as Text | null;
        continue;
      }

      const pai = no.parentElement;
      const h2 = pai ? pai.closest("h2") : null;
      if (h2 && h2 !== secaoAtual) {
        secaoAtual = h2;
        const rotulo = h2.id || normalizar(h2.textContent || "");
        if (rotulo) secoes.push({ idx: total, rotulo });
      }

      const idxNo = nodes.length;
      nodes.push(no);

      // Sem NFC aqui de propósito: normalizar pode mudar o comprimento e
      // desalinhar charOff dos offsets reais do nó, que é o que alimenta
      // range.setStart(). O índice e as âncoras ficam consistentes entre si
      // porque toda âncora nasce de uma fatia deste mesmo índice.
      const bruto = no.data;
      for (let i = 0; i < bruto.length; i++) {
        const ch = bruto[i];
        if (ESPACO.test(ch)) {
          if (ultimoFoiEspaco) continue;
          ultimoFoiEspaco = true;
          partes.push(" ");
        } else {
          ultimoFoiEspaco = false;
          partes.push(ch);
        }
        charNode.push(idxNo);
        charOff.push(i);
        total++;
      }

      no = walker.nextNode() as Text | null;
    }

    return { texto: partes.join(""), nodes, charNode, charOff, secoes };
  }

  function secaoEm(indice: IndiceDocumento, pos: number): string | null {
    let achado: string | null = null;
    for (let i = 0; i < indice.secoes.length; i++) {
      if (indice.secoes[i].idx > pos) break;
      achado = indice.secoes[i].rotulo;
    }
    return achado;
  }

  /** Primeiro caractere do índice pertencente a (no, offset), ou -1. */
  function posicaoDe(
    indice: IndiceDocumento,
    no: Node,
    offset: number,
    paraFrente: boolean
  ): number {
    // Selection pode terminar num Element (offset = índice de filho). Desce
    // para o nó de texto correspondente antes de procurar.
    let alvo = no;
    let alvoOff = offset;
    if (alvo.nodeType !== 3) {
      const filhos = alvo.childNodes;
      const escolhido = paraFrente
        ? filhos[Math.min(offset, filhos.length - 1)]
        : filhos[Math.max(0, offset - 1)];
      if (!escolhido) return -1;
      const w = (alvo.ownerDocument as Document).createTreeWalker(
        escolhido,
        NodeFilter.SHOW_TEXT
      );
      const texto = escolhido.nodeType === 3 ? escolhido : w.nextNode();
      if (!texto) return -1;
      alvo = texto;
      alvoOff = paraFrente ? 0 : (texto as Text).data.length;
    }

    const idxNo = indice.nodes.indexOf(alvo as Text);
    if (idxNo === -1) return -1;

    if (paraFrente) {
      for (let i = 0; i < indice.charNode.length; i++) {
        if (indice.charNode[i] === idxNo && indice.charOff[i] >= alvoOff) return i;
      }
      return -1;
    }
    for (let i = indice.charNode.length - 1; i >= 0; i--) {
      if (indice.charNode[i] === idxNo && indice.charOff[i] < alvoOff) return i + 1;
    }
    return -1;
  }

  function criarAncora(indice: IndiceDocumento, range: Range): Ancora | null {
    let inicio = posicaoDe(indice, range.startContainer, range.startOffset, true);
    let fim = posicaoDe(indice, range.endContainer, range.endOffset, false);
    if (inicio < 0 || fim <= inicio) return null;

    // Encolhe os limites em vez de dar trim() no texto: o prefixo, o sufixo e a
    // posição relativa são fatiados por estes offsets, e um trim posterior os
    // deixaria descrevendo um trecho diferente do que foi guardado.
    while (inicio < fim && ESPACO.test(indice.texto[inicio])) inicio++;
    while (fim > inicio && ESPACO.test(indice.texto[fim - 1])) fim--;

    const textoExato = indice.texto.slice(inicio, fim);
    if (textoExato.length < QUOTE_MIN || textoExato.length > QUOTE_MAX) {
      return null;
    }

    return {
      textoExato,
      prefixo: indice.texto.slice(Math.max(0, inicio - CONTEXTO), inicio),
      sufixo: indice.texto.slice(fim, fim + CONTEXTO),
      posicaoRelativa: indice.texto.length ? inicio / indice.texto.length : 0,
      ancoraSecao: secaoEm(indice, inicio),
    };
  }

  /** Comprimento do sufixo comum de a e b (para o prefixo da âncora). */
  function comumNoFim(a: string, b: string): number {
    let n = 0;
    while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) {
      n++;
    }
    return n;
  }

  /** Comprimento do prefixo comum de a e b (para o sufixo da âncora). */
  function comumNoInicio(a: string, b: string): number {
    let n = 0;
    while (n < a.length && n < b.length && a[n] === b[n]) n++;
    return n;
  }

  function resolverAncora(
    indice: IndiceDocumento,
    ancora: Ancora
  ): Resolucao | null {
    const alvo = ancora.textoExato;
    if (!alvo || alvo.length < QUOTE_MIN) return null;

    const ocorrencias: number[] = [];
    let de = indice.texto.indexOf(alvo);
    while (de !== -1 && ocorrencias.length < MAX_CANDIDATOS) {
      ocorrencias.push(de);
      de = indice.texto.indexOf(alvo, de + 1);
    }
    if (ocorrencias.length === 0) return null;

    let melhor = -1;
    let melhorNota = -1;
    for (let i = 0; i < ocorrencias.length; i++) {
      const pos = ocorrencias[i];
      const fim = pos + alvo.length;

      // Contexto: até 1.0 de cada lado, normalizado pelo tamanho guardado.
      const antes = indice.texto.slice(Math.max(0, pos - CONTEXTO), pos);
      const depois = indice.texto.slice(fim, fim + CONTEXTO);
      const notaPrefixo = ancora.prefixo
        ? comumNoFim(antes, ancora.prefixo) / ancora.prefixo.length
        : 0;
      const notaSufixo = ancora.sufixo
        ? comumNoInicio(depois, ancora.sufixo) / ancora.sufixo.length
        : 0;

      // Seção é BÔNUS, nunca filtro: renomear um <h2> orfanaria tudo abaixo.
      const secao = secaoEm(indice, pos);
      const notaSecao =
        ancora.ancoraSecao && secao === ancora.ancoraSecao ? 1 : 0;

      // Posição relativa é o último desempate, com tolerância larga — o
      // documento cresce a cada mês e o offset absoluto envelhece mal.
      const relativa = indice.texto.length ? pos / indice.texto.length : 0;
      const notaPosicao = 1 - Math.min(1, Math.abs(relativa - ancora.posicaoRelativa) * 2);

      const nota =
        notaPrefixo * 4 + notaSufixo * 4 + notaSecao * 1.5 + notaPosicao * 0.5;

      if (nota > melhorNota) {
        melhorNota = nota;
        melhor = pos;
      }
    }

    if (melhor < 0) return null;
    // 10 é a nota máxima possível (4 + 4 + 1.5 + 0.5).
    const confianca = Math.max(0, Math.min(1, melhorNota / 10));

    // Ocorrência única: aceita mesmo com nota baixa. Não há do que discordar —
    // se o trecho aparece uma vez só, é ali. Exigir contexto aqui produziria
    // órfão falso sempre que o parágrafo vizinho fosse editado.
    if (ocorrencias.length > 1 && confianca < CONFIANCA_MIN) return null;

    return { inicio: melhor, fim: melhor + alvo.length, confianca };
  }

  function rangeDe(indice: IndiceDocumento, alvo: Intervalo): Range | null {
    const { inicio, fim } = alvo;
    if (inicio < 0 || fim <= inicio || fim > indice.charNode.length) return null;

    const noInicio = indice.nodes[indice.charNode[inicio]];
    const noFim = indice.nodes[indice.charNode[fim - 1]];
    if (!noInicio || !noFim) return null;

    const range = (noInicio.ownerDocument as Document).createRange();
    range.setStart(noInicio, indice.charOff[inicio]);
    range.setEnd(noFim, indice.charOff[fim - 1] + 1);
    return range;
  }

  return { normalizar, construirIndice, criarAncora, resolverAncora, rangeDe };
}
