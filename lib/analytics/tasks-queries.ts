// Queries server-side para o sistema de tarefas (Sprint 7).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsTask } from "@/types/analytics";

const PRIORITY_RANK: Record<string, number> = { p0: 0, p1: 1, p2: 2 };

/**
 * Lista todas as tarefas (globais, não atadas ao mês).
 * Ordena por status (open antes de done), prioridade (p0→p2) e sort_order.
 */
export async function getTasks(): Promise<AnalyticsTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_tasks")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  const tasks = data as AnalyticsTask[];
  return tasks.sort((a, b) => {
    // Abertas primeiro
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    // Prioridade
    const pr = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
    if (pr !== 0) return pr;
    // Ordem manual
    return a.sort_order - b.sort_order;
  });
}
