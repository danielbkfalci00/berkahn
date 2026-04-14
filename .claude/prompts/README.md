# Prompts — Marketing Hub Berkahn

Biblioteca de prompts organizados por workstream. Use via slash commands ou diretamente.

## Pipeline de Artigos (4 etapas sequenciais)

| Etapa | Prompt | Comando | O que faz |
|-------|--------|---------|-----------|
| 1 | `blog-brainstorm.md` | `/brainstorm` | Gera ideias priorizadas por impacto |
| 2 | `blog-pesquisa.md` | `/pesquisa` | Pesquisa tema e escreve artigo completo |
| 3 | `blog-criacao.md` | `/criacao` | Escreve artigo final com regras rígidas |
| 4 | `article-implementation-prompt.md` | `/artigo` | Implementa com componentes + publica no Supabase |

**Quick add**: `add-article.md` — versão simplificada que pula direto para a etapa 4.

## LinkedIn

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| `linkedin-post.md` | `/linkedin` | Cria post + briefing de imagem para Canva |

## Apresentações

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| `presentation-slide.md` | `/apresentacao` | Cria/edita slides da apresentação executiva |

## Materiais (Canva)

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| `canva-briefing.md` | `/material` | Gera briefing detalhado para material no Canva |

## SEO

| Prompt | Comando | O que faz |
|--------|---------|-----------|
| `seo-page-audit.md` | `/seo` | Audita SEO/AEO de uma página do site |

## Context Files (base de conhecimento)

Os prompts referenciam arquivos de contexto em `.claude/context/`:
- `berkahn-brand.md` — Identidade, voz, terminologia, ICP
- `steel-frame-domain.md` — Conhecimento técnico de LSF
- `seo-aeo-strategy.md` — Regras de SEO/AEO para conteúdo
- `article-pipeline.md` — Pipeline de artigos e componentes
- `presentation-system.md` — Arquitetura de apresentações
- `design-principles.md` — Paleta, tipografia, princípios visuais
