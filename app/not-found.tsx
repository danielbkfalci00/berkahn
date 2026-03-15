import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-lg">
        <p className="text-7xl font-heading font-extrabold text-neutral-200">
          404
        </p>
        <h1 className="mt-4 text-2xl font-heading font-bold text-neutral-900">
          Pagina nao encontrada
        </h1>
        <p className="mt-3 text-neutral-600 leading-relaxed">
          O conteudo que voce procura pode ter sido movido ou nao existe mais.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Pagina inicial
          </Link>
          <Link
            href="/atualidades"
            className="inline-flex items-center px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/servicos"
            className="inline-flex items-center px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            Servicos
          </Link>
          <Link
            href="/perguntas-frequentes"
            className="inline-flex items-center px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </main>
  );
}
