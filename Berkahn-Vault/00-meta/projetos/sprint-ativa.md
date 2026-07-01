---
tipo: meta
criado: 2026-05-21
atualizado: 2026-07-01
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: "Sprint ativa de marketing/dev Berkahn (semana 2026-05-19 a 2026-05-23). Projeto de reorganização do vault concluído (Sprint 1+2+3+P1+P2). Próxima fase: retomar cadência editorial regular (blog/linkedin semanal) + tratar P0 SEO (indexação Google). Atualizado segunda-feira via /standup. Source of truth do estado semanal."
status: active
projetos_em_curso:
  - blog
  - linkedin
  - site
  - seo-aeo
  - apresentacoes
  - materiais
  - pesquisas
semana_inicio: 2026-05-19
semana_fim: 2026-05-23
---

# Sprint Ativa — semana de 2026-05-19

> Atualizado segunda-feira via `/standup` (auto seg 9h via scheduled-task). Referenciado em [[CLAUDE]] vault-level e em `vault-manifest.json` (`paths.sprint_doc`). Para detalhes por projeto, abrir o hub correspondente. Validação: `node scripts/vault-validate.mjs` → 0 issues.

## Objetivo da semana

**Reorganização completa do vault**: 7 hubs first-class + densificação grafo + unificação Docs/ + automação rituais + linter qualidade. ✅ **ENTREGUE TODOS 3 SPRINTS + P1 (95→0 WARNs) + P2 (20 arquivos Docs/ deletados)**. Próxima fase: retomar cadência editorial regular + tratar P0 SEO (indexação Google).

## Status por projeto

| Projeto | Status | Bloqueio principal | Próxima ação |
|---------|--------|--------------------|--------------|
| [[blog]] | active | 1/35 indexados Google (P0 SEO) | Post da semana via `/brainstorm` |
| [[linkedin]] | active | Cadência: 1/35 artigos com post | Post LinkedIn da semana |
| [[site]] | active | Bug SearchAction + Google Sheets SPOF | Validar build, monitorar CWV |
| [[seo-aeo]] | active | **P0**: Solicitar indexação GSC top 10 | Ações P0 do diagnóstico |
| [[apresentacoes]] | active | Roteiros não versionados (parcial) | Validar 16 slides em live env |
| [[materiais]] | active | Banco consolidado (160/9 cat.) + 26 imgs c/ marca d'água; capas órfãs a decidir | Preencher `uso_em`; catalogar obras marcadas |
| [[pesquisas]] | active | 70-knowledge populado (10 atomics) | Inventariar mais conceitos |

## Bloqueios consolidados (cross-projeto)

### P0 — Esta semana
- [ ] **Indexação Google** ([[seo-aeo]]): 6/44 páginas — solicitar indexação manual para top 10 (ação Bruno)
- [ ] **Decidir 4 capas órfãs** ([[materiais]]): Reestruturando Concreto, energia_solar, mármore, piscina_arraia
- [ ] **Smoke test Supabase** (Sprint 2.5): rodar `node scripts/vault-supabase-resync.mjs --check` com `$env:SUPABASE_SERVICE_KEY`

### P1 — Próximas 2 semanas
- [ ] **4 erros de frontmatter em `40-content/curadoria/`** (vault health): `status: done` (airos/maria-isabel/rosmari-revisao) e `tipo: reference` (pipeline-arquitetos) inválidos — corrigir valores OU ampliar listas válidas em `scripts/vault-validate.mjs` + taxonomia do CLAUDE.md. Rodar `vault-validate.mjs` até 0 ERRORs. (chip de sessão: `task_abaacde6`)
- [ ] **Google Sheets SPOF de leads** ([[site]]): backup automático Supabase (Fase 4.4 — opcional)
- [ ] **9 posts sem meta_title/meta_description** ([[blog]] + [[seo-aeo]]): preencher via admin Supabase
- [ ] **3 posts sem answer_summary** ([[seo-aeo]]): preencher para AEO

### P2 — 2-4 semanas
- [ ] **Fase 4 MCPs** (opcional): HubSpot leads sync · n8n KPIs · Figma tokens
- [x] **Capas consolidadas** em `Docs/banco-imagens/capas-blog/` (2026-07-01): dedup por hash concluído; par PNG/WEBP `lsf-mundial` mantido de propósito (PNG master + WEBP em produção). Path antigo `Docs/Conteúdo/Capas blog/` não existe mais.
- [ ] **Migrar slugs ambíguos** ([[blog]]): 2 TODOs no SLUG_MAP do `vault-backfill-articles.mjs`

## Wins / decisões (2026-07-01)

- **Banco de imagens consolidado + catalogado** ([[materiais]]): 160 arquivos organizados em `Docs/banco-imagens/` (9 categorias, 11 duplicatas apagadas por sha256), catálogo reescrito (MOC [[banco-imagens]] + 9 índices + 8 galerias visuais + [[banco-imagens.base]]), script `vault-images.mjs`. `public/images/` intocado. PRs #5/#6.
- **Marca d'água BERKAHN** em 26 imagens do Clube Quinta dos Lagos ([[watermark-clube-quinta-dos-lagos]]): wordmark centralizado, 15% (máx-discreto, decisão do Bruno), cor adaptativa por região; script reutilizável `watermark-images.mjs`. PRs #7/#8. Zip pronto para Drive.
- **Achado (dívida)**: arquivo `nul` (nome reservado Windows) na raiz trava `git add -A` — commits desta sessão foram por-caminho. `scripts/` é gitignored (tools ficam locais). `claude.md` tracked em minúsculo (case-mismatch resolvido).
- **Cron mensal `berkahn-performance-mensal` falhou silenciosamente**: disparou 10:23 BRT mas `test-auth.mjs` retornou `invalid_grant` (2ª ocorrência — mesma raiz do incidente Maio/2026). Recuperado manualmente: `oauth-login.mjs` → novo refresh token → `generate-report.mjs` completou → snapshot Junho/2026 no Supabase + MD/HTML em `40-content/auditorias-seo/2026-06-performance-blog.*`.
- **Hardening aplicado**: `generate-report.mjs` agora grava `~/.claude/scheduled-tasks/berkahn-performance-mensal/last-error.log` em falha e apaga em sucesso. SKILL.md do cron instrui checar esse log antes de rodar. Fim das falhas de 30 dias sem sinal.
- Reference doc atualizada: [[google-apis-setup]] tabela troubleshooting com linha nova pro `last-error.log` e diagnóstico OAuth (não JSON key).

## Decisões da semana (2026-05-22)

### Reorganização do vault (concluída)
- Aprovado plano de reorganização vault em **3 sprints + Fase 4 opcional** de integrações MCP
- Markdown em `40-content/blog/publicados/` é **source-of-truth** (sync Supabase via `/artigo`)
- Migrar TODOS markdowns de `Docs/` para vault; binaries (170 imagens + 4 PDFs) ficam em `Docs/` com notas-índice
- Ativar `/standup` (segunda 9h) e `/wrap-up` (sexta 17h) via scheduled-tasks
- KPIs **FLAT** no frontmatter (`kpi_*`), agregados por `kpis.base`
- Rename arquivos kebab-case **com PATCH Supabase atômico + 301 redirects**
- **B híbrido**: script estrutural + Claude semântico em batches (~5-10 artigos)
- **vault-validate.mjs em Node** (não bash), só manual (sem pre-commit hook)
- **Linter ordem canônica** expandida para 107 keys (Sprint 3.0)

### Triagem artigos problemáticos
- 3 artigos arquivados em `99-archive/blog-publicados-arquivados/`:
  - `tendencias-modular-2025-draft.md` (rascunho com placeholders)
  - `artigo-medstar-georgetown-v2025-superseded.md` (duplicata de hospital-em-operacao)
  - `steel-frame-revolucao-sustentavel-duplicate.md` (duplicata confirmada de futuro-construcao)

## Métricas finais (snapshot reorganização)

| Métrica | Início | Final | Δ |
|---------|--------|-------|---|
| Notas no vault | 79 | 113 | +34 |
| Hubs de projeto | 0 | 7 | +7 ✅ |
| Atomic notes (70-knowledge) | 0 | 10 | +10 ✅ |
| Índices de binaries | 0 | 9 | +9 ✅ |
| Workflows documentados | 1 | 6 | +5 ✅ |
| Bases dinâmicas | 4 | 8 | +4 ✅ |
| Markdowns migrados de Docs/ | 0 | 14 | +14 ✅ |
| Artigos com ai_summary | 0/35 | 32/32 ativos | 100% ✅ |
| Artigos com tags `domain/` | 0/35 | 32/32 | 100% ✅ |
| Artigos com wikilinks rodapé | 0/35 | 32/32 | 100% ✅ |
| Scripts vault-* em `scripts/` | 0 | 4 | +4 ✅ |
| Slash commands novos | 0 | 2 (/standup, /wrap-up) | +2 ✅ |
| Scheduled-tasks ativas | 0 | 2 (seg 9h + sex 17h) | +2 ✅ |
| Linter ordem canônica (keys) | 17 | 107 | +90 ✅ |
| Arquivos Docs/ legacy | 21 | 1 (README) | -20 ✅ |
| **Validate ERRORs/WARNs** | n/a | **0/0** | ✅ |

## Métricas operacionais (atualizar via /standup)

| Métrica | Valor atual | Meta semanal | Δ |
|---------|-------------|--------------|---|
| Artigos publicados (total) | 32 ativos + 3 arquivados | 36 (sem 22) | -4 |
| Posts LinkedIn (total) | 1 | 2 | -1 |
| Páginas indexadas Google | 6/44 (14%) | 16/44 (36%) | -10 ⚠️ |
| Posts sem meta tags | 9 | 5 | +4 ⚠️ |
| Posts sem answer_summary | 3 | 0 | +3 ⚠️ |

## Referências

- Plano completo Sprint 1-3 + P1 + P2: `~/.claude/plans/agora-eu-preciso-entender-functional-pinwheel.md`
- Workflow editorial: [[workflow-conteudo]]
- Pipeline blog: [[article-pipeline]]
- SEO: [[seo-aeo-strategy]]
- Dashboards: [[projetos.base]] · [[kpis.base]] · [[conhecimento.base]] · [[materiais.base]]
- Scripts vault: `scripts/VAULT-SCRIPTS-README.md`
- 7 hubs: [[blog]] · [[linkedin]] · [[site]] · [[seo-aeo]] · [[apresentacoes]] · [[materiais]] · [[pesquisas]]
- MOC: [[MOC]]
