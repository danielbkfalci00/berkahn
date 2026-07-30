---
tipo: projeto
criado: 2026-05-22
atualizado: 2026-07-20
tags:
  - project/material
  - status/active
ai_summary: Hub do projeto Materiais — briefings Canva (capas blog, peças LinkedIn, infográficos), PDFs técnicos, identidade visual. Banco de imagens reorganizado: 160 arquivos em 9 categorias (Docs/banco-imagens/), catalogados via MOC [[banco-imagens]] + 9 notas-índice em 40-content/materiais/indices/.
status: active
projeto: materiais
kpi_capas_blog: 22
kpi_pecas_linkedin: 1
kpi_logos_variacoes: 10
kpi_imagens_orcamento: 22
kpi_indices_criados: 9
kpi_meta_indices: 9
kpi_assets_total: 160
kpi_assets_categorias: 9
kpi_assets_em_producao: 16
kpi_atualizado_em: 2026-07-01
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

**Sub-área — Banco de imagens** (reorg 2026-07-01): 160 arquivos consolidados em `Docs/banco-imagens/` (9 categorias, 16 em produção). Entry-point: [[banco-imagens]] (MOC) → 9 índices `indices-<categoria>.md`. Inventário/validação via `scripts/vault-images.mjs`.

## Bloqueios ativos

- [ ] **Rastreamento bidirecional inexiste**: briefing → imagem → artigo/post não tem links de volta. Implementar via frontmatter `usado_em:` nas notas-índice (Sprint 2)
- [x] **9 notas-índice criadas** (2026-07-01, alinhadas 1:1 com as 9 categorias do banco de imagens)
- [ ] **Marketing Materials/ vazio**: 3 subpastas (Assets, Business Card, Flyer) sem conteúdo

## Próximos 7 dias

- [ ] Preencher `uso_em:` restante nos índices (mapear assets → artigos/slides que os consomem)
- [ ] Decidir catalogar entregas com marca d'água em [[indices-obras-projetos]] (ver [[watermark-clube-quinta-dos-lagos]])

## KPIs (snapshot)

| Métrica | Atual | Meta | Δ |
|---------|-------|------|---|
| Capas blog catalogadas | 22 | 35 (1 por artigo) | -13 |
| Peças LinkedIn | 1 | 35 (1 por post) | -34 |
| Logos/variações | 10 | OK | 0 |
| Imagens orçamento | 30+ | OK | 0 |
| Notas-índice criadas | 9 | 9 | 0 |
| Assets no banco (total) | 160 | — | — |
| Assets em produção | 16 | — | — |

## Contexto aplicado

- [[berkahn-brand]] — identidade visual, paleta, voz
- [[design-principles]] — paleta preto/off-white, tipografia Manrope, ícones outline
- [[guia-design-berkahn]] — guia completo de design (em `50-brand/`)

## Workflow & prompts

- Workflow: [[workflow-material]] — briefing → Canva → exportação → catalogação (criado em Sprint 1.8)
- Prompts: [[canva-briefing]] · `/material` slash command
- Outputs em:
  - `40-content/materiais/briefings/` — briefings gerados por `/material`
  - `40-content/materiais/indices/` — notas-índice de binaries em `Docs/banco-imagens/`
  - `Docs/banco-imagens/capas-blog/` — capas exportadas do Canva (binary)
  - `Docs/banco-imagens/materiais-marketing/` — peças LinkedIn (binary)

## Bases relacionadas

- [[materiais.base]] — catálogo unificado (criada em Sprint 3)
- [[kpis.base]] — agrega KPIs

## Subagents úteis

- `@design-review` — validar qualidade visual de novos materiais (consistência brand)

## Notas-índice do banco de imagens (9, ativas)

Entry-point: [[banco-imagens]] (MOC). Fonte: `Docs/banco-imagens/<categoria>/`.

- [[indices-marca]] — marca (10 logos)
- [[indices-parceiros]] — parceiros (4 banners, 3 em prod)
- [[indices-obras-projetos]] — obras/projetos (51: 16 curadas + 35 carrossel)
- [[indices-equipe]] — equipe (11 fotos, 1 em prod)
- [[indices-tecnico-lsf]] — técnico LSF (5, 3 em prod)
- [[indices-orcamento-prototipos]] — orçamento/protótipos (22, 4 em prod)
- [[indices-capas-blog]] — capas blog (22, 5 em prod)
- [[indices-materiais-marketing]] — materiais marketing (1)
- [[indices-referencia]] — referência (34 — não curado p/ galeria)

## Entregas com marca d'água

- [[watermark-clube-quinta-dos-lagos]] — 26 imagens do projeto Clube Quinta dos Lagos com wordmark BERKAHN (script `scripts/watermark-images.mjs`, reutilizável).

## Histórico recente

- 2026-07-20: standup — **Documento Institucional PDF "O que fazemos"** (9 páginas A4) entregue como novo material. v1 (PR #14) → v2 "monografia editorial" (rejeitado "muito Claude") → **v3 "Suíço-brutalista / Blueprint"** (Archivo + Space Mono + azul `#123A5E`), branch `design/institucional-monografia` → PR #17 pendente merge. Briefing: `40-content/materiais/2026-07-09-pdf-institucional/`. Artefato `Docs/berkahn-institucional-v3.pdf` (6.7MB). Pipeline de PDF do site (não Canva).
- 2026-07-06: standup — 2 wikilinks quebrados em notas-índice corrigidos (PR #10, 2026-07-02). Vault-validate 0 issues.
- 2026-07-01: marca d'água BERKAHN aplicada em 26 imagens (Clube Quinta dos Lagos) via `watermark-images.mjs` — registro em [[watermark-clube-quinta-dos-lagos]].
- 2026-07-01: banco de imagens reorganizado (160 arquivos / 9 categorias em `Docs/banco-imagens/`); catálogo reescrito — MOC [[banco-imagens]] + 9 índices 1:1 com as categorias; 7 notas-índice antigas (paths defasados) removidas; 8 galerias visuais + `banco-imagens.base`.
- 2026-05-22: hub criado, plano de catalogação via 9 notas-índice
