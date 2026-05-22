---
tipo: meta
criado: 2026-05-21
atualizado: 2026-05-21
tags:
  - status/active
ai_summary: Map of Content visual do vault Berkahn. Expansão do index.md com seções temáticas para navegação humana. Cluster por workstream (blog, LinkedIn, apresentação, site).
status: active
---

# MOC — Map of Content

Mapa temático do vault Berkahn. Para visão estrutural (por pasta), ver [[index]].

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

- **Blog publicados**: 35 artigos em `40-content/blog/publicados/`
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

- [[artigos.base]] — Publicados / Drafts / SEO incompleto
- [[memoria.base]] — Memória por subtipo / atualizadas
- [[calendario.base]] — Pipeline / próximos 30 dias / backlog
- [[tarefas.base]] — Em aberto / por prioridade

## 🔧 Workflow

- **Sprint ativa**: [[sprint-ativa]]
- **Standup output**: `00-meta/standup/`
- **Wrap-up output**: `00-meta/wrap-up/`
- **Daily notes**: usar template `template-daily.md`

## 📐 Diagramas

- `90-canvas/pipeline-conteudo.canvas` — Pipeline 4-etapas visual
