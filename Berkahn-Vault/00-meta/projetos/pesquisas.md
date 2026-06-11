---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/blog
  - project/site
  - status/active
ai_summary: Hub do projeto Pesquisas — mercado, concorrência, novos temas. Cross-projeto (alimenta blog, site, comercial). Pesquisas brutas em 40-content/blog/pesquisa/, competitor research em 40-content/pesquisa-mercado/ (migrado de Docs/REMODELAÇÃO/). Destilação em atomic notes (70-knowledge/) é GAP.
status: active
projeto: pesquisas
kpi_pesquisas_brutas_arquivadas: 0
kpi_competitors_documentados: 1
kpi_atomic_notes_geradas: 0
kpi_meta_atomic_notes: 10
kpi_atualizado_em: 2026-05-22
contextos_aplicados:
  - seo-aeo-strategy
  - steel-frame-domain
  - berkahn-brand
workflow: workflow-pesquisa
prompts_relacionados:
  - blog-pesquisa
bases_relacionadas:
  - conhecimento
  - kpis
subagents_uteis: []
---

# Pesquisas — Projeto

> Hub do projeto Pesquisas. Mercado + concorrência + novos temas. Cross-projeto (alimenta blog, site, comercial). Output esperado: atomic notes reutilizáveis em `70-knowledge/`.

## Status atual

Pipeline de pesquisa funcional para blog (`/pesquisa` salva em `40-content/blog/pesquisa/YYYY-MM-DD-tema.md` que `/criacao` consome). Competitor research recém-migrado de `Docs/REMODELAÇÃO/competitor-research/` (1 snapshot: Stalart). Pesquisa de mercado de orçamento migrado de `Docs/Orçamento/`. Pesquisa SEO/AEO em `40-content/auditorias-seo/research-seo-aeo.md`. **Gap crítico**: `70-knowledge/` está vazio — pesquisas viram markdown bruto consumido e descartado, sem destilação em atomic notes reutilizáveis.

## Bloqueios ativos

- [ ] **70-knowledge/ vazio** — conhecimento não acumula entre artigos. Sprint 2.2 cria 8-10 atomic notes LSF (normas, custos, fogo, acústica, financiamento, etc.)
- [ ] **Pesquisas brutas não viram atomic notes** — fluxo `/pesquisa → /criacao` descarta destilação
- [ ] **Apenas 1 competitor documentado** (Stalart) — concorrência LSF brasileira é maior

## Próximos 7 dias

- [ ] Inventariar pesquisas brutas existentes em `40-content/blog/pesquisa/`
- [ ] Identificar 3-5 temas recorrentes para virar atomic notes (Sprint 2)

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Pesquisas brutas arquivadas | n/d | tracked | medir |
| Competitors documentados | 1 | 5 | -4 |
| Atomic notes geradas | 0 | 10 | -10 ⚠️ Sprint 2 |
| Pesquisas usadas em 2+ artigos | 0 | tracked | — |

## Contexto aplicado

- [[seo-aeo-strategy]] — pesquisa SEO/AEO já consolidada
- [[steel-frame-domain]] — domínio LSF (pesquisa técnica acumulada)
- [[berkahn-brand]] — pesquisa de mercado deve respeitar voz/posicionamento

## Workflow & prompts

- Workflow: [[workflow-pesquisa]] — tema → fontes → síntese → atomic notes (criado em Sprint 1.8)
- Prompts (LOCKED): [[blog-pesquisa]] · `/pesquisa` slash command
- Outputs em:
  - `40-content/blog/pesquisa/YYYY-MM-DD-tema.md` — pesquisas brutas para blog
  - `40-content/pesquisa-mercado/` — pesquisa de mercado + competitor research (migrado)
  - `40-content/auditorias-seo/research-seo-aeo.md` — fundamentos SEO/AEO
  - `70-knowledge/<conceito>.md` — atomic notes destiladas (em construção Sprint 2)

## Bases relacionadas

- [[conhecimento.base]] — catálogo atomic notes (criada em Sprint 3)
- [[kpis.base]] — agrega KPIs

## Subagents úteis

- (nenhum subagent específico)

## Materiais arquivados (migrados de Docs/)

- [[research-seo-aeo]] — pesquisa de fundamentos SEO/AEO (Docs/SEO & AEO/)
- [[stalart-snapshot]] — primeiro competitor documentado (Docs/REMODELAÇÃO/)
- [[guia-orcamento]] — guia de orçamento (Docs/Orçamento/)
- [[paginas-conteudo-v2]] — estratégia páginas site (Docs/REMODELAÇÃO/)

## Atomic notes planejadas (Sprint 2.2)

- [[lsf-normas-nbr]] (NBR 16970, 14762, 15253)
- [[lsf-custos]] (faixa de preço m², SINAPI)
- [[lsf-cronograma]]
- [[lsf-fogo]]
- [[lsf-acustica]]
- [[lsf-financiamento]]
- [[lsf-vs-alvenaria]]
- [[lsf-fundacao]]
- [[lsf-sustentabilidade]]
- [[lsf-versatilidade-arquitetonica]]

## Histórico recente

- 2026-05-22: hub criado; pesquisas migradas de Docs/
