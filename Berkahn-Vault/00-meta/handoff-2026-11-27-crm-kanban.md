---
tipo: meta
criado: 2026-11-27
atualizado: 2026-11-27
tags:
  - domain/admin
  - project/site
  - status/active
ai_summary: Handoff da sessão de 13 a 27/11/2026 (CRM Kanban, tags, e-mail engenharia@, pedido de LinkedIn visual). Lista os PRs #151 a #160 em produção, a migration de tags aplicada, o que foi e o que não foi testado, pendências, decisões, a infraestrutura de trabalho no Claude Code e o prompt de abertura da próxima sessão. Continua o handoff de 13/11.
status: active
projeto: site
---

# Handoff — CRM Kanban, tags e e-mail (13 → 27/11/2026)

> Continua [[handoff-2026-11-13-admin-analytics]], que segue válido para tudo
> antes de 13/11 (analytics, LGPD, mural de feedback, PWA). Ler os dois.
> Contexto do produto: [[site]], [[admin-setup]], [[admin-feedback]].

## Escopo

O CRM de leads do admin (`/admin/leads`, visão Kanban e prévia do lead), o
e-mail de contato do site e um pedido de LinkedIn mais visual que ficou só
na conversa.

## O que foi entregue (tudo em `main`; Vercel publicou site e admin)

| PR | O quê | Testado |
|---|---|---|
| #151 | Handoff de 13/11 no vault | — |
| #152 | E-mail de solicitação de projeto vira `engenharia@berkahn.com.br` em todo o site: termos, privacidade, JSON-LD do `app/layout.tsx`, `UnifiedCTA`, slide de contato, `lib/constants.tsx`, `lib/institucional-data.ts`, `lib/orcamento-data.ts`, `public/llms.txt` | tsc, lint |
| #156 | Kanban: tirou o seletor de etapa duplicado da frente do card; descrição, urgência e responsável editáveis direto no card; prévia (clique no card) com campos editáveis no topo (etapa, urgência, responsável, próxima ação, descrição), contato completo editável e só depois origem/mensagem. Link "Histórico, arquivos e orçamentos" leva à ficha | tsc, lint (sem navegador) |
| #157 | Tags livres nos leads, no card e na prévia, com sugestão das já usadas | tsc, lint (sem navegador) |
| #158 | As 8 raias numa linha só, com rolagem horizontal (antes grid de 6 colunas quebrava Convertido e Perdido para baixo) | Navegador local logado |
| #159 | Card limpo: nome numa linha, descrição até 4 linhas sem barra de rolagem, "+ descrição" e "+ tag" discretos, `DndContext id` fixo (corrige erro de hidratação) | Navegador local logado |
| #160 | No PC: arrastar o fundo do quadro rola as raias; o card arrasta de qualquer área que não seja campo ou botão. Clique simples abre a prévia; soltar não abre. Teclado só pela alça. Celular sem mudança. Também consertou o teste `scripts/test-admin-navigation.mjs`, que falhava na `main` desde o #156 | Navegador local logado; CI local (lint, typecheck, test:conteudo, crm, admin, analytics) |

### Arquivos centrais

- `components/admin/analytics/LeadsQueue.tsx`: fila, Kanban, prévia (`LeadQuickView`), `saveOperations` otimista com rollback só dos campos tocados (tags vão para `setLeadTags`, o resto para `updateLeadOperations`), `CardPointerSensor` e pan do quadro
- `components/admin/analytics/LeadEditors.tsx` (novo): `InlineSummary` (salva no blur, Esc cancela, Ctrl+Enter salva; `compact` no card), `PrioritySelect`, `ResponsibleSelect`, `TagEditor`, `LeadContactEditor`
- `app/admin/leads/actions.ts`: `setLeadTags`; `getLeadPreview` passou a trazer `cargo`
- `app/admin/leads/page.tsx`: `LEAD_COLUMNS` inclui `tags`

### Migration aplicada nesta sessão

- `supabase/migrations/20261126180000_leads_tags.sql`: `leads.tags TEXT[] NOT NULL DEFAULT '{}'`, índice GIN e RPC `set_lead_tags(p_id, p_tags)` (SECURITY INVOKER, exige `is_berkahn_admin()`, normaliza para minúsculas, até 10 tags de 30 caracteres, grava em `activity_logs`). Aplicada em 26/11 via `DATABASE_URL` do `.env.local` com `pg`; conferido depois: coluna presente nos 67 leads e função criada. Reversão descrita no cabeçalho do arquivo.

## O que não foi testado

- Salvar de verdade descrição, urgência, responsável, próxima ação, contato ou tag pela interface (evitei alterar dados reais)
- Soltar um card em outra raia (mudança de etapa) com o arrasto novo do #160
- Qualquer tela no celular depois do #156
- O admin publicado: todos os testes foram no servidor local logado

## Pendências

### Do Bruno
- [ ] @bruno Testar no admin publicado: editar descrição, urgência, responsável e tag de um card, recarregar e conferir que ficou salvo #pendencia
- [ ] @bruno Arrastar um card para outra etapa no PC e conferir a mudança #pendencia
- [ ] @bruno Conferir o Kanban no celular #pendencia
- [ ] @bruno Responder se quer seguir com o LinkedIn visual (ver abaixo) #pendencia
- [ ] @bruno Herdadas de 13/11: "Secure password change" no Supabase, reinstalar o atalho do admin no celular, testar push do mural de feedback #pendencia

### Técnicas
- Filtro por tag na fila e no Kanban não existe (o índice GIN já está pronto para isso)
- O login de owner e a RLS continuam presos a `contato.berkahn@gmail.com`; só o e-mail exibido no site mudou. Notificações seguem só por Web Push (Apps Script/Gmail desligado). As migrations 017/024/031, `scripts/db/testar-leads-crm.mjs` e o subject VAPID em `lib/push/dispatch.ts` ainda citam o e-mail antigo de propósito
- Workflow `pages build and deployment` (GitHub Pages legado) segue no repo; despublicar com conta admin
- Herdadas de 13/11: colunas `sheet_sync_*`, junho/2026 em `analytics_snapshots` com só 20 queries, artigo `construir-ou-comprar-pronto-numeros-grande-sp` sem CTA

## Pedido de LinkedIn mais visual (só na conversa, nada implementado)

O Bertevas pediu pelo WhatsApp GIFs, infográficos, debate e dados de tamanho
de mercado nos posts. Resposta dada: dá para fazer infográfico em PNG,
carrossel em PDF, loop em MP4 no lugar de GIF e pergunta de debate na copy.
Dados só de fonte citável, e sem claim de experiência (a Berkahn nunca executou obra; memória nativa
`project-berkahn-sem-obra-real.md` em `~/.claude/projects/.../memory/`).
Proposta em aberto: começar pela pesquisa dos dados de mercado. Fluxo do
LinkedIn em [[workflow-conteudo]] e `/linkedin`.

## Decisões

- Tags livres, não lista fixa; sugestão das já usadas evita "steel frame" e "steelframe" separadas
- Campos operacionais salvam ao sair do campo; contato salva por botão (validação cruza nome, telefone e e-mail)
- No celular o card não arrasta pelo corpo (só pela alça, escondida), para não brigar com a rolagem; a etapa muda pela prévia
- Auto-merge nunca sem pedido do Bruno (no #152 liguei sem pedido; não repetir)

## Infraestrutura de trabalho no Claude Code

- **Worktree por tarefa**: `git worktree add .worktrees/<nome> -b <branch> origin/main`, `npm ci` dentro, `cp ../../.env.local .`. A pasta principal fica em branches de outras sessões (em 27/11 estava em `codex/admin-performance-mobile`). O worktree desta sessão é `.worktrees/crm-cards`
- **Testar logado localmente**: `.claude/launch.json` da pasta principal roda o `npm run dev` da pasta principal, não do worktree. Para testar o worktree, adicionar temporariamente uma config com `"runtimeArgs": ["--prefix", ".worktrees/<nome>", "run", "dev", "--", "-p", "3005"]`, abrir no navegador do app e pedir ao Bruno para logar no painel (o Claude não digita senha). O cookie de `localhost` vale para qualquer porta. Remover a config depois
- **Tela do Bruno**: testar o admin em 1366×768 (`resize_window`); o painel estreito mostra a versão mobile
- **Migration**: nesta sessão o Claude aplicou direto com `pg` e `DATABASE_URL` do `.env.local` (no handoff de 13/11 isso era bloqueado; o classificador decide caso a caso). Alternativa: `node --env-file=.env.local scripts/db/aplicar-migration.mjs <arquivo>`
- **Merge**: o classificador do modo automático às vezes bloqueia `gh pr merge` mesmo com "pode mergear". Quando bloquear, passar o comando para o Bruno rodar. Conferir se o PR já foi mergeado antes de dar push novo na branch: o #158 foi mergeado antes do último commit, que precisou do #159
- **CI local antes do PR**: `npm run lint`, `typecheck`, `test:conteudo`, `test:crm`, `test:admin`, `test:analytics` (lista em `.github/workflows/quality.yml`). O `test:admin` roda `LeadsQueue.tsx` num VM com imports simulados: todo import novo nesse arquivo precisa de stub em `scripts/test-admin-navigation.mjs`
- **Mural de feedback**: `node --env-file=../../.env.local scripts/admin/feedback.mjs listar` (vazio em 27/11)

## Prompt de abertura da próxima sessão

> Leia `Berkahn-Vault/00-meta/handoff-2026-11-27-crm-kanban.md` e
> `handoff-2026-11-13-admin-analytics.md`. Confira se o CI Quality da `main`
> está verde, rode `node scripts/admin/feedback.mjs listar` e me pergunte o
> resultado dos testes que deixei pendentes no Kanban antes de propor
> qualquer coisa. Trabalhe sempre num worktree novo a partir de `origin/main`.
