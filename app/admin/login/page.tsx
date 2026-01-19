import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">BERKAHN</h1>
          <p className="text-sm text-neutral-500 mt-1">Painel Administrativo</p>
        </div>

        {/* Login form */}
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-luxury-md p-8 animate-pulse">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-neutral-200 rounded" />
                  <div className="h-11 bg-neutral-100 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-neutral-200 rounded" />
                  <div className="h-11 bg-neutral-100 rounded-lg" />
                </div>
                <div className="h-11 bg-neutral-200 rounded-lg" />
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          © {new Date().getFullYear()} Berkahn. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
