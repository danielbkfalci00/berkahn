// Helpers de período client-friendly (server-only-free).

export function previousMonthSlug(monthSlug: string): string | null {
  const match = monthSlug.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1]);
  const month = parseInt(match[2]);
  if (month === 1) return `${year - 1}-12`;
  return `${year}-${String(month - 1).padStart(2, "0")}`;
}
