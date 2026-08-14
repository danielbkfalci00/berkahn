---
tipo: context
criado: 2025-12-01
atualizado: 2026-08-14
tags:
  - ai/context
  - project/site
  - domain/admin
ai_summary: Sistema Admin Berkahn com CRM leve em /admin/leads. Migrations 024–029, Edge de retenção e dispatcher Web Push estão ativos em produção; Supabase é a única custódia de PII. Resta o smoke autenticado e ativar a assinatura em um dispositivo do admin.
status: active
escopo: berkahn
---

# Sistema Admin Berkahn

> [!info] Migração para vault
> Este arquivo era duplicado em `Docs/ADMIN_SETUP.md` e `Docs/site/ADMIN_SETUP.md`. Consolidado aqui como fonte única. Referenciado por [[stack-nextjs-supabase]].

## Visão Geral

O Sistema Admin Berkahn é um painel administrativo para gerenciar:
- **Posts de Blog** (Atualidade)
- **Leads e operação comercial**
- **Conteúdo e documentação interna**
- **Orçamentos vinculados a leads**
- **Apresentações Executivas**
- **Propostas de Orçamento**

## Arquitetura

```
berkahn.com.br (Site Público)     admin.berkahn.com.br (Painel Admin)
         │                                    │
         ▼                                    ▼
   Next.js SSG + ISR                   Next.js Dynamic
   (mesmo build, `npm run build`)      server-side
         │                                    │
         └──────────────┬─────────────────────┘
                        │
                   Supabase
              (Database + Auth + Storage)
```

> [!warning] Corrigido em 2026-07-31
> Este diagrama dizia `output: "export"` para o site público, e a seção de
> produção mandava usar `npm run build:static` com output `out`. **Nunca foi o
> que roda.** `vercel.json` define `buildCommand: "npm run build"`, que vale
> para os dois projetos e tem precedência sobre a configuração do dashboard.
> O modo estático foi removido do repositório — ver `next.config.ts`.

## Estrutura de Arquivos

```
app/
├── admin/                    # Rotas do admin
│   ├── layout.tsx           # Layout com sidebar/header
│   ├── page.tsx             # Dashboard
│   ├── login/
│   │   └── page.tsx         # Página de login
│   ├── posts/
│   │   ├── page.tsx         # Lista de posts
│   │   ├── new/page.tsx     # Criar post
│   │   └── [id]/page.tsx    # Editar post
│   ├── propostas/
│   │   └── page.tsx         # Lista de propostas
│   ├── apresentacoes/
│   │   └── page.tsx         # Lista de apresentações
│   └── configuracoes/
│       └── page.tsx         # Configurações
├── ...                       # Outras rotas do site público

components/
├── admin/                    # Componentes do admin
│   ├── AdminLayoutClient.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── DashboardContent.tsx
│   ├── LoginForm.tsx
│   └── posts/
│       ├── PostsTable.tsx
│       └── PostEditor.tsx
├── ...                       # Outros componentes

lib/
├── supabase/                 # Cliente Supabase
│   ├── client.ts            # Cliente para browser
│   ├── server.ts            # Cliente para server
│   ├── middleware.ts        # Middleware de auth
│   └── index.ts             # Re-exports

types/
├── admin.ts                  # Tipos do admin
├── ...                       # Outros tipos

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Schema do banco
```

## Setup Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a URL e a chave anônima do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# URLs
NEXT_PUBLIC_SITE_URL=https://berkahn.com.br
NEXT_PUBLIC_ADMIN_URL=https://admin.berkahn.com.br
```

### 3. Executar Migrations

1. Acesse o SQL Editor no painel do Supabase
2. Cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
3. Execute o script

### 4. Configurar Storage Buckets

No painel do Supabase, vá em Storage e crie os buckets:
- `posts` (público) - para imagens dos posts
- `presentations` (público) - para assets das apresentações
- `proposals` (privado) - para anexos das propostas

### 5. Criar Usuário Admin

No painel do Supabase, vá em Authentication > Users e crie um usuário com email/senha.

## Desenvolvimento

### Rodar em desenvolvimento

```bash
npm run dev
```

O admin estará disponível em `http://localhost:3000/admin`

### Build

```bash
# Único build. Serve os dois domínios.
npm run build
```

## Configuração de Produção

Dois projetos Vercel apontando para o **mesmo repositório e o mesmo build**:

| Projeto | Domínio | Build |
|---|---|---|
| `berkahn` | `berkahn.com.br` | `npm run build` (de `vercel.json`) |
| `berkahn-admin` | `admin.berkahn.com.br` | `npm run build` (de `vercel.json`) |

O que separa os dois é o **middleware**, não o build: `middleware.ts` tem matcher
`['/', '/admin/:path*']` e exige sessão em tudo sob `/admin`. O output é `.next`
nos dois.

### Opção 2: Projeto Único

Configure um único projeto Vercel com o build completo:
- Domains: `berkahn.com.br`, `admin.berkahn.com.br`
- Build Command: `npm run build`

### Configurar DNS na Hostinger

1. Acesse o painel da Hostinger
2. Vá em DNS Zone
3. Adicione registro CNAME:
   - Nome: `admin`
   - Aponta para: `cname.vercel-dns.com`

## Módulos

### CRM de leads

`/admin/leads` é a fila operacional única. A Inbox usa paginação server-side de 25; o Kanban carrega até 150 resultados filtrados e oferece drag-and-drop mais seletor acessível. Busca, filtros, badge de não visualizados e KPIs por coorte de 28 dias são compartilhados. O detalhe concentra contato, origem consentida, funil, responsável, prioridade, último status, próxima ação, timeline, retry da notificação, arquivos e vínculos comerciais. A lista antiga foi removida de `/admin/analytics`, que mantém somente agregados e aprendizado.

O funil canônico é `novo` → `em_contato` → `qualificado` → `proposta_enviada` → `convertido`, com `desqualificado` exigindo motivo. `qualificado_em` registra a primeira qualificação e não é apagado por regressão posterior; `convertido_em` representa fechamento efetivo. Cadastro manual aceita WhatsApp, telefone, email e indicação, mostra candidatos a duplicidade e nunca dispara GA4.

As mutações de funil vivem em RPCs transacionais da migration `024_leads_crm_supabase.sql`; `027_lead_operations_artifacts.sql` acrescenta equipe, prioridade, resumo operacional e anexos, e `029_lead_artifact_atomic_delete.sql` torna a remoção do vínculo + entrada na fila de Storage uma única transação. Logs usam `Lead <prefixo-do-UUID>` em `entity_name`; PII e notas ficam em `details` e seguem a retenção. A migration 026 restringe leads, logs, orçamentos, propostas, apresentações e documentos ao email administrativo canônico — apenas possuir um JWT `authenticated` não basta. A matriz anon / authenticated não autorizado / admin / service role, a reversão atômica, a fila de arquivos e o payload push sem PII são verificados por `npm run test:leads`.

Arquivos de até 6 MB (`PDF`, `DOCX`, `XLSX`, `JPEG`, `PNG`, `WebP`) usam upload assinado direto ao bucket privado `lead-files`; o arquivo não atravessa a função Vercel. Arquivos grandes e pastas permanecem no Drive e entram como URL HTTPS. O Drive não é duplicado nem sincronizado automaticamente. Ao anonimizar, links externos são removidos e objetos privados entram em `lead_storage_cleanup` até a Edge Function confirmar a exclusão.

A PWA do admin usa `/admin/manifest.webmanifest` e `/admin-sw.js`, sem cachear telas ou PII. Cada dispositivo opta por Web Push. A outbox `lead_notification_outbox` recebe apenas título, texto, URL genérica e tag; não contém nome, contato ou UUID do lead. Novos contatos e próximas ações vencidas são deduplicados. As chaves abaixo foram configuradas nos dois projetos Vercel em 2026-08-14:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT=mailto:administrativo@berkahn.com.br
LEAD_PUSH_CRON_SECRET
```

O mesmo `LEAD_PUSH_CRON_SECRET` está no Supabase Vault como `lead_push_cron_secret`. O job `berkahn-lead-push-dispatch` (job 1) chama `https://admin.berkahn.com.br/api/admin/push/dispatch` a cada 15 minutos. A primeira execução automática, em 2026-08-14 às 12:30 UTC, terminou como `succeeded` e recebeu HTTP 200, sem timeout ou erro. O dispatcher é aceito sem cookie somente nessa rota e autentica por segredo constante; no domínio público `/api/admin/**` continua 404. Para receber notificações, cada navegador ainda precisa abrir `/admin/configuracoes` autenticado e ativar a assinatura.

Orçamentos e propostas têm `lead_id`. “Criar orçamento” abre o wizard existente com contato e vínculo preenchidos; salvar rascunho não move o funil e finalizar somente registra atividade. O módulo de propostas continua placeholder.

Importação histórica: `node --env-file=.env.local scripts/leads/import-leads-csv.mjs --file=C:\\caminho-fora-do-repo\\leads.csv --dry-run`, seguido de `--apply`. O identificador `sheet:<hash-do-arquivo>:<linha>` torna a repetição idempotente sem fundir linhas repetidas. O script não imprime PII.

Retenção: leads não convertidos, sem exceção e sem atualização por 24 meses são candidatos. A RPC revalida e bloqueia o registro, anonimiza transacionalmente lead, logs, orçamentos, propostas, resumo operacional e vínculos externos. PDFs de orçamento ficam em `retencao_storage_pendente`; uploads de lead ficam em `lead_storage_cleanup`. Só depois a Edge Function `lead-retention` remove os objetos dos buckets `orcamento-pdfs` e `lead-files`; falhas preservam os paths para retry. Em 2026-08-14, a função foi publicada na versão 1 sem verificação JWT, protegida por `RETENTION_CRON_SECRET` no ambiente da Edge e `lead_retention_cron_secret` no Vault. O job `berkahn-lead-retention-monthly` (job 2) roda às 03:15 no primeiro dia de cada mês. O rollout encontrou zero candidatos e zero objetos pendentes; não foi feita execução destrutiva manual.

### Posts de Blog

O módulo de posts permite:
- Criar/editar posts em Markdown
- Upload de imagens
- Categorização e tags
- Agendamento de publicação
- Preview em tempo real

### Apresentações (Em Desenvolvimento)

O módulo de apresentações permitirá:
- Criar slides interativos
- Compartilhar via link único
- Rastrear visualizações
- Exportar para PDF

### Propostas (Em Desenvolvimento)

O módulo de propostas permitirá:
- Criar orçamentos detalhados
- Enviar por email
- Rastrear status (enviado, visualizado, aprovado)
- Gerar relatórios

## Integrações

### Integrações operacionais

- Supabase é fonte única de leads e PII.
- Google Sheets e Apps Script estão desativados; alertas opcionais usam Web Push sem PII — ver [[google-sheets]].
- n8n não participa do fluxo de leads atual.

### Vercel Deploy Hook

Configure um deploy hook no Vercel para rebuild automático:
1. Vá em Project Settings > Git > Deploy Hooks
2. Crie um hook e adicione a URL em `.env.local`:
   ```
   VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
   ```

## Segurança

- **Autenticação**: Supabase Auth com email/senha
- **RLS**: Row Level Security em todas as tabelas
- **Middleware**: Proteção de rotas `/admin/*`
- **HTTPS**: Obrigatório via Vercel

## Troubleshooting

### Erro de login "Invalid API key"
Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas.

### Erro "Cannot read properties of null (reading 'getUser')"
O Supabase não está inicializado corretamente. Verifique as variáveis de ambiente.

### Página de admin retorna 404
Verifique se o middleware está ativo e se a rota está sob `/admin`. (Até
2026-07-31 esta seção culpava `output: "export"`, que não existe mais no
projeto.)
