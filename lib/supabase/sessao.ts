import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const BERKAHN_ADMIN_EMAIL = "contato.berkahn@gmail.com";

/**
 * Barreira de autenticação para route handlers sob /api/admin.
 *
 * O middleware já barra essas rotas, mas ele depende de um `matcher` estar
 * correto — e essa configuração já falhou uma vez: o matcher era
 * `['/', '/admin/:path*']` e não cobria `/api/admin/*`, deixando seis rotas
 * abertas na internet, três delas usando service key. Esta checagem local é a
 * segunda barreira, para que a garantia não dependa de um arquivo distante.
 *
 * Devolve `null` quando há sessão, ou a resposta 401 pronta para retornar:
 *
 *   const barrado = await exigirSessao()
 *   if (barrado) return barrado
 */
export async function exigirSessao(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== BERKAHN_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}
