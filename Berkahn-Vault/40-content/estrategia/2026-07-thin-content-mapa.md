---
tipo: documentacao
criado: 2026-07-30
atualizado: 2026-07-30
tags:
  - project/blog
  - project/seo-aeo
  - status/active
  - source/manual
  - domain/lsf
ai_summary: "Mapa dos 9 artigos publicados com menos de 55 palavras (24% do acervo), resolvido em 2026-07-30: 4 sem substituto ficaram no ar com noindex e entram no backlog de reescrita; 5 com substituto foram consolidadas por 301, com destinos verificados como indexados antes de apontar. 14 links internos reescritos para o destino final."
status: active
subtipo: mapa-thin-content
periodo_analise: "2026-04-29 a 2026-07-27 (90 dias)"
---

# Mapa dos artigos vazios e plano de republicação

Diagnóstico em [[2026-07-diagnostico-editorial]]. Calendário em [[2026-08-calendario-editorial]].

## O que foi feito em 2026-07-30

Os 9 artigos foram divididos conforme já existisse ou não outro artigo cobrindo o tema:

- **4 sem substituto** receberam `robots: noindex, follow` e saíram do sitemap. **Não saíram do ar**: as URLs continuam acessíveis e os links internos seguem funcionando.
- **5 com substituto** foram consolidadas por **301** para o artigo bom (ver seção "5 a 9" adiante).

A escolha de `noindex` em vez de 404 ou 301 não foi conservadorismo. Três desses artigos são **hubs de link interno** — `guia-definitivo` recebe 14 links de outros artigos, `isolamento-termico` recebe 10 e `passo-passo` recebe 8. Removê-los quebraria 32 links dentro de artigos bons. E `follow: true` garante que o Google continue percorrendo esses links, então a autoridade não fica presa numa página morta.

Controle em `lib/seo/thin-content.ts`. **Para republicar, basta reescrever o artigo e apagar a linha correspondente da lista.**

## O acervo escondido

| # | Slug | Palavras | Impr 90d | Cliques | Links internos | Queries | Já existe substituto melhor? |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | `guia-definitivo-steel-frame-brasil` | 53 | 395 | 3 | **14** | 12 | não |
| 2 | `financiamento-construcao-steel-frame` | 45 | 480 | 6 | 3 | 3 | **sim** — `financiar-construcao-light-steel-frame` (2.169 palavras) |
| 3 | `passo-passo-construcao-steel-frame` | 43 | 184 | 3 | **8** | 7 | parcial — a pauta S10 cobre cronograma |
| 4 | `certificacoes-steel-frame` | 49 | 149 | 1 | 4 | 1 | **sim** — `normas-light-steel-frame-brasil` |
| 5 | `isolamento-termico-acustico-steel-frame` | 40 | 110 | 0 | **10** | 1 | não |
| 6 | `steel-frame-futuro-construcao` | 14 | 74 | 2 | **0** | 3 | sim — o guia cobre |
| 7 | `5-vantagens-decisivas-light-steel-frame` | 38 | 51 | 0 | 5 | 4 | **sim** — `steel-frame-vantagens-desvantagens` |
| 8 | `tendencias-construcao-modular-2025` | 11 | 43 | 0 | 1 | 1 | não, mas está desatualizado (2024) |
| 9 | `sustentabilidade-construcao-industrializada` | 45 | 23 | 0 | 2 | 1 | **sim** — `...-economia-circular` |

**Total**: 1.509 impressões e 15 cliques em 90 dias. CTR agregado de **0,99%**, contra 3,95% do site.

Contagem de palavras feita sobre o corpo sem o bloco "Leia também", que em vários casos é maior que o artigo. Publicados entre **set/2024 e jan/2025** — são stubs do lançamento do blog, não conteúdo recente.

## Plano de republicação, em ordem

A ordem combina demanda latente (impressões), valor estrutural (links internos recebidos) e ausência de substituto. Um por mês é ritmo suficiente: são páginas que já estão escondidas e não sangram mais.

### 1. `guia-definitivo-steel-frame-brasil` — prioridade máxima

395 impressões, **12 queries distintas** e 14 links internos. É o hub natural do acervo e não tem substituto. Reescrever como **pillar page** de 3.000+ palavras que enderece as 12 queries e linke para os artigos de cluster. É o item de maior retorno da lista.

### 2. `passo-passo-construcao-steel-frame`

184 impressões, 8 links internos, 7 queries. Sobreposição parcial com a pauta S10 (cronograma semana a semana). **Decidir na hora**: ou vira a pauta S10 neste slug, aproveitando o histórico, ou é reescrito como "etapas do processo" e a S10 sai em slug novo. A primeira opção é melhor.

### 3. `isolamento-termico-acustico-steel-frame`

10 links internos e demanda real, sem substituto. Conecta com `anatomia-parede-steel-frame`, que já é bom. Reescrever com números de transmitância e dB, que é o que falta na SERP inteira.

### 4. `tendencias-construcao-modular-2025`

Já agendado como refresh em **dezembro** no calendário. Republicar como "Tendências 2027".

### 5 a 9 — consolidadas por 301 em 2026-07-30 ✅

As cinco já tinham artigo melhor no ar cobrindo o mesmo tema. Reescrevê-las criaria canibalização nova, que é exatamente o problema que estamos resolvendo nas páginas de custo. Foram consolidadas com 301 (declarados em `next.config.ts`), e **saem do backlog de republicação**.

| De | Para | Impressões consolidadas |
|---|---|---:|
| `financiamento-construcao-steel-frame` | `financiar-construcao-light-steel-frame` | 480 |
| `certificacoes-steel-frame` | `normas-light-steel-frame-brasil` | 149 |
| `steel-frame-futuro-construcao` | `construcao-industrializada-casa-montada-como-carro` | 74 |
| `5-vantagens-decisivas-light-steel-frame` | `steel-frame-vs-alvenaria` | 51 |
| `sustentabilidade-construcao-industrializada` | `...-economia-circular` | 23 |

**Todos os destinos foram verificados pela URL Inspection API antes de apontar**, e dois mudaram por causa disso:

- `5-vantagens-decisivas` iria para `steel-frame-vantagens-desvantagens`, que está **"Crawled, currently not indexed"** desde 13/04. Redirecionar para página fora do índice não consolidaria nada. Foi para `steel-frame-vs-alvenaria`.
- `steel-frame-futuro-construcao` iria para `guia-definitivo`, que está em `noindex` na mesma mudança. Foi para o artigo de construção industrializada, que cobre o mesmo ângulo de transformação do setor.

**14 links internos** que apontavam para as URLs antigas foram reescritos para o destino final, no Supabase e no vault. Um redirect interno funciona, mas adiciona um salto e dilui sinal. O texto da âncora também foi trocado — manter a âncora antiga apontando para outro artigo produziria link enganoso.

## Como medir se funcionou

O relatório do cron de 01/09 e 01/10 responde:

- A **cobertura de indexação** deve cair de 34/38 para ~29/29 — menos páginas indexadas, todas com conteúdo
- `steel-frame-aguenta-vento-forte`, hoje **"URL is unknown to Google"**, deve ser descoberto. A hipótese é que o orçamento de rastreamento estava sendo gasto nas páginas vazias
- O CTR médio do site deve subir por composição, já que sai da média o conjunto que rendia 0,99%

Se em 01/10 nada disso tiver acontecido, a hipótese de que thin content estava consumindo rastreamento está errada e vale revisitar.

---

**Relacionado**: [[2026-07-diagnostico-editorial]] · [[2026-08-calendario-editorial]] · [[blog]] · [[seo-aeo]]

**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[article-pipeline]]
