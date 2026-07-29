---
tipo: meta
criado: 2026-05-21
atualizado: 2026-07-29
tags:
  - status/active
ai_summary: Map of Content visual do vault Berkahn. Expansão do index.md com seções temáticas para navegação humana. Topo destaca 7 hubs de projeto ativos (first-class entities) + bases dinâmicas. Cluster por workstream (blog, LinkedIn, apresentação, site).
status: active
---

# MOC — Map of Content

Mapa temático do vault Berkahn. Para visão estrutural (por pasta), ver [[index]].

## 🚀 Projetos Ativos (hubs first-class)

| Projeto | Status | Bloqueio principal | Workflow | Atualizado |
|---------|--------|--------------------|----------|------------|
| [[blog]] | active | Pipeline editorial vazio; vault divergente de produção | [[workflow-conteudo]] | 2026-07-29 |
| [[linkedin]] | active | Cadência: 3/38 artigos com post | [[workflow-conteudo]] | 2026-07-29 |
| [[site]] | active | Bug SearchAction + Google Sheets SPOF | [[workflow-site]] | 2026-05-22 |
| [[seo-aeo]] | active | **P0**: 9 posts sem meta tags (indexação resolvida: 89%) | [[workflow-seo]] | 2026-07-29 |
| [[apresentacoes]] | active | Roteiros não versionados (parcial) | [[workflow-comercial]] | 2026-05-22 |
| [[materiais]] | active | 9 índices criados; 4 capas órfãs | [[workflow-material]] | 2026-05-22 |
| [[pesquisas]] | active | 70-knowledge populado com 10 atomic notes | [[workflow-pesquisa]] | 2026-05-22 |
| [[orcamento-automacao]] | active | Aguarda Bruno setar `CHROME_LOCAL_PATH` + smoke test E2E em prod | [[workflow-site]] | 2026-06-24 |

**Dashboards dinâmicos**: [[projetos.base]] · [[kpis.base]] · [[conhecimento.base]] · [[materiais.base]]
**Sprint atual**: [[sprint-ativa]] · **Standups**: `00-meta/standup/` · **Wrap-ups**: `00-meta/wrap-up/`

## 🧠 Memória

Memória persistente do projeto:
- [[perfil-bruno]] — Único marketing da Berkahn
- [[copy-sem-travessao]] — Regra anti-travessão em copy
- [[prompts-calibrados]] — Prompts intocáveis sem permissão
- [[workflow-conteudo]] — Pipeline editorial
- [[supabase-config]] — Config Supabase
- [[git-remote]] — Remote git config
- [[blog-pipeline]] — Slugs, placeholders, paths
- [[artigos-publicados]] — Registro de slugs

Índice completo: [[10-memory/MEMORY]]

## 📚 Contexto de domínio

Conhecimento que orienta o trabalho:
- [[berkahn-brand]] — Identidade, voz, ICP
- [[steel-frame-domain]] — Técnica LSF
- [[design-principles]] — Design system
- [[article-pipeline]] — Pipeline técnico blog
- [[seo-aeo-strategy]] — Estratégia SEO + AEO
- [[presentation-system]] — Sistema apresentação

## 🔒 Prompts (calibrados)

Por workstream:
- **Blog (LOCKED 🔒)**: [[blog-brainstorm]] → [[blog-pesquisa]] → [[blog-criacao]] → [[article-implementation-prompt]]
- **LinkedIn (LOCKED 🔒)**: [[linkedin-post]]
- **Quick add (LOCKED 🔒)**: [[add-article]]
- **Material (flexível)**: [[canva-briefing]]
- **Apresentação (flexível)**: [[presentation-slide]]
- **SEO (flexível)**: [[seo-page-audit]]

Índice + regras: [[30-prompts/README]]

## 📝 Conteúdo (40-content)

- **Blog publicados**: 38 artigos em `40-content/blog/publicados/`
- **Drafts**: `40-content/blog/drafts/`
- **Ideias**: `40-content/blog/ideias/ideas-YYYY-MM.md`
- **Pesquisa**: `40-content/blog/pesquisa/`
- **LinkedIn**: `40-content/linkedin/YYYY-MM-DD-tema/`
- **Apresentações**: `40-content/apresentacoes/`
- **Materiais**: `40-content/materiais/`
- **Auditorias SEO**: `40-content/auditorias-seo/`

Query estruturada: [[artigos.base]] | [[calendario.base]]

## 🎨 Brand + 🏗️ Arquitetura

- [[guia-design-berkahn]] — Materiais físicos/digitais
- [[logos]] — Inventário (PNGs em `Docs/brand/logos/`)
- [[stack-nextjs-supabase]] — Stack técnica
- [[admin-setup]] — Painel admin
- [[google-sheets]] — Integração formulário
- [[blog-infra-vs-wordpress]] — Comparativo

## 📊 Queries (Bases)

**Originais**:
- [[artigos.base]] — Publicados / Drafts / SEO incompleto / **Sem ai_summary / Sem answer_summary / Sem capa / Por domínio**
- [[memoria.base]] — Memória por subtipo / atualizadas
- [[calendario.base]] — Pipeline / próximos 30 dias / backlog / **Por projeto**
- [[tarefas.base]] — Em aberto / por prioridade / **Por projeto**

**Novas (Sprint 3)**:
- [[projetos.base]] — 8 hubs first-class, status, cards, stale
- [[kpis.base]] — Dashboard cross-projeto, atrasados (<80% meta), auditorias SEO
- [[conhecimento.base]] — 10 atomic notes LSF em 70-knowledge/, mais usados, órfãs
- [[materiais.base]] — Índices binários, por projeto, com órfãos/duplicatas

## 🔧 Workflow

- **Sprint ativa**: [[sprint-ativa]]
- **Standup** (`/standup`): auto via scheduled-task `berkahn-standup-semanal` (segunda 9h) → escreve em `00-meta/standup/YYYY-MM-DD.md`
- **Wrap-up** (`/wrap-up`): auto via scheduled-task `berkahn-wrapup-semanal` (sexta 17h) → escreve em `00-meta/wrap-up/YYYY-MM-DD.md`
- **Daily notes**: usar template `template-daily.md` (linka projetos do dia)
- **Workflows por projeto**: [[workflow-conteudo]] · [[workflow-site]] · [[workflow-seo]] · [[workflow-comercial]] · [[workflow-material]] · [[workflow-pesquisa]]
- **Validação**: `node scripts/vault-validate.mjs` (manual ou via /standup, /wrap-up)
- **Backfill scripts**: `scripts/vault-backfill-articles.mjs`, `scripts/vault-backfill-ai-summary.mjs`, `scripts/vault-supabase-resync.mjs` — ver `scripts/VAULT-SCRIPTS-README.md`

## 📐 Diagramas

- `90-canvas/pipeline-conteudo.canvas` — Pipeline 4-etapas visual
