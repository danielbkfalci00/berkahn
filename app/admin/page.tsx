import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/admin/DashboardContent";
import { DashboardStats } from "@/types/admin";

// Default stats when tables don't exist yet
const defaultStats: DashboardStats = {
  posts: { total: 0, published: 0, drafts: 0, scheduled: 0 },
  proposals: { total: 0, pending: 0, approved: 0, rejected: 0, total_value: 0 },
  presentations: { total: 0, sent: 0, viewed: 0 },
};

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

  // Fetch user info
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch real stats from Supabase using the helper function
  let stats: DashboardStats = defaultStats;
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    if (!error && data) {
      stats = data as DashboardStats;
    }
  } catch {
    // Tables may not exist yet, use defaults
    console.log('Dashboard stats: using defaults (tables may not exist)');
  }

  // Fetch recent activity from activity_logs
  let recentActivity: { id: string; action: string; entity: string; time: string }[] = [];
  try {
    const { data: logs } = await supabase
      .from('activity_logs')
      .select('id, action, entity_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (logs && logs.length > 0) {
      recentActivity = logs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity_name,
        time: formatRelativeTime(log.created_at),
      }));
    }
  } catch {
    // Table may not exist yet
  }

  // If no activity logs, show placeholder
  if (recentActivity.length === 0) {
    recentActivity = [
      { id: "0", action: "Sistema iniciado", entity: "Painel Administrativo", time: "Agora" },
    ];
  }

  return (
    <DashboardContent
      user={user}
      stats={stats}
      recentActivity={recentActivity}
    />
  );
}
