---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-30
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
- [ ] **Solicitar indexação manual** no GSC. Estado reverificado por URL Inspection API em 2026-07-30 — de 4, sobraram **3**, e uma piorou:

| URL | Estado | Último crawl |
|---|---|---|
| `steel-frame-aguenta-vento-forte` | **URL is unknown to Google** | nunca |
| `steel-frame-laje-de-concreto` | Discovered, currently not indexed | nunca |
| `steel-frame-vantagens-desvantagens` | Crawled, currently not indexed | 13/04/2026 |
| ~~`energia-solar-residencial`~~ | ✅ Submitted and indexed | 14/07/2026 |

  `URL is unknown to Google` num post publicado em 30/06 é o caso mais grave: não é rejeição, é não-descoberta. **Não é problema de sitemap** — os 38 slugs publicados estão nele, sem uma URL a mais nem a menos, verificado no XML servido. A causa mais provável é orçamento de rastreamento consumido por páginas de baixa qualidade, o que conecta direto com as 9 carcaças.

  Não há API pública para pedir indexação de página comum (a Indexing API só aceita `JobPosting` e `BroadcastEvent`), então isso é ação manual no GSC.
- [ ] **Preencher meta_title + meta_description** nos 9 posts faltantes (lista verificada no Supabase em 2026-07-29)
- [ ] **Preencher answer_summary** nos 4 posts faltantes
- [ ] **Criar/ativar Google Business Profile** (GBP) — *não verificado nesta sessão*
- [ ] **Corrigir SearchAction** gerando URL inválida (ver [[site]]) — *não verificado nesta sessão*

- [x] ~~**Desbloquear `Google-Extended`**~~ — feito em 2026-07-30. `ChatGPT-User`, `Claude-User` e `Perplexity-User` também ganharam allow explícito. `GPTBot` e `ClaudeBot` seguem bloqueados por escolha editorial, não por engano

### P1 — 1-2 semanas
- [ ] **Canibalização de preço, agora medida em query × página**: em *todas* as queries de preço, `quanto-custa-construir-...` aparece 5 a 20 posições abaixo da página-mãe. Acumula **17.759 impressões e CTR de 1,15%** em 90 dias, contra 2,98% de `custo-steel-frame-m2-2026`. Decisão recomendada é **reposicionar para metragem**, não redirecionar. Ver [[2026-08-calendario-editorial]], Bloco 1
- [x] ~~**Pool de CTR baixo, 8 páginas**~~ — reescritas em produção em 2026-07-30. Linha de base (90 dias): `financiar-construcao-...` 5.316 imp / **0,75%**, `normas-light-steel-frame-brasil` 4.010 / 0,85%, `fundacao-steel-frame-vs-alvenaria` 1.539 / 0,97%, `drywall-st-ru-rf` 949 / **0,21%**, `steel-frame-vs-wood-frame` 548 / 0,55%, `protecao-contra-quedas-...` 463 / **0%**. Efeito medido no relatório de 01/09
- [x] ~~**Título truncado na SERP**~~ — `quanto-custa-construir-...` saiu de 70 para 50 caracteres. O `title` (H1) não foi alterado: com a meta_title dentro do limite, o Google tende a usá-la, e mexer no H1 seria reposicionar a página, não corrigir meta
- [ ] **Reposicionar `quanto-custa-construir-...` para metragem** (decisão pendente): hoje as duas páginas de custo disputam a mesma intenção. Reavaliar em 60 dias — se o CTR não subir de 1,15%, aí vale 301 para a página-mãe
- [ ] **Lacunas com demanda medida e zero clique**: `telhado steel frame preço m2` (163 imp), queries por metragem (70/100/150 m²), e 682 impressões em queries com **"2023"** que o artigo de 2026 não atende
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
