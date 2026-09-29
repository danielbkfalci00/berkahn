const EDITORIAL_LISTS = new Set(["/admin/posts", "/admin/conteudo"]);
const PAUTA_PATH = /^\/admin\/conteudo\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INTERNAL_ORIGIN = "https://admin.invalid";
const COMMERCIAL_LISTS = new Set(["/admin/leads", "/admin/orcamentos"]);
const LEAD_PATH = /^\/admin\/leads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function internalUrl(value: unknown): URL | null {
  if (typeof value !== "string" || !value || value.length > 4096) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (Array.from(value).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return null;
  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    const rawPath = value.split(/[?#]/, 1)[0];
    return url.origin === INTERNAL_ORIGIN && url.pathname === rawPath ? url : null;
  } catch {
    return null;
  }
}

/** Only editorial lists and pauta details can be return destinations. */
export function editorialReturnTo(value: unknown, fallback: string): string {
  try {
    const url = internalUrl(value);
    if (!url) return fallback;
    const isList = EDITORIAL_LISTS.has(url.pathname);
    if (!isList && !PAUTA_PATH.test(url.pathname)) return fallback;

    // An editor can return to its pauta, which in turn returns to the filtered
    // board. Limit that chain to one detail to avoid cycles and growing URLs.
    const parent = url.searchParams.get("returnTo");
    url.searchParams.delete("returnTo");
    if (!isList && parent) {
      const parentPath = parent.split(/[?#]/, 1)[0];
      if (EDITORIAL_LISTS.has(parentPath)) {
        url.searchParams.set("returnTo", editorialReturnTo(parent, "/admin/conteudo"));
      }
    }
    if (url.pathname === "/admin/conteudo") url.searchParams.delete("nova");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

/** A lead returns only to its queue, never to another detail or an editor. */
export function leadsReturnTo(value: unknown): string {
  const url = internalUrl(value);
  if (url?.pathname !== "/admin/leads") return "/admin/leads";
  url.searchParams.delete("returnTo");
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Budget pages carry one originating list or one lead with its queue. */
export function commercialReturnTo(value: unknown, fallback = "/admin/orcamentos"): string {
  const url = internalUrl(value);
  if (!url || (!COMMERCIAL_LISTS.has(url.pathname) && !LEAD_PATH.test(url.pathname))) return fallback;
  const parent = url.searchParams.get("returnTo");
  url.searchParams.delete("returnTo");
  if (LEAD_PATH.test(url.pathname)) {
    // Do not replay the transient send form after visiting a budget again.
    url.searchParams.delete("atendimento");
    url.searchParams.delete("orcamento");
    url.hash = "";
    if (parent) url.searchParams.set("returnTo", leadsReturnTo(parent));
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function commercialHref(path: string, returnTo: string): string {
  const url = new URL(path, INTERNAL_ORIGIN);
  url.searchParams.set("returnTo", commercialReturnTo(returnTo));
  return `${url.pathname}${url.search}${url.hash}`;
}

export function leadHref(id: string, returnTo: string): string {
  const context = internalUrl(returnTo);
  const queue = context?.pathname === `/admin/leads/${id}`
    ? context.searchParams.get("returnTo")
    : returnTo;
  return commercialHref(`/admin/leads/${id}`, leadsReturnTo(queue));
}

export function editorialHref(path: string, returnTo: string): string {
  return `${path}?${new URLSearchParams({ returnTo: editorialReturnTo(returnTo, "/admin/posts") })}`;
}

export function postsListHref(search: string, status: string, page: number): string {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (["draft", "published", "scheduled", "archived"].includes(status)) params.set("status", status);
  if (page > 1 && Number.isFinite(page)) params.set("page", String(Math.floor(page)));
  const query = params.toString();
  return `/admin/posts${query ? `?${query}` : ""}`;
}
