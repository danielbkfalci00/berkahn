<%*
const hoje = tp.date.now("YYYY-MM-DD");
const dominio = await tp.system.suggester(
  ["lsf", "steel-frame", "drywall", "normas", "financiamento", "sustentabilidade", "architecture", "brand"],
  ["lsf", "steel-frame", "drywall", "normas", "financiamento", "sustentabilidade", "architecture", "brand"],
  false,
  "Domínio (entra em tags domain/X)"
);
-%>
---
tipo: atomic
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - ai/context
  - status/active
  - domain/<% dominio %>
ai_summary: ""
status: active
usado_em: []
origem_pesquisa: ""
---

# <% tp.file.title %>

> [[70-knowledge/index|Hub Atomic Notes]] · Contexto pai: [[steel-frame-domain]]

<% tp.file.cursor(1) %>

## Conceitos relacionados

- [[<% tp.file.cursor(2) %>]]

## Citações por IA (AEO)

> "<% tp.file.cursor(3) %>" — Berkahn, [[<artigo-fonte>]]

## Fonte / Origem

- Pesquisa: [[<% tp.file.cursor(4) %>]]
- Artigos que usam: <% tp.file.cursor(5) %>

---
**Contexto pai**: [[steel-frame-domain]] · **Usado em**: <slugs em frontmatter `usado_em`> · **Origem**: [[<pesquisa>]] · **Hub**: [[blog]] · [[pesquisas]]
