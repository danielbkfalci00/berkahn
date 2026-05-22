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
status: active
ai_summary: ""
---

# <% hoje %> — <% diaSemana %>

← [[<% ontem %>]] | [[<% amanha %>]] →

Sprint: [[sprint-ativa]]

## O que fiz

- <% tp.file.cursor(1) %>

## Próximos passos

- [ ] <% tp.file.cursor(2) %>

## Ideias soltas

- <% tp.file.cursor(3) %>

## Anotações

<% tp.file.cursor(4) %>
