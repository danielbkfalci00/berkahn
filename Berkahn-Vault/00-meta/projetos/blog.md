---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-06
tags:
  - project/blog
  - status/active
ai_summary: Hub do projeto Blog — posts semanais em /atualidades. 39 publicados, 34 indexados. Pipeline 4 etapas (/brainstorm → /pesquisa → /criacao → /artigo). Funil reposto em 2026-07-29 com 44 pautas até dezembro. Thin content e soft 404 resolvidos em 2026-07-30. Bloqueios restantes - canibalização entre as duas páginas de custo, e duas séries Arquitecasa diferentes no ar para o mesmo Sudeste. orcamento-steel-frame e hold-downs-ancoragens em backlog sem data, cada um com bloqueio nomeado. Lido por /standup, /wrap-up, /artigo.
status: active
projeto: blog
kpi_publicados: 39
kpi_meta_publicados_semanal: 1
kpi_indexados_google: 34
kpi_meta_indexacao_total: 38
kpi_posts_carcaca: 9
kpi_posts_sem_meta: 9
kpi_posts_sem_answer_summary: 0
kpi_ga4_users_mes: 1681
kpi_ga4_sessions_mes: 2027
kpi_ga4_pageviews_mes: 2444
kpi_gsc_clicks_mes: 1370
kpi_gsc_impressions_mes: 42011
kpi_health_score_mes: 77
kpi_atualizado_em: 2026-08-02
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

Dados verificados em 2026-07-30 contra Supabase e GSC.

**39 artigos publicados** (contagem conferida na tabela `posts`), 34 indexados. O bloqueio P0 de indexação que dominava este hub desde abril **está encerrado** — o texto anterior dizia "1 de 35 indexados", número que já estava errado quando foi escrito.

Último post: `mitos-verdades-steel-frame`, publicado em 2026-07-30 — tirado do próprio vault, onde estava pronto e nunca tinha ido ao ar.

**A divergência vault ↔ produção foi encerrada em 2026-07-30**: dos 6 arquivos do vault fora do ar, 3 eram renomeações (arquivadas) e 3 eram artigos inéditos, dos quais 1 foi publicado e 2 foram para backlog. A seção histórica abaixo fica como registro de como o descompasso foi diagnosticado.

`ideias/` foi reposta em 2026-07-29 com 44 pautas até dezembro (`ideas-2026-{08..12}.md`). `drafts/` e `pesquisa/` seguem vazias: enchem conforme o ciclo semanal roda.

Tráfego seguiu crescendo: 1.179 users em junho, 1.407 nos primeiros 26 dias de julho. Mas o crescimento vem de um ativo só (`custo-steel-frame-m2-2026` = 52% dos pageviews), não da cadência.

## Bloqueios ativos

- [x] ~~**Vault divergente da produção (P0)**~~ — encerrado em 2026-07-30. Os 6 do vault fora do ar foram classificados por similaridade de conteúdo: 3 são renomeações (arquivar) e 3 são artigos completos nunca publicados, dos quais `mitos-verdades-steel-frame` já foi ao ar. Ver seção abaixo
- [x] ~~**Pipeline vazio (P0)**~~: resolvido em 2026-07-29. 44 pautas planejadas até dez/2026 em [[2026-08-calendario-editorial]], serializadas em `ideias/ideas-2026-{08..12}.md`. Briefing executável em [[2026-08-playbook-pautas]]
- [ ] **Canibalização de custo (P0, novo)**: `quanto-custa-construir-steel-frame-precos-m2-2026` é suprimida pela página-mãe em **todas** as queries de preço. 17.759 impressões e CTR 1,15% em 90 dias. Ver [[2026-07-diagnostico-editorial]]
- [x] ~~**CTR de 8 páginas com impressão alta (P0)**~~ — meta tags reescritas em produção em 2026-07-30. Linha de base registrada em [[2026-08-calendario-editorial]]; o relatório do cron de 01/09 mede o efeito
- [x] ~~**Contradição de preço** em `custo-steel-frame-m2-2026`~~ — resolvida em 2026-07-30. Faixa canônica: **R$ 3.015 a R$ 6.091/m²** (Sudeste)
- [x] ~~**4 artigos sem answer_summary** (P1)~~ — preenchidos em 2026-07-30, 98 a 102 palavras cada, com dado quantitativo do próprio corpo
- [x] ~~**9 artigos são carcaças (P0)**~~ — resolvidos em 2026-07-30. **4** sem substituto ficaram no ar com `noindex, follow`; **5** com substituto foram consolidadas por **301**, com 14 links internos reescritos. Backlog de reescrita em [[2026-07-thin-content-mapa]]
- [ ] **3 artigos fora do índice** (P1): `steel-frame-aguenta-vento-forte` (URL unknown), `steel-frame-laje-de-concreto` (discovered), `steel-frame-vantagens-desvantagens` (crawled). Eram 4; ver [[seo-aeo]]
- [x] ~~**`quanto-custa-construir-steel-frame-precos-m2-2026` com `published_at` nulo**~~ — corrigido em 2026-07-30 para `created_at` (2026-01-26). Além da ordenação, o nulo tirava o artigo do RSS, deixava o schema Article sem `datePublished` e fazia o sitemap declarar `lastmod` = agora a cada crawl
- [ ] **Duas séries Arquitecasa no ar ao mesmo tempo (P1, novo)**: `custo-steel-frame-m2-2026` usa dez/2025 para o Sudeste (R$ 3.015–6.091) e a tabela regional de `quanto-custa-construir-...` usa jan/2025 (R$ 2.979–5.926). Mesmo índice, mesma região, snapshots diferentes. **Precisa da série dez/2025 das outras 4 regiões** para rebasear a tabela inteira — atualizar só o Sudeste deixaria a tabela inconsistente no tempo. Ver seção abaixo

## Próximos 7 dias

- [ ] Semana S1: `/pesquisa` → `/criacao` → `/artigo` do ICMS solar (janela vence 31/12, e homologação leva meses). **Já destravado** — a faixa de preço canônica está definida

> [!note] `orcamento-steel-frame` e `hold-downs-ancoragens` saíram do fluxo semanal
> Foram para backlog sem data em 2026-07-30, cada um com bloqueio nomeado. Ver "Backlog: os 2 artigos prontos que não vão ao ar agora" abaixo. **Não puxar para a semana sem antes ter os números** — publicar `orcamento-steel-frame` como está adiciona uma terceira faixa de preço ao acervo.

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts publicados (total) | 39 | — | ✅ |
| Indexados Google | 34/39 | 39 | -5 |
| Dias desde o último post | 0 | 7 | ✅ |
| Slugs divergentes vault ↔ produção | 0 | 0 | ✅ 2026-07-30 |
| Soft 404 em `/atualidades/` | resolvido | — | ✅ 2026-07-30 |
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

O `berkahn-reforma-...` é o de frontmatter corrompido (`title: **O que efetivamente mudou**`). ✅ **Arquivados em 2026-07-30** em `99-archive/blog-publicados-arquivados/` com sufixo `-renamed`; os 3 backlinks foram repontados para os slugs canônicos.

**Artigos completos que nunca foram publicados** — similaridade máxima abaixo de 2% contra tudo que está no ar, ou seja, conteúdo único:

Contagens de **corpo publicável** (sem frontmatter e sem o bloco "ESPECIFICAÇÕES TÉCNICAS", que é instrução de produção). O arquivo inteiro tem ~400 a 900 palavras a mais.

| Arquivo | Corpo | Tema | Demanda |
|---|---:|---|---|
| `hold-downs-ancoragens` | **2.490** | Caminho de cargas, hold-downs, ancoragem | Técnica: baixa por si só |
| ~~`mitos-verdades-steel-frame`~~ | 2.496 | ✅ **Publicado em 2026-07-30** | — |
| `orcamento-steel-frame` | **2.354** | Custo com 8 estudos acadêmicos, CUB/SP e SINAPI | **Custo: 78,5% das impressões** |

Eram ~7.300 palavras de corpo prontas enquanto o blog carregava 9 artigos de menos de 55 palavras publicados. As URLs retornavam soft 404 — desde 2026-07-30 retornam **404 de verdade** (ver abaixo).

✅ **`mitos-verdades-steel-frame` foi publicado em 2026-07-30** (4 componentes, capa gerada do banco de imagens). Restam dois, ambos em backlog.

### Backlog: os 2 artigos prontos que não vão ao ar agora

**Decisão de 2026-07-30: ambos para backlog, sem data.** Não é adiamento por falta de tempo — cada um tem um bloqueio nomeado, e publicar sem resolvê-lo piora o acervo em vez de melhorar.

**`orcamento-steel-frame`** (2.354 palavras de corpo). Bloqueio: **todo o eixo de preço está um ano defasado e conflita com o que já está no ar.**

- Ancora no Índice Arquitecasa de **janeiro/2025** (R$ 2.979 a 5.926/m² no Sudeste). O canônico é **dezembro/2025** (R$ 3.015 a 6.091/m²), e a fonte disso é [[financiar-construcao-light-steel-frame]]
- Selic e taxa da Caixa são de 2025 — o dado mais perecível do texto
- Preços unitários de 2025: placa cimentícia, basecoat, tarifa de energia, caçamba, terreno
- Diz LSF a 250 kg/m² e vida útil de 90 anos; [[mitos-verdades-steel-frame]], **publicado**, diz 60 a 100 kg/m² e "acima de 100 anos". O corpus publicado manda

**Para destravar**: a série Arquitecasa dez/2025 e a Selic/taxa Caixa vigentes. Sem os números, a revisão vira invenção.

**Decisão de canonical, quando for publicado**: `custo-steel-frame-m2-2026` continua sendo a página de "quanto custa o m²" — é o maior ativo do site. `orcamento-steel-frame` entra pelo ângulo que nenhuma outra página tem (comparação LSF × alvenaria com 8 estudos acadêmicos, breakdown por etapa, TCO de 20 anos), mirando "steel frame é mais barato que alvenaria" (480 impressões/mês em 3 variantes, sem post dedicado). Na prática: sai o "2025" do título, sai a tabela de preço/m² do FAQ, e a pergunta de preço linka para a página-mãe em vez de responder com uma terceira faixa.

**`hold-downs-ancoragens`** (2.490 palavras). Sem bloqueio de dado — não tem número perecível nem sobreposição de cluster. Bloqueio é de custo/benefício: conteúdo técnico rendeu **3 cliques em 90 dias** ([[2026-07-diagnostico-editorial]]), e ele depende de 4 ilustrações técnicas a produzir. Publicável a qualquer momento que sobrar folga.

### ✅ Resolvido: soft 404 em todo `/atualidades/`

Qualquer slug inexistente retornava **HTTP 200** com a página de erro no corpo. **Causa: os `loading.tsx`.** Um `loading.tsx` cria um boundary de Suspense sobre o segmento; o Next descarrega o shell com 200 antes de o `notFound()` ser alcançado, e o status não pode mais mudar.

Foram necessários **os dois**: `app/atualidades/loading.tsx` envolve o segmento `[slug]` também, então remover só o filho não resolvia — foi o que me custou duas rodadas de teste.

**Hipóteses testadas e descartadas** (registradas para ninguém repetir o caminho):

| Suspeito | Teste | Veredicto |
|---|---|---|
| `revalidate = 60` + `dynamicParams` | build sem `revalidate` | ❌ ainda 200 |
| `await cookies()` forçando render dinâmico | `/orcamento/estimativa/[id]` é `force-dynamic`, chama Supabase e devolve **404** | ❌ inocente |
| `notFound()` no lugar errado | antecipar para `generateMetadata` | ❌ no Next 15 a metadata também é streamed |
| `loading.tsx` | build sem os dois, com `revalidate` presente | ✅ **404** |

O motivo está em comentário no `app/atualidades/[slug]/page.tsx` para o skeleton não voltar sem querer. Se ele for necessário de novo, precisa ficar **abaixo** do ponto que decide o `notFound` (ex.: Suspense só em volta dos relacionados).

> `app/admin/analytics/loading.tsx` tem o mesmo padrão sobre um `notFound()`. Fica, porque a rota é autenticada e soft 404 lá não tem custo de crawl.

### Faixa de preço canônica (resolvido em 2026-07-30)

`custo-steel-frame-m2-2026` contradizia a si mesma sobre preço. O corpo, os componentes e a `meta_description` diziam **R$ 3.015 a R$ 6.091/m²** (Sudeste); só o `answer_summary` dizia R$ 2.500 a R$ 4.500. Foi ele o corrigido.

**Toda pauta que citar preço usa R$ 3.015 a R$ 6.091/m² e nenhuma outra faixa.**

> KPIs FLAT no frontmatter (`kpi_*`). Agregados por [[kpis.base]].

## Contexto aplicado

- [[berkahn-brand]] — voz, pilares (leveza/previsibilidade/limpeza), ICP, vícios proibidos
- [[seo-aeo-strategy]] — passage-level, ski ramp, hierarquia headings, schema.org
- [[article-pipeline]] — pipeline técnico, 19 componentes interativos, schema Supabase
- [[quadro-conteudo]] — o quadro em `/admin/conteudo`: a pauta é a unidade de trabalho, e desde 2026-08-06 `/pesquisa` grava lá em vez de criar `.md` no vault
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
