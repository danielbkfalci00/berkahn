---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - project/material
  - status/active
ai_summary: Hub do projeto Materiais — briefings Canva (capas blog, peças LinkedIn, infográficos), PDFs técnicos, identidade visual. 22 capas + 1 peça LinkedIn + 10 logos + 30+ imagens orçamento catalogadas via notas-índice em 40-content/materiais/indices/.
status: active
projeto: materiais
kpi_capas_blog: 22
kpi_pecas_linkedin: 1
kpi_logos_variacoes: 10
kpi_imagens_orcamento: 30
kpi_indices_criados: 0
kpi_meta_indices: 9
kpi_atualizado_em: 2026-05-22
contextos_aplicados:
  - berkahn-brand
  - design-principles
  - guia-design-berkahn
workflow: workflow-material
prompts_relacionados:
  - canva-briefing
bases_relacionadas:
  - materiais
  - kpis
subagents_uteis:
  - design-review
---

# Materiais — Projeto

> Hub do projeto Materiais. Briefings visuais + outputs Canva + PDFs + identidade visual. Catalogação via notas-índice (vault) + binaries (Docs/).

## Status atual

Materiais visuais vivem em `Docs/` (fora do vault) por tamanho/formato. Catalogação via notas-índice em `40-content/materiais/indices/` permite Claude/Bruno verem inventário sem inflar git. Briefings gerados pelo prompt `/material` (canva-briefing) ficam em `40-content/materiais/briefings/`.

## Bloqueios ativos

- [ ] **Rastreamento bidirecional inexiste**: briefing → imagem → artigo/post não tem links de volta. Implementar via frontmatter `usado_em:` nas notas-índice (Sprint 2)
- [ ] **9 notas-índice ainda não criadas** (Sprint 1.7 — esta semana)
- [ ] **Marketing Materials/ vazio**: 3 subpastas (Assets, Business Card, Flyer) sem conteúdo

## Próximos 7 dias

- [ ] Criar 9 notas-índice em `40-content/materiais/indices/` (Sprint 1.7)
- [ ] Catalogar 22 capas blog + linkar para artigos correspondentes

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Capas blog catalogadas | 22 | 35 (1 por artigo) | -13 |
| Peças LinkedIn | 1 | 35 (1 por post) | -34 |
| Logos/variações | 10 | OK | 0 |
| Imagens orçamento | 30+ | OK | 0 |
| Notas-índice criadas | 0 | 9 (Sprint 1.7) | -9 |

## Contexto aplicado

- [[berkahn-brand]] — identidade visual, paleta, voz
- [[design-principles]] — paleta preto/off-white, tipografia Manrope, ícones outline
- [[guia-design-berkahn]] — guia completo de design (em `50-brand/`)

## Workflow & prompts

- Workflow: [[workflow-material]] — briefing → Canva → exportação → catalogação (criado em Sprint 1.8)
- Prompts: [[canva-briefing]] · `/material` slash command
- Outputs em:
  - `40-content/materiais/briefings/` — briefings gerados por `/material`
  - `40-content/materiais/indices/` — notas-índice de binaries em `Docs/`
  - `Docs/Conteúdo/Capas blog/` — capas exportadas do Canva (binary)
  - `Docs/Conteúdo/peças linkedin/` — peças LinkedIn (binary)

## Bases relacionadas

- [[materiais.base]] — catálogo unificado (criada em Sprint 3)
- [[kpis.base]] — agrega KPIs

## Subagents úteis

- `@design-review` — validar qualidade visual de novos materiais (consistência brand)

## Notas-índice planejadas (Sprint 1.7)

- [[indices-capas-blog]] — `Docs/Conteúdo/Capas blog/` (22)
- [[indices-pecas-linkedin]] — `Docs/Conteúdo/peças linkedin/` (1+)
- [[indices-identidade-visual]] — `Docs/Identidade Visual/` (10 logos)
- [[indices-imagens-comercial]] — `Docs/Imagens/Comercial/`
- [[indices-imagens-residencial]] — `Docs/Imagens/residencial/`
- [[indices-imagens-lsf]] — `Docs/Imagens/LSF/`
- [[indices-imagens-equipe]] — `Docs/Imagens/equipe/`
- [[indices-imagens-projetos]] — `Docs/Imagens/projetos/`
- [[indices-orcamento-imagens]] — `Docs/Orçamento/` (30+ técnicas)
- [[indices-mockups-remodelacao]] — `Docs/REMODELAÇÃO/` (9 mockups + PDF)

## Histórico recente

- 2026-05-22: hub criado, plano de catalogação via 9 notas-índice
