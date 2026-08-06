---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-06
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Quadro /admin/conteudo é a fonte operacional. Cada pauta tem trilhas Blog e LinkedIn independentes; pesquisa e LinkedIn ficam no card, draft fica no vault e publicação exige aprovação manual.
status: active
subtipo: project
why: "Cada etapa tem prompt específico calibrado. Separar em etapas permite iterar em cada fase sem perder contexto das regras de qualidade."
how_to_apply: "Selecionar pauta aprovada no quadro → /pesquisa → /criacao registra draft_path → /artigo produzir → aprovação manual → /artigo publicar. /linkedin corre em trilha própria e só publica após URL + data."
---

# Workflow de conteúdo semanal

Pipeline de artigos tem 4 etapas sequenciais:

1. **Brainstorm** (`/brainstorm`) — gerar ideias priorizadas
2. **Pesquisa** (`/pesquisa`) — pesquisar e escrever artigo completo
3. **Criação** (`/criacao`) — escrever artigo final com regras rígidas
4. **Produção** (`/artigo produzir`) — implementar e criar post como draft
5. **Aprovação** — sempre manual no quadro
6. **Publicação** (`/artigo publicar`) — publicar post+pauta e mover markdown

## Cadência

- 1 artigo blog + 1 post LinkedIn por semana
- Blog e LinkedIn avançam de forma independente no mesmo card
- `/admin/conteudo` é o hub operacional; `calendario.base` é visão do acervo
- LinkedIn continua sendo publicado manualmente; URL e data fecham a trilha

## Materiais relacionados

- Imagens para LinkedIn: briefing gerado pelo prompt → Canva
- Materiais visuais (flyers, cartões, treinamentos): Canva
- Slash commands: `/brainstorm`, `/pesquisa`, `/criacao`, `/artigo`, `/linkedin`

## Referências

- Pipeline técnico: [[article-pipeline]]
- Prompts: [[prompts-calibrados]]
- Brand: [[berkahn-brand]]
