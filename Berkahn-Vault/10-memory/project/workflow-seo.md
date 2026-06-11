---
tipo: memory
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - ai/memory
  - status/active
  - project/site
  - project/blog
  - domain/seo
ai_summary: Workflow do projeto SEO/AEO — auditoria periódica + remediação P0/P1/P2. Cadência sugerida quinzenal. Foco atual P0 indexação (6/44). Cross-projeto (afeta blog e site). Output em 40-content/auditorias-seo/.
status: active
subtipo: project
why: "SEO/AEO é trabalho contínuo, não pontual. Indexação Google e citações por IA decidem visibilidade. Workflow definido garante regressões não passam batido e P0s são resolvidos antes de virarem crônicos."
how_to_apply: "Quinzenal: rodar /seo (auditoria periódica) → comparar com diagnóstico anterior → atualizar hub [[seo-aeo]] com novos P0/P1/P2 → executar ações P0 primeiro (Bruno) → re-auditar próximo ciclo."
---

# Workflow do projeto SEO/AEO

> Hub: [[seo-aeo]] · Estratégia: [[seo-aeo-strategy]] · Pipeline: [[article-pipeline]]

## Pipeline

**Cadência sugerida**: quinzenal (a cada 2 sextas) ou após mudança grande no site/blog.

Disparado por:
- Cadência regular (scheduled-task futuro — Fase 4.5)
- Novo artigo publicado (validar SEO/AEO no `/artigo`)
- Mudança técnica no site (impacto em schema/metadata)
- Alerta GSC (drop em impressões, novo erro de indexação)
- Update de algoritmo Google ou nova feature AI Overview

## Etapas

### 1. Auditoria periódica
- Rodar `/seo` slash command
- Output: nota em `40-content/auditorias-seo/YYYY-MM-tema.md`
- Frontmatter: `tipo: auditoria`, `data_diagnostico:`, `kpi_*` snapshot

### 2. Comparação com diagnóstico anterior
- Ler [[2026-04-diagnostico-integrado]] (último)
- Comparar KPIs: score, indexação, posts sem meta, etc.
- Identificar: resolvidos, regressões, novos problemas

### 3. Classificação P0/P1/P2
- **P0** (urgente, esta semana): indexação, bugs críticos de schema, meta tags faltantes em posts ativos
- **P1** (1-2 semanas): categorias, sitemap, robots, backlinks
- **P2** (2-4 semanas): pillar pages, internal linking estruturado, hreflang

### 4. Atualizar hub [[seo-aeo]]
- Status atual
- Bloqueios ativos por prioridade
- KPIs no frontmatter (`kpi_score`, `kpi_paginas_indexadas`, etc.)
- Histórico recente

### 5. Execução de ações P0
- Bruno: ações em painel admin (preencher meta tags, answer_summary, normalizar categorias)
- Bruno: ações em GSC (solicitar indexação, ativar GBP)
- Claude: ações em código (`app/robots.ts`, `app/sitemap.ts`, schema fixes em `app/layout.tsx`)
- Documentar em commits + atualizar hub

### 6. Validação
- Aguardar 1-7 dias pós-ação para Google reagir
- Verificar GSC: novas indexações? regressões?
- Atualizar `kpi_atualizado_em` no hub

## Prompts e bases

- Prompt: [[seo-page-audit]] (não-locked) — auditoria de página específica
- Slash: `/seo` (auditoria global)
- Bases consumidas: [[artigos.base]] view "SEO incompleto"
- Bases atualizadas: [[kpis.base]] (após Sprint 3)

## Outputs típicos

- Nova auditoria em `40-content/auditorias-seo/YYYY-MM-tema.md`
- Atualização do hub [[seo-aeo]]
- PRs em código (`app/robots.ts`, `app/sitemap.ts`, etc.) — workflow [[workflow-site]]
- Alterações em Supabase (meta tags, answer_summary) via admin
- Ações manuais Bruno (GSC, GBP, diretórios)

## Subagents úteis

- (nenhum subagent específico)

## Auditorias arquivadas

- [[2026-04-diagnostico-integrado]] — score 52/100, 9 posts sem meta, P0 indexação
- [[2026-03-diagnostico-base]] — score teórico 74/100 (superado)
- [[research-seo-aeo]] — blueprint teórico SEO+AEO 2026
