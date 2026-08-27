import type { AdminRole } from "@/types/analytics";

export const ADMIN_ROLES: AdminRole[] = ["owner", "comercial", "conteudo", "viewer"];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Proprietário",
  comercial: "Comercial",
  conteudo: "Conteúdo",
  viewer: "Somente leitura",
};

export function roleCanAccessPath(role: AdminRole, pathname: string): boolean {
  if (role === "owner") return true;
  if (
    pathname === "/admin"
    || pathname.startsWith("/admin/configuracoes")
    || pathname.startsWith("/admin/analytics")
  ) return true;
  if (role === "comercial") {
    return ["/admin/leads", "/admin/orcamentos", "/admin/propostas"].some((prefix) => pathname.startsWith(prefix));
  }
  if (role === "conteudo") {
    return ["/admin/conteudo", "/admin/posts", "/admin/documentacoes", "/admin/apresentacoes"].some((prefix) => pathname.startsWith(prefix));
  }
  return pathname.startsWith("/admin/documentacoes");
}
