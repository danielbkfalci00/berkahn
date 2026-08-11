---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-06
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/linkedin
ai_summary: Status do quadro é livre e não publica. Gaps orientam a próxima ação; pesquisa, draft, artigo e LinkedIn podem entrar na fila Codex, mas aprovação editorial e publicação real continuam humanas.
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
- LinkedIn continua sendo publicado manualmente; URL e data comprovam a publicação real, independentemente do status escolhido

## Materiais relacionados

- Imagens para LinkedIn: briefing gerado pelo prompt → Canva
- Materiais visuais (flyers, cartões, treinamentos): Canva
- Slash commands: `/brainstorm`, `/pesquisa`, `/criacao`, `/artigo`, `/linkedin`

## Referências

- Pipeline técnico: [[article-pipeline]]
- Prompts: [[prompts-calibrados]]
- Brand: [[berkahn-brand]]

## Operação assistida pelo Codex

No card, **Enviar ao Codex** cria um job durável para a próxima ação derivada dos
artefatos. O worker usa `pauta.mjs job-claim`, carrega contexto progressivo com
`proxima --include` e finaliza com tokens, custo, hashes e `run_id`. Se o
computador estiver desligado, o job permanece na fila. O agendamento local
`worker-de-conte-do-berkahn` está **pausado**: a configuração antiga de 15
minutos aponta para um worktree removido e criava uma task completa por ciclo.
Até o redesenho para execução sob demanda ou heartbeat leve, use **Copiar
contexto** como fallback manual e não interprete heartbeat antigo como saúde.

Mover status é sempre permitido e nunca executa publicação. A visão Geral só
mostra Concluída quando Blog e LinkedIn aplicáveis têm publicação real.
