---
tipo: meta
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - status/active
  - domain/lsf
ai_summary: Hub das atomic notes em 70-knowledge/. Cada nota = 1 conceito reutilizável (200-400 palavras com dados-chave). Linkadas em artigos via [[wikilink]]. Origem: destiladas de pesquisas e artigos publicados. Atualizado conforme atomic notes são criadas.
status: active
---

# 70-knowledge — Atomic Notes Hub

> Hub das atomic notes do vault Berkahn. Cada nota representa **1 conceito reutilizável** que pode ser linkado de múltiplos artigos, pesquisas, apresentações e materiais.

## Propósito

Conhecimento de domínio (especialmente LSF/Steel Frame) hoje vive disperso em:
- `20-context/steel-frame-domain.md` — contexto genérico (90 linhas, raso)
- 33 artigos publicados em `40-content/blog/publicados/` — conteúdo profundo, mas isolado e não reutilizável
- Pesquisas editoriais no bloco da pauta — consumidas por `/criacao`

Atomic notes resolvem este gap: destilação de conceitos centrais em notas com:
- `ai_summary` (1 linha) + síntese de 200-400 palavras
- Campo `usado_em: []` (rastreabilidade onde é referenciada)
- Campo `origem_pesquisa: ""` (pesquisa raw que originou)
- Wikilinks para [[steel-frame-domain]] (contexto pai) e artigos relevantes

Cada nova pesquisa busca em [[conhecimento.base]] (criada Sprint 3) ANTES de re-explorar tema já mapeado.

## Hubs relacionados

- [[steel-frame-domain]] — contexto de domínio pai (LSF)
- [[pesquisas]] — workflow do projeto Pesquisas
- [[workflow-pesquisa]] — pipeline tema → fontes → síntese → atomic notes
- [[blog]] — hub do projeto Blog (consume atomic notes em artigos)

## Atomic notes por domínio

### LSF — Light Steel Frame (core)

Planejado em Sprint 2.2 — populado conforme criadas:

- [[lsf-normas-nbr]] — NBR 16970, 14762, 15253 (normas técnicas)
- [[lsf-custos]] — faixa R$/m², SINAPI, comparativos
- [[lsf-cronograma]] — timeline típico de obra (30-40% mais rápido)
- [[lsf-fogo]] — resistência ao fogo (NBR 14432, drywall RF)
- [[lsf-acustica]] — desempenho acústico (lã mineral)
- [[lsf-financiamento]] — Caixa, bancos, MCMV
- [[lsf-vs-alvenaria]] — comparativo técnico e econômico
- [[lsf-fundacao]] — tipos de fundação para LSF (radier, sapata)
- [[lsf-sustentabilidade]] — 90% reciclável, economia circular
- [[lsf-versatilidade-arquitetonica]] — flexibilidade, paredes não-estruturais

### Incrementais (criadas durante backfill Sprint 2.1B conforme conceitos aparecem)

Espera-se +5-8 notas: ex `lsf-conceitos-basicos`, `lsf-componentes-drywall`, `lsf-execucao-erros`, `lsf-isolamento-termico`, etc.

## Convenções

- **Naming**: kebab-case com prefixo de domínio (`lsf-X`, `drywall-X`, `normas-X`)
- **Tamanho**: 200-400 palavras (1 conceito = 1 nota; se ultrapassa, dividir)
- **Frontmatter mínimo**:
  ```yaml
  tipo: atomic
  tags: [ai/context, status/active, domain/<dominio>]
  ai_summary: <1 linha>
  status: active
  usado_em: [<slugs dos artigos fonte/destino>]
  origem_pesquisa: <slug pesquisa raw ou ''>
  ```
- **Rodapé padrão**: `**Contexto pai**: [[<dominio>]] · **Usado em**: <wikilinks artigos> · **Origem**: [[<pesquisa>]]`
- **Wikilinks**: cada atomic note DEVE linkar para [[steel-frame-domain]] (ou contexto pai apropriado) + ≥1 artigo que a usa

## Manutenção

- A cada nova atomic note criada, adicionar wikilink nesta seção apropriada acima
- Quando `usado_em` ficar vazio por > 90 dias → flag para revisão (atomic não está sendo usada)
- Quando 2+ atomic notes cobrem mesmo conceito → consolidar via [[conhecimento.base]] view "Duplicates"
