<%*
const subtipo = await tp.system.suggester(
  ["user", "feedback", "project", "reference"],
  ["user", "feedback", "project", "reference"],
  false,
  "Subtipo da memória"
);
const titulo = await tp.system.prompt("Título curto", tp.file.title);
const slug = titulo.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
await tp.file.rename(slug);
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: memory
subtipo: <% subtipo %>
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - ai/memory
  - status/active
ai_summary: ""
status: active
slug: <% slug %>
---

# <% titulo %>

<% tp.file.cursor(1) %>

## Why

<% tp.file.cursor(2) %>

## How to apply

<% tp.file.cursor(3) %>
