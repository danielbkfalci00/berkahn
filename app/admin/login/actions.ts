"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/supabase/sessao";

/**
 * Autenticação do admin, no servidor.
 *
 * Até 2026-07-31 isto vivia em `components/admin/LoginForm.tsx`, que é um
 * Client Component: a senha da conta Supabase era uma constante de módulo e ia
 * inteira para o bundle. Verificado em produção — estava legível num `curl` ao
 * chunk `/_next/static/chunks/app/admin/login/page-*.js`. E a comparação
 * `if (code !== ACCESS_CODE)` era teatro, porque rodava no código do atacante.
 *
 * Pior: aquela string não era um portão da aplicação, era a senha da conta
 * Supabase Auth. Quem a lesse autenticava direto contra a API do Supabase, sem
 * passar por aqui, e recebia um JWT `authenticated` — que sob as políticas de
 * RLS dá CRUD em posts, orçamentos, propostas, apresentações e comentários.
 *
 * Agora o que o usuário digita é enviado ao servidor e repassado ao Supabase,
 * que verifica. Consequência deliberada: **não existe segredo no repositório
 * nem no ambiente**. A senha vive só no Supabase, e rotacionar é trocá-la lá —
 * sem variável de ambiente para manter em sincronia.
 */

// Não é segredo: este endereço está no rodapé do site público. O segredo é a
// senha. Fica aqui, e não numa env var, para o login não depender de
// configuração que alguém pode esquecer de definir num ambiente novo.
export async function entrar(email: string, senha: string): Promise<{ erro: string | null }> {
  if (!email.trim() || !senha) return { erro: "Informe email e senha." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    if (error) {
      // Mensagem genérica de propósito. Distinguir "senha errada" de "conta
      // inexistente" ou de erro de configuração entrega informação a quem
      // está tentando adivinhar. O detalhe fica no log do servidor.
      console.error("[admin login] falha na autenticação:", error.message);
      return { erro: "Email ou senha inválidos." };
    }

    const session = await getAdminSession();
    if (!session) {
      await supabase.auth.signOut();
      return { erro: "Esta conta não possui acesso ativo ao admin." };
    }

    return { erro: null };
  } catch (e) {
    // Cai aqui quando as variáveis do Supabase faltam: `lib/supabase/server.ts`
    // usa `!` nas duas e o cliente lança na construção.
    console.error("[admin login] erro inesperado:", e);
    return { erro: "Não foi possível entrar. Tente novamente." };
  }
}

export async function solicitarRedefinicao(email: string): Promise<{ erro: string | null; mensagem?: string }> {
  const clean = email.trim().toLowerCase();
  if (!clean) return { erro: "Informe seu email." };
  const supabase = await createClient();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "https://admin.berkahn.com.br";
  const { error } = await supabase.auth.resetPasswordForEmail(clean, {
    redirectTo: `${adminUrl}/auth/callback?next=/admin/definir-senha`,
  });
  if (error) {
    console.error("[admin reset] falha:", error.message);
  }
  return { erro: null, mensagem: "Se a conta estiver ativa, você receberá um link para definir uma nova senha." };
}
