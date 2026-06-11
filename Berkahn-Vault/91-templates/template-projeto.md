<%*
const projeto = await tp.system.prompt("Nome do projeto (slug — ex: blog, site, seo-aeo)", tp.file.title);
const projetoTitle = await tp.system.prompt("Título do projeto (ex: Blog, Site, SEO/AEO)", projeto.charAt(0).toUpperCase() + projeto.slice(1));
await tp.file.rename(projeto);
const hoje = tp.date.now("YYYY-MM-DD");
-%>
---
tipo: projeto
criado: <% hoje %>
atualizado: <% hoje %>
tags:
  - project/<% projeto %>
  - status/active
ai_summary: "Hub do projeto <% projetoTitle %> — status, KPIs, bloqueios, links para contexto/regras/workflow. Lido por /standup, /wrap-up. Source of truth do estado do projeto."
status: active
projeto: <% projeto %>
kpi_atualizado_em: <% hoje %>
contextos_aplicados: []
workflow: ""
prompts_relacionados: []
bases_relacionadas: []
subagents_uteis: []
---

# <% projetoTitle %> — Projeto

> Hub do projeto. Atualizado semanalmente via `/standup` (segunda 9h) e `/wrap-up` (sexta 17h). Lido por `/standup`, `/wrap-up` e qualquer comando relacionado.

## Status atual

<% tp.file.cursor(1) %>

## Bloqueios ativos

- [ ] <% tp.file.cursor(2) %>

## Próximos 7 dias

- [ ] <% tp.file.cursor(3) %>

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| <% tp.file.cursor(4) %> |  |  |  |

> KPIs vivem no frontmatter como chaves `kpi_<nome>:` e `kpi_meta_<nome>:` (pattern FLAT). Agregados por [[kpis.base]].

## Contexto aplicado

- [[<% tp.file.cursor(5) %>]] — ...

## Workflow & prompts

- Workflow: [[<% tp.file.cursor(6) %>]]
- Prompts: [[<% tp.file.cursor(7) %>]]

## Bases relacionadas

- [[<% tp.file.cursor(8) %>]]

## Subagents úteis

- `@<% tp.file.cursor(9) %>` — quando usar

## Materiais de apoio

- [[<% tp.file.cursor(10) %>]] — índices em `40-content/materiais/indices/`

## Histórico recente

- <% hoje %>: criado
