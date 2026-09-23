import { DashboardContent } from "@/components/admin/DashboardContent";
import { DashboardStats } from "@/types/admin";
import { getAdminSession } from "@/lib/supabase/sessao";
import { getDashboardLeadOperations } from "@/lib/analytics/leads-queries";
import type { AdminDataResult } from "@/types/analytics";
import { redirect } from "next/navigation";

// Helper to format relative time
function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Há ${diffMins} minutos`;
  if (diffHours < 24) return `Há ${diffHours} horas`;
  if (diffDays === 1) return "Ontem";
  return `Há ${diffDays} dias`;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string | string[] }>;
}) {
  const { aviso } = await searchParams;
  // Setado pelo middleware quando roleCanAccessPath nega a rota pedida.
  const semPermissao = aviso === "sem-permissao";
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { user, membership } = session;
  const canManageCommercial = session?.membership.role === "owner" || session?.membership.role === "comercial";
  const [stats, recentActivity, leadOperations] = await Promise.all([
    loadStats(),
    loadRecentActivity(),
    canManageCommercial ? getDashboardLeadOperations() : Promise.resolve(null),
  ]);

  return (
    <>
      {semPermissao && (
        <p
          role="status"
          className="mx-auto mb-4 max-w-6xl rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          Seu papel não dá acesso à área que você tentou abrir. Se precisar dela, peça acesso a um owner.
        </p>
      )}
      <DashboardContent
        fallbackName={user.email?.split("@")[0] ?? null}
        stats={stats}
        recentActivity={recentActivity}
        leadOperations={leadOperations}
        membership={membership}
      />
    </>
  );
}

async function loadStats(): Promise<AdminDataResult<DashboardStats>> {
  try {
    const session = await getAdminSession();
    if (!session) throw new Error("Sessão ausente");
    const { data, error } = await session.supabase.rpc("get_dashboard_stats");
    return error || !data
      ? { status: "unavailable", reason: "Não foi possível consultar os indicadores agora." }
      : { status: "ok", data: data as DashboardStats };
  } catch (error) {
    console.error("Dashboard stats indisponíveis", error);
    return { status: "unavailable", reason: "Não foi possível consultar os indicadores agora." };
  }
}

async function loadRecentActivity(): Promise<AdminDataResult<{ id: string; action: string; entity: string; time: string }[]>> {
  try {
    const session = await getAdminSession();
    if (!session) throw new Error("Sessão ausente");
    const { data: logs, error } = await session.supabase
      .from("activity_logs")
      .select("id, action, entity_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error || !logs) return { status: "unavailable", reason: "Não foi possível carregar a atividade recente." };
    return { status: "ok", data: logs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity_name,
      time: formatRelativeTime(log.created_at),
    })) };
  } catch (error) {
    console.error("Atividade recente indisponível", error);
    return { status: "unavailable", reason: "Não foi possível carregar a atividade recente." };
  }
}
