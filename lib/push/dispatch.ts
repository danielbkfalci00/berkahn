import "server-only";
import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/admin";

interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

export interface PushDispatchResult {
  claimed: number;
  sent: number;
  skipped: number;
  failed: number;
  disabledSubscriptions: number;
  configured: boolean;
}

export async function dispatchLeadPushNotifications(): Promise<PushDispatchResult> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:contato@berkahn.com.br";
  if (!publicKey || !privateKey) {
    return { claimed: 0, sent: 0, skipped: 0, failed: 0, disabledSubscriptions: 0, configured: false };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const supabase = createServiceClient();
  const [
    { data: notifications, error: claimError },
    { data: subscriptions, error: subscriptionsError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase.rpc("claim_lead_push_notifications", { p_limit: 20 }),
    supabase
      .from("admin_push_subscriptions")
      .select("id,user_id,endpoint,p256dh,auth_key")
      .eq("ativo", true),
    supabase
      .from("lead_responsaveis")
      .select("user_id,role,ativo,notificar_novos_leads,notificar_acoes_vencidas")
      .eq("ativo", true)
      .in("role", ["owner", "comercial"]),
  ]);
  if (claimError) throw new Error(`push outbox claim: ${claimError.message}`);
  if (subscriptionsError) throw new Error(`push subscriptions: ${subscriptionsError.message}`);
  if (membersError) throw new Error(`push members: ${membersError.message}`);

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  let disabledSubscriptions = 0;
  for (const notification of notifications || []) {
    const payload = notification.payload as unknown as PushPayload;
    const eligibleUsers = new Set((members || [])
      .filter((member) => notification.tipo === "novo_lead"
        ? member.notificar_novos_leads
        : member.notificar_acoes_vencidas)
      .map((member) => member.user_id)
      .filter(Boolean));
    const eligibleSubscriptions = (subscriptions || []).filter((subscription) => eligibleUsers.has(subscription.user_id));
    if (eligibleSubscriptions.length === 0) {
      const { error } = await supabase
        .from("lead_notification_outbox")
        .update({
          estado: "skipped_no_subscribers",
          atualizado_em: new Date().toISOString(),
          ultimo_erro: "Nenhum dispositivo elegível com esta preferência ativa",
        })
        .eq("id", notification.id);
      if (error) throw new Error(`push outbox skip: ${error.message}`);
      skipped += 1;
      continue;
    }
    let delivered = 0;
    let lastError = "Nenhum dispositivo ativo";

    for (const subscription of eligibleSubscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth_key },
          },
          JSON.stringify(payload),
          { TTL: 60 * 60, urgency: notification.tipo === "novo_lead" ? "high" : "normal" }
        );
        delivered += 1;
      } catch (pushError) {
        const statusCode = typeof pushError === "object" && pushError && "statusCode" in pushError
          ? Number(pushError.statusCode)
          : 0;
        lastError = pushError instanceof Error ? pushError.message.slice(0, 500) : "Falha no Web Push";
        if (statusCode === 404 || statusCode === 410) {
          const { error: deactivateError } = await supabase
            .from("admin_push_subscriptions")
            .update({ ativo: false, atualizado_em: new Date().toISOString() })
            .eq("id", subscription.id);
          if (!deactivateError) disabledSubscriptions += 1;
        }
      }
    }

    if (delivered > 0) {
      const { error } = await supabase
        .from("lead_notification_outbox")
        .update({
          estado: "sent",
          enviado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          ultimo_erro: null,
        })
        .eq("id", notification.id);
      if (error) throw new Error(`push outbox complete: ${error.message}`);
      sent += 1;
      continue;
    }

    const retryMinutes = Math.min(60, 2 ** Math.min(notification.tentativas, 5));
    const nextAttempt = new Date(Date.now() + retryMinutes * 60_000).toISOString();
    await supabase
      .from("lead_notification_outbox")
      .update({
        estado: "failed",
        ultimo_erro: lastError,
        proxima_tentativa_em: nextAttempt,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", notification.id);
    failed += 1;
  }

  return {
    claimed: notifications?.length || 0,
    sent,
    skipped,
    failed,
    disabledSubscriptions,
    configured: true,
  };
}
