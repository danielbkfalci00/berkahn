---
tipo: context
criado: 2026-05-21
atualizado: 2026-08-12
tags:
  - ai/context
  - project/site
  - domain/architecture
ai_summary: Stack do site Berkahn. Next 16.3 usa fontes self-hosted e árvore npm sem advisories; Supabase concentra CMS, Auth e CRM com RPCs/RLS, arquivos privados e outbox push. Apps Script/Sheets são legado desativado.
status: active
escopo: berkahn
---

# Stack Berkahn — Next.js + Supabase

Visão executiva da arquitetura técnica do site Berkahn.

## Frontend

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.3 (App Router + Turbopack) |
| UI | React 18.3 + TypeScript; React 18 preservado enquanto `react-simple-maps` não declarar suporte a React 19 |
| Styling | Tailwind CSS + shadcn/ui |
| Componentes interativos | 19 componentes React específicos para blog (ver [[article-pipeline]]) |
| Animações | Framer Motion (motion/react) |
| Ícones | Lucide React |
| Charts | Recharts |
| Tipografia | Manrope, Archivo, Space Mono, Caveat e Playfair Display self-hosted via Fontsource; build não acessa Google Fonts — ver [[design-principles]] |
| Deploy | Vercel |
| Domain | `berkahn.vercel.app` (produção) + custom domain |

Baseline de dependências validado em 2026-08-12: Next 16.3, Sharp 0.35.3,
Puppeteer 25.6 e ESLint 9 flat config; `npm audit` retorna zero. O proxy de
sessão usa a convenção `proxy.ts` do Next 16 e o harness local é excluído do
tracing de produção para não empacotar o repositório inteiro.

## Backend / CMS

| Camada | Tecnologia |
|--------|-----------|
| CMS + CRM | Supabase (PostgreSQL) — `posts`, `leads`, `proposals`, `presentations`, `analytics_snapshots`, `analytics_tasks` e `orcamentos` |
| Auth | Supabase Auth (admin panel) |
| RLS | Row Level Security ativo em todas as tabelas |
| API | Supabase REST + Server Actions Next.js |
| Service Role | Server-side ONLY, em `.env` (ver [[supabase-config]]). Helper tipado: `createServiceClient()` em `lib/supabase/admin.ts` |
| Geração de PDF | `puppeteer-core` + `@sparticuz/chromium` serverless. Helper compartilhado em `lib/puppeteer-launch.ts` com fallback `CHROME_LOCAL_PATH` em dev. Usado por `/orcamento/pdf` (LSF) e `/orcamento/estimativa/[id]` (gated por HMAC — ver [[orcamento-automacao]]) |

## Painel Admin

Painel Next.js separado para gerenciar posts, conteúdo, leads, dashboard e **orçamentos** (`/admin/orcamentos` — wizard de 5 steps + upload de hero + geração de PDF). O CRM tem Inbox/Kanban, responsáveis, arquivos privados/Drive e PWA instalável sem cache de PII. Detalhes em [[admin-setup]] e [[orcamento-automacao]].

## Integrações Externas

| Integração | Função | Doc |
|------------|--------|-----|
| Google Sheets via Apps Script | Legado desativado; não participa da captura nem da notificação | [[google-sheets]] |
| Edge Function + pg_cron/pg_net | Retenção e anonimização de leads inativos após 24 meses | [[admin-setup]] |
| Web Push + outbox Supabase | Alertas genéricos de novo lead e próxima ação vencida | [[admin-setup]] |
| Quadro admin | Hub operacional de pautas, Blog e LinkedIn | [[quadro-conteudo]] |
| Canva | Materiais visuais (briefing manual) | [[canva-briefing]] |
| Google Search Console | Indexação + analytics | — |

## Estrutura de Pastas (raiz do projeto)

```
Site Berkahn/
├── Berkahn-Vault/          ← Knowledge base (este vault)
├── .claude/
│   ├── commands/           ← Slash commands (apontam para vault)
│   └── subagents/          ← Subagents (review, security)
├── app/                    ← Next.js App Router (páginas + componentes server)
├── components/             ← Componentes React (article/, presentation/, ui/)
├── lib/                    ← Utils, dados estáticos, helpers
├── public/                 ← Assets estáticos (imagens, infograficos)
│   └── images/img_blog/    ← Capas dos artigos (consumidas pelo Next)
├── scripts/                ← Scripts node; CLI de conteúdo versionado seletivamente
├── tests-playwright/       ← Testes Playwright (Python)
├── data/                   ← Dados estáticos (posts.ts, presentation-data.ts)
├── types/                  ← TypeScript types
├── Docs/                   ← Assets pesados (PDFs, imagens não usadas pelo site, brand/logos/)
├── .env.local              ← Credenciais (gitignored)
├── .env.example            ← Template público
├── .gitleaks.toml          ← Config pre-commit hook
├── vault-manifest.json     ← Config do vault (allowed_projects, paths)
├── CLAUDE.md               ← Instruções projeto-level
└── tailwind.config.ts      ← Config Tailwind (paleta preto/branco)
```

## Workflows ativos

Detalhes em [[workflow-conteudo]]:
- 1 artigo blog + 1 post LinkedIn por semana
- Pipeline: brainstorm → pesquisa → criação → produção → aprovação → publicação
- `/admin/conteudo` = hub operacional

## Comandos críticos

```bash
npm run dev          # dev server (porta 3000+)
npm run build        # build produção
npm run lint         # lint
gitleaks detect      # scan secrets (rodado automaticamente em pre-commit)
```

## Referências

- Admin painel: [[admin-setup]]
- Pipeline blog: [[article-pipeline]]
- Integração Google Sheets: [[google-sheets]]
- Comparativo WordPress: [[blog-infra-vs-wordpress]]
- SEO/AEO: [[seo-aeo-strategy]]
- Brand: [[berkahn-brand]] + [[guia-design-berkahn]]
- Sistema de apresentações: [[presentation-system]]
- Memória técnica: [[supabase-config]], [[git-remote]], [[blog-pipeline]]
