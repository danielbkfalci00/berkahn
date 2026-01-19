"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Lock } from "lucide-react";

const ACCESS_CODE = "Berkahn2025@";
const ADMIN_EMAIL = "admin@berkahn.com.br";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate access code
      if (code !== ACCESS_CODE) {
        setError("Código de acesso inválido");
        setIsLoading(false);
        return;
      }

      // Check if environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError("Configuração do servidor incompleta. Verifique as variáveis de ambiente.");
        setIsLoading(false);
        return;
      }

      // Sign in with Supabase using fixed admin credentials
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ACCESS_CODE,
      });

      if (error) {
        console.error("Auth error:", error.message);
        setError(`Erro: ${error.message}`);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-luxury-md p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 text-center text-lg tracking-wider"
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-100 font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
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
