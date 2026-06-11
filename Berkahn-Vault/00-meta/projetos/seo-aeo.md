---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-06-03
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: Hub do projeto SEO/AEO — score 52/100 (abril 2026). Indexação CRÍTICA (6/44 páginas = 14%). P0 indexação manual GSC + meta tags faltantes + GBP + answer_summary. Estratégia teórica em 20-context, diagnóstico em 40-content/auditorias-seo.
status: active
projeto: seo-aeo
kpi_posts_sem_answer_summary: 3
kpi_score: 52
kpi_paginas_indexadas: 31
kpi_paginas_total: 44
kpi_pct_indexacao: 14
kpi_posts_sem_meta_title: 9
kpi_posts_sem_meta_description: 9
kpi_trafego_cliques_90d: 41
kpi_pct_branded: 100
kpi_dominio_idade_meses: 3
kpi_backlinks: 0
kpi_trafego_cliques_30d: 347
kpi_trafego_impressoes_30d: 20196
kpi_ctr_medio: 1.72
kpi_posicao_media: 5.3
kpi_atualizado_em: 2026-06-03
contextos_aplicados:
  - seo-aeo-strategy
  - article-pipeline
  - berkahn-brand
workflow: workflow-seo
prompts_relacionados:
  - seo-page-audit
bases_relacionadas:
  - artigos
  - kpis
subagents_uteis: []
---

# SEO/AEO — Projeto

> Hub do projeto SEO/AEO. Trabalho cross-projeto (afeta [[blog]] e [[site]]). Estratégia teórica em [[seo-aeo-strategy]], diagnósticos reais em `40-content/auditorias-seo/`.

## Status atual

**Score 52/100 (abril 2026)**. Indexação é o problema crítico — apenas 6 de 44 páginas indexadas (14%). Infraestrutura técnica sólida (schema.org, meta tags, ISR, canonicals) mas Google detecta e não indexa. Tráfego 100% branded ("berkahn"), 41 cliques em 90 dias. Domínio jovem (~3 meses), zero backlinks.

## Bloqueios ativos

### P0 — urgente (esta semana)
- [ ] **Solicitar indexação manual** no Google Search Console para 10 páginas críticas
- [ ] **Criar/ativar Google Business Profile** (GBP)
- [ ] **Preencher meta_title + meta_description** nos 9 posts faltantes (script de backfill Sprint 2)
- [ ] **Preencher answer_summary** nos 3 posts faltantes
- [ ] **Corrigir SearchAction** gerando URL inválida (ver [[site]])

### P1 — 1-2 semanas
- [ ] Normalizar 12 categorias → 5
- [ ] Adicionar `lastModified` a páginas estáticas no sitemap
- [ ] Registrar em diretórios de construção brasileiros (3-5)
- [ ] Compartilhar 5 posts em redes sociais (LinkedIn — sinergia com [[linkedin]])

### P2 — 2-4 semanas
- [ ] Estruturar internal linking (3-5 links por artigo)
- [ ] Expandir `/lsf` como pillar page (3K+ palavras)
- [ ] Adicionar hreflang pt-BR auto-referencial

## Próximos 7 dias

- [ ] GSC: solicitar indexação dos 10 artigos top-views
- [ ] Backfill meta tags via script (Sprint 2 do plano)
- [ ] Validar `/seo` auditoria periódica

## KPIs (snapshot)

| Métrica | Atual | Meta P0 | Meta P3 | Δ |
|---------|-------|---------|---------|---|
| Score geral | 52/100 | 65 | 85 | -13 P0 |
| Páginas indexadas | 6/44 | 20 | 40 | -14 ⚠️ P0 |
| Posts sem meta tags | 9 | 0 | 0 | +9 ⚠️ |
| Posts sem answer_summary | 3 | 0 | 0 | +3 ⚠️ |
| Tráfego orgânico (90d) | 41 | 200 | 1000 | -159 |
| % branded | 100% | 70% | 40% | precisa não-branded |
| Backlinks | 0 | 5 | 30 | -5 |

## Contexto aplicado

- [[seo-aeo-strategy]] — regras (passage-level, ski ramp, schema, robots.txt seletivo)
- [[article-pipeline]] — validação SEO/AEO obrigatória no `/artigo`
- [[berkahn-brand]] — keywords core (Light Steel Frame, LSF, construção industrializada)
- [[llms-txt]] — veredito sobre o arquivo llms.txt (nice-to-have, não bala de prata)

## Workflow & prompts

- Workflow: [[workflow-seo]] — auditoria periódica, P0/P1/P2, indexação, schema (criado em Sprint 1.8)
- Prompts: [[seo-page-audit]] · `/seo` slash command
- Outputs em: `40-content/auditorias-seo/YYYY-MM-tema.md`

## Bases relacionadas

- [[artigos.base]] view "SEO incompleto" — detecta posts sem meta
- [[kpis.base]] — agrega KPIs do projeto

## Subagents úteis

- (nenhum subagent específico — `/seo` cobre auditoria)

## Diagnósticos arquivados

Migrados de `Docs/SEO & AEO/` para `40-content/auditorias-seo/` (Sprint 1.6):
- [[2026-04-diagnostico-integrado]] — score 52/100, 9 posts sem meta, plano P0/P1/P2
- [[2026-04-diagnostico-base]] — diagnóstico inicial
- [[research-seo-aeo]] — pesquisa de fundamentos (passage-level, ski ramp, AEO)

## Histórico recente

- 2026-05-22: hub criado, diagnósticos migrados de `Docs/SEO & AEO/`
- 2026-04: diagnóstico integrado v2 — identificou 9 posts sem meta + 3 sem answer_summary + bug SearchAction
