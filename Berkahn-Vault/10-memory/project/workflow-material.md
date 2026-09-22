---
tipo: memory
criado: 2026-05-22
atualizado: 2026-09-10
tags:
  - ai/memory
  - status/active
  - project/material
ai_summary: Workflow de Materiais — briefing → cinco cenários → seleção única → WebP 1200x800 para Blog e recorte 1080x1350 para LinkedIn → staging do card → catálogo. Canva continua válido para peças gráficas; capas fotográficas podem sair do gerador de imagens.
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
3. Produção visual  →  imagem-final.png
   ├─ Capa fotográfica: gerar cinco cenários, selecionar um e recortar os dois canais
   └─ Peça gráfica: Canva seguindo briefing e templates Berkahn
       ↓
4. Arquivar em Docs/banco-imagens/[categoria]/
   ├─ Lote de capas: capas-blog/[lote]/[slug]/{scenario-*,selected,linkedin-1080x1350}.webp
   ├─ Peça LinkedIn: materiais-marketing/YYYY-MM-DD-tema.png
   └─ Infográfico/outros: categoria correspondente
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

### 3. Produção visual
- Capas fotográficas: gerar cinco cenários distintos, escolher um arquivo e derivar dele Blog 1200×800 e LinkedIn 1080×1350.
- Peças com texto ou composição gráfica: usar Canva e os templates Berkahn.
- Aplicar logo de [[indices-marca]] somente quando o formato pedir; capas de artigo não levam texto embutido.

### 4. Arquivamento
- **Capa blog** (final em produção): converter para WebP (sharp, quality 80, max 1200px) → `public/images/img_blog/[slug]/cover.webp`
- **Capa blog** (fonte e variações): salvar em `Docs/banco-imagens/capas-blog/`.
- **Peça LinkedIn**: salvar em `Docs/banco-imagens/materiais-marketing/` e na pasta do post quando houver acervo específico.
- **Infográfico/material institucional**: salvar na categoria apropriada de `Docs/banco-imagens/`.

### 5. Catalogação
- Atualizar índice correspondente em `40-content/materiais/indices/`:
  - [[indices-capas-blog]] para capas
  - [[indices-materiais-marketing]] para peças LinkedIn
  - [[indices-equipe]], [[indices-obras-projetos]] ou outra categoria de [[banco-imagens]] para os demais usos
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
- Imagem-fonte em `Docs/banco-imagens/[categoria]/`
- Imagem em `public/images/img_blog/[slug]/cover.webp` (produção, capas blog)
- Update de [[indices-capas-blog]] ou índice apropriado
- Update do hub [[materiais]] (kpi_capas_blog, kpi_pecas_linkedin)

## Subagents úteis

- `@design-review` — validar consistência brand de novos materiais antes de uso

## Manutenção e qualidade

- Padronizar naming: `[slug-do-artigo].webp` para capa blog, `YYYY-MM-DD-tema.png` para LinkedIn
- Consolidar variações duplicadas em [[indices-capas-blog]] e [[indices-marca]]
- Pasta `Docs/Marketing Materials/` (Assets, Business Card, Flyer) está VAZIA — popular conforme demanda

## Gap atual

- O acervo de capas inclui o lote de 20 pautas de setembro; cobertura real deve ser conferida pelo staging do card e por `public/images/`, não pela contagem bruta de variações.
- 1 peça LinkedIn vs 1 post (proporcional, mas baixo volume absoluto)
- Identidade visual com 10 logos mas naming inconsistente — consolidar
- Sem briefings históricos arquivados (todo briefing futuro vai para `40-content/materiais/briefings/`)
