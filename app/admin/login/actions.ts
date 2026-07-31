"use server";

import { createClient } from "@/lib/supabase/server";

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
const ADMIN_EMAIL = "contato.berkahn@gmail.com";

export async function entrar(senha: string): Promise<{ erro: string | null }> {
  if (!senha) return { erro: "Digite o código de acesso." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: senha,
    });

    if (error) {
      // Mensagem genérica de propósito. Distinguir "senha errada" de "conta
      // inexistente" ou de erro de configuração entrega informação a quem
      // está tentando adivinhar. O detalhe fica no log do servidor.
      console.error("[admin login] falha na autenticação:", error.message);
      return { erro: "Código de acesso inválido." };
    }

    return { erro: null };
  } catch (e) {
    // Cai aqui quando as variáveis do Supabase faltam: `lib/supabase/server.ts`
    // usa `!` nas duas e o cliente lança na construção.
    console.error("[admin login] erro inesperado:", e);
    return { erro: "Não foi possível entrar. Tente novamente." };
  }
}
