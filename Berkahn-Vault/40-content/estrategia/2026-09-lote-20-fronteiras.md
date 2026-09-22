---
tipo: documentacao
criado: 2026-09-09
atualizado: 2026-09-10
tags:
  - project/blog
  - project/seo-aeo
  - status/active
  - source/manual
  - domain/lsf
ai_summary: "Ordem de publicação e restrições vinculantes dos 20 fluxos produzidos em 05 e 06/09: 15 artigos novos, 4 reposicionamentos e a pauta de cronograma redirecionada para revisão do guia existente. As 20 capas Blog e LinkedIn foram geradas e ligadas aos cards em 10/09."
status: active
subtipo: mapa-lote
projeto: blog
periodo_analise: "pautas com data-alvo de 2026-08-17 a 2026-10-26"
---

# Lote de 20: ordem de publicação e fronteiras

Os 20 fluxos foram produzidos em 05 e 06/09 por dois workflows, cada um com um
agente árbitro lendo os dez contratos de escopo juntos antes da escrita. O árbitro
julgou **19 colisões** contra três conjuntos: os 43 artigos publicados, os slugs
reservados pelo lote anterior e os irmãos do próprio lote.

As decisões dele estão por extenso no bloco **Pesquisa** de cada pauta, seção
"Canibalização, verificado antes de escrever". Esta nota não as repete: registra
só o que precisa sobreviver até a publicação, semanas depois, quando ninguém vai
reabrir dez blocos de pesquisa para lembrar por que uma frase não pode ser usada.

Detalhe do estado de cada card em `/admin/conteudo/<id>`. Fluxo em
[[workflow-conteudo]]. Calendário em [[2026-08-calendario-editorial]].

## O que existe

| Data-alvo | Card | Artigo | Tipo |
|---|---|---|---|
| 17/08 | `0197a729` | `custo-steel-frame-m2-2026` | **reposicionamento** |
| 24/08 | `b08575a6` | `aprovar-projeto-prefeitura-sp` | novo |
| 24/08 | `5753baf4` | `steel-frame-litoral-maresia` | novo |
| 31/08 | `423ac435` | `pendurar-tv-parede-steel-frame` | novo |
| 31/08 | `7994d19a` | `steel-frame-esquenta-conforto-termico` | novo |
| 07/09 | `72133a0d` | `financiar-construcao-light-steel-frame` | **reposicionamento** |
| 14/09 | `3f612a4e` | `telhado-steel-frame-tipos-custo-m2` | novo |
| 14/09 | `39c936e8` | `entrada-financiamento-construcao` | novo |
| 21/09 | `ffa2dc80` | `impermeabilizacao-banheiro-steel-frame` | novo |
| 21/09 | `831f9266` | `normas-light-steel-frame-brasil` | **reposicionamento** |
| 28/09 | `a5396a74` | `casa-steel-frame-70m2` | novo |
| 28/09 | `239dc13e` | `vida-util-casa-steel-frame` | novo |
| 05/10 | `f579f618` | `manutencao-casa-steel-frame` | novo |
| 05/10 | `d13686e3` | `passo-passo-construcao-steel-frame` | **revisão direcionada; sem nova URL** |
| 12/10 | `b2536b68` | `casa-steel-frame-valoriza-revenda` | novo |
| 19/10 | `10139838` | `acustica-entrepiso-steel-frame` | novo |
| 26/10 | `8ef29137` | `galpao-steel-frame-ou-estrutura-metalica` | novo |
| 26/10 | `09e83ca8` | `steel-frame-vantagens-desvantagens` | **reposicionamento** |
| 26/10 | `df7906d4` | `reforma-tributaria-empreitada-incorporacao` | novo |
| 26/10 | `a66a5dba` | `steel-frame-comercial-loja-escritorio` | novo |

15 artigos novos e 5 revisões de páginas existentes. A pauta de cronograma não
abre URL: a pesquisa reprovou a criação de um oitavo conteúdo conflitante e o
destino passou a ser o guia já indexado `passo-passo-construcao-steel-frame`.

> [!warning] As 5 revisões mexem em página indexada e viva
> Eles não criam URL. O draft tem o mesmo nome do arquivo em `publicados/`, o que
> é estado de staging por design: `produzir` num slug publicado escreve em
> `post_draft_payload` sem tocar no artigo no ar, e `publicar` troca por RPC.
> **Cada um exige `--usar-existente` com confirmação humana explícita.**
> `custo-steel-frame-m2-2026` sozinho responde por 65% das impressões e 78% dos
> cliques do blog, então é o de maior risco do conjunto.

## Restrições que precisam sobreviver até a publicação

Estas vieram do árbitro e valem no momento de publicar, não só de escrever.

**Sequenciamento obrigatório**

- `239dc13e` (vida útil) publica **antes** de `f579f618` (manutenção). As duas
  nasceram com o mesmo insight no calendário e as datas foram trocadas no quadro
  por isso. Vida útil é dona dos números (90/100/300 anos, Z275, VUP da NBR 15575);
  manutenção é dona do calendário de periodicidade e do tripé NBR 5674/14037/17170.
- `b2536b68` (valoriza/revenda) publica antes ou junto de `09e83ca8` (desvantagens),
  porque o item "difícil de revender" só cabe como menção com handoff na segunda.
- `a5396a74` (casa de 70 m²) publica **depois** do reposicionamento de
  `custo-steel-frame-m2-2026` estar reindexado, para não somar sinal de preço
  durante a reindexação da página que sustenta o blog.
- `a66a5dba` (loja e escritório) é a cabeça do cluster comercial e
  `8ef29137` (galpão) é o satélite técnico, por isso o galpão foi movido para 26/10.

**Propriedade exclusiva de conteúdo**

- `casa-steel-frame-70m2` não usa "mais barato que alvenaria" nem "vale a pena" em
  title, meta, H1, H2 ou answer_summary, e não publica R$/m² comparativo entre
  sistemas.
- `telhado-steel-frame-tipos-custo-m2` não publica R$/m² de casa inteira, nem
  tabela comparativa com alvenaria, nem decomposição do CUB.
- `acustica-entrepiso-steel-frame` não republica os 45 a 50 dB nem R-value, que são
  de `isolamento-termico-acustico-steel-frame`, e abre com um parágrafo separando
  ruído aéreo de ruído de impacto.
- `09e83ca8` não refaz nenhuma refutação de `mitos-verdades-steel-frame`.

**Achado que virou hipótese aberta**

O árbitro do lote 2 levantou que `steel-frame-vantagens-desvantagens` está em
`Crawled - currently not indexed` e que o `answer_summary` de
`mitos-verdades-steel-frame` já faz a mesma refutação das sete objeções. A
desindexação pode ser canibalização entre duas páginas **já publicadas**. Não foi
investigado nem confirmado.

## Pendências

- [x] Geradas e vinculadas as 20 capas Blog 1200x800 e LinkedIn 1080x1350; staging dos cards e arquivos públicos preparados em 10/09.
- [ ] @bruno Confirmar `--usar-existente` para cada uma das 5 revisões antes de produzir, porque elas alteram páginas indexadas #pendencia
- [x] `d13686e3` redirecionada para revisão de `passo-passo-construcao-steel-frame`, sem nova URL e sem fabricar um cronograma de obra não documentado.
- [ ] @bruno Fornecer um cronograma real de obra Berkahn, com área e datas, antes de publicar números próprios na revisão de `passo-passo-construcao-steel-frame` #pendencia
