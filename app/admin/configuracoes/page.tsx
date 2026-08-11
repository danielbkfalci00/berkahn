import { Bell, Database, Shield, UserRound } from "lucide-react";
import { LeadResponsibleSettings } from "@/components/admin/LeadResponsibleSettings";
import { AdminPushSettings, type AdminPushDevice } from "@/components/admin/AdminPwa";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { LeadResponsible } from "@/types/analytics";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const [{ data: { user } }, { data: responsibles }, { data: pushDevices }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("lead_responsaveis")
      .select("id,nome,ativo,ordem")
      .order("ativo", { ascending: false })
      .order("ordem")
      .order("nome"),
    supabase
      .from("admin_push_subscriptions")
      .select("id,device_label,ativo,ultimo_uso_em")
      .order("ativo", { ascending: false })
      .order("ultimo_uso_em", { ascending: false }),
  ]);
  const pushConfigured = Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()
    && process.env.VAPID_PRIVATE_KEY?.trim()
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500">Admin · operação</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">Configurações</h1>
        <p className="mt-1 text-sm text-neutral-600">Somente controles que alteram o sistema aparecem nesta tela.</p>
      </div>

      <Card className="p-6">
        <SectionHeading icon={UserRound} title="Equipe comercial" description="Responsáveis disponíveis na Inbox e no Kanban de leads." />
        <div className="mt-6">
          <LeadResponsibleSettings initialResponsibles={(responsibles || []) as LeadResponsible[]} />
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading icon={Bell} title="Notificações no dispositivo" description="Alertas operacionais do admin, sem dados pessoais na tela bloqueada." />
        <div className="mt-6">
          <AdminPushSettings devices={(pushDevices || []) as AdminPushDevice[]} configured={pushConfigured} />
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeading icon={Shield} title="Acesso administrativo" description="O admin aceita apenas a conta canônica autorizada." />
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <SystemField label="Conta ativa" value={user?.email || "Sessão não identificada"} />
          <SystemField label="Domínio" value="admin.berkahn.com.br" />
        </dl>
      </Card>

      <Card className="p-6">
        <SectionHeading icon={Database} title="Infraestrutura" description="Estado das integrações usadas pelo CRM leve." />
        <div className="mt-5 divide-y divide-neutral-200 rounded-md border border-neutral-200">
          <IntegrationRow icon={Database} name="Supabase" detail="Leads, histórico e arquivos privados" ready />
          <IntegrationRow icon={Bell} name="Alertas no dispositivo" detail="Web Push sem dados pessoais" ready={pushConfigured} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">O CRM opera somente no Supabase. Integrações Google não participam da captura.</p>
      </Card>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }: { icon: typeof UserRound; title: string; description: string }) {
  return <div className="flex items-start gap-3"><span className="rounded-md bg-neutral-100 p-2"><Icon className="h-5 w-5 text-neutral-600" /></span><div><h2 className="font-semibold text-neutral-900">{title}</h2><p className="mt-0.5 text-sm text-neutral-500">{description}</p></div></div>;
}

function SystemField({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</dt><dd className="mt-1 break-words text-neutral-800">{value}</dd></div>;
}

function IntegrationRow({ icon: Icon, name, detail, ready }: { icon: typeof Database; name: string; detail: string; ready: boolean }) {
  return <div className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><Icon className="h-5 w-5 shrink-0 text-neutral-500" /><div className="min-w-0"><p className="font-medium text-neutral-900">{name}</p><p className="truncate text-sm text-neutral-500">{detail}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{ready ? "Ativo" : "Configuração pendente"}</span></div>;
}
