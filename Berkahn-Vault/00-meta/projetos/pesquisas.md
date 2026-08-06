---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-06
tags:
  - project/blog
  - project/site
  - status/active
ai_summary: Hub de Pesquisas. Pesquisa editorial de Blog vive no bloco da pauta em /admin/conteudo; competitor, mercado e SEO continuam no vault. Destilação reutilizável permanece em 70-knowledge/.
status: active
projeto: pesquisas
kpi_pesquisas_brutas_arquivadas: 0
kpi_competitors_documentados: 1
kpi_atomic_notes_geradas: 10
kpi_meta_atomic_notes: 10
kpi_atualizado_em: 2026-08-06
contextos_aplicados:
  - seo-aeo-strategy
  - steel-frame-domain
  - berkahn-brand
workflow: workflow-pesquisa
prompts_relacionados:
  - blog-pesquisa
bases_relacionadas:
  - conhecimento
  - kpis
subagents_uteis: []
---

# Pesquisas — Projeto

> Hub do projeto Pesquisas. Mercado + concorrência + novos temas. Cross-projeto (alimenta blog, site, comercial). Output esperado: atomic notes reutilizáveis em `70-knowledge/`.

## Status atual

Para Blog, `/pesquisa` grava diretamente em `pesquisa_conteudo` na pauta e
`/criacao` lê pelo id; `40-content/blog/pesquisa/` não recebe arquivos novos.
Competitor research, mercado e SEO continuam em pastas próprias. A destilação em
`70-knowledge/` já começou e permanece a camada reutilizável.

## Bloqueios ativos

- [x] **70-knowledge/ populado** — 10 atomic notes LSF criadas; a pendência agora é conectá-las às pesquisas novas quando houver aprendizado reutilizável
- [ ] **Pesquisas brutas não viram atomic notes** — fluxo `/pesquisa → /criacao` descarta destilação
- [ ] **Apenas 1 competitor documentado** (Stalart) — concorrência LSF brasileira é maior

## Próximos 7 dias

- [x] Retirar `40-content/blog/pesquisa/` do fluxo operacional
- [ ] Inventariar blocos de pesquisa das pautas antes de criar novas atomic notes
- [ ] Identificar 3-5 temas recorrentes para virar atomic notes (Sprint 2)

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Pesquisas brutas arquivadas | n/d | tracked | medir |
| Competitors documentados | 1 | 5 | -4 |
| Atomic notes geradas | 10 | 10 | meta atingida |
| Pesquisas usadas em 2+ artigos | 0 | tracked | — |

## Contexto aplicado

- [[seo-aeo-strategy]] — pesquisa SEO/AEO já consolidada
- [[steel-frame-domain]] — domínio LSF (pesquisa técnica acumulada)
- [[berkahn-brand]] — pesquisa de mercado deve respeitar voz/posicionamento

## Workflow & prompts

- Workflow: [[workflow-pesquisa]] — tema → fontes → síntese → atomic notes (criado em Sprint 1.8)
- Prompts (LOCKED): [[blog-pesquisa]] · `/pesquisa` slash command
- Outputs em:
  - `/admin/conteudo` — pesquisas editoriais do Blog
  - `40-content/pesquisa-mercado/` — pesquisa de mercado + competitor research (migrado)
  - `40-content/auditorias-seo/research-seo-aeo.md` — fundamentos SEO/AEO
  - `70-knowledge/<conceito>.md` — atomic notes destiladas (em construção Sprint 2)

## Bases relacionadas

- [[conhecimento.base]] — catálogo atomic notes (criada em Sprint 3)
- [[kpis.base]] — agrega KPIs

## Subagents úteis

- (nenhum subagent específico)

## Materiais arquivados (migrados de Docs/)

- [[research-seo-aeo]] — pesquisa de fundamentos SEO/AEO (Docs/SEO & AEO/)
- [[stalart-snapshot]] — primeiro competitor documentado (Docs/REMODELAÇÃO/)
- [[guia-orcamento]] — guia de orçamento (Docs/Orçamento/)
- [[paginas-conteudo-v2]] — estratégia páginas site (Docs/REMODELAÇÃO/)

## Atomic notes planejadas (Sprint 2.2)

- [[lsf-normas-nbr]] (NBR 16970, 14762, 15253)
- [[lsf-custos]] (faixa de preço m², SINAPI)
- [[lsf-cronograma]]
- [[lsf-fogo]]
- [[lsf-acustica]]
- [[lsf-financiamento]]
- [[lsf-vs-alvenaria]]
- [[lsf-fundacao]]
- [[lsf-sustentabilidade]]
- [[lsf-versatilidade-arquitetonica]]

## Histórico recente

- 2026-05-22: hub criado; pesquisas migradas de Docs/
