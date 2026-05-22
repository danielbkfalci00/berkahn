<%*
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: atomic
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - ai/context
  - status/active
ai_summary: ""
status: active
---

# <% tp.file.title %>

> [[index]]

<% tp.file.cursor(1) %>

## Conceitos relacionados

- <% tp.file.cursor(2) %>

## Fonte

<% tp.file.cursor(3) %>
