---
tipo: memory
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - ai/memory
  - status/active
  - project/material
ai_summary: Workflow do projeto Materiais — briefing (/material gera) → Canva (Bruno cria visual) → exportação → catalogação (índice). Materiais: capas blog (1 por artigo), peças LinkedIn (1 por post), infográficos, PDFs. Briefings vivem em 40-content/materiais/briefings/.
status: active
subtipo: project
why: "Material visual é gargalo (1 capa por artigo + 1 peça por post LinkedIn = volume contínuo). Briefing automatizado via prompt + catalogação estruturada evita perder rastreabilidade (briefing → imagem → output)."
how_to_apply: "Output (artigo/post) demanda visual → rodar /material com tema → recebe briefing detalhado → criar no Canva → exportar PNG/WebP para Docs/Conteúdo/[tipo]/ → atualizar índice correspondente em 40-content/materiais/indices/."
---

# Workflow do projeto Materiais

> Hub: [[materiais]] · Brand: [[berkahn-brand]] · Design: [[design-principles]] · Guia: [[guia-design-berkahn]]

## Pipeline

```
1. Demanda (artigo, post LinkedIn, apresentação, material institucional)
       ↓
2. /material  →  briefing-imagem.md
   ├─ Lê: berkahn-brand, design-principles, guia-design-berkahn
   └─ Output: briefing estruturado (conceito, paleta, layout, copy)
       ↓
3. Canva (Bruno)  →  imagem-final.png
   ├─ Importar template ou criar do zero seguindo briefing
   └─ Exportar PNG/WebP
       ↓
4. Arquivar em Docs/Conteúdo/[tipo]/
   ├─ Capa blog: Docs/Conteúdo/Capas blog/[slug].webp
   ├─ Peça LinkedIn: Docs/Conteúdo/peças linkedin/YYYY-MM-DD-tema.png
   └─ Infográfico/outros: Docs/Conteúdo/[subpasta]/
       ↓
5. Catalogar no índice apropriado em 40-content/materiais/indices/
   └─ Atualizar tabela com nome do arquivo + uso (artigo/post)
       ↓
6. Para capa blog: copiar/converter para public/images/img_blog/[slug]/cover.webp (produção)
```

## Etapas

### 1. Demanda
- Origem: pipeline blog ([[workflow-conteudo]]), pipeline comercial ([[workflow-comercial]]), apresentação, material institucional ad-hoc
- Identificar tipo: capa blog / peça LinkedIn / infográfico / brand asset / proposta

### 2. Briefing via /material
- Rodar `/material` com tema/conceito
- Lê contexto: [[berkahn-brand]] (voz, ICP, pilares), [[design-principles]] (paleta preto/off-white, Manrope, ícones outline), [[guia-design-berkahn]]
- Output: `40-content/materiais/briefings/YYYY-MM-DD-tema.md`
- Briefing inclui: conceito, paleta, tipografia, layout sugerido, copy de elementos, referências visuais

### 3. Criação no Canva
- Bruno acessa Canva e cria visual seguindo briefing
- Usar templates Berkahn quando existirem (manter consistência)
- Aplicar logo de [[indices-identidade-visual]] (escolher variação por fundo)
- Exportar: PNG (alta qualidade) ou WebP (web)

### 4. Arquivamento
- **Capa blog** (final em produção): converter para WebP (sharp, quality 80, max 1200px) → `public/images/img_blog/[slug]/cover.webp`
- **Capa blog** (versão arquivo Canva): salvar em `Docs/Conteúdo/Capas blog/[slug].png`
- **Peça LinkedIn**: salvar em `Docs/Conteúdo/peças linkedin/YYYY-MM-DD-tema.png` E em `40-content/linkedin/YYYY-MM-DD-tema/imagem-final.png`
- **Infográfico/material institucional**: salvar em `Docs/Conteúdo/[subpasta apropriada]/`

### 5. Catalogação
- Atualizar índice correspondente em `40-content/materiais/indices/`:
  - [[indices-capas-blog]] para capas
  - [[indices-pecas-linkedin]] para peças LinkedIn
  - [[indices-imagens-equipe]], [[indices-imagens-gerais]], etc. para outros
- Adicionar linha na tabela: arquivo + uso/artigo
- Atualizar `arquivos_total` no frontmatter

### 6. Vinculação bidirecional (Sprint 2 backfill)
- Artigo ganha frontmatter `material_visual_slug: <nome-arquivo>`
- Post LinkedIn ganha `material:` no frontmatter
- Material no índice ganha `usado_em:` (lista de artigos/posts)

## Prompts e bases

- Slash: `/material` (gerar briefing Canva)
- Prompt: [[canva-briefing]]
- Bases consumidas: nenhuma específica (consulta hubs e índices)
- Base atualizada: [[materiais.base]] (criada em Sprint 3)

## Outputs típicos

- Briefing em `40-content/materiais/briefings/`
- Imagem em `Docs/Conteúdo/[tipo]/` (origem Canva)
- Imagem em `public/images/img_blog/[slug]/cover.webp` (produção, capas blog)
- Update de [[indices-capas-blog]] ou índice apropriado
- Update do hub [[materiais]] (kpi_capas_blog, kpi_pecas_linkedin)

## Subagents úteis

- `@design-review` — validar consistência brand de novos materiais antes de uso

## Manutenção e qualidade

- Padronizar naming: `[slug-do-artigo].webp` para capa blog, `YYYY-MM-DD-tema.png` para LinkedIn
- Consolidar variações duplicadas em [[indices-capas-blog]] e [[indices-identidade-visual]]
- Pasta `Docs/Marketing Materials/` (Assets, Business Card, Flyer) está VAZIA — popular conforme demanda

## Gap atual

- 22 capas blog mas só 35 artigos (faltam para 13 artigos sem capa catalogada)
- 1 peça LinkedIn vs 1 post (proporcional, mas baixo volume absoluto)
- Identidade visual com 10 logos mas naming inconsistente — consolidar
- Sem briefings históricos arquivados (todo briefing futuro vai para `40-content/materiais/briefings/`)
