import { PasswordSetupForm } from "@/components/admin/PasswordSetupForm";

export default function DefinirSenhaPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500">Conta Berkahn</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">Defina sua senha</h1>
        <p className="mt-2 text-sm text-neutral-600">Use pelo menos oito caracteres. A nova senha vale para todos os seus dispositivos.</p>
        <PasswordSetupForm />
      </div>
    </div>
  );
}
