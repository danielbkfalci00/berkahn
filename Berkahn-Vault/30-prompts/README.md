---
tipo: meta
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/prompt
  - status/active
ai_summary: Índice dos 9 prompts calibrados Berkahn por workstream. Comandos slash referenciam estes prompts. Locked prompts não devem ser alterados sem permissão.
status: active
---

# Prompts — Marketing Hub Berkahn

Biblioteca de prompts organizados por workstream. Use via slash commands ou diretamente. Regras gerais em [[prompts-calibrados]].

## Pipeline de Artigos (4 etapas sequenciais)

| Etapa | Prompt | Comando | O que faz |
|-------|--------|---------|-----------|
| 1 | [[blog-brainstorm]] 🔒 | `/brainstorm` | Gera ideias priorizadas por impacto |
| 2 | [[blog-pesquisa]] 🔒 | `/pesquisa` | Pesquisa tema e escreve artigo completo |
| 3 | [[blog-criacao]] 🔒 | `/criacao` | Escreve artigo final com regras rígidas |
| 4 | [[article-implementation-prompt]] 🔒 | `/artigo` | Implementa com componentes + publica no Supabase |

**Quick add**: [[add-article]] — versão simplificada que pula direto para a etapa 4.

## LinkedIn

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| [[linkedin-post]] 🔒 | `/linkedin` | Cria post + briefing de imagem para Canva |

## Apresentações

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| [[presentation-slide]] | `/apresentacao` | Cria/edita slides da apresentação executiva |

## Materiais (Canva)

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| [[canva-briefing]] | `/material` | Gera briefing detalhado para material no Canva |

## SEO

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| [[seo-page-audit]] | `/seo` | Audita SEO/AEO de uma página do site |

## Legenda

- 🔒 `locked: true` — prompt calibrado por Bruno, NÃO ALTERAR sem permissão (ver [[prompts-calibrados]])
- Demais: criados por Claude, podem ser ajustados com mais liberdade

## Context Files (referenciados pelos prompts)

Os prompts referenciam arquivos de contexto em `Berkahn-Vault/20-context/`:

- [[berkahn-brand]] — Identidade, voz, terminologia, ICP
- [[steel-frame-domain]] — Conhecimento técnico de LSF
- [[seo-aeo-strategy]] — Regras de SEO/AEO para conteúdo
- [[article-pipeline]] — Pipeline de artigos e componentes
- [[presentation-system]] — Arquitetura de apresentações
- [[design-principles]] — Paleta, tipografia, princípios visuais
