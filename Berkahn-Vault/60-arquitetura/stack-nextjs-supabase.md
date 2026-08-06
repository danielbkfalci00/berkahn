---
tipo: context
criado: 2026-05-21
atualizado: 2026-08-06
tags:
  - ai/context
  - project/site
  - domain/architecture
ai_summary: Stack técnica do site Berkahn (visão executiva). Next.js + React + Tailwind no frontend, Supabase como CMS + auth, Vercel deploy. Integrações Google Sheets, Apps Script. Componentes interativos via JSONB.
status: active
escopo: berkahn
---

# Stack Berkahn — Next.js + Supabase

Visão executiva da arquitetura técnica do site Berkahn.

## Frontend

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js (App Router) |
| UI | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Componentes interativos | 19 componentes React específicos para blog (ver [[article-pipeline]]) |
| Animações | Framer Motion (motion/react) |
| Ícones | Lucide React |
| Charts | Recharts |
| Tipografia | Manrope (Google Fonts) — ver [[design-principles]] |
| Deploy | Vercel |
| Domain | `berkahn.vercel.app` (produção) + custom domain |

## Backend / CMS

| Camada | Tecnologia |
|--------|-----------|
| CMS | Supabase (PostgreSQL) — tabelas `posts`, `proposals`, `presentations`, `analytics_snapshots`, `analytics_tasks`, `orcamentos` (esta última: estimativas preliminares PDF, ver [[orcamento-automacao]]) |
| Auth | Supabase Auth (admin panel) |
| RLS | Row Level Security ativo em todas as tabelas |
| API | Supabase REST + Server Actions Next.js |
| Service Role | Server-side ONLY, em `.env` (ver [[supabase-config]]). Helper tipado: `createServiceClient()` em `lib/supabase/admin.ts` |
| Geração de PDF | `puppeteer-core` + `@sparticuz/chromium` serverless. Helper compartilhado em `lib/puppeteer-launch.ts` com fallback `CHROME_LOCAL_PATH` em dev. Usado por `/orcamento/pdf` (LSF) e `/orcamento/estimativa/[id]` (gated por HMAC — ver [[orcamento-automacao]]) |

## Painel Admin

Painel Next.js separado para gerenciar posts, leads, dashboard, **orçamentos** (`/admin/orcamentos` — wizard de 5 steps + upload de hero + geração de PDF). Detalhes em [[admin-setup]] e [[orcamento-automacao]].

## Integrações Externas

| Integração | Função | Doc |
|------------|--------|-----|
| Google Sheets via Apps Script | Captura leads do formulário de contato | [[google-sheets]] |
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
