---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-29
tags:
  - project/site
  - status/active
ai_summary: Hub do projeto Site — Next.js 15 + Supabase + Vercel em produção (berkahn.com.br). Indexação dos artigos resolvida em 2026-07-29 (34/38); páginas institucionais nunca foram medidas. Ajustes contínuos, novas páginas, refactors, integração admin/Supabase. Code paths em app/, lib/, components/.
status: active
projeto: site
kpi_paginas_indexadas: 34
kpi_paginas_total: 38
kpi_lcp_target_ms: 2500
kpi_fid_target_ms: 100
kpi_cls_target: 0.1
kpi_isr_revalidate_s: 60
kpi_componentes_article: 19
kpi_atualizado_em: 2026-07-29
contextos_aplicados:
  - stack-nextjs-supabase
  - admin-setup
  - design-principles
  - seo-aeo-strategy
  - google-sheets
workflow: workflow-site
prompts_relacionados: []
bases_relacionadas:
  - kpis
subagents_uteis:
  - pragmatic-code-review
  - design-review
  - security-review
code_paths:
  - app/
  - components/
  - lib/
  - public/
  - scripts/
---

# Site — Projeto

> Hub do projeto Site (next-app + admin). Em produção em [berkahn.com.br](https://www.berkahn.com.br). Ajustes contínuos.

## Status atual

Site em produção (Next.js App Router + Supabase + Vercel + Tailwind + shadcn/ui). 16 rotas em `app/` (atualidades, empresa, admin, apresentacao-executiva, etc.). Admin com painel de posts ativo (`app/admin/`). Integração Google Sheets para leads via Apps Script.

**Indexação**: 34 de 38 artigos indexados (89%) em 2026-07-29, contra 6/44 em abril. O pipeline `/performance` inspeciona **só URLs de artigo** — as páginas institucionais (`/empresa`, `/servicos`, `/lsf`, `/portfolio`, etc.) nunca foram medidas. Se isso importar, ampliar `getAllPostUrls()` em `scripts/analytics/lib/posts.mjs`. Ver [[seo-aeo]].

## Bloqueios ativos

- [ ] **PR #17 (institucional v3) pendente merge**: branch `design/institucional-monografia` (rota `/institucional/pdf` + API + 9 componentes). Validar geração do PDF em prod após merge. Ver [[materiais]] + `40-content/materiais/2026-07-09-pdf-institucional/`
- [x] **Indexação Google** (delegado a [[seo-aeo]]): resolvido em 2026-07-29 — 34/38 artigos (89%), contra 6/44 em abril
- [ ] **Bug SearchAction**: gera URL inválida — corrigir
- [ ] **Google Sheets SPOF**: leads sem backup automático em Supabase (mitigado em Fase 4 do plano)
- [ ] **Core Web Vitals**: monitorar LCP < 2.5s, FID < 100ms, CLS < 0.1

## Próximos 7 dias

- [ ] **Merge PR #17** (institucional v3) + validar `/institucional/pdf` gerando PDF em prod
- [ ] Validar build (`npm run build`) sem warnings críticos
- [ ] gitleaks scan pre-commit ativo

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Artigos indexados | 34/38 (89%) | 38 | -4 |
| Páginas institucionais indexadas | não medido | — | ampliar escopo do `/performance` |
| LCP | n/d | < 2500ms | monitorar |
| CLS | n/d | < 0.1 | monitorar |
| ISR revalidate | 60s | 60s | OK |

## Contexto aplicado

- [[stack-nextjs-supabase]] — arquitetura geral (Next.js 15 + Supabase + RLS + Vercel)
- [[admin-setup]] — painel admin, autenticação, schema `posts`
- [[design-principles]] — paleta preto/off-white, Manrope, ícones outline
- [[seo-aeo-strategy]] — regras técnicas SEO (schema, meta, robots)
- [[google-sheets]] — integração leads via Apps Script

## Workflow & prompts

- Workflow: [[workflow-site]] — manutenção, novas páginas, refactors, bugs (criado em Sprint 1.8)
- Prompts: (nenhum específico ainda; usar `/seo` para auditoria)

## Bases relacionadas

- [[kpis.base]] — agrega `kpi_*` do site + outros projetos

## Subagents úteis

- `@pragmatic-code-review` — review de PRs (arquitetura, segurança, qualidade)
- `@design-review` — UI/UX changes (testes Playwright em live env)
- `@security-review` — antes de mexer em auth/payments/data handling

## Code paths (mapeamento com `60-arquitetura/`)

| Path | Conteúdo | Doc vault |
|------|----------|-----------|
| `app/` | 16 rotas Next.js App Router | [[stack-nextjs-supabase]] |
| `components/article/` | 19 componentes interativos | [[article-pipeline]] |
| `components/presentation/` | Slides + UI da /apresentacao-executiva | [[presentation-system]] |
| `lib/` | Utilitários (Supabase client, helpers) | [[stack-nextjs-supabase]] |
| `public/images/img_blog/` | Capas WebP por artigo | — |
| `scripts/articles/` | add-article-*.mjs (25 scripts batch) | [[article-pipeline]] |

## Materiais de apoio

- [[indices-mockups-remodelacao]] — mockups de redesign em `Docs/REMODELAÇÃO/`
- [[paginas-conteudo-v2]] — estratégia de páginas (migrado de Docs/)

## Histórico recente

- 2026-07-20: standup — infra nova do **Documento Institucional PDF**: rota `app/institucional/pdf/`, `GET /api/institucional/pdf`, `components/institucional/pdf/*.tsx` (9 páginas), copy em `lib/institucional-data.ts` (2026-07-09/10). Branch `design/institucional-monografia` → PR #17 pendente merge. Reusa pipeline Puppeteer + `optImg()` (PDF 31MB → 6.7MB).
- 2026-05-22: hub criado
- 2026-05-21: vault migrado, integração documentada em `60-arquitetura/`
