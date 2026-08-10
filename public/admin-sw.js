self.addEventListener("push", (event) => {
  let payload = {
    title: "Berkahn Admin",
    body: "Há uma atualização na operação comercial.",
    url: "/admin/leads",
    tag: "berkahn-admin",
  };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Mantém o fallback genérico; nunca exibe o conteúdo bruto recebido.
  }
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: "/images/logo/icon-192x192.png",
    badge: "/images/logo/icon-192x192.png",
    tag: payload.tag,
    renotify: false,
    data: { url: payload.url },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/admin/leads", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
