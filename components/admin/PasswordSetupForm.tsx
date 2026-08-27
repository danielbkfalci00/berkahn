"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PasswordSetupForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use pelo menos oito caracteres.");
    if (password !== confirmation) return setError("As senhas não coincidem.");
    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) return setError("Não foi possível definir a senha. Solicite um novo link.");
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <label className="block space-y-1 text-sm font-medium text-neutral-700"><span>Nova senha</span><input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 px-3 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200" /></label>
      <label className="block space-y-1 text-sm font-medium text-neutral-700"><span>Confirmar senha</span><input type="password" required minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 px-3 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200" /></label>
      <button disabled={pending} className="h-11 w-full rounded-md bg-neutral-900 text-sm font-medium text-white disabled:opacity-50">{pending ? "Salvando…" : "Salvar senha"}</button>
    </form>
  );
}
