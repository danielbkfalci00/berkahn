/**
 * Três escalas de numeral para a página inteira, e só três.
 *
 * Antes havia seis tamanhos diferentes espalhados pelos componentes, o que
 * apagava a hierarquia: numa paleta mono a escala é a única linguagem de
 * importância, e com seis valores nenhum deles significa nada. Pior, na seção
 * da perda o número de contexto (16% de reciclagem) estava 2,4 vezes maior que
 * os números da tese (30% contra 5%).
 *
 * HERO      o número que carrega a tese da seção.
 * SUPPORT   o número que dá contexto ao herói.
 * INLINE    o número que vive dentro de uma lista ou legenda.
 */
export const FIGURE_HERO = "text-[clamp(72px,9vw,150px)]";
/**
 * O tier herói expresso numa coluna de meia largura. Mesmo papel, teto menor:
 * "até 30%" no teto de 150px passa dos 290px da coluna e encosta no vizinho.
 */
export const FIGURE_HERO_TIGHT = "text-[clamp(52px,6vw,96px)]";
export const FIGURE_SUPPORT = "text-[clamp(40px,3.6vw,56px)]";
export const FIGURE_INLINE = "text-[clamp(28px,2.2vw,34px)]";
