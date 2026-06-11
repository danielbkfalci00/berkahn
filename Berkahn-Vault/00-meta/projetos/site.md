---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/site
  - status/active
ai_summary: Hub do projeto Site — Next.js 15 + Supabase + Vercel em produção (berkahn.com.br). 44 páginas detectadas pelo Google. Ajustes contínuos, novas páginas, refactors, integração admin/Supabase. Code paths em app/, lib/, components/.
status: active
projeto: site
kpi_paginas_indexadas: 6
kpi_paginas_total: 44
kpi_lcp_target_ms: 2500
kpi_fid_target_ms: 100
kpi_cls_target: 0.1
kpi_isr_revalidate_s: 60
kpi_componentes_article: 19
kpi_atualizado_em: 2026-05-22
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

Site em produção (Next.js App Router + Supabase + Vercel + Tailwind + shadcn/ui). 16 rotas em `app/` (atualidades, empresa, admin, apresentacao-executiva, etc.). Google detecta 44 páginas mas só indexa 6 — **ver [[seo-aeo]] para resolução**. Admin com painel de posts ativo (`app/admin/`). Integração Google Sheets para leads via Apps Script.

## Bloqueios ativos

- [ ] **Indexação Google** (delegado a [[seo-aeo]]): 6/44 = 14%
- [ ] **Bug SearchAction**: gera URL inválida — corrigir
- [ ] **Google Sheets SPOF**: leads sem backup automático em Supabase (mitigado em Fase 4 do plano)
- [ ] **Core Web Vitals**: monitorar LCP < 2.5s, FID < 100ms, CLS < 0.1

## Próximos 7 dias

- [ ] (sob demanda — entrar via /standup conforme issues)
- [ ] Validar build (`npm run build`) sem warnings críticos
- [ ] gitleaks scan pre-commit ativo

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Páginas indexadas | 6 | 44 | -38 ⚠️ |
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

- 2026-05-22: hub criado
- 2026-05-21: vault migrado, integração documentada em `60-arquitetura/`
