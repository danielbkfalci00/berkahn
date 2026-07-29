---
tipo: meta
criado: 2026-05-21
atualizado: 2026-07-29
tags:
  - project/site
  - project/blog
  - status/active
ai_summary: "Sprint ativa de marketing/dev Berkahn (semana 2026-07-20 a 2026-07-24). Institucional PDF v4 na branch design/institucional-monografia, pendente merge. Analytics: PR #18 merged em 29/07 (mês parcial + 3 bugs de métrica). P0 de indexação ENCERRADO (89%). Fase atual: fechar institucional + publicar OAuth consent screen (trava o cron de 01/09) + instrumentar conversão. Atualizado segunda via /standup. Source of truth do estado semanal."
status: active
projetos_em_curso:
  - blog
  - linkedin
  - site
  - seo-aeo
  - apresentacoes
  - materiais
  - pesquisas
  - orcamento-automacao
semana_inicio: 2026-07-27
semana_fim: 2026-07-31
---

# Sprint Ativa — semana de 2026-07-27

> [!warning] O `/standup` de 2026-07-27 não rodou
> A janela foi rolada à mão em 29/07 durante a sessão de analytics, porque o frontmatter ainda apontava para a semana de 20-24/07 e alimenta as Bases. Isso **não** substitui o standup: os KPIs por projeto e o comparativo semana-a-semana não foram coletados. Rodar `/standup` para fechar direito.

> Atualizado segunda-feira via `/standup` (auto seg 9h via scheduled-task). Referenciado em [[CLAUDE]] vault-level e em `vault-manifest.json` (`paths.sprint_doc`). Para detalhes por projeto, abrir o hub correspondente. Validação: `node scripts/vault-validate.mjs` → 0 issues.

## Objetivo da semana

**Fechar o Documento Institucional PDF** (merge PR #17 v3 + validar geração em prod + distribuir) e **retomar cadência editorial** (blog + LinkedIn semanal). Manter pressão no **P0 SEO** (indexação Google — ação Bruno). Reorganização do vault permanece concluída (3 sprints + P1 + P2).

## Status por projeto

| Projeto | Status | Bloqueio principal | Próxima ação |
|---------|--------|--------------------|--------------|
| [[blog]] | active | Pipeline editorial vazio (drafts/ideias/pesquisa) | Repor funil via `/brainstorm` |
| [[linkedin]] | active | Cadência: 2 posts vs 38 artigos | Post LinkedIn da semana |
| [[site]] | active | **PR #17 (institucional v3) pendente merge** + bug SearchAction | Validar `/institucional/pdf` em prod pós-merge |
| [[seo-aeo]] | active | 9 posts sem meta tags; 4 URLs não indexadas | Backfill meta tags + GSC nas 4 URLs |
| [[apresentacoes]] | active | Roteiros não versionados (parcial) | Validar 16 slides em live env |
| [[materiais]] | active | **Institucional PDF v3** aguarda merge/distribuição | Distribuir `berkahn-institucional-v3.pdf`; preencher `usado_em` |
| [[pesquisas]] | active | 70-knowledge populado (10 atomics) | Inventariar mais conceitos |
| [[orcamento-automacao]] | published | Smoke test E2E prod pendente (Bruno) | Gerar PDF BRK-2026-0001 (checar pgs/peso) |

## Bloqueios consolidados (cross-projeto)

### P0 — Esta semana
- [ ] **Merge PR #17** (institucional v3/v4, [[site]] + [[materiais]]): branch `design/institucional-monografia` → `main` + validar `/institucional/pdf` em prod + distribuir o PDF. A branch está 3 commits atrás de `main`; rebasear antes evita conflito
- [x] **Indexação Google** ([[seo-aeo]]): **encerrado em 2026-07-29** — 34/38 artigos (89%), contra 6/44 em abril. Restam 4 URLs em "Crawled/Discovered - currently not indexed", agora P1
- [ ] **Publicar OAuth consent screen** ([[google-apis-setup]]): consent em modo Testing expira o refresh token em 7 dias. Sem isso o cron `berkahn-performance-mensal` falha em 01/09 (ação Bruno)
- [ ] **Decidir 4 capas órfãs** ([[materiais]]): Reestruturando Concreto, energia_solar, mármore, piscina_arraia
- [ ] **Smoke test Supabase** (Sprint 2.5): rodar `node scripts/vault-supabase-resync.mjs --check` com `$env:SUPABASE_SERVICE_KEY`

### P1 — Próximas 2 semanas
- [x] **4 erros de frontmatter em `40-content/curadoria/`** (vault health): corrigidos em 2026-07-02 (PR #11) — `status`/`tipo` inválidos normalizados. `vault-validate.mjs` → 0 issues. Chip `task_abaacde6` fechado.
- [ ] **Google Sheets SPOF de leads** ([[site]]): backup automático Supabase (Fase 4.4 — opcional)
- [ ] **9 posts sem meta_title/meta_description** ([[blog]] + [[seo-aeo]]): preencher via admin Supabase
- [ ] **4 posts sem answer_summary** ([[seo-aeo]]): preencher para AEO. Verificado no Supabase em 2026-07-29

### P2 — 2-4 semanas
- [ ] **Fase 4 MCPs** (opcional): HubSpot leads sync · n8n KPIs · Figma tokens
- [x] **Capas consolidadas** em `Docs/banco-imagens/capas-blog/` (2026-07-01): dedup por hash concluído; par PNG/WEBP `lsf-mundial` mantido de propósito (PNG master + WEBP em produção). Path antigo `Docs/Conteúdo/Capas blog/` não existe mais.
- [ ] **Migrar slugs ambíguos** ([[blog]]): 2 TODOs no SLUG_MAP do `vault-backfill-articles.mjs`

## Standup 2026-07-20

Nota completa: [[2026-07-20]]. Standup de 07-13 não disparou — base de comparação é 2026-07-06 (~2 semanas). **Delta principal**: novo deliverable **Documento Institucional PDF "O que fazemos"** (9 páginas, v1 PR #14 → v2 rejeitado "muito Claude" → **v3 blueprint suíço-brutalista**, branch `design/institucional-monografia` → PR #17 pendente merge; artefato `Docs/berkahn-institucional-v3.pdf` 6.7MB; infra em `app/institucional/pdf/` + `lib/institucional-data.ts`). Blog: `kpi_publicados` 37 → 38 (`steel-frame-laje-de-concreto`, 07-08). [[article-pipeline]] +3 aprendizados. Bloqueios P0 SEO (indexação GSC, meta tags, answer_summary) e smoke test orçamento arrastados — aguardam Bruno. KPIs externos não coletados nesta execução automática.

## Standup 2026-07-06 (primeiro standup formal)

Primeira execução do `/standup` (ritual criado 2026-05-22, nunca disparado até hoje). Nota completa: [[2026-07-06]]. Deltas desde 2026-07-01/02: P1 curadoria resolvido (PR #11), 20 WARNs de ordem zerados (PR #12), 2 wikilinks corrigidos (PR #10), fotos do globo/DomeGallery renovadas na apresentação executiva (PR #13). Vault 151 notas / 0 issues. Foco da semana: retomar cadência editorial (blog + LinkedIn) + P0 SEO (indexação GSC — ação Bruno). KPIs externos (indexação, leads, publicados) aguardam input do Bruno.

## Wins / decisões (2026-07-29)

**PR [#18](https://github.com/danielbkfalci00/berkahn/pull/18) merged, deploy verde nos dois projetos Vercel.**

- **Mês parcial no dashboard**: `/admin/analytics` passa a mostrar o mês corrente com janela cortada no lag do GSC (3 dias) e MoM contra a **mesma contagem de dias** do mês anterior. Badge "Parcial", Comparar desabilitado, ponto vazado no gráfico. Run parcial **não** atualiza os hubs — valores parciais fariam `/standup` narrar queda inexistente. O run do dia 1 sobrescreve automaticamente. Regras em [[analytics-methodology]], operação em `.claude/commands/performance.md`.
- **Julho/2026 (01-26, parcial)**: 1.407 users (↑43,1%), 1.107 cliques (↑54,4%), CTR 3,32% (↑38,3%), posição 4,2. 26 dias já superaram junho inteiro.
- **3 bugs de métrica corrigidos**: (1) indexação contava "not indexed" como indexado — inflava em 1 todo mês desde fevereiro e, na negação, suprimia as ações P0 dessas páginas, o que explica os relatórios com "nenhuma ação P0"; (2) meta usava média de 3 meses, produzindo alvo menor que o mês anterior — atingimento de 150-850% sempre, barra sempre verde; base passou a ser o último mês fechado; (3) `generatedDate` em UTC saía um dia à frente após as 21h.
- **Descoberta que muda a estratégia**: o tráfego virou **98,8% não-branded** (era 100% branded em abril). A meta de chegar a 40% foi superada. A pergunta deixou de ser "como ser descoberto" e passou a ser "como converter quem já chega" — o que conecta com a Fase 3 do plano (não existe CTA no fim dos artigos, e 72% dos pageviews estão lá).
- **Hubs saneados**: [[blog]] e [[seo-aeo]] carregavam KPIs de abril, alguns internamente contraditórios. Tudo reverificado contra Supabase e GSC. Bloqueio P0 de indexação **encerrado** (14% → 89%).
- **Vault reconciliado com produção**: 4 artigos no ar sem contraparte no vault foram reconstruídos do Supabase, incluindo `custo-steel-frame-m2-2026` (78% dos cliques do Google), antes não editável pelo fluxo `/artigo`.
- **Causa raiz do `invalid_grant` identificada** (3ª ocorrência): consent screen provavelmente em modo Testing, onde o refresh token morre em 7 dias. Passo a passo para publicar em [[google-apis-setup]]. **Ação manual pendente do Bruno** — sem isso o cron falha de novo em 01/09.
- **A branch `design/institucional-monografia` está 3 commits atrás de `main`** (merge-base `a149b47`): faltam `02a7709`, `7597ecd` e `2ef61a2`, que adicionam os artigos `energia-solar-residencial` e `anatomia-parede-steel-frame` mais o post LinkedIn de energia solar. Nada foi deletado e o merge não apaga nada — mas contar arquivos em `publicados/` estando nela dá resultado errado. Vale rebasear antes de mergear.

### Pendências abertas desta sessão

- [ ] Publicar o OAuth consent screen no Google Cloud Console (passo a passo em [[google-apis-setup]]) — trava o cron de 01/09
- [ ] Registrar custom dimensions no GA4 (`cta_location`, `channel`, `segment`) e marcar `generate_lead`/`contact_click` como Key Events — **não são retroativas**, precisam existir antes da Fase 3
- [ ] Conferir visualmente `/admin/analytics` (badge, tooltip do Comparar, ponto vazado) — não verificável sem login
- [ ] Resolver contradição de preço em `custo-steel-frame-m2-2026`: `answer_summary` diz R$ 2.500-4.500/m², `seo_description` diz R$ 3.015-6.091
- [ ] Classificar os 6 arquivos do vault que não estão em produção (despublicados? renomeados? nunca publicados?) — ver [[blog]]
- [ ] Refazer metas P0/P3 de [[seo-aeo]]: três foram superadas e não foram rebaixadas, o painel só mostra verde
- [ ] Fases 3-5 do plano (instrumentação de conversão, CTA no blog, IQS, diagnóstico): `~/.claude/plans/executa-o-sprint-4-whimsical-thimble.md` ⚠️ **fora do vault e fora do git** — 32KB só na máquina local. Se importar, promover para nota do vault
- [ ] Rodar `/standup` — o de 2026-07-27 não disparou
- [ ] Rodar `/wrap-up` — o último é de 2026-05-22, ou seja, **2 meses sem wrap-up**. Investigar por que `berkahn-wrapup-semanal` não gera nada
- [ ] Blindar `berkahn-standup-semanal` e `berkahn-wrapup-semanal` com `last-error.log`, como foi feito no `berkahn-performance-mensal` em 2026-07-01. Hoje esses dois falham sem deixar sinal

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
| Artigos publicados (total) | 38 ativos + 3 arquivados | 39 (sem 30) | -1 |
| Posts LinkedIn (total) | 1 | 2 | -1 |
| Páginas indexadas Google | 34/38 (89%) | 38/38 | -4 |
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
