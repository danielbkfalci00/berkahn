<%*
const hoje = tp.date.now("YYYY-MM-DD");
const versao = await tp.system.prompt("Versão", "1.0");
-%>
---
tipo: prompt
locked: true
versao: <% versao %>
calibrado_em: <% hoje %>
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - ai/prompt
  - ai/locked
status: locked
ai_summary: ""
---

> [!warning] NÃO ALTERAR sem permissão
> Este prompt foi calibrado em <% hoje %> (v<% versao %>).
> Alterações destroem a consistência do output. Pergunte antes.

# <% tp.file.title %>

## Prompt

```
<% tp.file.cursor(1) %>
```

## Quando usar

<% tp.file.cursor(2) %>

## Histórico de calibragem

- <% hoje %> — v<% versao %> — <% tp.file.cursor(3) %>
