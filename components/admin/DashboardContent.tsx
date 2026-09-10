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
  Clock,
  DollarSign,
  Inbox,
  UserRoundX,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import type { DashboardStats } from "@/types/admin";
import type { AdminDataResult, AdminMembership } from "@/types/analytics";
import type { DashboardLeadOperations } from "@/lib/analytics/leads-queries";

interface Activity {
  id: string;
  action: string;
  entity: string;
  time: string;
}

interface DashboardContentProps {
  user: User | null;
  stats: AdminDataResult<DashboardStats>;
  recentActivity: AdminDataResult<Activity[]>;
  leadOperations: AdminDataResult<DashboardLeadOperations> | null;
  membership: AdminMembership | null;
}

export function DashboardContent({
  user,
  stats,
  recentActivity,
  leadOperations,
  membership,
}: DashboardContentProps) {
  const greeting = getGreeting();
  const firstName = membership?.nome.split(" ")[0] || user?.email?.split("@")[0] || "Admin";
  const canManageContent = membership?.role === "owner" || membership?.role === "conteudo";
  const canManageCommercial = membership?.role === "owner" || membership?.role === "comercial";
  const canReadContent = canManageContent || membership?.role === "viewer";

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
            {greeting}, {firstName}!
          </h2>
        </div>
        {canManageContent && (
          <Button asChild className="min-h-11 bg-neutral-950 text-white hover:bg-neutral-800">
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo post
            </Link>
          </Button>
        )}
      </div>

      {canManageCommercial && leadOperations && (
        <section aria-labelledby="pending-title">
          <div className="mb-3 flex items-center justify-between">
            <h3 id="pending-title" className="text-base font-semibold text-neutral-950">Pendências agora</h3>
            <Link href="/admin/leads" className="inline-flex min-h-11 items-center text-sm font-medium text-neutral-600 hover:text-neutral-950">
              Ver leads <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {leadOperations.status === "unavailable" ? (
            <Card className="border-amber-200 p-4 text-sm text-amber-800">Pendências indisponíveis. {leadOperations.reason}</Card>
          ) : (
            <Card className="overflow-hidden border-neutral-200 bg-white">
              <div className="grid grid-cols-3 divide-x divide-neutral-200">
                <OperationMetric icon={Inbox} label="Novos" value={leadOperations.data.newCount} />
                <OperationMetric icon={AlertTriangle} label="Vencidos" value={leadOperations.data.overdueCount} danger={leadOperations.data.overdueCount > 0} />
                <OperationMetric icon={UserRoundX} label="Sem responsável" value={leadOperations.data.unassignedCount} />
              </div>
              {leadOperations.data.nextLeadId && leadOperations.data.nextActionAt && (
                <Link href={`/admin/leads/${leadOperations.data.nextLeadId}`} className="flex min-h-12 items-center justify-between border-t border-neutral-200 px-4 text-sm hover:bg-neutral-50">
                  <span className={leadOperations.data.nextActionOverdue ? "font-medium text-red-700" : "text-neutral-700"}>
                    {leadOperations.data.nextActionOverdue ? "Ação mais atrasada" : "Próxima ação"}: {formatDateTime(leadOperations.data.nextActionAt)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </Link>
              )}
            </Card>
          )}
        </section>
      )}

      <section aria-labelledby="overview-title">
        <h3 id="overview-title" className="mb-3 text-base font-semibold text-neutral-950">Visão geral</h3>
        {stats.status === "unavailable" ? (
          <Card className="border-amber-200 p-4 text-sm text-amber-800">Indicadores indisponíveis. {stats.reason}</Card>
        ) : (
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 lg:grid-cols-4">
            {canReadContent && <SummaryMetric href="/admin/posts" icon={FileText} label="Posts" value={stats.data.posts.total} detail={`${stats.data.posts.drafts} rascunhos`} />}
            {canManageCommercial && <SummaryMetric href="/admin/propostas" icon={FileSpreadsheet} label="Propostas" value={stats.data.proposals.total} detail={`${stats.data.proposals.pending} pendentes`} />}
            {canReadContent && <SummaryMetric href="/admin/apresentacoes" icon={Presentation} label="Apresentações" value={stats.data.presentations.total} detail={`${stats.data.presentations.viewed} visualizadas`} />}
            {canManageCommercial && <SummaryMetric href="/admin/propostas" icon={DollarSign} label="Aprovado" value={`R$ ${(stats.data.proposals.total_value / 1000).toFixed(0)}k`} detail={`${stats.data.proposals.approved} propostas`} />}
          </div>
        )}
      </section>

      <section aria-labelledby="activity-title">
        <h3 id="activity-title" className="mb-3 text-base font-semibold text-neutral-950">Atividade recente</h3>
        <Card className="divide-y divide-neutral-100 overflow-hidden border-neutral-200">
          {recentActivity.status === "unavailable" ? (
            <p className="p-4 text-sm text-amber-800">{recentActivity.reason}</p>
          ) : recentActivity.data.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">Nenhuma atividade registrada ainda.</p>
          ) : recentActivity.data.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {activity.action}
                  </p>
                  <p className="truncate text-xs text-neutral-500">{activity.entity}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-400">{activity.time}</span>
              </div>
            ))}
        </Card>
      </section>
    </div>
  );
}

function OperationMetric({ icon: Icon, label, value, danger = false }: { icon: typeof Inbox; label: string; value: number; danger?: boolean }) {
  return <div className="min-w-0 px-3 py-4 sm:px-5"><Icon className={`mb-3 h-4 w-4 ${danger ? "text-red-600" : "text-neutral-400"}`} /><strong className={`block text-2xl tabular-nums ${danger ? "text-red-700" : "text-neutral-950"}`}>{value}</strong><span className="mt-1 block text-[11px] leading-tight text-neutral-500 sm:text-xs">{label}</span></div>;
}

function SummaryMetric({ href, icon: Icon, label, value, detail }: { href: string; icon: typeof Inbox; label: string; value: string | number; detail: string }) {
  return <Link href={href} className="flex min-h-28 flex-col bg-white p-4 hover:bg-neutral-50"><Icon className="h-4 w-4 text-neutral-400" /><strong className="mt-3 text-xl tabular-nums text-neutral-950">{value}</strong><span className="text-sm text-neutral-700">{label}</span><span className="mt-1 text-xs text-neutral-400">{detail}</span></Link>;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
