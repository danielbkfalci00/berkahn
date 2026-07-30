---
tipo: documentacao
criado: 2026-07-29
atualizado: 2026-07-29
tags:
  - project/blog
  - project/seo-aeo
  - status/active
  - source/manual
  - domain/lsf
ai_summary: "Diagnóstico editorial de jul/2026 com a cauda longa real do GSC (1.270 queries em 90 dias, contra as 20 que o pipeline enxergava). Achado central: `quanto-custa-construir-steel-frame-precos-m2-2026` é canibalizada em TODAS as queries de preço e desperdiça 17.759 impressões com CTR 1,15%. Conteúdo técnico captura 0,87% de CTR. Base do calendário ago-dez/2026."
status: active
subtipo: diagnostico-editorial
periodo_analise: "2026-04-29 a 2026-07-27 (90 dias)"
---

# Diagnóstico editorial: o que funciona, o que não funciona e por quê

Este documento sustenta o [[2026-08-calendario-editorial]]. Ele existe porque toda análise anterior de SEO da Berkahn foi feita sobre uma amostra truncada, e a amostra completa muda a conclusão.

## O erro de medição que contaminava tudo

O pipeline de analytics pede ao Google Search Console as **20 queries de maior clique por mês** (`fetch-gsc.mjs:34`, `rowLimit: 20`). Todo relatório de fevereiro a julho enxergou só isso.

A API aceita até 25.000 linhas. Ao pedir tudo, a janela de 90 dias (29/04 a 27/07) devolve:

| Medida | Amostra antiga (20 queries) | Real |
|---|---|---|
| Queries distintas | 20 | **1.270** |
| Queries com zero clique | não visíveis | **1.135 (89%)** |
| Impressões nessas queries mudas | 0 | **4.516 (24,7%)** |

A leitura de que "o tráfego é 100% de preço" vinha de olhar apenas o topo de uma distribuição. Com a cauda inteira, o quadro é outro: preço domina, mas há 1.135 buscas em que a Berkahn aparece e ninguém clica.

## Distribuição real por intenção

| Intenção | Queries | Impressões | % | Cliques | CTR |
|---|---:|---:|---:|---:|---:|
| Preço e custo | 403 | 14.323 | 78,5% | 627 | 4,38% |
| Genéricas e institucionais | 635 | 3.060 | 16,8% | 60 | 1,96% |
| **Técnicas** | 139 | 346 | 1,9% | **3** | **0,87%** |
| Local e comercial | 47 | 233 | 1,3% | 11 | 4,72% |
| Marca | 2 | 116 | 0,6% | 19 | 16,38% |
| **Financiamento** | 16 | 85 | 0,5% | **0** | **0%** |
| Comparativas | 18 | 54 | 0,3% | 1 | 1,85% |
| **Objeção** | 10 | 31 | 0,2% | **0** | **0%** |

<canvas data-chart='{"type":"bar","data":{"labels":["Preço/custo","Genéricas","Técnicas","Local","Marca","Financ.","Comparativo","Objeção"],"datasets":[{"label":"Impressões (90d)","data":[14323,3060,346,233,116,85,54,31],"backgroundColor":"#0A0A0A"}]},"options":{"indexAxis":"y","plugins":{"legend":{"display":false}},"scales":{"x":{"type":"logarithmic"}}}}' height="220"></canvas>

Três leituras que mudam a estratégia:

**O conteúdo técnico não captura busca.** 139 queries técnicas produziram **3 cliques em 90 dias**. Os artigos de norma, fundação, fogo, isolamento e patologia existem, rankeiam por volta da posição 5 e não são clicados. A hipótese de "autoridade técnica atrai tráfego" está refutada pelo dado. Isso não significa que o conteúdo técnico seja inútil, significa que ele **não é canal de aquisição** e não deve ocupar 40% do calendário.

**Intenção local converte 5x melhor que a média.** 4,72% de CTR contra 1,96% das genéricas, com apenas 233 impressões. Existe demanda comercial que o site quase não alcança.

**A marca converte a 16,38%** e tem só 116 impressões. Quem já conhece a Berkahn clica; quase ninguém a conhece.

## O maior desperdício: canibalização medida, não suposta

O relatório anterior levantou a suspeita. O dado de query × página confirma e quantifica.

Em **todas** as queries de preço, as duas páginas aparecem juntas, e a segunda aparece muito abaixo:

| Query | `custo-steel-frame-m2-2026` | `quanto-custa-construir-...` |
|---|---|---|
| steel frame valor m2 | 2.268 imp · 111 clk · **pos 3,5** | 328 imp · 2 clk · **pos 10,5** |
| casas steel frame preço m2 | 1.301 imp · 85 clk · pos 3,4 | 48 imp · 1 clk · pos 10,4 |
| steel frame preço | 1.234 imp · 34 clk · pos 5,0 | 19 imp · 0 clk · pos 15,8 |
| light steel frame preço m2 | 527 imp · 20 clk · pos 5,9 | 91 imp · 0 clk · **pos 25,3** |
| casa steel frame 100m2 preço | 474 imp · 27 clk · pos 3,1 | 57 imp · 0 clk · pos 9,9 |
| steel frame é mais barato que alvenaria | 612 imp · 17 clk · pos 5,8 | 4 imp · 0 clk · pos 2,8 |

O padrão é consistente demais para ser coincidência: onde a página-mãe está em 3, a segunda está em 10; onde a mãe está em 6, a segunda está em 25.

**Resultado acumulado em 90 dias**: `quanto-custa-construir-steel-frame-precos-m2-2026` tem **17.759 impressões e 204 cliques — CTR de 1,15%**, contra 2,98% da página-mãe. Não é uma página que compete: é uma página sendo suprimida pelo próprio site.

> [!warning] As duas páginas ainda se contradizem
> Para Sudeste padrão médio, uma diz R$ 4.395 e a outra apresenta faixa de R$ 4.000 a R$ 5.200. O concorrente que está acima nas duas usa índice de fev/2026, mais recente que o de ambas. Isso é dano de credibilidade direto numa query onde o usuário compara valores entre abas, e é exatamente o tipo de inconsistência que faz um modelo de IA escolher outra fonte para citar.

## Demanda medida, zero clique

Estas queries têm impressão real e **nenhum clique** em 90 dias. São lacunas, não fracassos de ranking.

| Query | Impressões | Posição | Existe artigo? |
|---|---:|---:|---|
| steel frame valor m2 **2023** | 357 | 5,7 | não, e o artigo diz "2026" |
| steel frame preço m2 **2023** | 325 | 6,3 | idem |
| light steel framing preço m2 | 331 | 8,4 | grafia "framing" não coberta |
| **telhado steel frame preço m2** | 163 | 5,9 | **não existe artigo de cobertura** |
| casa em steel frame é mais barata | 47 | 4,6 | não dedicado |
| laje steel frame preço | 44 | 6,8 | existe artigo, sem preço |
| casa steel frame **70m2** | 36 | 6,7 | não |
| cobertura steel frame preço m2 | 31 | 3,3 | não |
| casa steel frame **100m2** | 24 | 7,7 | não dedicado |
| casa steel frame **150m2** | 22 | 6,7 | não |
| construtora steel frame | 32 | 6,3 | não há página comercial |

Dois padrões acionáveis:

**O ano na query não é o ano do artigo.** Somadas, as buscas com "2023" valem **682 impressões e 1 clique**. O artigo grita 2026; quem busca 2023 não reconhece a resposta. Um bloco de série histórica de preço dentro da página-mãe resolve sem criar página nova.

**Metragem é intenção própria e não tem página.** 70m², 100m² e 150m² aparecem separadamente. A Berkahn tem a melhor resposta do mercado para isso (faixas fechadas por metragem) e não sinaliza em título nem em URL.

## Onde o acervo perde

| Página | Impressões | Cliques | CTR | Leitura |
|---|---:|---:|---:|---|
| `custo-steel-frame-m2-2026` | 63.757 | 1.903 | 2,98% | o ativo |
| `quanto-custa-construir-...` | 17.759 | 204 | 1,15% | canibalizada |
| `financiar-construcao-light-steel-frame` | 5.316 | 40 | **0,75%** | pior relação do acervo |
| `normas-light-steel-frame-brasil` | 4.010 | 34 | 0,85% | |
| `fundacao-steel-frame-vs-alvenaria` | 1.539 | 15 | 0,97% | query pede "radier", título diz "vs alvenaria" |
| `drywall-st-ru-rf` | 949 | 2 | **0,21%** | |
| `protecao-contra-quedas-construcao-civil` | 463 | **0** | **0%** | tema fora do funil |
| `steel-frame-vantagens-desvantagens` | 141 | 0 | 0% | não indexada |
| `isolamento-termico-acustico-steel-frame` | 110 | 0 | 0% | |
| **`/` (homepage)** | 645 | 85 | **13,18%** | converte 4x melhor que qualquer artigo |

A homepage é o item mais informativo da tabela. Com 1% das impressões do artigo campeão, ela tem CTR quatro vezes maior. O que falta não é conteúdo, é **página que responda intenção comercial**.

## O que a concorrência faz melhor

Levantamento de SERP em 8 queries que a Berkahn já disputa:

1. **O título exibido está mutilado.** Em "quanto custa construir em steel frame" a Berkahn é **posição 1**, e o Google descarta a title tag e exibe o H1 cortado em "...tabela de preços ...". O usuário nunca vê "2026" nem "por m²". Rankear em primeiro e ser truncado explica boa parte do CTR de 1,15%.
2. **Ninguém coloca faixa de preço no título.** Espaço aberto numa SERP inteiramente de preço.
3. **Entidade no título decide.** Em financiamento, o primeiro colocado lidera com "Caixa". O título da Berkahn é o mais genérico da SERP.
4. **Ano só ajuda onde a query tem tempo.** Em "é mais barato que alvenaria", os quatro vencedores usam formato pergunta e nenhum usa ano. A Berkahn responde com a página que grita 2026.
5. **A query comercial mais valiosa não tem a Berkahn.** Em "construtora steel frame sp" nenhum vencedor rankeia com artigo: são homepages e páginas de serviço geolocalizadas. Um concorrente ocupa 4 posições com um cluster de páginas comerciais.
6. **O líder de preço ganha sem escrever mais.** 2.800 palavras contra 3.200-3.800 da Berkahn. Ganha por dado mais fresco, autor nomeado e uma seção de **desvantagens** que a Berkahn não tem em nenhuma página de preço.
7. **A fonte que todos citam tem 850 palavras.** Um índice mensal de custo, sem metodologia declarada, rankeia acima da Berkahn porque é a série temporal que todo mundo referencia.

## A queda do tráfego de IA é aritmética, não problema

O relatório de julho registra o tráfego de assistentes de IA caindo de 14,0% (maio) para 4,6%. Isso levou à leitura de que "a estratégia AEO parou de funcionar". **A leitura está errada.**

Decompondo maio → julho: se o ChatGPT tivesse ficado parado nas 120 sessões de maio, a fatia cairia sozinha para 6,0%, só porque o tráfego total mais que dobrou. **Cerca de 8 dos 10 pontos percentuais de queda são efeito de denominador.** As ~40 sessões restantes (120 → ~80) ficam dentro da variação normal de um canal desse tamanho, e maio foi um pico isolado numa série 39 → 120 → 101 → 80.

Nenhuma fonte de mercado reporta queda de referrals do ChatGPT em jun-jul/2026; os levantamentos grandes mostram crescimento. O que mudou foi a **composição**: a fatia do ChatGPT no mercado de IA caiu de 76,4% para 52,7% em um ano, enquanto Gemini foi de 8,9% para 27,3% e Claude de 1,6% para 8,9%.

**Consequência prática**: pare de reportar "% de tráfego de IA". Com o orgânico crescendo 40% ao mês, esse número cai mesmo quando a IA cresce. A métrica honesta é **sessões absolutas de IA em média móvel de 3 meses**.

### Mas há um erro de configuração real, que não causou a queda

`app/robots.ts:13` bloqueia `CCBot, GPTBot, ClaudeBot, Google-Extended`, com o comentário "Block training-only crawlers (no search/citation value)".

**Esse comentário é falso para o Google-Extended.** Ele não protege de AI Overviews (quem governa isso é o Googlebot) e não é sinal de ranking. O que ele faz é excluir o site do **grounding do app Gemini e do Vertex AI** — justamente a plataforma que triplicou de fatia. A Berkahn paga o custo sem receber o benefício.

O bloqueio entrou em 13/04/2026, e o tráfego do ChatGPT triplicou **depois** disso (39 sessões em abril → 120 em maio). O timing sozinho refuta a hipótese de que o robots.txt causou a queda. São dois assuntos diferentes: a queda é ruído, o bloqueio do Google-Extended é um erro a corrigir por mérito próprio.

> [!warning] `seo-aeo-strategy.md` descreve o robots.txt errado
> A nota de contexto afirma que o site "permite ChatGPT-User/PerplexityBot e bloqueia GPTBot, ClaudeBot, CCBot, anthropic-ai". O arquivo real (`app/robots.ts:11-20`) libera **OAI-SearchBot, Claude-SearchBot e PerplexityBot**, bloqueia **Google-Extended** (não mencionado na nota) e nunca cita `anthropic-ai`. Corrigir a nota.

### O que a evidência de 2025-2026 diz sobre formato

Isto muda o desenho das pautas mais do que qualquer keyword:

- **Frescor é o único fator estrutural com evidência causal unânime.** Atualizar página existente supera publicar página nova. `custo-steel-frame-m2-2026` tem `dateModified` de **13/04/2026** — 3,5 meses de defasagem numa página cujo título promete "2026" e que carrega 78% dos cliques.
- **O que faz citar é afirmação autocontida com número, unidade, data e fonte nomeada** no corpo visível. Estatísticas, comparações e definições têm o maior uplift medido.
- **FAQ e H2 em forma de pergunta não aumentam citação por IA.** As duas medições diretas do efeito são negativas. Continuam valendo porque funcionam no Google, não por AEO.
- **Schema não é alavanca de citação.** O próprio Google diz que não é necessário para IA generativa. Manter pelo rich result.
- **`llms.txt` é cargo cult**: 97% dos arquivos publicados nunca receberam uma requisição. O arquivo já existe e custa nada; não investir mais tempo nele.
- **98% do conteúdo citado por IA é de terceiros.** A maior alavanca não está no blog: está em menção de marca fora do site.

> [!warning] Bug do Search Console contamina os relatórios de fev a abr/2026
> O Google registra um erro de logging que **super-reportou impressões de 13/05/2025 até 27/04/2026**, sem afetar cliques. Isso produz exatamente a assinatura "impressões sobem, CTR cai" — e os relatórios de fevereiro a abril da Berkahn caem dentro dessa janela. Os dados de maio a julho já são pós-correção e são os únicos confiáveis para leitura de CTR.

## Implicações para o calendário

1. **Escrever mais artigo longo é o movimento que comprovadamente não move o ponteiro.** A Berkahn já escreve mais que todos os concorrentes e perde em CTR. O gargalo é embalagem, canibalização e ausência de página comercial.
2. **Resolver a canibalização vale mais que qualquer pauta nova**: 17.759 impressões represadas.
3. **Reduzir o peso do conteúdo técnico puro.** 3 cliques em 90 dias não justifica 40% do calendário. Técnico entra como profundidade dentro de pauta com demanda, não como pauta.
4. **Metragem, cobertura e comparativo de custo** são as três lacunas com demanda medida e zero concorrência interna.
5. **A intenção local é a maior alavanca de conversão não explorada** — e não se resolve com blog.

## Ressalvas de método

- A janela é de 90 dias e agrega meses com volume muito diferente. Serve para intenção e lacuna, não para tendência mensal.
- As impressões somadas por query (18.248) são menores que o total agregado do site porque o GSC omite queries raras por anonimização. A cauda real é maior que a medida.
- Volume absoluto de busca não foi medido: não há ferramenta de keyword volume conectada. Toda leitura de demanda vem de impressão real da Berkahn, o que subestima temas onde ela ainda não rankeia.
- `www.berkahn.com.br` aparece com 415 impressões em 47 páginas e zero cliques na posição 25,3. O padrão sugere rastreador automatizado, não usuário. Não foi usado como sinal.
- Sem instrumentação de conversão (`ga4.events` vazio em todos os meses), "qual pauta gera cliente" continua não mensurável. Tudo aqui usa tráfego como proxy.

---

**Fonte dos dados**: Search Console API, query e query×page, 2026-04-29 a 2026-07-27, via `scripts/analytics/adhoc-cauda-longa.mjs`. Levantamento de SERP e concorrência por pesquisa manual em 29/07/2026.

**Relacionado**: [[2026-08-calendario-editorial]] · [[2026-08-playbook-pautas]] · [[2026-07-performance-blog]]

**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[article-pipeline]] · [[analytics-methodology]]
