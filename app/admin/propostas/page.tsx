import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, Construction } from "lucide-react";

export default function PropostasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500">
            Gerencie propostas de orçamento para clientes
          </p>
        </div>
        <Link href="/admin/propostas/new">
          <Button className="bg-neutral-900 hover:bg-neutral-800">
            <Plus className="h-4 w-4 mr-2" />
            Nova Proposta
          </Button>
        </Link>
      </div>

      {/* Under Construction */}
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-amber-50 rounded-full mb-4">
            <Construction className="h-12 w-12 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Em Desenvolvimento
          </h2>
          <p className="text-neutral-500 max-w-md mb-6">
            O módulo de propostas está em desenvolvimento. Em breve você poderá
            criar, gerenciar e enviar propostas de orçamento diretamente pelo painel.
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <span className="flex items-center gap-1">
              <FileSpreadsheet className="h-4 w-4" />
              CRUD de propostas
            </span>
            <span>•</span>
            <span>Template PDF</span>
            <span>•</span>
            <span>Envio por email</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
