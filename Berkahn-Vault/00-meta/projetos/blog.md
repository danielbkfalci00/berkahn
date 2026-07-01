---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-01
tags:
  - project/blog
  - status/active
ai_summary: Hub do projeto Blog — posts semanais em /atualidades. 37 publicados, meta +1/semana. Pipeline 4 etapas (/brainstorm → /pesquisa → /criacao → /artigo). Bloqueio crítico:  indexação Google (1/35). Lido por /standup, /wrap-up, /artigo.
status: active
projeto: blog
kpi_publicados: 37
kpi_meta_publicados_semanal: 1
kpi_indexados_google: 35
kpi_meta_indexacao_total: 30
kpi_posts_sem_meta: 9
kpi_posts_sem_answer_summary: 3
kpi_ga4_users_mes: 1179
kpi_ga4_sessions_mes: 1498
kpi_ga4_pageviews_mes: 1860
kpi_gsc_clicks_mes: 850
kpi_gsc_impressions_mes: 34396
kpi_health_score_mes: 83
kpi_atualizado_em: 2026-07-01
contextos_aplicados:
  - berkahn-brand
  - seo-aeo-strategy
  - article-pipeline
  - copy-sem-travessao
  - steel-frame-domain
workflow: workflow-conteudo
prompts_relacionados:
  - blog-brainstorm
  - blog-pesquisa
  - blog-criacao
  - article-implementation-prompt
bases_relacionadas:
  - artigos
  - calendario
  - kpis
subagents_uteis:
  - pragmatic-code-review
---

# Blog — Projeto

> Hub do projeto Blog. Atualizado semanalmente via `/standup` (segunda 9h) e `/wrap-up` (sexta 17h). Source of truth do estado do projeto.

## Status atual

Pipeline editorial estável. 35 artigos publicados acumulados (cadência 1/semana). **Indexação Google é o gargalo crítico**: apenas 1 dos 35 artigos está indexado. Migração do vault concluída — `40-content/blog/publicados/` agora é source-of-truth (sync para Supabase via `/artigo`).

## Bloqueios ativos

- [ ] **Indexação Google (P0)**: 1/35 artigos indexados. Solicitar indexação manual no GSC para top 10 artigos. Ver [[seo-aeo]]
- [ ] **9 artigos sem meta_title/meta_description**: bloqueia ranking. Backfill agendado para Sprint 2
- [ ] **3 artigos sem answer_summary**: bloqueia AEO (citações por IA)
- [ ] **35 artigos = ilhas** no vault: zero `ai_summary`, zero tags `domain/`, zero wikilinks. Backfill via script em Sprint 2

## Próximos 7 dias

- [ ] Post semanal: definir tema via `/brainstorm` (segunda)
- [ ] `/pesquisa` (terça)
- [ ] `/criacao` (quarta)
- [ ] `/artigo` (quinta) + `/linkedin` (quinta tarde)

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts publicados (total) | 35 | 36 (semana atual) | -1 |
| Indexados Google | 1 | 30 | -29 ⚠️ P0 |
| Posts sem meta tags | 9 | 0 | +9 ⚠️ P0 |
| Posts sem answer_summary | 3 | 0 | +3 ⚠️ P1 |

> KPIs FLAT no frontmatter (`kpi_*`). Agregados por [[kpis.base]].

## Contexto aplicado

- [[berkahn-brand]] — voz, pilares (leveza/previsibilidade/limpeza), ICP, vícios proibidos
- [[seo-aeo-strategy]] — passage-level, ski ramp, hierarquia headings, schema.org
- [[article-pipeline]] — pipeline técnico, 19 componentes interativos, schema Supabase
- [[copy-sem-travessao]] — regra de copy (sem travessão `—`)
- [[steel-frame-domain]] — domínio LSF (normas, custos, fogo, acústica)

## Workflow & prompts

- Workflow: [[workflow-conteudo]] — pipeline editorial 4 etapas + cadência
- Prompts (LOCKED): [[blog-brainstorm]] · [[blog-pesquisa]] · [[blog-criacao]] · [[article-implementation-prompt]]
- Outputs em: `40-content/blog/{ideias,pesquisa,drafts,publicados}/`

## Bases relacionadas

- [[artigos.base]] — Publicados / Drafts / SEO incompleto
- [[calendario.base]] — Pipeline cards + próximos 30 dias + backlog
- [[kpis.base]] — agrega `kpi_*` (criada em Sprint 3)

## Subagents úteis

- `@pragmatic-code-review` — review de componentes React novos em `components/article/`
- `@security-review` — antes de PRs com mudanças em `scripts/articles/` ou Supabase keys

## Materiais de apoio

- [[indices-capas-blog]] — 22 capas em `Docs/Conteúdo/Capas blog/` (criado em Sprint 1.7)
- Capas em produção: `public/images/img_blog/[slug]/cover.webp`

## Histórico recente

- 2026-05-22: hub criado; sprint 1 do plano de reorganização do vault
- 2026-05-21: vault migrado, artigos arquivados em `40-content/blog/publicados/`
- 2026-04-13: pipeline /brainstorm → /pesquisa → /criacao → /artigo estabilizado
