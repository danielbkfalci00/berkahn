---
tipo: memory
criado: 2026-05-29
atualizado: 2026-05-29
tags:
  - ai/memory
  - status/active
  - project/site
  - source/manual
ai_summary: Roadmap multi-sprint (S5-S8) do dashboard /admin/analytics após sort/filter. Cobre bugs visuais (dropdowns transparentes, charts Ato 2, links de post), tabela Notion-like (resize+reorder de colunas, tooltips de status) e sistema de tarefas tipo Notion (CRUD Supabase, drag-drop dnd-kit, conclusão com comentário). Status por sprint + decisões de produto registradas.
status: active
subtipo: project
projeto: site
---

# Roadmap — Dashboard `/admin/analytics` (Sprints 5-8)

Continuação do trabalho pós-auditoria. Sessões anteriores entregaram: auditoria (7 quick wins, commit `a6fce1b`) e sort/filter interativo com tanstack/react-table (commit `103780e`). Este roadmap cobre bugs reportados em produção + tabela Notion-like + sistema de tarefas.

Plan file completo: `~/.claude/plans/conduz-a-auditoria-do-majestic-raven.md`.

## Decisões de produto (confirmadas com Bruno)

- **Sugestões vs tarefas**: sugestões automáticas (cron) e tarefas manuais convivem em seções separadas. Botão "Adicionar como tarefa" promove uma sugestão para a lista editável.
- **Atribuição**: sem atribuição a pessoas na v1 (só prioridade + status + comentário).
- **Reordenação**: drag-and-drop completo (dnd-kit) para tarefas e para colunas das tabelas.
- **Persistência das tarefas**: globais (lista contínua), não atadas ao mês do snapshot.
- **Fix de cores (dropdowns)**: cirúrgico (override local em `select.tsx`/`dropdown-menu.tsx`), NÃO mapear cores shadcn no tailwind — evita regressão nos 21 arquivos de `<Badge>` do site público.

## Status por sprint

> [!success]- Sprint 5 — Correções visuais + navegação ✅ (commit pendente)
> - [x] 5.1 Fix cirúrgico dos dropdowns (override `bg-white`/`focus:bg-neutral-100` em `select.tsx` + `dropdown-menu.tsx`)
> - [x] 5.2 Charts do Ato 2 em 2 linhas (TrafficSources full-width + Area/Devices 2 cols, YAxis 160→240)
> - [x] 5.3 Link do título do post → `/atualidades/[slug]` (nova aba, ícone ExternalLink no hover)
> - [x] 5.4 Nomes completos dos posts (`line-clamp-2` + `title` nativo no hover)

> [!success]- Sprint 6 — Tabela Notion/Sheets-like ✅ (commit pendente)
> - [x] 6.1 Redimensionar colunas (`table-layout: fixed` + `enableColumnResizing` + sizes em todas as colunas + persistência `{key}-sizing`)
> - [x] 6.2 Reordenar colunas (dnd-kit `DraggableHead`, `columnOrder` + reconciliação + persistência `{key}-order`, PointerSensor distance:8 + KeyboardSensor)
> - [x] 6.3 Tooltips em status (Engajado/Em alta/Em queda/Abandonado/Estável) com metrificação em `STATUS_META`
> - [x] Extra: `storageKey` base no DataTable + "Resetar colunas" no menu. `MetricTooltip` com `stopPropagation` (G9).

> [!todo]- Sprint 7 — Sistema de Tarefas: backend + CRUD (~3h)
> - [ ] 7.1 Migration `005_analytics_tasks.sql` + RLS + ALTER `activity_logs` CHECK
> - [ ] 7.2 Server Actions (create/update/complete/reopen/delete/reorder)
> - [ ] 7.3 Tipos + `getTasks()` + integração no `page.tsx`
> - [ ] 7.4 TaskBoard v1 (zona sugestões read-only + zona tarefas CRUD)

> [!todo]- Sprint 8 — Tarefas Notion-like polish (~2h30)
> - [ ] 8.1 Drag-and-drop (dnd-kit reuso) + optimistic UI
> - [ ] 8.2 Edição inline + mudança de prioridade
> - [ ] 8.3 Histórico via `activity_logs` + empty/loading/erro
> - [ ] 8.4 Integração visual final no Ato 4

## Não-objetivos

Roles custom, subtarefas, due dates, notificações, atribuição a pessoas (v1), tarefas por-mês, mapear sistema de cores shadcn global, Supabase Realtime.

## Contexto relacionado

- Metodologia e thresholds: [[analytics-methodology]]
- Voz e copy: [[berkahn-brand]] · [[copy-sem-travessao]]
- Hub do projeto: [[site]]
- Handoff da auditoria original: [[dashboard-audit-uxui-handoff]]
