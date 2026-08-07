// Helpers de período (mês fechado, mês parcial, mês anterior, formatos)

const MS_PER_DAY = 86400000;

// Lag de consolidação do Search Console. 3 dias (e não 2) porque em D+2 o
// último dia costuma vir artificialmente baixo e enviesa o total para baixo.
// Configurável via env para teste ou se o lag do GSC mudar.
export const GSC_LAG_DAYS = Number(process.env.ANALYTICS_GSC_LAG_DAYS ?? 3);

// Toda aritmética de data acontece em UTC, mas ancorada no dia civil LOCAL.
// Ler o relógio local mantém o resultado alinhado com o dia de quem roda o
// script; calcular em UTC deixa imune a DST e ao off-by-one de toISOString().
function utcAnchor(d) {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

function fmtUtc(ms) {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysInMonth(year, month) {
  // month: 1-12. Date.UTC com dia 0 devolve o último dia do mês anterior ao
  // índice informado — como o índice é 0-based, month cru aponta para este mês.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function monthBounds(year, month) {
  // month: 1-12
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const last = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
  return { startDate, endDate };
}

export function previousMonth(year, month) {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

export function lastClosedMonth(now = new Date()) {
  // Retorna ano/mês do último mês completo (sempre o mês anterior ao atual)
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-11, então mês passado é m (sem +1)
  if (m === 0) return { year: y - 1, month: 12 };
  return { year: y, month: m };
}

/** Data de hoje no fuso local, YYYY-MM-DD. Nunca usar toISOString() — é UTC. */
export function todayLocal(now = new Date()) {
  return fmtUtc(utcAnchor(now));
}

export function isCurrentMonth(year, month, now = new Date()) {
  return year === now.getFullYear() && month === now.getMonth() + 1;
}

export function isFutureMonth(year, month, now = new Date()) {
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;
  return year > cy || (year === cy && month > cm);
}

/**
 * Bounds de um mês ainda aberto, cortando no último dia com dado consolidado.
 *
 * Se o corte já alcançou o fim do mês, o mês fechou de fato: devolve
 * `partial: false` com os bounds cheios, para o chamador não carimbar de
 * parcial um relatório que é o fechamento.
 *
 * @throws se o mês ainda não tem nenhum dia consolidado (rodar nos dias 1-3).
 * @returns {{startDate,endDate,daysCovered,daysInMonth,asOfDate,lagDays,partial}}
 */
export function partialMonthBounds(year, month, { asOf = new Date(), lagDays = GSC_LAG_DAYS } = {}) {
  const dim = daysInMonth(year, month);
  const monthStartMs = Date.UTC(year, month - 1, 1);
  const monthEndMs = Date.UTC(year, month - 1, dim);
  const cutoffMs = utcAnchor(asOf) - lagDays * MS_PER_DAY;
  const endMs = Math.min(cutoffMs, monthEndMs);

  if (endMs >= monthEndMs) {
    return { ...monthBounds(year, month), daysCovered: dim, daysInMonth: dim, asOfDate: fmtUtc(monthEndMs), lagDays, partial: false };
  }

  if (endMs < monthStartMs) {
    const slug = monthSlug(year, month);
    throw new Error(
      `${slug} ainda não tem dias consolidados (lag GSC = ${lagDays}). ` +
      `Rode sem flags para gerar o último mês fechado.`
    );
  }

  return {
    startDate: fmtUtc(monthStartMs),
    endDate: fmtUtc(endMs),
    daysCovered: new Date(endMs).getUTCDate(),
    daysInMonth: dim,
    asOfDate: fmtUtc(endMs),
    lagDays,
    partial: true,
  };
}

/**
 * Janela do mês anterior com a MESMA contagem de dias, para o MoM comparar
 * períodos equivalentes em vez de parcial-contra-mês-inteiro.
 *
 * Clampa quando o mês anterior é mais curto (só morde em março com
 * daysCovered >= 29). Quem consome deve checar se `daysCovered` do retorno
 * bate com o pedido e sinalizar quando não bater.
 *
 * Ressalva conhecida: a composição de dias da semana só é idêntica quando
 * daysCovered é múltiplo de 7. Fora disso as duas janelas pegam quantidades
 * diferentes de fim de semana, o que enviesa levemente o MoM.
 */
export function equivalentPreviousWindow(year, month, daysCovered) {
  const prev = previousMonth(year, month);
  const days = Math.min(daysCovered, daysInMonth(prev.year, prev.month));
  return {
    startDate: fmtUtc(Date.UTC(prev.year, prev.month - 1, 1)),
    endDate: fmtUtc(Date.UTC(prev.year, prev.month - 1, days)),
    daysCovered: days,
  };
}

const PT_BR_MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function monthLabel(year, month) {
  return `${PT_BR_MONTHS[month - 1]}/${year}`;
}

export function monthSlug(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function parseMonthArg(arg) {
  // Aceita "YYYY-MM"
  const m = arg?.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return null;
  const month = parseInt(m[2]);
  // Sem esta checagem, "2026-13" passa e monthBounds gera a string sintética
  // "2026-13-31", que a API do GA4 rejeita com erro obscuro.
  if (month < 1 || month > 12) return null;
  return { year: parseInt(m[1]), month };
}
