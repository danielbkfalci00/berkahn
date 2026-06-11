<%*
const hoje = tp.date.now("YYYY-MM-DD");
const ontem = tp.date.now("YYYY-MM-DD", -1);
const amanha = tp.date.now("YYYY-MM-DD", 1);
const diaSemana = tp.date.now("dddd");
-%>
---
tipo: daily
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - source/daily
  - status/active
ai_summary: ""
status: active
projetos_dia: []
---

# <% hoje %> — <% diaSemana %>

← [[<% ontem %>]] | [[<% amanha %>]] →

Sprint: [[sprint-ativa]] · Standup mais recente: navegar `00-meta/standup/` · Wrap-up mais recente: `00-meta/wrap-up/`

## Projetos trabalhados hoje

> Preencher com os hubs em que houve atividade hoje. Atualizar `projetos_dia` no frontmatter conforme.

- [[<% tp.file.cursor(1) %>]] — <% tp.file.cursor(2) %>

## O que fiz

- <% tp.file.cursor(3) %>

## Próximas ações por projeto

- [[blog]]: <% tp.file.cursor(4) %>
- [[linkedin]]: <% tp.file.cursor(5) %>
- [[site]]: <% tp.file.cursor(6) %>
- [[seo-aeo]]: <% tp.file.cursor(7) %>

## Próximos passos (gerais)

- [ ] <% tp.file.cursor(8) %>

## Ideias soltas

- <% tp.file.cursor(9) %>

## Anotações

<% tp.file.cursor(10) %>

## Hubs (acesso rápido)

[[blog]] · [[linkedin]] · [[site]] · [[seo-aeo]] · [[apresentacoes]] · [[materiais]] · [[pesquisas]]
