---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-30
tags:
  - project/blog
  - status/active
ai_summary: Hub do projeto Blog — posts semanais em /atualidades. 38 publicados, 34 indexados (89%). Pipeline 4 etapas (/brainstorm → /pesquisa → /criacao → /artigo). Funil reposto em 2026-07-29 com 44 pautas até dezembro; meta tags e answer_summary saneados em 2026-07-30. Bloqueio atual é thin content — 9 artigos com menos de 55 palavras, 24% do blog — mais a canibalização entre as duas páginas de custo. Lido por /standup, /wrap-up, /artigo.
status: active
projeto: blog
kpi_publicados: 38
kpi_meta_publicados_semanal: 1
kpi_indexados_google: 34
kpi_meta_indexacao_total: 38
kpi_posts_carcaca: 9
kpi_posts_sem_meta: 9
kpi_posts_sem_answer_summary: 0
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

`ideias/` foi reposta em 2026-07-29 com 44 pautas até dezembro (`ideas-2026-{08..12}.md`). `drafts/` e `pesquisa/` seguem vazias: enchem conforme o ciclo semanal roda.

Tráfego seguiu crescendo: 1.179 users em junho, 1.407 nos primeiros 26 dias de julho. Mas o crescimento vem de um ativo só (`custo-steel-frame-m2-2026` = 52% dos pageviews), não da cadência.

## Bloqueios ativos

- [ ] **Vault divergente da produção (P0)**: 6 slugs no ar sem arquivo no vault e 6 arquivos no vault fora do ar. Ver seção abaixo
- [x] ~~**Pipeline vazio (P0)**~~: resolvido em 2026-07-29. 44 pautas planejadas até dez/2026 em [[2026-08-calendario-editorial]], serializadas em `ideias/ideas-2026-{08..12}.md`. Briefing executável em [[2026-08-playbook-pautas]]
- [ ] **Canibalização de custo (P0, novo)**: `quanto-custa-construir-steel-frame-precos-m2-2026` é suprimida pela página-mãe em **todas** as queries de preço. 17.759 impressões e CTR 1,15% em 90 dias. Ver [[2026-07-diagnostico-editorial]]
- [x] ~~**CTR de 8 páginas com impressão alta (P0)**~~ — meta tags reescritas em produção em 2026-07-30. Linha de base registrada em [[2026-08-calendario-editorial]]; o relatório do cron de 01/09 mede o efeito
- [x] ~~**Contradição de preço** em `custo-steel-frame-m2-2026`~~ — resolvida em 2026-07-30. Faixa canônica: **R$ 3.015 a R$ 6.091/m²** (Sudeste)
- [x] ~~**4 artigos sem answer_summary** (P1)~~ — preenchidos em 2026-07-30, 98 a 102 palavras cada, com dado quantitativo do próprio corpo
- [x] ~~**9 artigos são carcaças (P0)**~~ — resolvidos em 2026-07-30. **4** sem substituto ficaram no ar com `noindex, follow`; **5** com substituto foram consolidadas por **301**, com 14 links internos reescritos. Backlog de reescrita em [[2026-07-thin-content-mapa]]
- [ ] **4 artigos não indexados** (P1): ver lista em [[seo-aeo]]
- [ ] **`quanto-custa-construir-steel-frame-precos-m2-2026` com `published_at` nulo** (P2): quebra ordenação e a timeline do dashboard

## Próximos 7 dias

- [ ] Semana S1: `/pesquisa` → `/criacao` → `/artigo` do ICMS solar (janela vence 31/12, e homologação leva meses). **Já destravado** — a faixa de preço canônica está definida
- [ ] Backfill de meta tags nos posts que seguem sem `meta_title`/`meta_description` (os 9 de CTR baixo já foram)
- [ ] Pedir indexação no GSC das 4 URLs fora do índice

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts publicados (total) | 38 | — | ✅ |
| Indexados Google | 34/38 (89%) | 38 | -4 |
| Dias desde o último post | 9 | 7 | +2 |
| Slugs divergentes vault ↔ produção | 12 (6+6) | 0 | ⚠️ P0 |
| Posts carcaça (<55 palavras) | 9 | 0 | 4 noindex + 5 em 301 ✅ |
| Artigos indexáveis (com conteúdo) | 29 | 33 | reescrever 4 |
| Posts sem answer_summary | 0 | 0 | ✅ |
| Páginas de CTR baixo corrigidas | 9 | — | ✅ 2026-07-30 |
| Artigos no funil (drafts+ideias+pesquisa) | 44 planejados | ≥2 | ✅ |
| CTR de `quanto-custa-construir-...` | 1,15% | >3% | ⚠️ P0 |
| Concentração de cliques no artigo #1 | 78% | <55% | ⚠️ |

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

**No vault, fora do ar (6)** — ✅ **classificados em 2026-07-30** por comparação de conteúdo (similaridade de trigramas contra todos os posts em produção). São dois grupos distintos:

**Renomeações — arquivar o do vault, o conteúdo está no ar com outro slug:**

| Arquivo do vault | É o mesmo artigo que | Similaridade |
|---|---|---:|
| `berkahn-reforma-construcao-industrializada` | `reforma-tributaria-construcao-industrializada` | **92%** |
| `normas-lsf` | `normas-light-steel-frame-brasil` | **67%** |
| `alvenaria-vs-drywall` | `drywall-ou-alvenaria` | **63%** |

O `berkahn-reforma-...` é o de frontmatter corrompido (`title: **O que efetivamente mudou**`). Arquivar os três em `99-archive/`.

**Artigos completos que nunca foram publicados** — similaridade máxima abaixo de 2% contra tudo que está no ar, ou seja, conteúdo único:

| Arquivo | Palavras | Tema | Demanda |
|---|---:|---|---|
| `hold-downs-ancoragens` | **3.368** | Caminho de cargas, hold-downs, ancoragem | Técnica: baixa por si só |
| `mitos-verdades-steel-frame` | **3.197** | "Enferruja", "pega fogo", "é frágil", "é barulhento" | **Objeção: alta.** Cluster que o diagnóstico aponta como não atendido |
| `orcamento-steel-frame` | **2.961** | Custo com 8 estudos acadêmicos, CUB/SP e SINAPI | **Custo: 78,5% das impressões** |

São **9.526 palavras prontas** enquanto o blog carregava 9 artigos de menos de 55 palavras publicados. As URLs retornam soft 404 (ver abaixo).

`mitos-verdades-steel-frame` e `orcamento-steel-frame` valem publicação antes de qualquer pauta nova. **Ressalva**: `orcamento-steel-frame` cita dados de 2025 e entra no cluster de custo, que já tem canibalização — precisa de revisão de números e de decisão sobre canonical antes de ir ao ar.

### Bug: soft 404 em todo `/atualidades/`

Qualquer slug inexistente retorna **HTTP 200** com a página "404 Pagina nao encontrada" no corpo. Verificado em produção e reproduzido no build local com um slug inventado.

O `notFound()` está no lugar certo (`app/atualidades/[slug]/page.tsx:294`) e **funciona** — a página de erro renderiza. O que não muda é o status. Tentei antecipar o `notFound()` para dentro do `generateMetadata` e **não resolveu**, então a causa não é a que parecia.

Importa porque desperdiça orçamento de rastreamento, e `steel-frame-aguenta-vento-forte` está há um mês como "URL is unknown to Google". Investigar com calma: suspeitos são a interação de `revalidate = 60` com `dynamicParams = true`.

### Faixa de preço canônica (resolvido em 2026-07-30)

`custo-steel-frame-m2-2026` contradizia a si mesma sobre preço. O corpo, os componentes e a `meta_description` diziam **R$ 3.015 a R$ 6.091/m²** (Sudeste); só o `answer_summary` dizia R$ 2.500 a R$ 4.500. Foi ele o corrigido.

**Toda pauta que citar preço usa R$ 3.015 a R$ 6.091/m² e nenhuma outra faixa.**

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
