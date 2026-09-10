import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/admin/DashboardContent";
import { DashboardStats } from "@/types/admin";
import { getAdminSession } from "@/lib/supabase/sessao";
import { getDashboardLeadOperations } from "@/lib/analytics/leads-queries";
import type { AdminDataResult } from "@/types/analytics";

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

export default async function AdminDashboard() {
  const supabase = await createClient();
  const session = await getAdminSession();

  // Fetch user info
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let stats: AdminDataResult<DashboardStats>;
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    stats = error || !data
      ? { status: "unavailable", reason: "Não foi possível consultar os indicadores agora." }
      : { status: "ok", data: data as DashboardStats };
  } catch (error) {
    console.error("Dashboard stats indisponíveis", error);
    stats = { status: "unavailable", reason: "Não foi possível consultar os indicadores agora." };
  }

  // Fetch recent activity from activity_logs
  let recentActivity: AdminDataResult<{ id: string; action: string; entity: string; time: string }[]>;
  try {
    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('id, action, entity_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !logs) {
      recentActivity = { status: "unavailable", reason: "Não foi possível carregar a atividade recente." };
    } else {
      recentActivity = { status: "ok", data: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity_name,
        time: formatRelativeTime(log.created_at),
      })) };
    }
  } catch (error) {
    console.error("Atividade recente indisponível", error);
    recentActivity = { status: "unavailable", reason: "Não foi possível carregar a atividade recente." };
  }

  const canManageCommercial = session?.membership.role === "owner" || session?.membership.role === "comercial";
  const leadOperations = canManageCommercial ? await getDashboardLeadOperations() : null;

  return (
    <DashboardContent
      user={user}
      stats={stats}
      recentActivity={recentActivity}
      leadOperations={leadOperations}
      membership={session?.membership ?? null}
    />
  );
}
