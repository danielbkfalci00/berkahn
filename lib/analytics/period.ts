// Helpers de período client-friendly (server-only-free).

export function previousMonthSlug(monthSlug: string): string | null {
  const match = monthSlug.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1]);
  const month = parseInt(match[2]);
  if (month === 1) return `${year - 1}-12`;
  return `${year}-${String(month - 1).padStart(2, "0")}`;
}

/** Cadência semanal do pipeline, com três dias de consolidação do GSC. */
export function snapshotFreshnessNotice(
  { monthSlug, periodEnd, partial }: { monthSlug: string; periodEnd: string; partial: boolean },
  now = new Date()
): string | null {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const endMs = Date.parse(`${periodEnd}T00:00:00Z`);
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(endMs) || !Number.isFinite(todayMs)) return null;
  const currentMonth = today.slice(0, 7);
  const ageDays = (todayMs - endMs) / 86_400_000;

  // Um fechamento antigo é histórico válido, não uma coleta vencida.
  if (monthSlug < currentMonth && partial) {
    const [year, month] = monthSlug.split("-").map(Number);
    const closureDue = Date.UTC(year, month, 4);
    return todayMs >= closureDue
      ? "Fechamento pendente: este relatório ainda cobre apenas parte do mês selecionado."
      : null;
  }
  if (monthSlug === currentMonth && ageDays > 10) {
    return "Atualização pendente: a cobertura está além da frequência semanal prevista. Os números abaixo são da última coleta disponível.";
  }
  return null;
}
