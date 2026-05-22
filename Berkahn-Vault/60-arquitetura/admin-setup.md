---
tipo: context
criado: 2025-12-01
atualizado: 2026-05-21
tags:
  - ai/context
  - project/site
  - domain/admin
ai_summary: Sistema Admin Berkahn (Next.js + Supabase) — painel administrativo para gerenciar posts, leads, dashboard. Stack, setup inicial, RLS, autenticação, comandos de dev. Deduplicado de Docs/site/ (única fonte agora).
status: active
escopo: berkahn
---

# Sistema Admin Berkahn

> [!info] Migração para vault
> Este arquivo era duplicado em `Docs/ADMIN_SETUP.md` e `Docs/site/ADMIN_SETUP.md`. Consolidado aqui como fonte única. Referenciado por [[stack-nextjs-supabase]].

## Visão Geral

O Sistema Admin Berkahn é um painel administrativo para gerenciar:
- **Posts de Blog** (Atualidade)
- **Apresentações Executivas**
- **Propostas de Orçamento**

## Arquitetura

```
berkahn.com.br (Site Público)     admin.berkahn.com.br (Painel Admin)
         │                                    │
         ▼                                    ▼
   Next.js Static                      Next.js Dynamic
   output: "export"                    server-side
         │                                    │
         └──────────────┬─────────────────────┘
                        │
                   Supabase
              (Database + Auth + Storage)
```

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
# Build completo (site + admin)
npm run build

# Build apenas site público (estático)
npm run build:static

# Build apenas admin (dinâmico)
npm run build:admin
```

## Configuração de Produção

### Opção 1: Dois Projetos Vercel (Recomendado)

Configure dois projetos no Vercel apontando para o mesmo repositório:

**Projeto 1: Site Público**
- Domain: `berkahn.com.br`
- Build Command: `npm run build:static`
- Output Directory: `out`

**Projeto 2: Admin**
- Domain: `admin.berkahn.com.br`
- Build Command: `npm run build:admin`
- (sem output directory - usa o padrão do Next.js)

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

### n8n (Automação)

Configure webhooks no n8n para:
- Notificações de novas propostas
- Trigger de rebuild quando posts são publicados
- Backup automático para Google Sheets

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
O build pode ter sido feito com `output: "export"`. Use `npm run build` ou `npm run build:admin`.
