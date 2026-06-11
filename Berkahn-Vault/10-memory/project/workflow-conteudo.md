---
tipo: memory
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Pipeline de artigos tem 4 etapas (brainstorm → pesquisa → criação → produção). Cadência 1 artigo + 1 LinkedIn por semana. Notion = hub de gerenciamento (manual).
status: active
subtipo: project
why: "Cada etapa tem prompt específico calibrado. Separar em etapas permite iterar em cada fase sem perder contexto das regras de qualidade."
how_to_apply: "Seguir ordem brainstorm → pesquisa → criação → artigo. LinkedIn vem depois (referencia o artigo). Bruno copia manualmente para Notion."
---

# Workflow de conteúdo semanal

Pipeline de artigos tem 4 etapas sequenciais:

1. **Brainstorm** (`/brainstorm`) — gerar ideias priorizadas
2. **Pesquisa** (`/pesquisa`) — pesquisar e escrever artigo completo
3. **Criação** (`/criacao`) — escrever artigo final com regras rígidas
4. **Produção** (`/artigo`) — implementar com componentes + publicar no Supabase

## Cadência

- 1 artigo blog + 1 post LinkedIn por semana
- Artigo primeiro, LinkedIn depois (o post referencia o artigo)
- Notion é o hub de gerenciamento (não há integração direta, Bruno copia conteúdo manualmente)

## Materiais relacionados

- Imagens para LinkedIn: briefing gerado pelo prompt → Canva
- Materiais visuais (flyers, cartões, treinamentos): Canva
- Slash commands: `/brainstorm`, `/pesquisa`, `/criacao`, `/artigo`, `/linkedin`

## Referências

- Pipeline técnico: [[article-pipeline]]
- Prompts: [[prompts-calibrados]]
- Brand: [[berkahn-brand]]
