---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-29
tags:
  - project/blog
  - status/active
ai_summary: Hub do projeto Blog — posts semanais em /atualidades. 38 publicados, 34 indexados (89%), meta +1/semana. Pipeline 4 etapas (/brainstorm → /pesquisa → /criacao → /artigo). Bloqueio atual — cadência parada há 3 semanas e pipeline vazio, não mais indexação. Lido por /standup, /wrap-up, /artigo.
status: active
projeto: blog
kpi_publicados: 38
kpi_meta_publicados_semanal: 1
kpi_indexados_google: 34
kpi_meta_indexacao_total: 38
kpi_posts_sem_meta: 9
kpi_posts_sem_answer_summary: 4
kpi_ga4_users_mes: 1179
kpi_ga4_sessions_mes: 1498
kpi_ga4_pageviews_mes: 1860
kpi_gsc_clicks_mes: 850
kpi_gsc_impressions_mes: 34396
kpi_health_score_mes: 83
kpi_atualizado_em: 2026-07-20
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

Dados verificados em 2026-07-29 contra Supabase e GSC.

**38 artigos publicados, 34 indexados (89%)**. O bloqueio P0 de indexação que dominava este hub desde abril **está encerrado** — o texto anterior dizia "1 de 35 indexados", número que já estava errado quando foi escrito.

**O gargalo mudou de lugar**: o problema agora é o vault divergir da produção, não a indexação. Último post real é `anatomia-parede-steel-frame` (2026-07-20, 9 dias atrás) — a cadência está quase em dia, mas **esse post não existe no vault**. Ler `40-content/blog/publicados/` daria a resposta errada de que o último post foi 08/07.

`drafts/`, `ideias/` e `pesquisa/` estão os três vazios desde 21/05 — não há nada no funil para a próxima semana, ainda que a publicação esteja acontecendo.

Tráfego seguiu crescendo: 1.179 users em junho, 1.407 nos primeiros 26 dias de julho. Mas o crescimento vem de um ativo só (`custo-steel-frame-m2-2026` = 52% dos pageviews), não da cadência.

## Bloqueios ativos

- [ ] **Vault divergente da produção (P0)**: 6 slugs no ar sem arquivo no vault e 6 arquivos no vault fora do ar. Ver seção abaixo
- [ ] **Pipeline vazio (P0)**: `drafts/`, `ideias/`, `pesquisa/` sem nenhum arquivo desde 21/05. Rodar `/brainstorm` para repor o funil
- [ ] **9 artigos sem meta_title/meta_description** (P0): lista verificada no Supabase. Ver [[seo-aeo]]
- [ ] **4 artigos sem answer_summary** (P1): bloqueia AEO. `financiar-construcao-light-steel-frame`, `steel-frame-no-mundo`, `construir-hospital-em-operacao`, `reforma-tributaria-construcao-industrializada`
- [ ] **4 artigos não indexados** (P1): ver lista em [[seo-aeo]]
- [ ] **`quanto-custa-construir-steel-frame-precos-m2-2026` com `published_at` nulo** (P2): quebra ordenação e a timeline do dashboard

## Próximos 7 dias

- [ ] Repor o funil: `/brainstorm` (pipeline está vazio)
- [ ] `/pesquisa` → `/criacao` → `/artigo` para retomar a cadência
- [ ] Backfill de meta tags nos 9 posts

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts publicados (total) | 38 | — | ✅ |
| Indexados Google | 34/38 (89%) | 38 | -4 |
| Dias desde o último post | 9 | 7 | +2 |
| Slugs divergentes vault ↔ produção | 12 (6+6) | 0 | ⚠️ P0 |
| Posts sem meta tags | 9 | 0 | +9 ⚠️ P0 |
| Posts sem answer_summary | 4 | 0 | +4 ⚠️ P1 |
| Artigos no funil (drafts+ideias+pesquisa) | 0 | ≥2 | ⚠️ P0 |

## Divergência vault ↔ produção (2026-07-29)

`40-content/blog/publicados/` **não é source-of-truth confiável**. Ambos os lados têm 38 arquivos, mas 12 slugs divergem.

**No ar, sem arquivo no vault** — ✅ **resolvido em 2026-07-29**, mas eram **4**, não 6:

Os 4 abaixo foram reconstruídos a partir do Supabase e agora estão em `publicados/`. Cada um traz um callout marcando que os campos curatoriais (`palavras_chave`, tags `domain/`, `linkedin_slug`, `material_visual_slug`) ficaram vazios e precisam de curadoria.

`anatomia-parede-steel-frame` e `energia-solar-residencial` **já existiam em `main`, curados**. A ausência era artefato de a sessão ter rodado na branch `design/institucional-monografia`, que está 3 commits atrás de `main` (merge-base `a149b47`) e portanto nunca teve esses arquivos. Nada foi deletado, e mergear aquela branch não apaga nada. Restaurados de `main` na working tree local.

**Lição**: contar arquivos em `publicados/` só é confiável na branch certa. Para saber o que está no ar, a fonte é o Supabase, não a pasta.

| Publicado | Slug | Observação |
|---|---|---|
| 2024-10-25 | `tendencias-construcao-modular-2025` | data anterior ao vault |
| 2026-03-16 | `custo-steel-frame-m2-2026` | **maior ativo: 78% dos cliques, 52% dos pageviews** |
| 2026-03-16 | `steel-frame-vs-wood-frame` | |
| 2026-04-27 | `reforma-tributaria-construcao-industrializada` | também sem `answer_summary` |
| 2026-07-14 | `energia-solar-residencial` | recente |
| 2026-07-20 | `anatomia-parede-steel-frame` | **último post publicado** |

**No vault, fora do ar (6)** — ⏳ **pendente de decisão sua**: `alvenaria-vs-drywall`, `berkahn-reforma-construcao-industrializada`, `hold-downs-ancoragens`, `mitos-verdades-steel-frame`, `normas-lsf`, `orcamento-steel-frame`.

Não dá para resolver isso por dedução: cada um pode ter sido despublicado de propósito, renomeado (vários têm nome próximo de slugs que estão no ar, ex. `normas-lsf` vs `normas-light-steel-frame-brasil`), ou nunca ter chegado a publicar. Precisam ser classificados um a um antes de arquivar ou republicar.

### Inconsistência de dado no maior ativo

`custo-steel-frame-m2-2026` tem `answer_summary` dizendo **R$ 2.500 a R$ 4.500/m²** e `seo_description` dizendo **R$ 3.015 a R$ 6.091**. A página que responde por 78% dos cliques do Google se contradiz justamente sobre preço, que é a intenção da query. Definir qual faixa está certa e alinhar os dois campos.

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

- 2026-07-20: standup — `kpi_publicados` 37 → 38 (novo: `steel-frame-laje-de-concreto`, publicado 2026-07-08). 3 aprendizados de pipeline adicionados em [[article-pipeline]] (H1 duplica título; `NormsSection` título fixo; `StatHighlight` trunca decimais).
- 2026-05-22: hub criado; sprint 1 do plano de reorganização do vault
- 2026-05-21: vault migrado, artigos arquivados em `40-content/blog/publicados/`
- 2026-04-13: pipeline /brainstorm → /pesquisa → /criacao → /artigo estabilizado
