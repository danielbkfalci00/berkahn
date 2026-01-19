import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Database, Webhook } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <User className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Perfil</h2>
            <p className="text-sm text-neutral-500">
              Informações da sua conta
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
          </div>
          <Button>Salvar alterações</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Bell className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Notificações</h2>
            <p className="text-sm text-neutral-500">
              Configure como deseja receber notificações
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">Email de propostas</p>
              <p className="text-sm text-neutral-500">
                Receber notificações quando propostas forem visualizadas
              </p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
          <Separator />
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">
                Email de apresentações
              </p>
              <p className="text-sm text-neutral-500">
                Receber notificações quando apresentações forem visualizadas
              </p>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
          </label>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Shield className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Segurança</h2>
            <p className="text-sm text-neutral-500">
              Gerencie a segurança da sua conta
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Button>Alterar senha</Button>
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Webhook className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Integrações</h2>
            <p className="text-sm text-neutral-500">
              Conecte com serviços externos
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-neutral-900">Supabase</p>
                <p className="text-sm text-neutral-500">
                  Banco de dados e autenticação
                </p>
              </div>
            </div>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              Conectado
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Webhook className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">n8n</p>
                <p className="text-sm text-neutral-500">
                  Automação de workflows
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Conectar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
