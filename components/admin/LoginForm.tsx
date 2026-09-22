"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { entrar, solicitarRedefinicao } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Lock } from "lucide-react";

/**
 * Só coleta o que o usuário digita e entrega para a Server Action. Nenhuma
 * credencial e nenhuma decisão de autorização deste lado — este arquivo vai
 * inteiro para o bundle público.
 */

/**
 * Aceita apenas caminho interno.
 *
 * `redirectTo` vem do middleware como `request.nextUrl.pathname`, mas a URL é
 * editável: `/admin/login?redirectTo=https://exemplo.com` faria o
 * `router.push` levar o usuário para fora depois de autenticar. `//` também
 * sai barrado porque o browser o interpreta como protocolo-relativo, e `\`
 * também, porque o parser de URL trata `/\evil.com` como `//evil.com`. Por
 * isso a checagem final é pela origem resolvida, não pelo texto.
 */
function destinoSeguro(bruto: string | null): string {
  if (!bruto || !bruto.startsWith("/") || bruto.startsWith("//") || bruto.includes("\\")) return "/admin";
  try {
    const url = new URL(bruto, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/admin")) return "/admin";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/admin";
  }
}

// Motivos que chegam por redirect (auth/callback e middleware). Sem isso a
// pessoa cai numa tela de login muda e não sabe por que voltou.
const ERROS_DE_REDIRECT: Record<string, string> = {
  "link-invalido": "O link expirou ou já foi usado. Peça um novo em Esqueci minha senha.",
  "acesso-inativo": "Seu acesso está inativo. Fale com o responsável.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(
    () => ERROS_DE_REDIRECT[searchParams.get("erro") ?? ""] ?? null
  );
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    iniciar(async () => {
      const res = await entrar(email, senha);
      if (res.erro) {
        setErro(res.erro);
        return;
      }
      router.push(destinoSeguro(redirectTo));
      router.refresh();
    });
  }

  function redefinir() {
    setErro(null);
    setMensagem(null);
    iniciar(async () => {
      const result = await solicitarRedefinicao(email);
      if (result.erro) setErro(result.erro);
      else setMensagem(result.mensagem || null);
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-luxury-md p-8">
      <form onSubmit={aoEnviar} className="space-y-6">
        {erro && (
          <div id="login-erro" role="alert" className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {mensagem && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{mensagem}</p>}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={enviando} className="h-12" autoComplete="email" aria-invalid={!!erro} aria-describedby={erro ? "login-erro" : undefined} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={enviando}
            className="h-12"
            autoComplete="current-password"
            aria-invalid={!!erro}
            aria-describedby={erro ? "login-erro" : undefined}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-100 font-medium"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verificando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
        <button type="button" onClick={redefinir} disabled={enviando} className="w-full min-h-11 py-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline disabled:opacity-50">Esqueci minha senha</button>
      </form>
    </div>
  );
}
