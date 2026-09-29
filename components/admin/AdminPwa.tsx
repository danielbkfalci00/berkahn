"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff, Download, Smartphone } from "lucide-react";
import {
  deactivateAdminPushSubscription,
  getCurrentAdminPushState,
  revokeAdminPushDevice,
  saveAdminPushSubscription,
} from "@/app/admin/leads/actions";
import { updateOwnNotificationPreferences } from "@/app/admin/configuracoes/actions";

export interface AdminPushDevice {
  id: string;
  device_label: string;
  ativo: boolean;
  ultimo_uso_em: string;
  // Só as linhas do próprio usuário chegam aqui (RLS); o endpoint serve para
  // reconhecer qual registro é este navegador.
  endpoint: string;
}

type PushMessage = { kind: "ok" | "error"; text: string };

// navigator.serviceWorker.ready nunca resolve sem SW registrado no escopo;
// o limite evita o botão preso em "Aguarde…".
const SW_READY_TIMEOUT_MS = 10_000;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_PROMPT_CHANGED = "admin-pwa:install-prompt-changed";
let pendingInstallPrompt: BeforeInstallPromptEvent | null = null;

export function AdminPwaRegistration() {
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      pendingInstallPrompt = event as BeforeInstallPromptEvent;
      window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGED));
    };
    const clear = () => {
      pendingInstallPrompt = null;
      window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGED));
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", clear);
    if ("serviceWorker" in navigator && isAdminOrigin()) {
      void navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" }).catch(() => { /* O CRM continua disponível sem push. */ });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", clear);
    };
  }, []);
  return null;
}

export function AdminPushSettings({ devices, configured, canReceivePush, preferences, devicesUnavailable = false }: {
  devicesUnavailable?: boolean;
  devices: AdminPushDevice[];
  configured: boolean;
  canReceivePush: boolean;
  preferences: { novosLeads: boolean; acoesVencidas: boolean };
}) {
  const router = useRouter();
  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<PushMessage | null>(null);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);
  const [novosLeads, setNovosLeads] = useState(preferences.novosLeads);
  const [acoesVencidas, setAcoesVencidas] = useState(preferences.acoesVencidas);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const available = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(available);
    if (!available) return;
    let cancelled = false;
    void withPushTimeout((async () => {
      const subscription = await getLocalSubscription();
      const result = subscription ? await getCurrentAdminPushState(subscription.endpoint) : null;
      if (cancelled) return;
      setCurrentEndpoint(subscription?.endpoint ?? null);
      setActive(Boolean(subscription && result?.ok && result.active));
      setCurrentDeviceId(result?.deviceId ?? null);
      if (result && !result.ok) setMessage({ kind: "error", text: "Não foi possível conferir o registro deste dispositivo. Tente ativá-lo novamente." });
    })()).catch(() => {
      if (!cancelled) setMessage({ kind: "error", text: "Não foi possível consultar as notificações deste navegador." });
    });
    return () => { cancelled = true; };
  }, [devices]);

  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const syncPrompt = () => setInstallPrompt(pendingInstallPrompt);
    syncPrompt();
    const complete = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener(INSTALL_PROMPT_CHANGED, syncPrompt);
    window.addEventListener("appinstalled", complete);
    return () => {
      window.removeEventListener(INSTALL_PROMPT_CHANGED, syncPrompt);
      window.removeEventListener("appinstalled", complete);
    };
  }, []);

  async function enable() {
    if (pending) return;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      setMessage({ kind: "error", text: "Os alertas ainda não estão disponíveis." });
      return;
    }
    setPending(true);
    setMessage(null);
    try {
      // Checa o registro antes de pedir permissão: sem ele, a permissão do SO
      // seria gasta e o ready nunca resolveria.
      if (!isAdminOrigin() || !await navigator.serviceWorker.getRegistration("/admin/")) {
        throw new Error("Alertas só funcionam no endereço admin.berkahn.com.br. Abra o admin por lá e tente de novo.");
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permissão de notificação negada. Libere as notificações deste site nas configurações do navegador e tente de novo.");
      }
      const registration = await withPushTimeout(navigator.serviceWorker.ready);
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
      setCurrentEndpoint(subscription.endpoint);
      setMessage({ kind: "ok", text: "Notificações ativadas neste dispositivo." });
      router.refresh();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Falha ao ativar notificações." });
    } finally {
      setPending(false);
    }
  }

  async function perform(operation: () => Promise<void>) {
    if (pending) return;
    setPending(true);
    setMessage(null);
    try { await operation(); }
    catch (error) { setMessage({ kind: "error", text: error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente." }); }
    finally { setPending(false); }
  }

  async function syncLocalState() {
    const subscription = await withPushTimeout(getLocalSubscription());
    setCurrentEndpoint(subscription?.endpoint ?? null);
    if (!subscription) {
      setActive(false);
      setCurrentDeviceId(null);
    }
  }

  async function disable() {
    await perform(async () => {
      const result = await disableCurrentAdminPush();
      await syncLocalState().catch(() => { /* O resultado abaixo informa a falha parcial. */ });
      router.refresh();
      if (!result.ok) throw new Error(result.error || "Não foi possível desativar as notificações.");
      setActive(false);
      setCurrentDeviceId(null);
      setCurrentEndpoint(null);
      setMessage({ kind: "ok", text: "Notificações desativadas neste dispositivo." });
    });
  }

  async function revoke(device: AdminPushDevice) {
    if (pending) return;
    const isCurrent = device.id === currentDeviceId || device.endpoint === currentEndpoint;
    const warning = isCurrent
      ? `Revogar "${device.device_label}"? Este é o aparelho em uso e ele deixará de receber alertas.`
      : `Revogar "${device.device_label}"? Esse aparelho deixará de receber alertas.`;
    if (!window.confirm(warning)) return;
    await perform(async () => {
      const result = isCurrent ? await disableCurrentAdminPush() : await revokeAdminPushDevice(device.id);
      if (isCurrent) await syncLocalState().catch(() => { /* O resultado abaixo informa a falha parcial. */ });
      router.refresh();
      if (!result.ok) throw new Error(result.error || "Não foi possível revogar o dispositivo.");
      if (isCurrent) {
        setActive(false);
        setCurrentDeviceId(null);
        setCurrentEndpoint(null);
      }
      setMessage({ kind: "ok", text: "Dispositivo revogado." });
    });
  }

  async function savePreferences() {
    await perform(async () => {
      const result = await updateOwnNotificationPreferences({ novosLeads, acoesVencidas });
      if (!result.ok) throw new Error(result.error || "Não foi possível salvar as preferências.");
      setMessage({ kind: "ok", text: "Preferências de alerta salvas." });
      router.refresh();
    });
  }

  async function install() {
    if (!installPrompt || pending) return;
    setPending(true);
    setMessage(null);
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setMessage({ kind: "ok", text: "Admin instalado neste dispositivo." });
    } catch {
      setMessage({ kind: "error", text: "O navegador não abriu a instalação. Use o menu do Chrome ou Edge para instalar este site como aplicativo." });
    } finally {
      pendingInstallPrompt = null;
      setInstallPrompt(null);
      window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGED));
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-medium text-neutral-900">Aplicativo Berkahn Admin</p><p className="mt-0.5 text-sm text-neutral-500">Instale para abrir em tela própria e receber alertas neste dispositivo.</p></div>
        {installed ? <span className="text-sm font-medium text-emerald-700">Instalado</span> : installPrompt ? <button type="button" disabled={pending} onClick={install} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white"><Download className="h-4 w-4" />Instalar</button> : <p className="max-w-sm text-xs leading-relaxed text-neutral-600">No PC, abra admin.berkahn.com.br/admin diretamente no Chrome ou Edge e use o ícone de instalação na barra de endereço ou o menu ⋮ → Instalar este site como app. Navegadores integrados podem não oferecer essa opção. No iPhone, use Compartilhar → Adicionar à Tela de Início.</p>}
      </div>
      {!configured && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">O aplicativo pode ser instalado. Os alertas ainda não estão disponíveis.</p>}
      {configured && !supported && <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">Este navegador não oferece Web Push. O CRM continua funcionando normalmente.</p>}
      {!canReceivePush && <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-600">Alertas de leads são enviados só para os papéis Comercial e Owner.</p>}
      {canReceivePush && configured && supported && (
        <div className="flex flex-col gap-4 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-neutral-900">Este dispositivo</p>
            <p className="mt-0.5 text-sm text-neutral-500">Novos leads e próximas ações vencidas, sem nome ou contato na notificação.</p>
          </div>
          <button type="button" disabled={pending} onClick={active ? disable : enable} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-40 ${active ? "border border-neutral-300 bg-white text-neutral-800" : "bg-neutral-900 text-white"}`}>{active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}{pending ? "Aguarde…" : active ? "Desativar" : "Ativar"}</button>
        </div>
      )}
      {message && (message.kind === "error"
        ? <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{message.text}</p>
        : <p role="status" className="text-sm text-neutral-600">{message.text}</p>)}
      {canReceivePush && <>
      <fieldset disabled={pending} className="rounded-md border border-neutral-200 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Alertas que quero receber</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={novosLeads} onChange={(event) => setNovosLeads(event.target.checked)} />Novos leads</label>
          <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={acoesVencidas} onChange={(event) => setAcoesVencidas(event.target.checked)} />Ações vencidas</label>
        </div>
        <button type="button" disabled={pending} onClick={savePreferences} className="mt-4 rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium disabled:opacity-40">Salvar preferências</button>
      </fieldset>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Dispositivos registrados</h3>
        <div className="mt-2 divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {devicesUnavailable ? <p role="alert" className="p-4 text-sm text-amber-800">Não foi possível carregar os dispositivos. Atualize a página para tentar novamente.</p> : devices.length === 0 ? <p className="p-4 text-sm text-neutral-500">Nenhum dispositivo registrado.</p> : devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between gap-3 p-3"><div className="flex min-w-0 items-center gap-3"><Smartphone className="h-4 w-4 shrink-0 text-neutral-500" /><div className="min-w-0"><p className="truncate text-sm font-medium text-neutral-800">{device.device_label}{device.endpoint === currentEndpoint && <span className="ml-1.5 text-xs font-normal text-neutral-500">(este aparelho)</span>}</p><p className="text-xs text-neutral-500">Último uso {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(device.ultimo_uso_em))}</p></div></div>{device.ativo ? <button type="button" disabled={pending} onClick={() => revoke(device)} className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-neutral-300 px-3 text-xs font-medium text-neutral-700 disabled:opacity-40">Revogar</button> : <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">Inativo</span>}</div>
          ))}
        </div>
      </div>
      </>}
    </div>
  );
}

export async function disableCurrentAdminPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    return await withPushTimeout((async () => {
      if (!("serviceWorker" in navigator)) return { ok: true };
      const registration = await navigator.serviceWorker.getRegistration("/admin/");
      const subscription = await registration?.pushManager.getSubscription();
      if (!subscription) return { ok: true };
      // Desliga localmente mesmo se o servidor estiver indisponível.
      const results = await Promise.allSettled([
        deactivateAdminPushSubscription(subscription.endpoint), subscription.unsubscribe(),
      ]);
      const server = results[0];
      const browser = results[1];
      if (browser.status === "rejected" || (server.status === "fulfilled" && !server.value.ok) || server.status === "rejected") {
        return { ok: false, error: "A desativação não foi confirmada em todos os lugares. Tente novamente ou revogue este dispositivo na lista." };
      }
      return { ok: true };
    })());
  } catch {
    return { ok: false, error: "A desativação demorou mais que o esperado. Tente novamente." };
  }
}

async function withPushTimeout<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("O serviço de notificações não respondeu. Atualize a página e tente novamente.")), SW_READY_TIMEOUT_MS); }),
    ]);
  } finally { if (timer) clearTimeout(timer); }
}

async function getLocalSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  const registration = await navigator.serviceWorker.getRegistration("/admin/");
  return await registration?.pushManager.getSubscription() ?? null;
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
