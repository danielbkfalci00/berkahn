const EDITORIAL_LISTS = new Set(["/admin/posts", "/admin/conteudo"]);
const PAUTA_PATH = /^\/admin\/conteudo\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INTERNAL_ORIGIN = "https://admin.invalid";

/** Only editorial lists and pauta details can be return destinations. */
export function editorialReturnTo(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value || value.length > 4096) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  if (Array.from(value).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return fallback;
  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    const rawPath = value.split(/[?#]/, 1)[0];
    if (url.origin !== INTERNAL_ORIGIN || url.pathname !== rawPath) return fallback;
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
