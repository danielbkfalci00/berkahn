---
tipo: memory
criado: 2026-04-13
atualizado: 2026-08-12
tags:
  - ai/memory
  - status/active
  - project/blog
  - project/linkedin
ai_summary: /conteudo é o orquestrador único até aprovação. Ele seleciona um pacote, usa contexto progressivo, produz artigo, LinkedIn e capas e para para decisão humana; publicação real continua explícita.
status: active
subtipo: project
why: "Cada etapa tem prompt específico calibrado. Separar em etapas permite iterar em cada fase sem perder contexto das regras de qualidade."
how_to_apply: "Dizer 'Produza o próximo conteúdo' → /conteudo seleciona e executa até o pacote de aprovação → dizer 'Aprovo' → Blog publica; LinkedIn recebe copy, capa e UTM para publicação manual."
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
- Slash command diário: `/conteudo produzir` orquestra os comandos especializados
  `/pesquisa`, `/criacao`, `/artigo` e `/linkedin` sem duplicar seus prompts

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
prompt completo** como fallback manual e não interprete heartbeat antigo como saúde.

O run direto tem uma pauta, no máximo oito transições e contexto progressivo.
`pauta.mjs selecionar --escopo=pacote` prioriza aprovação pendente, fila e WIP
antes de abrir pauta planejada. A confirmação “Aprovo” pode registrar a decisão
via CLI, mas não é inferida de silêncio ou elogio.

Ao atualizar slug já publicado, `/artigo produzir` mantém `posts` live e salva a
revisão em `conteudo_pautas.post_draft_payload`. Só `/artigo publicar`, depois da
aprovação, aplica payload, promove capa/markdown e limpa staging atomicamente.

Mover status é sempre permitido e nunca executa publicação. A visão Geral só
mostra Concluída quando Blog e LinkedIn aplicáveis têm publicação real.
