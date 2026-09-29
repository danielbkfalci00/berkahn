"use client";

import { useEffect } from "react";
import Link from "next/link";

// A recuperação de uma rota não precisa derrubar a navegação do ADMIN.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Falha no ADMIN", error); }, [error]);
  return <section role="alert" className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-white p-6">
    <h1 className="text-lg font-semibold text-neutral-950">Não foi possível carregar esta tela</h1>
    <p className="mt-2 text-sm text-neutral-600">Tente novamente. Se a falha continuar, você pode voltar ao início do ADMIN.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={reset} className="min-h-11 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white">Tentar novamente</button>
      <Link href="/admin" className="inline-flex min-h-11 items-center rounded-md border border-neutral-300 px-4 text-sm">Ir ao início</Link>
    </div>
    {error.digest && <p className="mt-4 text-xs text-neutral-500">Referência: {error.digest}</p>}
  </section>;
}
