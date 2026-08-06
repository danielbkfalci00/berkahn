---
tipo: meta
criado: 2026-05-21
atualizado: 2026-05-21
tags:
  - status/active
ai_summary: Entry point do vault Berkahn. Claude lê este arquivo PRIMEIRO em toda sessão (via SessionStart hook). Mapa de navegação para 12 pastas top-level.
status: active
---

# Berkahn Vault

**Memória, contexto, prompts e conteúdo do projeto Berkahn — fonte única.**

## Navegação rápida (MOC)

| # | Pasta | Conteúdo |
|---|-------|----------|
| 00 | [[00-meta/MOC]] | Map of Content, CHANGELOG, projetos, standup, wrap-up |
| 10 | [[10-memory/MEMORY]] | Memória persistente (user, feedback, project, reference) |
| 20 | [[article-pipeline]] | Contexto de domínio (pipeline, brand, SEO, design, presentation, LSF) |
| 30 | [[30-prompts/README]] | Prompts calibrados (locked — não alterar sem permissão) |
| 40 | `40-content/` | Blog (publicados, drafts, ideias, pesquisa), LinkedIn, apresentações, materiais, auditorias SEO, [[2026-08-calendario-editorial\|estratégia editorial]] |
| 50 | [[guia-design-berkahn]] | Brand assets (guia design, logos) |
| 60 | [[stack-nextjs-supabase]] | Arquitetura (stack, admin, integrações, blog infra) |
| 70 | `70-knowledge/` | Atomic notes (conceitos LSF, normas, etc.) |
| 80 | `80-bases/` | Queries estruturadas: [[artigos.base]], [[memoria.base]], [[calendario.base]], [[tarefas.base]] |
| 90 | `90-canvas/` | Diagramas Canvas (pipeline-conteudo) |
| 91 | `91-templates/` | Templates Templater (memory, atomic, prompt, draft-blog, daily) |
| 99 | `99-archive/` | Notas arquivadas/obsoletas |

## Como Claude usa este vault (padrão token-efficient)

1. **SKIM**: este `index.md` + [[00-meta/MOC]] + [[10-memory/MEMORY]]
2. **GREP**: `Grep "ai_summary:" Berkahn-Vault/` → TL;DRs de todas notas em uma chamada
3. **READ TARGETED**: abrir só notas com hit relevante

Regras detalhadas em [[CLAUDE]] (vault-level — separado do CLAUDE.md do projeto).

## Workflow semanal

| Dia | Comando | Output em |
|-----|---------|-----------|
| Segunda 9h | `/standup` | `00-meta/standup/YYYY-MM-DD.md` |
| Segunda 14h | `/brainstorm` | `40-content/blog/ideias/ideas-YYYY-MM.md` |
| Terça | `/pesquisa` | bloco Pesquisa da pauta em `/admin/conteudo` |
| Quarta | `/criacao` | `40-content/blog/drafts/[slug].md` |
| Quinta | `/artigo produzir` + aprovação + `/artigo publicar` | markdown publicado + trilhas do card |
| Sexta 17h | `/wrap-up` | `00-meta/wrap-up/YYYY-MM-DD.md` |
| Domingo | `dream` (auto) | `~/.claude/projects/.../memory/` (revisar segunda) |
