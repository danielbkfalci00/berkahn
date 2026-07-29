---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-29
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: Hub do projeto SEO/AEO — indexação 34/38 artigos (89%), tráfego 98,8% NÃO-branded (meta de 40% já superada), 850 cliques/mês em junho. P0 restante — 9 posts sem meta tags, 4 sem answer_summary, 4 URLs não indexadas, 11 categorias a normalizar. Estratégia em 20-context, diagnósticos em 40-content/auditorias-seo.
status: active
projeto: seo-aeo
kpi_posts_sem_answer_summary: 4
kpi_score: 52
kpi_paginas_indexadas: 34
kpi_paginas_total: 38
kpi_pct_indexacao: 89
kpi_posts_sem_meta_title: 9
kpi_posts_sem_meta_description: 9
kpi_trafego_cliques_90d: 1281
kpi_pct_branded: 1.2
kpi_dominio_idade_meses: 6
kpi_backlinks: 0
kpi_trafego_cliques_30d: 850
kpi_trafego_impressoes_30d: 34396
kpi_ctr_medio: 2.47
kpi_posicao_media: 4.5
kpi_atualizado_em: 2026-07-29
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

Dados de 2026-07-29 (junho fechado + julho parcial 01-26).

**A indexação deixou de ser o bloqueio crítico**: 34 de 38 artigos indexados (89%), contra 6/44 em abril. As 4 restantes estão em "Crawled/Discovered - currently not indexed" e viraram P0 nominal, não estrutural.

**O tráfego deixou de ser branded**: 98,8% dos cliques das top queries vêm de termos genéricos ("steel frame valor m2", "casas steel frame preço m2"), contra 100% branded em abril. A meta de chegar a 40% branded foi superada com folga — o que muda a pergunta de "como ser descoberto" para "como converter quem já chega".

**O que ficou**: 9 posts sem meta tags, 4 sem answer_summary, 11 categorias por normalizar, zero backlinks. E uma concentração de risco: `custo-steel-frame-m2-2026` sozinho gera 78% dos cliques do Google.

> [!warning] `kpi_score: 52` é de abril e não foi recalculado
> Não existe recomputação automática desse score — ele veio da auditoria manual [[2026-04-diagnostico-integrado]]. Rodar `/seo` para ter um número atual antes de usá-lo em qualquer decisão.

## Bloqueios ativos

### P0 — urgente (esta semana)
- [ ] **Solicitar indexação manual** no GSC para as 4 URLs não indexadas: `steel-frame-vantagens-desvantagens` (Crawled), `steel-frame-aguenta-vento-forte`, `steel-frame-laje-de-concreto` (Discovered) + 1 (ver tabela no relatório de julho)
- [ ] **Preencher meta_title + meta_description** nos 9 posts faltantes (lista verificada no Supabase em 2026-07-29)
- [ ] **Preencher answer_summary** nos 4 posts faltantes
- [ ] **Criar/ativar Google Business Profile** (GBP) — *não verificado nesta sessão*
- [ ] **Corrigir SearchAction** gerando URL inválida (ver [[site]]) — *não verificado nesta sessão*

### P1 — 1-2 semanas
- [ ] **Resolver canibalização preço/custo**: `custo-steel-frame-m2-2026` (864 cliques, pos. 3,5) e `quanto-custa-construir-steel-frame-precos-m2-2026` (135 cliques, 10.463 impressões, CTR 1,29%, pos. 6,1) disputam a mesma intenção
- [ ] **Pool de CTR baixo**: 3 páginas com ~3.700 impressões rendendo 47 cliques — `financiar-construcao-light-steel-frame` (1,33%), `normas-light-steel-frame-brasil` (1,25%), `fundacao-steel-frame-vs-alvenaria` (1,13%)
- [ ] Normalizar 11 categorias → 5
- [ ] Adicionar `lastModified` a páginas estáticas no sitemap
- [ ] Registrar em diretórios de construção brasileiros (3-5)

### P2 — 2-4 semanas
- [ ] Estruturar internal linking (3-5 links por artigo)
- [ ] Expandir `/lsf` como pillar page (3K+ palavras)
- [ ] Adicionar hreflang pt-BR auto-referencial

## Próximos 7 dias

- [ ] GSC: solicitar indexação das 4 URLs pendentes
- [ ] Backfill meta tags nos 9 posts
- [ ] Rodar `/seo` para recalcular `kpi_score` (o 52 é de abril)

## KPIs (snapshot)

Verificados em 2026-07-29 contra Supabase e GSC.

| Métrica | Atual | Meta P0 | Meta P3 | Situação |
|---------|-------|---------|---------|----------|
| Score geral | 52/100 (abril) | 65 | 85 | ⏳ recalcular via `/seo` |
| Artigos indexados | 34/38 (89%) | 20 | 40 | ✅ meta P0 superada |
| Posts sem meta tags | 9 | 0 | 0 | ⚠️ P0 |
| Posts sem answer_summary | 4 | 0 | 0 | ⚠️ P0 |
| Tráfego orgânico (90d) | 1.281 | 200 | 1000 | ✅ meta P3 superada |
| % branded | 1,2% | 70% | 40% | ✅ meta P3 superada |
| Backlinks | 0 | 5 | 30 | ⚠️ -5 |
| Concentração top-1 | 78% dos cliques | — | — | ⚠️ risco novo |

Três metas foram superadas e não foram rebaixadas ainda — **as metas P0/P3 precisam ser refeitas**, senão o painel só mostra verde. Fica para a próxima sessão, junto com a definição de tráfego qualificado.

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

- 2026-07-29: saneamento — KPIs de abril substituídos por valores verificados. Indexação 14%→89%, branded 100%→1,2%, cliques 90d 41→1.281. Bloqueio P0 de indexação encerrado. Corrigido bug que contava "not indexed" como indexado (inflava a contagem em 1 todo mês desde fevereiro).
- 2026-05-22: hub criado, diagnósticos migrados de `Docs/SEO & AEO/`
- 2026-04: diagnóstico integrado v2 — identificou 9 posts sem meta + 3 sem answer_summary + bug SearchAction
