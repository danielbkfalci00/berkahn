import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Presentation, Construction } from "lucide-react";

export default function ApresentacoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Crie e gerencie apresentações executivas para clientes
          </p>
        </div>
        <Link href="/admin/apresentacoes/new">
          <Button className="bg-neutral-900 hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Nova Apresentação
          </Button>
        </Link>
      </div>

      {/* Under Construction */}
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-purple-50 rounded-full mb-4">
            <Construction className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Em Desenvolvimento
          </h2>
          <p className="text-neutral-500 max-w-md mb-6">
            O módulo de apresentações está em desenvolvimento. Em breve você poderá
            criar apresentações interativas com slides personalizados para clientes.
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <span className="flex items-center gap-1">
              <Presentation className="h-4 w-4" />
              Builder de slides
            </span>
            <span>•</span>
            <span>Link compartilhável</span>
            <span>•</span>
            <span>Analytics</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
