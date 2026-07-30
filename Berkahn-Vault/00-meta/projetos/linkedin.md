---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-29
tags:
  - project/linkedin
  - status/active
ai_summary: Hub do projeto LinkedIn — posts semanais de divulgação que referenciam artigos do blog. 3 arquivados (formato YYYY-MM-DD-tema/) contra 38 artigos, meta +1/semana. Bruno copia manualmente para Notion. Briefing imagem → Canva.
status: active
projeto: linkedin
kpi_publicados: 3
kpi_meta_publicados_semanal: 1
kpi_engajamento_medio: 0
kpi_artigos_linkados: 0
kpi_atualizado_em: 2026-07-29
contextos_aplicados:
  - berkahn-brand
  - copy-sem-travessao
  - perfil-bruno
workflow: workflow-conteudo
prompts_relacionados:
  - linkedin-post
  - canva-briefing
bases_relacionadas:
  - calendario
  - kpis
subagents_uteis: []
---

# LinkedIn — Projeto

> Hub do projeto LinkedIn. Posts semanais de divulgação. Lê do blog (gera post + briefing imagem).

## Status atual

Pipeline definido mas sub-utilizado: 3 posts arquivados (2026-04-13 Medstar/Gestão de Obra · 2026-06-16 Painelizado vs Stick · 2026-07-14 Energia Solar). Bruno publica manualmente no LinkedIn e copia conteúdo para Notion. Briefing de imagem vai para Canva manual.

Contagem verificada em 2026-07-29 contra `main` — o `kpi_publicados: 1` anterior estava parado desde maio.

## Bloqueios ativos

- [ ] **Cadência abaixo da meta**: 3 posts arquivados vs 38 artigos do blog — só ~8% dos artigos viraram post
- [ ] **Rastreamento bidirecional inexiste**: post não tem `artigo_slug:`, artigos não têm `linkedin_slug:`. Backfill agendado Sprint 2
- [ ] **Engajamento não tracked**: sem captura de métricas (likes, comments, reach)

## Próximos 7 dias

- [ ] Post LinkedIn da semana referenciando artigo recente (`/linkedin`)
- [ ] Exportar imagem do Canva conforme briefing
- [ ] Começar o backlog de distribuição: 22 posts derivam de artigos **já publicados** e não exigem escrever artigo nenhum

## Backlog planejado (2026-07-29)

44 briefings até dezembro em [[2026-08-calendario-editorial]], em duas fontes:

- **22 derivados** das pautas Core da semana, um por semana
- **22 do acervo**: artigos já no ar que nunca viraram post. Hoje só 3 dos 38 têm post correspondente

Cada post recebe `artigo_slug` no frontmatter, fechando o rastreamento bidirecional que hoje não existe. O texto final sai de `/linkedin`; o calendário entrega ângulo, dado-âncora e artigo de origem, não o post pronto.

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Posts arquivados (total) | 1 | 1 (semana) | 0 |
| Artigos com post LinkedIn | 0 | 35 (retroativo) | -35 |
| Engajamento médio | n/d | a definir | — |

## Contexto aplicado

- [[berkahn-brand]] — voz, ICP, gancho profissional
- [[copy-sem-travessao]] — regra de copy aplicada
- [[perfil-bruno]] — perfil pessoal Bruno (publicação manual)

## Workflow & prompts

- Workflow: [[workflow-conteudo]] — LinkedIn como sub-pipeline após blog
- Prompts (LOCKED): [[linkedin-post]] · [[canva-briefing]]
- Outputs em: `40-content/linkedin/YYYY-MM-DD-tema/{post.md, briefing-imagem.md, imagem-final.png}`

## Bases relacionadas

- [[calendario.base]] — pipeline + próximos 30 dias (inclui LinkedIn)
- [[kpis.base]] — agrega `kpi_*` (criada em Sprint 3)

## Subagents úteis

- (nenhum específico — outputs são markdown + briefing texto)

## Materiais de apoio

- [[indices-pecas-linkedin]] — peças visuais em `Docs/Conteúdo/peças linkedin/` (criado em Sprint 1.7)
- [[indices-capas-blog]] — capas que podem ser reutilizadas

## Histórico recente

- 2026-05-22: hub criado
- 2026-04-13: primeiro post arquivado (Medstar — Gestão de Obra)
