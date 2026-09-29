import "server-only";
import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/admin";

interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

interface LeadNotification {
  id: string;
  lead_id: string | null;
  tipo: string;
  payload: unknown;
  tentativas: number;
  delivered_subscription_ids: string[] | null;
}

interface PendingLead {
  id: string;
  responsavel_id: string | null;
  status: string;
  proxima_acao_em: string | null;
  arquivado_em: string | null;
  anonimizado_em: string | null;
}

export interface PushDispatchResult {
  claimed: number;
  sent: number;
  skipped: number;
  failed: number;
  disabledSubscriptions: number;
  configured: boolean;
}

export async function dispatchLeadPushNotifications(options: { budgetMs?: number } = {}): Promise<PushDispatchResult> {
  const deadline = Date.now() + Math.min(20_000, Math.max(1_000, options.budgetMs ?? 20_000));
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:contato@berkahn.com.br";
  if (!publicKey || !privateKey) {
    return { claimed: 0, sent: 0, skipped: 0, failed: 0, disabledSubscriptions: 0, configured: false };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const supabase = createServiceClient();
  const [
    { data: subscriptions, error: subscriptionsError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase
      .from("admin_push_subscriptions")
      .select("id,user_id,endpoint,p256dh,auth_key")
      .eq("ativo", true),
    supabase
      .from("lead_responsaveis")
      .select("id,user_id,role,ativo,notificar_novos_leads,notificar_acoes_vencidas")
      .eq("ativo", true)
      .in("role", ["owner", "comercial"]),
  ]);
  if (subscriptionsError) throw new Error(`push subscriptions: ${subscriptionsError.message}`);
  if (membersError) throw new Error(`push members: ${membersError.message}`);

  let claimed = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  let disabledSubscriptions = 0;
  // Reivindica somente o item que cabe nesta execução. A cauda continua disponível ao cron.
  while (claimed < 20 && Date.now() < deadline - 2_000) {
    const { data: rawNotifications, error: claimError } = await supabase.rpc("claim_lead_push_notifications", { p_limit: 1 });
    if (claimError) throw new Error(`push outbox claim: ${claimError.message}`);
    const notification = (rawNotifications as LeadNotification[] | null)?.[0];
    if (!notification) break;
    claimed += 1;
    const payload = notification.payload as unknown as PushPayload;
    const leadResult = notification.lead_id ? await supabase.from("leads")
      .select("id,responsavel_id,status,proxima_acao_em,arquivado_em,anonimizado_em")
      .eq("id", notification.lead_id).maybeSingle() : { data: null, error: null };
    if (leadResult.error) {
      await supabase.from("lead_notification_outbox").update({ estado: "pending", tentativas: Math.max(0, notification.tentativas - 1), atualizado_em: new Date().toISOString(), proxima_tentativa_em: new Date(Date.now() + 60_000).toISOString() }).eq("id", notification.id);
      throw new Error("Não foi possível conferir as pendências antes do envio.");
    }
    const lead = leadResult.data as PendingLead | null;
    const overdue = notification.tipo === "proxima_acao_vencida";
    const feedback = notification.tipo === "novo_feedback";
    const resolved = !feedback && (!lead || Boolean(lead.arquivado_em || lead.anonimizado_em)
      || (overdue && (["convertido", "desqualificado"].includes(lead.status) || !lead.proxima_acao_em || Date.parse(lead.proxima_acao_em) >= Date.now())));
    if (resolved) {
      const { error } = await supabase.from("lead_notification_outbox").update({ estado: "skipped_resolved", atualizado_em: new Date().toISOString(), ultimo_erro: null }).eq("id", notification.id);
      if (error) throw new Error(`push resolved: ${error.message}`);
      skipped += 1;
      continue;
    }
    const eligibleUsers = new Set((members || [])
      .filter((member) => feedback ? member.role === "owner" : overdue
        ? member.notificar_acoes_vencidas && (lead?.responsavel_id ? member.id === lead.responsavel_id : member.role === "owner")
        : member.notificar_novos_leads)
      .map((member) => member.user_id).filter(Boolean));
    const eligibleSubscriptions = (subscriptions || [])
      .filter((subscription) => eligibleUsers.has(subscription.user_id))
      .sort((left, right) => left.id.localeCompare(right.id));
    if (eligibleSubscriptions.length === 0) {
      const { error } = await supabase.from("lead_notification_outbox").update({
        estado: "skipped_no_subscribers", atualizado_em: new Date().toISOString(), ultimo_erro: "Nenhum dispositivo elegível com esta preferência ativa",
      }).eq("id", notification.id);
      if (error) throw new Error(`push outbox skip: ${error.message}`);
      skipped += 1;
      continue;
    }
    const deliveredIds = new Set<string>(notification.delivered_subscription_ids || []);
    let retryRequired = false;
    let lastError = "";
    const unconfirmed = eligibleSubscriptions.filter((subscription) => !deliveredIds.has(subscription.id));
    // Alterna o primeiro lote após falha para que dispositivos lentos não bloqueiem a cauda.
    const offset = unconfirmed.length ? ((notification.tentativas - 1) * 2) % unconfirmed.length : 0;
    const remaining = [...unconfirmed.slice(offset), ...unconfirmed.slice(0, offset)];
    let attempted = 0;
    while (attempted < remaining.length && Date.now() < deadline - 1_500) {
      const batch = remaining.slice(attempted, attempted + 2);
      const timeout = Math.min(2_000, Math.max(250, deadline - Date.now() - 1_000));
      const results = await Promise.allSettled(batch.map((subscription) => webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth_key } },
        JSON.stringify(payload), { TTL: 60 * 60, urgency: notification.tipo === "novo_lead" ? "high" : "normal", timeout }
      )));
      attempted += batch.length;
      for (let index = 0; index < results.length; index += 1) {
        const result = results[index];
        const subscription = batch[index];
        if (result.status === "fulfilled") {
          deliveredIds.add(subscription.id);
          continue;
        }
        const pushError: unknown = result.reason;
        const statusCode = typeof pushError === "object" && pushError && "statusCode" in pushError ? Number(pushError.statusCode) : 0;
        lastError = pushError instanceof Error ? pushError.message.slice(0, 500) : "Falha no Web Push";
        if (statusCode === 404 || statusCode === 410) {
          const { error } = await supabase.from("admin_push_subscriptions").update({ ativo: false, atualizado_em: new Date().toISOString() }).eq("id", subscription.id);
          if (!error) disabledSubscriptions += 1;
          else retryRequired = true;
        } else retryRequired = true;
      }
      const { error } = await supabase.from("lead_notification_outbox").update({ delivered_subscription_ids: [...deliveredIds] }).eq("id", notification.id);
      if (error) throw new Error(`push delivery receipt: ${error.message}`);
    }
    const deferred = attempted < remaining.length;
    const deferredWithoutFailure = deferred && !retryRequired;
    const now = new Date().toISOString();
    const retryMinutes = Math.min(60, 2 ** Math.min(notification.tentativas, 5));
    const { error } = await supabase.from("lead_notification_outbox").update({
      estado: retryRequired ? "failed" : deferred ? "pending" : deliveredIds.size ? "sent" : "skipped_no_subscribers",
      tentativas: deferredWithoutFailure ? Math.max(0, notification.tentativas - 1) : notification.tentativas,
      enviado_em: !deferred && !retryRequired && deliveredIds.size ? now : null,
      delivered_subscription_ids: [...deliveredIds], atualizado_em: now,
      ultimo_erro: retryRequired ? lastError : null,
      proxima_tentativa_em: new Date(Date.now() + (deferredWithoutFailure ? 1 : retryMinutes) * 60_000).toISOString(),
    }).eq("id", notification.id);
    if (error) throw new Error(`push outbox completion: ${error.message}`);
    if (retryRequired) failed += 1;
    else if (!deferred && deliveredIds.size) sent += 1;
    else if (!deferred) skipped += 1;
    if (deferred) break;
  }

  return {
    claimed,
    sent,
    skipped,
    failed,
    disabledSubscriptions,
    configured: true,
  };
}
