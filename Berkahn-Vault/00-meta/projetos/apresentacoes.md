---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-08-27
tags:
  - project/apresentacao
  - status/active
ai_summary: Hub do projeto Apresentações comerciais — /apresentacao-executiva (16 slides, lazy load, 3 charts Recharts). 3 casos publicados (Casa Santa Cristina, Vila Serrana, Residência Monteiro). Roteiros migrados de Docs/apresentacoes/. Material de vendas + pitch.
status: active
projeto: apresentacoes
kpi_apresentacoes_ativas: 1
kpi_slides_total: 16
kpi_casos_publicados: 3
kpi_charts_interativos: 3
kpi_imagens_galeria_3d: 41
kpi_atualizado_em: 2026-05-22
contextos_aplicados:
  - presentation-system
  - berkahn-brand
  - design-principles
  - steel-frame-domain
workflow: workflow-comercial
prompts_relacionados:
  - presentation-slide
bases_relacionadas:
  - kpis
subagents_uteis:
  - design-review
---

# Apresentações comerciais — Projeto

> Hub do projeto Apresentações comerciais. Materiais de vendas/pitch para prospects. `/apresentacao-executiva` é a apresentação principal.

## Status atual

1 apresentação ativa: `/apresentacao-executiva` (16 slides, lazy load via `dynamic()`, 3 charts via Recharts, galeria 3D com 41 imagens). 3 projetos-caso publicados. Roteiros e dados em `lib/presentation-data.ts`. Dados globais de mercado em `lib/global-steel-frame-data.ts`.

## Bloqueios ativos

- [ ] **Roteiros não versionados no vault**: roteiros vivem em `Docs/apresentacoes/` (migrados em Sprint 1.6) ou só no código React — falta documentação narrativa por slide
- [ ] **Dados (PIB, estatísticas LSF) não linkam para origem** em `global-steel-frame-data.ts`
- [ ] **Sem apresentações específicas por prospect** — `/apresentacao-executiva` é one-size-fits-all

## Próximos 7 dias

- [ ] (sob demanda — geralmente disparado por reunião comercial agendada)
- [ ] Validar slides em produção (testar 16 slides em live env)

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Apresentações ativas | 1 | 1+ (por segmento) | 0 |
| Slides | 16 | 16-20 | OK |
| Casos publicados | 3 | 5 | -2 |
| Galeria 3D imagens | 41 | 50+ | -9 |

## Contexto aplicado

- [[presentation-system]] — arquitetura (slides, lazy load, charts, dados, componentes UI)
- [[berkahn-brand]] — identidade visual, voz, ICP
- [[design-principles]] — paleta, tipografia, ícones, animações (RevealOnScroll, CharReveal, CountUp)
- [[steel-frame-domain]] — dados técnicos LSF para slides 5-7 (Global, Leaders, Brazil)

## Workflow & prompts

- Workflow: [[workflow-comercial]] — pipeline vendas: lead → proposta → apresentação → contrato (criado em Sprint 1.8)
- Prompts: [[presentation-slide]] — criar/editar slide individual
- Outputs em: `40-content/apresentacoes/` (roteiros) + `components/presentation/slides/` (código)

## Bases relacionadas

- [[kpis.base]] — agrega KPIs

## Subagents úteis

- `@design-review` — validar UI/UX de novos slides (Playwright live env)

## Slides atuais

Ver [[presentation-system]] para tabela completa. Resumo: Cover, About, Methodology, Diferenciais, Global Overview/Leaders, Brazil Opportunity, Founders, Services, Projects (×3), Partners, Gallery, Contact.

## Charts disponíveis

- `RegionalDonut` — distribuição regional global
- `BrazilMixDonut` — LSF vs convencional no Brasil
- `BrazilGrowthChart` — crescimento mercado LSF Brasil

## Materiais de apoio

- [[indices-tecnico-lsf]] — diagramas e imagens técnicas para contexto comercial
- [[indices-obras-projetos]] — fotos e renders de obras/projetos
- [[40-content/apresentacoes/steel-frame-no-mundo|steel-frame-no-mundo]] — roteiro migrado de `Docs/apresentacoes/`

## Como adicionar slide novo

Ver [[presentation-system#Como adicionar um novo slide]] — pattern: criar `components/presentation/slides/SlideX.tsx` + importar com `dynamic()` + adicionar no JSX.

## Histórico recente

- 2026-07-06: standup — fotos do globo (DomeGallery) renovadas na `/apresentacao-executiva` (PR #13, 2026-07-02). Validar em prod.
- 2026-05-22: hub criado
- 2026-05-21: roteiros migrados de `Docs/apresentacoes/`
