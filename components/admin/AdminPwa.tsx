"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff, Smartphone } from "lucide-react";
import {
  deactivateAdminPushSubscription,
  revokeAdminPushDevice,
  saveAdminPushSubscription,
} from "@/app/admin/leads/actions";

export interface AdminPushDevice {
  id: string;
  device_label: string;
  ativo: boolean;
  ultimo_uso_em: string;
}

export function AdminPwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !isAdminOrigin()) return;
    void navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" });
  }, []);
  return null;
}

export function AdminPushSettings({ devices, configured }: { devices: AdminPushDevice[]; configured: boolean }) {
  const router = useRouter();
  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const available = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(available);
    if (!available) return;
    void navigator.serviceWorker.getRegistration("/admin/").then(async (registration) => {
      const subscription = await registration?.pushManager.getSubscription();
      setActive(Boolean(subscription));
    });
  }, []);

  async function enable() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      setMessage("A chave pública de notificações ainda não foi configurada.");
      return;
    }
    setPending(true);
    setMessage(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Permissão de notificação não concedida.");
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const serialized = subscription.toJSON();
      if (!serialized.endpoint || !serialized.keys?.p256dh || !serialized.keys.auth) {
        throw new Error("O navegador não retornou uma assinatura válida.");
      }
      const result = await saveAdminPushSubscription({
        endpoint: serialized.endpoint,
        p256dh: serialized.keys.p256dh,
        auth: serialized.keys.auth,
        deviceLabel: deviceLabel(),
        userAgent: navigator.userAgent,
      });
      if (!result.ok) {
        if (!existing) await subscription.unsubscribe();
        throw new Error(result.error || "Não foi possível ativar as notificações.");
      }
      setActive(true);
      setMessage("Notificações ativadas neste dispositivo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao ativar notificações.");
    } finally {
      setPending(false);
    }
  }

  async function disable() {
    setPending(true);
    setMessage(null);
    const result = await disableCurrentAdminPush();
    setPending(false);
    if (!result.ok) {
      setMessage(result.error || "Não foi possível desativar as notificações.");
      return;
    }
    setActive(false);
    setMessage("Notificações desativadas neste dispositivo.");
  }

  async function revoke(device: AdminPushDevice) {
    setPending(true);
    setMessage(null);
    const result = await revokeAdminPushDevice(device.id);
    setPending(false);
    if (!result.ok) {
      setMessage(result.error || "Não foi possível revogar o dispositivo.");
      return;
    }
    setMessage("Dispositivo revogado.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!configured && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">A PWA pode ser instalada, mas o envio de alertas aguarda as chaves VAPID no ambiente de produção.</p>}
      {configured && !supported && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">Este navegador não oferece Web Push. O CRM continua funcionando normalmente.</p>}
      {configured && supported && (
        <div className="flex flex-col gap-4 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-neutral-900">Este dispositivo</p>
            <p className="mt-0.5 text-sm text-neutral-500">Novos leads e próximas ações vencidas, sem nome ou contato na notificação.</p>
          </div>
          <button type="button" disabled={pending} onClick={active ? disable : enable} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-40 ${active ? "border border-neutral-300 bg-white text-neutral-800" : "bg-neutral-900 text-white"}`}>{active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}{pending ? "Aguarde…" : active ? "Desativar" : "Ativar"}</button>
        </div>
      )}
      {message && <p role="status" className="text-sm text-neutral-600">{message}</p>}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Dispositivos registrados</h3>
        <div className="mt-2 divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {devices.length === 0 ? <p className="p-4 text-sm text-neutral-500">Nenhum dispositivo registrado.</p> : devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between gap-3 p-3"><div className="flex min-w-0 items-center gap-3"><Smartphone className="h-4 w-4 shrink-0 text-neutral-500" /><div className="min-w-0"><p className="truncate text-sm font-medium text-neutral-800">{device.device_label}</p><p className="text-xs text-neutral-500">Último uso {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(device.ultimo_uso_em))}</p></div></div>{device.ativo ? <button type="button" disabled={pending} onClick={() => revoke(device)} className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 disabled:opacity-40">Revogar</button> : <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">Inativo</span>}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function disableCurrentAdminPush(): Promise<{ ok: boolean; error?: string }> {
  if (!("serviceWorker" in navigator)) return { ok: true };
  const registration = await navigator.serviceWorker.getRegistration("/admin/");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return { ok: true };
  const result = await deactivateAdminPushSubscription(subscription.endpoint);
  await subscription.unsubscribe();
  return result;
}

function isAdminOrigin() {
  return window.location.hostname === "admin.berkahn.com.br"
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1";
}

function deviceLabel() {
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  return `${mobile ? "Celular" : "Computador"} · ${navigator.platform || "navegador"}`.slice(0, 80);
}

function urlBase64ToUint8Array(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let index = 0; index < raw.length; index += 1) output[index] = raw.charCodeAt(index);
  return output;
}
