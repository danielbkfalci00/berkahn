---
tipo: documentacao
criado: 2026-08-12
atualizado: 2026-08-12
tags:
  - domain/architecture
  - project/site
  - status/active
ai_summary: Por que o dashboard coletava 20 de 1.126 queries desde fevereiro sem ninguém notar, e as três visualizações que isso destravou. Regra geral do projeto - quando um número bate exatamente no teto por meses seguidos, é truncamento, não dado. Escala de calor é logarítmica porque o acervo é lei de potência (250:1).
status: active
projeto: site
---

# Analytics — as matrizes de calor e a distribuição truncada

> Complementa [[analytics-methodology]], que descreve Health Score, metas
> dinâmicas e red flags. Esta nota cobre a coleta e as visualizações de calor.

## O achado que motivou tudo

De fevereiro a agosto de 2026 o pipeline coletava **20 queries de uma
distribuição de 1.126**. `fetch-gsc.mjs` pedia `rowLimit: 20` para queries e
`15` para páginas; a Search Analytics API aceita 25.000.

**Por que ninguém notou por seis meses**: nada errava. Os totais — cliques,
impressões, CTR, posição — vêm de uma chamada `overall` separada das listas.
Então todo número de manchete sempre bateu. Só a *distribuição* estava
truncada, e era justamente ela que respondia "que pauta escrever".

Havia quatro tetos, não um:

| Onde | Era | É | Como se detecta |
|---|---|---|---|
| GSC queries | 20 | 5.000 buscadas, piso de 3 impressões | abr–jul deram exatamente 20 |
| GSC páginas | 15 | 200 | abr–jul deram exatamente 15 |
| GA4 páginas | 50 | 200 | mai–jul deram exatamente 50 |
| GA4 fontes | 10 | 50 | — |

> [!tip] Regra que vale para o projeto inteiro
> **Número que bate exatamente no mesmo valor por meses seguidos é teto, não
> dado.** Fevereiro, março e abril davam 16, 33 e 41 páginas — reais, porque
> o tráfego era menor. A partir de maio, sempre 50. Essa é a assinatura.

O custo real: o quadrante de oportunidade de query tinha **1 entrada** sobre as
20 armazenadas e **61** sobre as 357. Não era ausência de oportunidade, era
ausência de dado.

## Buscar largo, guardar filtrado

Guardar as 1.126 queries cruas recriaria o problema do outro lado: `getSnapshot`
faz `select("*")` e a página carrega dois snapshots (mês corrente + anterior),
então cada query armazenada é paga duas vezes por carregamento.

Piso de **3 impressões** (`MIN_IMPRESSOES_ARMAZENADAS`). Medido em 12/08, janela
de 28 dias: 1.126 queries no total, 357 acima do piso. Preserva 370 dos 389
cliques atribuíveis a query e corta dois terços do volume. Query de 1-2
impressões tem CTR de 0% ou 100% — ruído que não sustenta decisão.

Seguro para o `computeDelta`: o filtro de baseline exige `clicksPrevious >= 5`,
e cliques nunca passam de impressões.

## Estreitar a leitura antes de engordar a coleta

Ordem importa. `getAllTrendPoints` puxava `ga4_data` e `gsc_data` **inteiros de
todos os meses** para extrair cinco escalares de cada. Subir os limites primeiro
teria transformado a colheita maior em regressão na própria tela.

Medido contra o banco: **168,1 KB → 0,7 KB**. `getHistoricalPageviewsBySlug`
passou a selecionar só `ga4_data->topPages`. A rota é `force-dynamic`, sem cache
absorvendo.

> [!warning] `->>` devolve texto, não número
> O operador do PostgREST devolve `{"users":"1681"}`, com aspas. Sem conversão
> explícita o `TrendPoint` chegaria ao `GrowthChart` com strings. O padrão já
> existia no arquivo (`partial:context->>partial`) e só não tinha sido aplicado
> aos demais campos.

## As três visualizações

Entram **dentro dos atos existentes** — os não-objetivos de
[[dashboard-sprint-4-handoff|dashboard-audit-uxui-handoff]] vetam ato novo, lib
nova e período semanal.

| Viz | Ato | Fonte |
|---|---|---|
| Acervo mês a mês | 1 · Crescimento | `getHistoricalPageviewsBySlug` |
| Quadrante de oportunidade | 2 · Origem | `gsc_data.topQueries` |
| Até onde leem | 3 · Posts | `ga4_data.articleProgress` |

Derivações puras em `lib/analytics/{heatmaps,query-opportunity}.ts`, sem I/O,
com 49 asserções em `scripts/analytics/testar-heatmaps.mjs` (roda no CI via
`npm run test:analytics`).

### Por que CSS Grid e não biblioteca

Recharts não tem primitivo de heatmap, e somar `nivo` ou `visx` contrariaria a
decisão registrada de não trocar de lib. Tabela semântica com `<th scope>` sai
mais acessível que qualquer canvas, e imprime.

### Por que escala logarítmica

O acervo é lei de potência. Totais por artigo medidos nas fixtures de fev a ago:
**2766, 727, 102, 92, 84, ... 11** no vigésimo quinto — razão de 250:1, com
máximo de célula em 1314.

- Linear põe o 25º em **0,008** de alpha
- Raiz quadrada, em **0,09**
- Log, em **0,35**

Os dois primeiros apagam a cauda inteira — e a cauda é exatamente o que se quer
ver crescer, já que a meta declarada é baixar a concentração do artigo #1 de 78%
para 55% até dezembro.

### Por que densidade de tinta e não matiz

A paleta da marca é preto + off-white + cinzas. Um ramp de hue existiria só
nesta tela. Densidade sobrevive a daltonismo e a impressão em preto e branco.

> [!danger] `print-color-adjust: exact` é obrigatório
> O navegador descarta cor de fundo ao imprimir por padrão. Sem isso a matriz
> sai **em branco** no papel e no PDF — que é exatamente o uso declarado, já que
> o dashboard é apresentado projetado na reunião mensal.

## Profundidade de leitura

`article_progress` é disparado por `ReadingProgress.tsx` em 25/50/75/90%, com
`article_slug` e `percent_scrolled` como dimensões personalizadas do GA4.

Estado em 12/08/2026: **as dimensões já estão registradas** e o dado começou a
fluir por volta de 10/08. Medido em 28 dias: 95 eventos, 41 com slug populado,
distribuídos em 6 artigos.

> [!warning] Dimensão personalizada do GA4 não é retroativa
> Evento anterior ao registro devolve `(not set)`. Eram 54 dos 95. Esse balde é
> contado à parte e **nunca** vira slug — como linha, dominaria a matriz. Encolhe
> sozinho a cada mês.

**Piso de amostra: 30 leitores**, o mesmo que
`conteudo_performance_snapshots.amostra_suficiente` já formaliza. Abaixo disso a
linha sai cinza e sem recomendação. No volume atual isso silencia quase tudo — e
é o comportamento certo: com 8 leitores, um abandono a mais move a barra em 12
pontos.

A base da retenção é o bucket de 25%, não o total de eventos: todo mundo que
rolou cruzou os 25% antes de chegar aos 50%.

## Backfill histórico — a armadilha

O GSC retém 16 meses, então recuperar a cauda é possível. **Mas não com
`generate-report.mjs --month`.**

Um run ao vivo chama `fetchGsc(..., urlsToInspect)`, e a **URL Inspection API não
tem modo histórico** — devolve o status de indexação de *hoje*. Rodar
`--month 2026-02` gravaria a indexação de agosto dentro do snapshot de fevereiro,
e daí ela flui para `insights`, `actions`, `summary` e `indexedCount` dentro de
`context`. O `upsertSnapshot` faz `merge-duplicates` e sobrescreve sem avisar.

Isso desfaria a decisão registrada em [[analytics-methodology]] de **não
regenerar** os relatórios de fev a jun por causa do `+1` de indexação.

Backfill correto: script dedicado que reescreve só `topQueries` / `topPages`,
deixando `indexation` e `context` intactos. `scripts/analytics/adhoc-cauda-longa.mjs`
já puxa com `rowLimit: 25000` e consulta o par `['query','page']` — que diz
**qual página ranqueia para qual query**, transformando "reescrever o title" em
"reescrever *este* title".

## Estado da conversão

A instrumentação de 30/07 saiu do zero. Últimos 28 dias contra julho inteiro:

| Evento | Julho | 28 dias até 11/08 |
|---|---|---|
| `cta_click` | 1 | 13 |
| `whatsapp_click` | 1 | 10 |
| `form_submit` | — | 5 |
| `generate_lead` | — | 1 |

`form_submit: 5` contra `generate_lead: 1` é discrepância a investigar — ou
quatro submissões não persistiram, ou a ordem dos eventos difere do esperado.

## Contexto relacionado

- [[analytics-methodology]] — Health Score, metas, red flags, mês parcial
- [[quadro-conteudo]] — de onde saem as pautas que o quadrante alimenta
- [[seo-aeo-strategy]] — estratégia que as queries do quadrante servem
- [[site]] · [[blog]] · [[seo-aeo]]
