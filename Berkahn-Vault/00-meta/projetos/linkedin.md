---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/linkedin
  - status/active
ai_summary: Hub do projeto LinkedIn — posts semanais de divulgação que referenciam artigos do blog. 1 arquivado (formato YYYY-MM-DD-tema/), meta +1/semana. Bruno copia manualmente para Notion. Briefing imagem → Canva.
status: active
projeto: linkedin
kpi_publicados: 1
kpi_meta_publicados_semanal: 1
kpi_engajamento_medio: 0
kpi_artigos_linkados: 0
kpi_atualizado_em: 2026-05-22
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

Pipeline definido mas sub-utilizado: apenas 1 post arquivado (2026-04-13 — Medstar/Gestão de Obra). Bruno publica manualmente no LinkedIn e copia conteúdo para Notion. Briefing de imagem vai para Canva manual.

## Bloqueios ativos

- [ ] **Cadência abaixo da meta**: 1 post arquivado vs 35 artigos do blog — só ~3% dos artigos viraram post
- [ ] **Rastreamento bidirecional inexiste**: post não tem `artigo_slug:`, artigos não têm `linkedin_slug:`. Backfill agendado Sprint 2
- [ ] **Engajamento não tracked**: sem captura de métricas (likes, comments, reach)

## Próximos 7 dias

- [ ] Post LinkedIn da semana referenciando artigo recente (`/linkedin`)
- [ ] Exportar imagem do Canva conforme briefing

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
