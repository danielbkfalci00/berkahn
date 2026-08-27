"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Presentation,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Eye,
  Inbox,
  Calculator,
  BarChart3,
} from "lucide-react";
import type { DashboardStats } from "@/types/admin";
import type { AdminMembership } from "@/types/analytics";

interface Activity {
  id: string;
  action: string;
  entity: string;
  time: string;
}

interface DashboardContentProps {
  user: User | null;
  stats: DashboardStats;
  recentActivity: Activity[];
  membership: AdminMembership | null;
}

export function DashboardContent({
  user,
  stats,
  recentActivity,
  membership,
}: DashboardContentProps) {
  const greeting = getGreeting();
  const firstName = membership?.nome.split(" ")[0] || user?.email?.split("@")[0] || "Admin";
  const canManageContent = membership?.role === "owner" || membership?.role === "conteudo";
  const canManageCommercial = membership?.role === "owner" || membership?.role === "comercial";
  const canReadContent = canManageContent || membership?.role === "viewer";

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">
            {greeting}, {firstName}!
          </h2>
          <p className="text-neutral-500 mt-1">
            Aqui está um resumo do seu painel
          </p>
        </div>
        {canManageContent && <div className="flex gap-2">
          <Link href="/admin/posts/new">
            <Button className="bg-neutral-900 hover:bg-neutral-800">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </Link>
        </div>}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Posts */}
        {canReadContent && <Card className="p-6 hover:shadow-luxury-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <Link
              href="/admin/posts"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-neutral-900">
              {stats.posts.total}
            </p>
            <p className="text-sm text-neutral-500">Posts</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              {stats.posts.published} publicados
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <Clock className="h-3 w-3" />
              {stats.posts.drafts} rascunhos
            </span>
          </div>
        </Card>}

        {/* Proposals */}
        {canManageCommercial && <Card className="p-6 hover:shadow-luxury-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <Link
              href="/admin/propostas"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-neutral-900">
              {stats.proposals.total}
            </p>
            <p className="text-sm text-neutral-500">Propostas</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-amber-600">
              <Clock className="h-3 w-3" />
              {stats.proposals.pending} pendentes
            </span>
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              {stats.proposals.approved} aprovadas
            </span>
          </div>
        </Card>}

        {/* Presentations */}
        {canReadContent && <Card className="p-6 hover:shadow-luxury-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Presentation className="h-5 w-5 text-purple-600" />
            </div>
            <Link
              href="/admin/apresentacoes"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-neutral-900">
              {stats.presentations.total}
            </p>
            <p className="text-sm text-neutral-500">Apresentações</p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="h-3 w-3" />
              {stats.presentations.sent} enviadas
            </span>
            <span className="flex items-center gap-1 text-purple-600">
              <Eye className="h-3 w-3" />
              {stats.presentations.viewed} visualizadas
            </span>
          </div>
        </Card>}

        {/* Revenue (Proposals) */}
        {canManageCommercial && <Card className="p-6 hover:shadow-luxury-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-neutral-900">
              R$ {(stats.proposals.total_value / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-neutral-500">Em propostas aprovadas</p>
          </div>
          <div className="mt-4 flex items-center text-xs text-neutral-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>{stats.proposals.approved} propostas aprovadas</span>
          </div>
        </Card>}
      </div>

      {/* Quick actions and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="font-semibold text-neutral-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-2">
            {canManageContent && <Link href="/admin/posts/new">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Novo Post
              </Button>
            </Link>}
            {canManageCommercial && <Link href="/admin/leads">
              <Button variant="outline" className="w-full justify-start">
                <Inbox className="h-4 w-4 mr-2" />
                Operar Leads
              </Button>
            </Link>}
            {canManageCommercial && <Link href="/admin/orcamentos/novo">
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="h-4 w-4 mr-2" />
                Novo Orçamento
              </Button>
            </Link>}
            <Link href="/admin/analytics"><Button variant="outline" className="w-full justify-start"><BarChart3 className="h-4 w-4 mr-2" />Ver Analytics</Button></Link>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-neutral-500">{activity.entity}</p>
                </div>
                <span className="text-xs text-neutral-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
