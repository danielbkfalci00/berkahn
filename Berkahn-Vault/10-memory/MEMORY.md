---
tipo: meta
criado: 2026-05-21
atualizado: 2026-07-01
tags:
  - ai/memory
  - status/active
ai_summary: Índice da memória persistente do projeto Berkahn — perfis, feedbacks, projetos, referências. Claude lê este arquivo para localizar memórias específicas via wikilinks.
status: active
---

# Memória — Berkahn

## Perfil

- [[perfil-bruno]] — Único marketing da Berkahn (site/blog/LinkedIn/apresentações)

## Feedback (regras de trabalho)

- [[copy-sem-travessao]] — Nunca usar — ou - como separador estilístico em copy
- [[prompts-calibrados]] — Prompts de conteúdo intocáveis sem permissão

## Project (workflows ativos)

- [[workflow-conteudo]] — Pipeline 4 etapas, 1 artigo + 1 LinkedIn por semana

## Reference (configs e dados)

- [[supabase-config]] — Config Supabase (secrets em `.env`)
- [[git-remote]] — Remote git config (PAT em `.env`)
- [[blog-pipeline]] — Slugs, placeholders, paths do blog
- [[artigos-publicados]] — Registro de slugs + Supabase IDs
- [[google-apis-setup]] — Setup GA4 + Search Console + troubleshooting OAuth (cron `berkahn-performance-mensal`)
- [[analytics-methodology]] — Fórmulas dashboard `/admin/analytics` (Health Score, metas dinâmicas, red flags)

## Como Claude usa esta memória

Padrão SKIM → GREP → READ TARGETED:
1. **SKIM**: este `MEMORY.md` + `[[../index]]` (entry point do vault)
2. **GREP**: `Grep "ai_summary:" 10-memory/` para TL;DR de todas notas
3. **READ TARGETED**: abrir notas específicas via wikilinks

Detalhes em [[CLAUDE]] (vault-level).
