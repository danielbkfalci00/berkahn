import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Presentation } from "lucide-react";

export default function ApresentacoesPage() {
  return (
    <div className="space-y-6">
      <p className="text-neutral-500">Material disponível para apresentar a Berkahn aos clientes.</p>
      <Card className="max-w-2xl p-6">
        <Presentation className="h-7 w-7 text-neutral-600" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-neutral-900">Apresentação executiva</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Conheça a empresa, o sistema construtivo e o portfólio de projetos.
        </p>
        <Button className="mt-5 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white" asChild>
          <Link href="/apresentacao-executiva" target="_blank" rel="noopener noreferrer">
            Abrir apresentação <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
