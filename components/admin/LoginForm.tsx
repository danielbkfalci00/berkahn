"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { entrar } from "@/app/admin/login/actions";
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
 * sai barrado porque o browser o interpreta como protocolo-relativo.
 */
function destinoSeguro(bruto: string | null): string {
  if (!bruto || !bruto.startsWith("/") || bruto.startsWith("//")) return "/admin";
  return bruto;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destino = destinoSeguro(searchParams.get("redirectTo"));

  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    iniciar(async () => {
      const res = await entrar(codigo);
      if (res.erro) {
        setErro(res.erro);
        return;
      }
      router.push(destino);
      router.refresh();
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-luxury-md p-8">
      <form onSubmit={aoEnviar} className="space-y-6">
        {erro && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="code" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Código de Acesso
          </Label>
          <Input
            id="code"
            type="password"
            placeholder="Digite o código de acesso"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            disabled={enviando}
            className="h-12 text-center text-lg tracking-wider"
            autoComplete="current-password"
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
      </form>
    </div>
  );
}
