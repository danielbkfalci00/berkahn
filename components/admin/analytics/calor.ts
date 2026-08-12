import type { CSSProperties } from "react";

/**
 * Estilo de uma célula de matriz de calor.
 *
 * Densidade de tinta sobre off-white, não escala de matiz. A paleta da marca é
 * preto + off-white + cinzas (guia de design), e um ramp de hue introduziria
 * uma cor que não existe no sistema só para esta tela. Também sobrevive a
 * daltonismo e a impressão em preto e branco, que é onde o dashboard termina:
 * o insumo declarado é a reunião mensal.
 *
 * `printColorAdjust: exact` é obrigatório. O navegador descarta cor de fundo ao
 * imprimir por padrão — sem isso a matriz sai em branco no papel e no PDF, que
 * é exatamente o uso para o qual ela existe.
 */
export function estiloCalor(intensidade: number): CSSProperties {
  const alpha = Math.max(0, Math.min(1, intensidade));
  return {
    backgroundColor: `rgba(0, 0, 0, ${(alpha * 0.88).toFixed(3)})`,
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };
}

/**
 * Acima de ~0,55 de intensidade o fundo escurece o suficiente para texto preto
 * perder contraste. Trocar por branco mantém a legibilidade nos dois extremos.
 */
export function classeTextoCalor(intensidade: number): string {
  return intensidade > 0.55 ? "text-white" : "text-neutral-700";
}

/** Formata 0..1 como percentual inteiro. */
export function pct(fracao: number): string {
  if (!Number.isFinite(fracao)) return "—";
  return `${Math.round(fracao * 100)}%`;
}
