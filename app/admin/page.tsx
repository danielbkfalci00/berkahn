import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/admin/DashboardContent";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch user info
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Fetch real stats from Supabase when tables are created
  // For now, using mock data
  const stats = {
    posts: {
      total: 12,
      published: 8,
      drafts: 3,
      scheduled: 1,
    },
    proposals: {
      total: 24,
      pending: 5,
      approved: 15,
      rejected: 4,
      total_value: 125000,
    },
    presentations: {
      total: 6,
      sent: 4,
      viewed: 3,
    },
  };

  // TODO: Fetch recent activity
  const recentActivity = [
    {
      id: "1",
      action: "Post publicado",
      entity: "5 Vantagens do Steel Frame",
      time: "Há 2 horas",
    },
    {
      id: "2",
      action: "Proposta enviada",
      entity: "BRK-2024-015 - João Silva",
      time: "Há 4 horas",
    },
    {
      id: "3",
      action: "Apresentação visualizada",
      entity: "Casa Alphaville - Família Santos",
      time: "Ontem",
    },
  ];

  return (
    <DashboardContent
      user={user}
      stats={stats}
      recentActivity={recentActivity}
    />
  );
}
